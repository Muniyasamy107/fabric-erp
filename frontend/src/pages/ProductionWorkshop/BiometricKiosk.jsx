import React, { useEffect, useRef, useState } from 'react';
import {
  getAttendanceByDate,
  punchWorkerAttendance,
  punchWorkerOut,
  scanKioskBadge
} from '../../services/attendanceService';
import { Fingerprint, LogIn, LogOut, Clock, BadgeCheck, AlertOctagon, Users, ClipboardList, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './BiometricKiosk.css';

const OFFICE_BADGES = ['ADMIN', 'SUPERVISOR', 'WEAVER', 'DYER'];
const FACTORY_BADGES = [
  'EMP-WEAVER-042', 'EMP-WEAVER-057', 'EMP-WARP-019', 'EMP-DYER-014',
  'EMP-FIN-021', 'EMP-QC-008', 'EMP-FIT-003', 'EMP-PACK-011'
];

const SHIFT_LABELS = {
  SHIFT_A_MORNING: 'Shift A · Morning (6 AM – 2 PM)',
  SHIFT_B_EVENING: 'Shift B · Evening (2 PM – 10 PM)',
  SHIFT_C_NIGHT: 'Shift C · Night (10 PM – 6 AM)'
};

const detectShift = (d) => {
  const h = d.getHours();
  if (h >= 6 && h < 14) return 'SHIFT_A_MORNING';
  if (h >= 14 && h < 22) return 'SHIFT_B_EVENING';
  return 'SHIFT_C_NIGHT';
};

const nowTimeString = (d) =>
  d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();

const parseTimeToMinutes = (t) => {
  if (!t) return null;
  const m = String(t).match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return null;
  let h = Number(m[1]) % 12;
  if (/pm/i.test(m[3])) h += 12;
  return h * 60 + Number(m[2]);
};

const BiometricKiosk = () => {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [badgeInput, setBadgeInput] = useState('');
  const [worker, setWorker] = useState(null);
  const [todayPunches, setTodayPunches] = useState([]);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text }
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  const today = new Date().toISOString().slice(0, 10);
  const currentShift = detectShift(now);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const loadTodayPunches = async () => {
    try {
      const res = await getAttendanceByDate(today);
      setTodayPunches(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTodayPunches();
    const t = setInterval(loadTodayPunches, 10000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  const myRecord = worker
    ? todayPunches.find(
        (p) =>
          String(p.workerBadgeNumber || '').trim().toUpperCase() ===
            String(worker.badgeNumber).trim().toUpperCase() &&
          p.designatedShift === currentShift
      )
    : null;

  const scanBadge = async (rawBadge) => {
    const badge = (rawBadge ?? badgeInput).trim();
    if (!badge) return;
    setBusy(true);
    setMessage(null);
    setWorker(null);
    try {
      await loadTodayPunches();
      const res = await scanKioskBadge(badge);
      setWorker(res.data);
      setBadgeInput('');
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
    } catch (err) {
      const msg = typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.error || 'Badge not registered.';
      setMessage({ type: 'error', text: msg });
      setBadgeInput('');
    } finally {
      setBusy(false);
    }
  };

  const handlePunchIn = async () => {
    if (!worker) return;
    setBusy(true);
    setMessage(null);
    try {
      const res = await punchWorkerAttendance({
        workerBadgeNumber: worker.badgeNumber,
        workerFullName: worker.fullName,
        plantDepartment: worker.plantDepartment,
        designatedShift: currentShift,
        attendanceDate: today,
        punchInTime: nowTimeString(new Date()),
        punchOutTime: '',
        attendanceStatus: 'PRESENT',
        overtimeHours: 0,
        regularDailyWage: Number(worker.baseDailyWage) || 650,
        assignedMachineCode: worker.assignedMachineCode,
        supervisorNotes: 'Biometric kiosk punch-in'
      });
      setMessage({
        type: 'success',
        text: `PUNCH-IN OK · ${worker.fullName} · Day wage ₹${Number(res.data.totalGrossEarned).toFixed(2)} locked`
      });
      await loadTodayPunches();
    } catch (err) {
      const msg = typeof err.response?.data === 'string' ? err.response.data : 'Punch-in failed.';
      setMessage({ type: 'error', text: msg });
    } finally {
      setBusy(false);
    }
  };

  const handlePunchOut = async () => {
    if (!worker || !myRecord) return;
    setBusy(true);
    setMessage(null);
    try {
      const inMin = parseTimeToMinutes(myRecord.punchInTime);
      const outDate = new Date();
      let workedHours = 8;
      if (inMin !== null) {
        const outMin = outDate.getHours() * 60 + outDate.getMinutes();
        let diff = outMin - inMin;
        if (diff < 0) diff += 24 * 60; // night shift crossover
        workedHours = diff / 60;
      }
      const ot = Math.max(0, Math.round((workedHours - 8) * 2) / 2);

      const res = await punchWorkerOut({
        badgeNumber: worker.badgeNumber,
        designatedShift: currentShift,
        attendanceDate: today,
        punchOutTime: nowTimeString(outDate),
        overtimeHours: String(ot)
      });
      setMessage({
        type: 'success',
        text: `PUNCH-OUT OK · ${worker.fullName} · ${workedHours.toFixed(1)} h worked${ot > 0 ? ` · OT ${ot} h (2x) → ₹${Number(res.data.totalGrossEarned).toFixed(2)}` : ''}`
      });
      await loadTodayPunches();
    } catch (err) {
      const msg = typeof err.response?.data === 'string' ? err.response.data : 'Punch-out failed.';
      setMessage({ type: 'error', text: msg });
    } finally {
      setBusy(false);
    }
  };

  const status = !myRecord ? 'IN' : myRecord.punchOutTime ? 'DONE' : 'OUT';

  return (
    <div className="kiosk-page">
      {/* ---------------- Left: scan terminal ---------------- */}
      <div className="kiosk-terminal">
        <div className="kiosk-topbar">
          <span className="kiosk-terminal-label">BIOMETRIC PUNCH TERMINAL · GATE 1</span>
          <button type="button" className="kiosk-register-link" onClick={() => navigate('/attendance-muster')}>
            <ClipboardList size={14} /> Attendance Register & OT
          </button>
        </div>

        <div className="kiosk-clock-row">
          <div className="kiosk-clock">{nowTimeString(now)}</div>
          <div className="kiosk-date">
            {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        <div className="kiosk-shift-chip">
          <Clock size={15} /> {SHIFT_LABELS[currentShift]}
        </div>

        <div className="kiosk-scan-box">
          <Fingerprint size={30} color="#d4af37" />
          <div className="kiosk-scan-title">Scan Worker Badge</div>
          <div className="kiosk-scan-sub">Type or scan the badge ID, then press Enter</div>
          <input
            ref={inputRef}
            value={badgeInput}
            onChange={(e) => setBadgeInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && scanBadge()}
            placeholder="e.g. EMP-WEAVER-042"
            autoFocus
          />
        </div>

        {message && (
          <div className={`kiosk-msg ${message.type}`}>
            {message.type === 'success' ? <BadgeCheck size={18} /> : <AlertOctagon size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        {worker && (
          <div className="kiosk-worker-card">
            <div className="kiosk-worker-head">
              <div className="kiosk-avatar">{(worker.fullName || '?').charAt(0)}</div>
              <div>
                <h3>{worker.fullName}</h3>
                <p>{worker.badgeNumber} · {(worker.plantDepartment || '').replace(/_/g, ' ')}</p>
                <p className="kiosk-machine">Machine: {worker.assignedMachineCode || '—'}</p>
              </div>
              <div className="kiosk-head-right">
                <span className={`kiosk-role-chip ${worker.source === 'USER' ? 'office' : 'factory'}`}>
                  {worker.source === 'USER'
                    ? <><Briefcase size={12} /> {worker.role || 'OFFICE STAFF'}</>
                    : <><Users size={12} /> FACTORY WORKER</>}
                </span>
                <span className={`kiosk-status st-${status.toLowerCase()}`}>
                  {status === 'IN' && 'NOT PUNCHED'}
                  {status === 'OUT' && `IN @ ${myRecord?.punchInTime}`}
                  {status === 'DONE' && 'SHIFT CLOSED'}
                </span>
              </div>
            </div>

            <div className="kiosk-actions">
              {status === 'IN' && (
                <button className="kiosk-btn in" onClick={handlePunchIn} disabled={busy}>
                  <LogIn size={20} /> PUNCH IN
                </button>
              )}
              {status === 'OUT' && (
                <button className="kiosk-btn out" onClick={handlePunchOut} disabled={busy}>
                  <LogOut size={20} /> PUNCH OUT
                </button>
              )}
              {status === 'DONE' && (
                <div className="kiosk-done">
                  ✔ Shift completed · Out @ {myRecord?.punchOutTime} · Gross ₹
                  {Number(myRecord?.totalGrossEarned || 0).toFixed(2)}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="kiosk-demo-strip">
          <span><Briefcase size={13} /> Office / Staff (scan login username):</span>
          {OFFICE_BADGES.map((b) => (
            <button key={b} type="button" className="office-badge" onClick={() => scanBadge(b)} disabled={busy}>
              {b}
            </button>
          ))}
          <span><Users size={13} /> Factory workers (EMP badges):</span>
          {FACTORY_BADGES.map((b) => (
            <button key={b} type="button" onClick={() => scanBadge(b)} disabled={busy}>
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* ---------------- Right: today's live feed ---------------- */}
      <div className="kiosk-feed">
        <h3>Today's Punches · {todayPunches.length}</h3>
        <div className="kiosk-feed-list">
          {todayPunches.length === 0 ? (
            <p className="kiosk-feed-empty">No punches recorded yet today.</p>
          ) : (
            todayPunches.map((p) => (
              <div key={p.id} className="kiosk-feed-item">
                <div className={`feed-dot ${p.punchOutTime ? 'closed' : 'open'}`} />
                <div className="feed-main">
                  <strong>{p.workerFullName}</strong>
                  <span>
                    {p.workerBadgeNumber} · {(p.designatedShift || '').replace('SHIFT_', 'Shift ').replace('_', ' ')}
                  </span>
                </div>
                <div className="feed-times">
                  <span>IN {p.punchInTime || '—'}</span>
                  <span>{p.punchOutTime ? `OUT ${p.punchOutTime}` : 'Working…'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BiometricKiosk;
