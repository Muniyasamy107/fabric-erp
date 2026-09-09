# 🧪 Yarn & Dye House — வரி வரியாக முழு விளக்கம்

**Page தலைப்பு:** Yarn Cone Store & Dye Kitchen Recipe Lab
இரண்டு அறைகள்: (1) **நூல் கிடங்கு** — மூலப்பொருள் இருப்பு · (2) **சாய ஆய்வகம்** — நிற recipe-கள்.

---

## (1) Yarn Cone Store — அட்டவணை நெடுக்கைகள்

| நெடுக்கை | அர்த்தம் |
|----------|---------|
| Yarn Lot Number | நூல் தொகுதி எண் (தானாக) |
| Count & Fiber Specification | நூல் எண் + இழை விவரம் |
| Spinning Mill Origin | எந்த spinning mill-லிருந்து வந்தது |
| Total Stock Weight | மொத்த இருப்பு KG |
| Cartons | பெட்டிகள் எண்ணிக்கை |
| Storage Bay | கிடங்கில் எங்கே |
| Condition | நிலை (Raw / Dyed / Creel-ல்) |

**பொத்தான்:** Inward Raw Yarn → modal.

### Inward Modal — வரி வரியாக
1. **Yarn Count & Specification** — நூல் விவரம். எ.கா. `Cotton 80/1 Ne Combed Giza`
   (80/1 = மிக நுண்ணிய நூல் · Combed = தூய்மை · Giza = எகிப்து பிரீமியம் பருத்தி)
2. **Fiber Class** — dropdown: Pure Cotton · Mulberry Silk · Cashmere Wool · Linen Flax · Viscose
3. **Spinning Mill / Origin Vendor** — சப்ளையர் mill பெயர்
4. **Net Inward Weight (KG)** — வந்த எடை `250`
5. **Cartons / Bag Count** — பெட்டிகள் `5`
6. **Rate / Kg (₹)** — கிலோ விலை `480`
7. **Warehouse Storage Bay / Rack** — வைக்கும் இடம் `Yarn Bay A-02`
8. **Yarn State** — dropdown: Raw Greige (சாயம் ஏறாத) · Dyed & Conditioned · Loaded in Warping Creel
9. **Inward to Yarn Store** → இருப்பு **உடனே கூடும்!**

---

## (2) Dye Kitchen — Recipe Modal வரி வரியாக

1. **Shade / Color Name** — நிறத்தின் பெயர் `Midnight Navy`
2. **Pantone TCX Standard Code** — உலக நிறக் குறியீடு `19-4052 TCX`.
   Buyer "19-4052" சொன்னால் உலகம் முழுக்க **அதே நிறம்** — குழப்பமே இல்லை!
3. **Visual Swatch Color** — screen-ல் காட்டும் HEX `#1B2A4A`
4. **Dye Chemistry Class** — சாயம் வகை `Reactive Dye for Cotton/Silk`
5. **Liquor Ratio (M:L)** — துணி : தண்ணீர் விகிதம் `1:8` = 1 KG துணிக்கு 8 L தண்ணீர்
6. **Peak Dye Temp (°C)** — அதிகபட்ச வெப்பம் `85`
7. **Delta E Tolerance (ΔE)** — நிற வேறுபாட்டு எல்லை `0.45`.
   ΔE = நம் நிறமும் standard-உம் இடையே உள்ள தூரம்; **1-க்குக் கீழே = கண்ணுக்கே தெரியாது!**
8. **Chemical & Dyestuff Formulation Recipe** — படிப்படியான வேதியியல்:
   - Dyestuff Navy Blue 3R: 2.45% o.w.f (துணி எடையில் %)
   - Glauber's Salt 45 g/L (40°C-ல்)
   - Soda Ash 18 g/L (60°C-ல் 30 நிமிடம்)
   - Levelling aux 1.5 g/L · Acetic acid neutralisation 85°C
9. **Master Dyer / Lab Chemist Name** — பொறுப்பாளர் `Chief Colorist Rangasamy`
10. Save → **Recipe Code** (DYE-xxx) alert.

---

## 🖨️ Dye Recipe Print

KAK Dyeing Division header · shade பெயர் + Pantone · HEX swatch · வகை ·
விகிதம் · வெப்பம் · ΔE · **முழு formulation** · master dyer பெயர் —
**சாய இயந்திரம் ஓட்டுபவருக்கு** கொடுக்கும் சீட்டு. இதனால் எப்போதும் **அதே நிறம்** கிடைக்கும்!

---

**Flow:** நூல் inward → bay-ல் சேமிப்பு → recipe தயார் → dye machine-க்கு print → சாயம் ஏற்றம் 🎨
