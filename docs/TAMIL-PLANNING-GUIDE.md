# 🧭 Production Planning — வரி வரியாக முழு விளக்கம்

**Page தலைப்பு:** Master Production Schedule & MRP Engine
**MRP = Material Requirement Planning** — "இவ்வளவு மீட்டர் துணிக்கு எவ்வளவு நூல் வேண்டும்,
எவ்வளவு நாள் ஆகும்" என்பதைக் கணக்கிடும் எஞ்சின்.

---

## Page-ல் உள்ளே என்ன?

- **Gold பொத்தான்:** New Production Plan → modal திறக்கும்
- **அட்டவணை நெடுக்கைகள்:**
  1. Plan Number — திட்ட எண் (தானாக)
  2. Buyer / Contract — வாடிக்கையாளர் + ஆர்டர் எண்
  3. Fabric Quality — எந்தத் துணி
  4. Target Yardage — இலக்கு மீட்டர்
  5. Loom Allocation — எத்தனை தறிகள்
  6. Warp / Weft Requisition — தேவையான நூல் KG
  7. Milestone Stage — **dropdown** (கீழே 6 நிலைகள்)
  8. Route Card — print பொத்தான்
- **15 வினாடிக்கு ஒருமுறை live புதுப்பிப்பு** — AUTO-PILOT திட்டங்கள் தானாக நகரும்!

---

## Modal — வரி வரியாக

### வரி 1
- **Wholesale Order / Export Contract Reference** — எந்த ஆர்டருக்கான திட்டம். எ.கா. `EXP-2026-9021`
- **Target Buyer / Garment Brand** — வாடிக்கையாளர். எ.கா. `Armani Group Milan`

### வரி 2
- **Commissioned Woven Fabric Quality** — catalog-ல் உள்ள துணியைத் **தேர்வு** (dropdown).
  தேர்ந்தால் Quality Code தானாக நிரம்பும்.
- **Contract Target Volume (Meters)** — எவ்வளவு மீட்டர் நெய்ய வேண்டும். எ.கா. `25000`

### ⭐ Live MRP Preview (உள்ளே நான்கு கணக்குகள் நேரலை!)
- **Required Warp Yarn** = மீட்டர் × 0.088 → `2200 KG`
- **Required Weft Yarn** = மீட்டர் × 0.067 → `1675 KG`
- **Allocated Looms** — நாம் போட்ட தறி எண்ணிக்கை
- **Loom Time Required** = மீட்டர் ÷ (தறிகள் × 250) → `17 Days`
(நாம் மீட்டர்/தறி மாற்றும்போதே எண்கள் உடனே மாறும்!)

### வரி 3
- **Allocate Weaving Looms Count** — எத்தனை தறிகள் (1–48). எ.கா. `6`
- **Planned Production Start Date** — தொடக்க தேதி
- **Committed Buyer Delivery Date** — buyer-க்கு வாக்குறுதி அளித்த டெலிவரி தேதி

### பொத்தான்கள்
- **Cancel** — மூடு
- **Issue Master Production Plan & Route Card** — திட்டம் உருவாகும் →
  Plan Ref (எ.கா. PP-1042) + Estimated Days alert-ல் வரும்

---

## 6 Milestone Stages — எளிய விளக்கம்

| நிலை | அர்த்தம் |
|------|---------|
| Yarn Requisition | நூல் தேவை — கிடங்கிலிருந்து நூல் எடுக்க ஆர்டர் |
| Warping Beams Prep | நூலைத் தறிக்குத் தயார் செய்வது (beam) |
| Active Loom Weaving | தறியில் நெசவு நடக்கிறது |
| Dyeing & Stenter Finish | சாயம் + பினிஷிங் |
| QC & Baling | தரப் பரிசோதனை + பேல் கட்டுதல் |
| Contract Completed | ஆர்டர் முடிந்தது ✅ |

---

## Route Card Print-ல் என்ன?

துணியின் **பயண அட்டை** — ஆலையில் நிலை மாறும்போது கையொப்பமிட:
- துணி பெயர் · மூலப்பொருள் பட்டியல் + தேவை KG · கிடங்குத் துறை
- ஒவ்வொரு நிலை + இயந்திர வரிசை + பொறுப்பாளர் + Passed Output (எவ்வளவு முடிந்தது)
- **மாஸ்டர் கையொப்பக் கட்டம்** — ஒவ்வொரு நிலையிலும் கையொப்பம்!

---

**முக்கியம்:** AUTO-PILOT எஞ்சின் low-stock துணிக்குத் தானாகத் திட்டம் உருவாக்கி,
நிலைகளைத் தானாக நகர்த்தும் — திரையில் live-ஆப் பார்க்கலாம்!
