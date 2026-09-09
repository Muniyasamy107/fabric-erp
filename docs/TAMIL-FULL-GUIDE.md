# 🏭 முழு A-Z சுத்த தமிழ் விளக்கம் — உள்ளே என்ன + என்ன போட வேண்டும் + Print-ல் என்ன

ஒவ்வொரு component-உம்: (அ) உள்ளே இருப்பவை · (ஆ) புதிதாகச் சேர்க்கும்போது பெட்டிகள் · (இ) Print உள்ளடக்கம்.

---

## 1. Mill Dashboard — மேலாண்மைப் பலகை
**உள்ளே:** LIVE pulse குறி · 4 KPI அட்டைகள் (விற்பனை ₹, மீட்டர், OEE %, தண்ணீர் %) · 4 வரைபடங்கள் · stock எச்சரிக்கைப் பட்டியல்.
**போட வேண்டியது:** இல்லை — எல்லாம் தானாக.
**Print:** இல்லை.

## 2. Fabric Catalog — துணி அலமாரி
**உள்ளே:** தேடல் பெட்டி · Cards/Table மாற்றுப் பொத்தான் · **+ Add Product** · அட்டைகள் (படம், விலை, இருப்பு, LOW STOCK ribbon) · **Tag** பொத்தான்.
**புதிதாகச் சேர்க்க:**

| பெட்டி | என்ன போட வேண்டும் | உதாரணம் |
|--------|-------------------|----------|
| Item Code | தனித்துவ எண் | RF-COT-023 |
| Fabric Name | பெயர் | Cotton Twill |
| Material | இழை வகை | 100% Cotton |
| GSM | எடை | 145 |
| Rack | அலமாரி இடம் | BAY-4 |
| HSN Code | வரி எண் | 5208 |
| Price/Meter | மீட்டர் விலை | 210 |
| Total Meters | இருப்பு | 1200 |
| Low Stock Alert | எச்சரிக்கை எல்லை | 100 |
| GST Rate | வரி % | 5 |

**Print (Tag):** பார்கோடு ஸ்டிக்கர் — துணி பெயர், SKU, பார்கோடு கோடுகள், "KAK Textile Processing, Tirupur".

## 3. Swatch Gallery — பட ஆல்பம்
**உள்ளே:** பெரிய பட அட்டைகள். **போட:** இல்லை. **Print:** இல்லை.

## 4. Remnant Clearance — தள்ளுபடி மூலை
**உள்ளே:** மீதம்-ரோல் அட்டைகள் (மொத்த மீ, மீதம் மீ, தள்ளுபடி %) · **Set Discount** · View in Catalog.
**போட:** தள்ளுபடி % (எ.கா. 25). **Print:** இல்லை.

## 5. CAD Weave Studio — ஓவிய அறை
**உள்ளே:** டிசைன் அட்டைகள் · **New Sample Design** modal · Tech Sheet print.
**புதிதாக:** டிசைன் பெயர் `Herringbone V2` · Buyer `Raymond` · Weave `Twill 2/2` · Shafts `4` · EPI `120` · PPI `68` · Sample மீட்டர் `50` · டிசைனர் பெயர்.
**Print (Tech Sheet):** டிசைன் பெயர், weave structure, shafts, EPI/PPI, total construction, buyer — மாதிரி அறைக்கு.

## 6. Production Planning — உற்பத்தித் திட்டம்
**உள்ளே:** திட்ட அட்டவணை · Stage dropdown · **New Plan** · Route Card print.
**புதிதாக:** ஆர்டர் எண் `WO-2026-221` · Buyer · துணி வகை · இலக்கு மீட்டர் `5000` · தறிகள் `4` · தொடக்க/டெலிவரி தேதி.
**Print (Route Card):** துணி பெயர், மூலப்பொருள் பட்டியல் (KG), கிடங்குத் துறை, ஒவ்வொரு நிலை + இயந்திரம் + பொறுப்பாளர் + Passed Output + **மாஸ்டர் கையொப்பக் கட்டம்** — துணி ஆலையில் நிலை மாறும்போது கையொப்பமிட!

## 7. Yarn & Dye House — நூல் கிடங்கு + சாய ஆய்வகம்
**உள்ளே:** Yarn Cone Store அட்டவணை + **Inward Raw Yarn** · Dye Kitchen அட்டைகள் + **New Dye Recipe** + print.
**புதிதாக (நூல்):** நூல் எண் `2/60s Combed` · மில் `Lakshmi Mills` · எடை `500 kg` · பைகள் `25` · விலை `₹420` · Bay `YARN-A1`.
**புதிதாக (சாயம்):** நிறம் `Midnight Navy` · Pantone `19-4034 TCX` · Dye class `Reactive` · Liquor `1:10` · வெப்பம் `60` · Delta E `0.8` · வேதியியல் குறிப்பு · மாஸ்டர் டையர் பெயர்.
**Print (Recipe):** நிறம், pantone, விகுதி, வெப்பம், முழு வேதியியல் formulation, டையர் பெயர் — சாய இயந்திரத்தாரருக்கு.

## 8. Warping & Sizing — நூல் வலுப்படுத்தல்
**உள்ளே:** Beam bank அட்டவணை · **Prepare New Beam** · Beam Ticket print.
**புதிதாக:** துணி · நூல் lot · Warp ends `4800` · நீளம் `12000 m` · Flange `72"` · Sizing recipe `PVA 12kg` · Pick-up % `9.5` · வெப்பம் `110` · ஒதுக்கீடு தறி `LOOM-A01`.
**Print (Beam Ticket):** துணி பெயர், நூல் எண், ends, நீளம், sizing — warping பிரிவுக்கு.

## 9. Loom 2D Floor Matrix — நேரலை வரைபடம்
**உள்ளே:** 2D tiles (பச்சை pulse/சிவப்பு/மஞ்சள்) · tile click → Telemetry modal (RPM, efficiency, வெப்பம், மீட்டர்) · Floor print · 10s புதுப்பிப்பு.
**போட:** இல்லை.
**Print (Floor):** தறி எண், வகை, ஓடும் lot, RPM, நெய்த மீட்டர், நெசவாளர், Live status, sensor குறிப்பு — shift மாற்றுக் குறிப்பு.

## 10. Loom Control Room — வேலை ஒதுக்கீடு
**உள்ளே:** தறி அட்டைகள் · Active Batches அட்டவணை · **Schedule Job** · **Update Batch Progress** (produced, scrap, grade) · Save Yield.
**புதிதாக:** துணி · தறி · நெசவாளர் `Murugan` · இலக்கு `800 m` · தேதிகள்.
**Print:** இல்லை (Matrix print உள்ளது).

## 11. Shift Yield & OEE — மதிப்பெண் சீட்டு
**உள்ளே:** shift அட்டவணை · **Log Shift Yield** · print.
**புதிதாக:** மேற்பார்வையாளர் · தறிகள் `10` · மீட்டர் `12400` · picks · வீண் `120` · warp breaks `14 min` · மின்சாரம் `340 kWh` → OEE தானாக.
**Print:** தறிகள், மொத்த நீளம், picks counter, வீண், மின்சாரம், OEE % — மேலாளர் அறிக்கை.

## 12. Fabric Costing — செலவு கணக்கு
**உள்ளே:** cost அட்டைகள் · **New Cost Sheet** · print.
**புதிதாக:** warp ₹/மீ `48` · weft `32` · sizing `6` · கூலி `25` · சாயம் `30` · மேலாண்மை `18` · லாபம் % `22` → மொத்தம் + பரிந்துரை விலை தானாக.
**Print (Cost Sheet):** துணி, warp/weft ends·count·crimp, அகலம், ஒவ்வொரு செலவு உருப்படி + ₹/மீ, மொத்தம், பரிந்துரை விலை — விலை நிர்ணய ஆதாரம்.

## 13. Boiler & Steam — அடுப்பு டையரி
**உள்ளே:** logs அட்டவணை · **Log Daily Boiler** · print.
**புதிதாக:** steam `42 t` · அழுத்தம் `8.5 bar` · வெப்பம் `175°C` · எரிபொருள் `Husk 12t` · pH `10.8` · பொறியாளர்.
**Print:** துறை வாரியாக ஒதுக்கிய steam டன், பங்கு %, அழுத்தம், எரிபொருள் — ஆற்றல் தணிக்கை.

## 14. Stenter & Finishing — இஸ்திரி அறை
**உள்ளே:** batches அட்டவணை · **Queue Finishing Batch** · print.
**புதிதாக:** lot `WV-LOT-88` · இயந்திரம் `Stenter-2` · treatment `Soft Finish` · வெப்பம் `185` · வேகம் `35` · அகலம் `44"` · மீட்டர் `1500`.
**Print:** lot, இயந்திரம், treatment, வெப்பம்/வேகம்/அகலம் — finishing பிரிவுச் சீட்டு.

## 15. QC & Lab Test — தரப் பரிசோதனை
**உள்ளே:** inspections பட்டியல் · **New Inspection** (ASTM 4-Point) · verdict தானாக · **Lab Certificate** print.
**புதிதாக:** lot · பார்த்த மீட்டர் · அகலம் · சிறு குறை `3` · பெரிய குறை `0` · GSM `145` · சுருக்கம் `1.2%` · வலிமை `420N` · நிற உறுதி `4`.
**Print (Certificate):** lot, நீளம், அகலம், குறைகள், 4-point score, GSM, சுருக்கம், **தர முடிவு (Grade A / EXPORT APPROVED)** — வாடிக்கையாளருக்கு ஆதாரம்.

## 16. ETP — தண்ணீர் சுத்தம்
**உள்ளே:** logs அட்டவணை · **Log ETP Audit** · **ZLD Certificate** print.
**புதிதாக:** inflow `85 KLD` · சுத்தம் `78` · pH `7.2` · COD `42` · BOD `11`.
**Print (Certificate):** அளவுரு | அரசு வரம்பு | வந்த மதிப்பு | சுத்தமான RO வெளியீடு | **இணக்க நிலை** — மாசு கட்டுப்பாட்டு ஆதாரம்.

## 17. Roll Packing — பார்சல் அறை
**உள்ளே:** rolls அட்டவணை · **Pack & Tag Roll** · **Roll Sticker** print · **Bale Manifest** print.
**புதிதாக:** lot · நீளம் `98.5 m` · அகலம் `44"` · மொத்த எடை `31.2` · நிகர எடை `29.8` · தரம் `A` · bin `FG-BAY-2` · bale `BALE-009`.
**Print 1 (Sticker):** துணி பெயர், தரம், bale ref, bay, தேதி, பார்கோடு — ரோல் மேல் ஒட்ட.
**Print 2 (Manifest):** piece எண், ரோல் பார்கோடு, அகலம், நிகர நீளம், நிகர/மொத்த எடை, தரம் — கிடங்குக் கணக்கு.

## 18. Plant Maintenance — மெக்கானிக் டையரி
**உள்ளே:** tickets அட்டவணை · **Log Breakdown / PM** · print.
**புதிதாக:** இயந்திரம் `LOOM-A07` · வகை `Breakdown` · தீவிரம் `Critical` · fitter `Ramesh` · அறிகுறி · உதிரி பாகங்கள்.
**Print (Ticket):** இயந்திரக் குறியீடு, பிரச்சனை, fitter, பாகங்கள் — engineering பிரிவுச் சீட்டு.

## 19. Attendance Register — வருகைப் பதிவேடு
**உள்ளே:** 3 tabs (Bulk grid · Directory · History) · **Open Biometric Kiosk** பொத்தான் · **Register Employee** form · print.
**புதிதாக (ஊழியர்):** பெயர் `Ramesh Kumar` · badge ⚡ Auto (EMP-WEA-xxx) · இயந்திரம் `LOOM-A01` · கூலி `650` · துறை.
**Print (Form 25 / Muster):** Emp ID, பெயர், துறை & இயந்திரம், shift, IN/OUT நேரம், நிலை, OT மணி, **மொத்தக் கூலி ₹** — சட்டப்பூர்வ ஆவணம்.

## 20. Biometric Kiosk — கேட் முனையம்
**உள்ளே:** நேரலை கடிகாரம் · shift chip · badge input · ID card view · PUNCH IN/OUT · stats (ON DUTY/PUNCHED/CLOSED) · demo badges · live feed.
**போட:** badge மட்டும் (`EMP-WEAVER-042` / `ADMIN`).
**Print:** இல்லை (திரை முனையம்).

## 21. Security Gate Pass — கேட் சீட்டு
**உள்ளே:** passes அட்டவணை · **Issue Gate Pass** · print.
**புதிதாக:** வகை `Dispatch` · வண்டி `TN 39 AB 1234` · transporter · ஓட்டுநர் + phone · invoice ref · e-way · எடைகள் · ரோல்கள் `42` · அதிகாரி.
**Print:** வண்டி எண், மொத்த bales/rolls, மொத்த yardage, **மொத்த/வெறுமை/நிகர எடை**, ஓட்டுநர், e-way — கேட் பாதுகாவலர் சீட்டு.

## 22. Global B2B Exports — வெளிநாட்டு ஒப்பந்தம்
**உள்ளே:** contracts அட்டவணை · **Draft Export Contract** · **Commercial Invoice** print.
**புதிதாக:** buyer `Hugo Boss` · நாடு · துணி · அளவு · நாணயம் `EUR` · விலை `3.10` · Incoterms `FOB Chennai` · துறைமுகங்கள் · LC எண் · வங்கி.
**Print (Invoice):** buyer நிறுவனம், பொருள் விவரம், **HS Code**, அளவு, யூனிட் விலை, **மொத்தத் தொகை (நாணயத்துடன்)** — சுங்க ஆவணம்.

## 23. B2B Clients — வாடிக்கையாளர் புத்தகம்
**உள்ளே:** directory அட்டவணை · **+ Register Brand Client**.
**புதிதாக:** நிறுவனம் · phone · email · GSTIN · முகவரி · segment.
**Print:** இல்லை.

## 24. Wholesale Dispatch — டெலிவரி மேசை
**உள்ளே:** **Select Fabrics** picker (checkbox + மீட்டர்) · Invoicing Desk · invoice print · stock தானாகக் குறையும்.
**புதிதாக:** buyer தேர்வு · துணிகள் + மீட்டர் · LR எண் · கட்டண நிபந்தனை.
**Print (Invoice):** buyer, துணிகள், மீட்டர், விலை, **GST**, மொத்தத் தொகை — விற்பனை பில்.

## 25. Weaver Payroll — சம்பள மேசை
**உள்ளே:** wage ledger · **Log Wages** modal (மீட்டர் × விலை = சம்பளம் தானாக).
**Print:** நேரடி இல்லை — Reports-ல் Wage Register உள்ளது.

## 26. Day-End Settlement — நாள் முடிவு கணக்கு
**உள்ளே:** opening float input · விற்பனை தானாக · **Z-Lock** · கடந்த Z-reports · print.
**புதிதாக:** காலை பணம் `₹5000` மட்டும்; மீதி தானாக.
**Print (Z-Report):** shift, opening, விற்பனை மொத்தம், கட்டண வகைகள், closing, cashier — நாள் இலாபக் குறிப்பு.

## 27. Stock Ledger — அசைவுப் புத்தகம்
**உள்ளே:** movements அட்டவணை (INWARD/SALE/WASTAGE/ADJUSTMENT) · **Record Wastage** form.
**புதிதாக (வீண்):** ரோல் · மீட்டர் · காரணம்.
**Print:** இல்லை (பார்வை மட்டும்).

## 28. Purchase Orders — நூல் ஆர்டர்
**உள்ளே:** PO பட்டியல் · **Issue PO** · **Stock Inward** modal · PO print.
**புதிதாக:** supplier · துணி/SKU · அளவு · விலை · தேதி · நிபந்தனை.
**Print (PO):** supplier மில், SKU & spec, பொருள் வகை, ஆர்டர் நீளம், விலை, subtotal, கையொப்பம் — supplier-க்கு அனுப்பும் ஆவணம்.
**Stock Inward:** பொருள் வந்ததும் மீட்டர் போடுங்கள் → இருப்பு தானாகக் கூடும்.

## 29. Yarn Suppliers — சப்ளையர் புத்தகம்
**புதிதாக:** மில் பெயர் · தொடர்பு நபர் · phone · சிறப்பு · ஊர் · GSTIN. **Print:** இல்லை.

## 30. Shift Staff — ஐடி அறை
**புதிதாக:** பெயர் · username · password · role. Disable/Enable · Reset PW. **Print:** இல்லை.

## 31. Production Reports — தணிக்கை அறை
**உள்ளே:** 5 registers (B2B invoices · loom lots · QC certs · wages · yarn stock) · **Excel export** · prints.
**Print/Excel:** மேலாளர் & அரசு தணிக்கைக்கு.

---

**விதி:** பார்க்கும் பக்கங்கள் = live தரவு மட்டும் · வேலைப் பக்கங்கள் = modal → Save → Print 🖨️
