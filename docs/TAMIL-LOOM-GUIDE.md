# 🟩️ Loom Floor Matrix + Loom Control Room — முழு விளக்கம்

---

## A. LOOM 2D FLOOR MATRIX — நேரலை ஆலை வரைபடம் 🎥

**தலைப்பு:** Loom Hall 2D Floor Matrix & Live Monitoring
**10 வினாடிக்கு ஒருமுறை** தானாகப் புதுப்பிக்கும் — reload தேவையில்லை!

### ஒவ்வொரு TILE-லும் (ஒரு தறியின் நேரலை நிலை)
- **Loom number** — தறி எண் (LOOM-A01)
- **RPM** — நிமிட சுற்று வேகம் (550+ = ஓடுகிறது)
- **Fabric name + Lot** — எந்தத் துணி, எந்த lot நெய்கிறது
- **Efficiency %** — செயல்திறன்
- **Woven meters** — நெய்த மீட்டர் (நேரலையில் கூடும்!)
- **Alert ribbon** — பழுது எனில் சிவப்பு நாடா

### நிறங்கள்
- 🟢 பச்சை pulse — ஓடுகிறது (Running 550+ RPM)
- 🔴 சிவப்பு — breakdown (நின்றது)
- 🟡 மஞ்சள் — beam மாற்றம் / பராமரிப்பு

### Tile click → Telemetry Modal
- தறி எண் + machine வகை
- Live RPM · efficiency · meters
- **Status Override பொத்தான்கள்** (machine-க்கு கை கட்டளை):
  - ACTIVE_RUNNING — இயங்குகிறது
  - WARP_BREAK_STOP — பாவு நூல் அறுப்பு (நீள நூல் கிழிந்தது → நிறுத்து)
  - WEFT_FEEDER_STOP — ஊடு நூல் feeder நின்றது
  - BEAM_GAITING_CHANGE — புதிய beam ஏற்றும் பணி
- **Sensor Diagnostic Log & Fault Trip Detail** — எப்போது எந்த fault நடந்தது பதிவு
- **Floor Print** — shift மாற்றுக் குறிப்பு அச்சு

**Input இல்லை — பார்க்க மட்டும் + status override.**

---

## B. LOOM CONTROL ROOM — வேலை மேசை ⚙️

**தலைப்பு:** Weaving Loom Hall & Production Batches

### Active Production Batches அட்டவணை
Lot/Batch No · Fabric Quality · Assigned Loom · Target Meters · Produced Meters ·
Scrap Wastage · Grade · Production Status · Progress Update (பொத்தான்)

### Schedule Job Modal — புது வேலை ஒதுக்க
1. **Select Fabric Quality to Weave \*** — எந்தத் துணி (dropdown)
2. **Allocate Loom Machine \*** — எந்தத் தறி
3. **Weaver Operator Name** — நெசவாளர் `Murugan`
4. **Target Production (Meters) \*** — இலக்கு `800`
5. **Start Date / Target Completion Date** — தேதிகள்

### Update Batch Modal — மாலை புதுப்பிப்பு
1. **Produced Meters (Actual)** — நெய்தது `795`
2. **Weaver Scrap / Flaw (m)** — வீண் `5`
3. **Inspector Fabric Quality Grade** — dropdown:
   - Grade A (Premium — defect இல்லை)
   - Grade B (சிறு ஊடு நூல் கோணல்)
   - Seconds (scrap / rejected)
4. **Production Status** — dropdown:
   - Queued / Creel Loading → Warping → Active Weaving → Inspection → Lot Finished
5. **Save Production Yield** → meters + stock புதுப்பிப்பு

---

**வேறுபாடு:** Matrix = **பார்க்கும்** கண்ணாடி (monitoring) · Control Room = **செய்யும்** மேசை (action).
இரண்டும் இணைந்தே நெசவுத் துறையை நடத்துகின்றன! 🏭
