import React, { useEffect, useState } from 'react';
import { getUsers, createUser, toggleUser } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import './StaffList.css';

const StaffList = () => {
  const { user } = useAuth();
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'WEAVER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadStaff = async () => {
    try {
      const res = await getUsers();
      setStaff(res.data || []);
    } catch (err) {
      setError('Admin privilege is required to access the factory shift directory.');
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createUser(form);
      setForm({ username: '', password: '', fullName: '', role: 'WEAVER' });
      await loadStaff();
    } catch (err) {
      setError(err.response?.data || 'Failed to register operator credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleUser(id);
      await loadStaff();
    } catch (err) {
      alert(err.response?.data || 'Failed to update operator state');
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="staff-page">
        <h1 className="staff-title">Access Restricted</h1>
        <p className="staff-sub">Only the Plant General Manager (ADMIN) can access and configure operator directory privileges.</p>
      </div>
    );
  }

  return (
    <div className="staff-page">
      <div className="staff-header">
        <div>
          <h1 className="staff-title">Mill Operators & Shift Directory</h1>
          <p className="staff-sub">Configure terminal credentials and security roles for weavers, chemists, fitters, and supervisors</p>
        </div>
      </div>

      <div className="staff-layout">
        <form className="staff-form-card" onSubmit={handleCreate}>
          <h3>Register Plant Operator</h3>

          <label>Full Employee Name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            placeholder="e.g. Ramesh Kumar"
          />

          <label>Mill Terminal Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            placeholder="e.g. ramesh_weaver"
          />

          <label>Terminal Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Min 6 alphanumeric characters"
          />

          <label>Factory Operational Role</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="WEAVER">Weaver — Loom Machine Operator</option>
            <option value="SUPERVISOR">Supervisor — Shift Floor Manager</option>
            <option value="DYEING_MASTER">Dyeing Master — Lab Color Chemist</option>
            <option value="FINISHING_MASTER">Finishing Master — Stenter Line Manager</option>
            <option value="FITTER">Fitter — Loom Plant Maintenance Mechanic</option>
            <option value="DISPATCHER">Dispatcher — Warehouse & Gate Clerk</option>
            <option value="ADMIN">Admin — Plant General Manager</option>
          </select>

          {error && <div className="staff-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register Operator'}
          </button>
        </form>

        <div className="staff-table-card">
          <h3>Mill Operator Directory</h3>
          <table className="staff-table">
            <thead>
              <tr>
                <th>Operator Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>State</th>
                <th>Terminal Access</th>
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-text">No active operators found.</td>
                </tr>
              ) : (
                staff.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.fullName}</strong></td>
                    <td className="gold-text">{s.username}</td>
                    <td>
                      <span className={`role-badge ${s.role?.toLowerCase()}`}>
                        {s.role?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      {s.active ? (
                        <span className="status-on">Active</span>
                      ) : (
                        <span className="status-off">Disabled</span>
                      )}
                    </td>
                    <td>
                      <button className="toggle-btn" onClick={() => handleToggle(s.id)}>
                        {s.active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffList;