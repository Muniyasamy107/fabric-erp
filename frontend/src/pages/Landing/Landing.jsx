import React from 'react';
import { Link } from 'react-router-dom';
import {
  Factory,
  Layers,
  Droplets,
  FlaskConical,
  Truck,
  Globe2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Ruler,
  CheckCircle2,
  Award,
  Recycle
} from 'lucide-react';
import './Landing.css';

const collections = [
  {
    img: '/fabrics/cotton-shirting.jpg',
    title: 'Premium Cotton Shirting',
    sub: 'Poplin · Cambric · Voile · Satin | 40s–80s combed counts',
    desc: 'Crisp, breathable cottons woven on high-speed rapier looms for premium shirting brands.'
  },
  {
    img: '/fabrics/oxford-blue.jpg',
    title: 'Oxford & Casual Weaves',
    sub: 'Oxford 40s · Twill Stretch | 140–210 GSM',
    desc: 'Durable basket weaves and stretch twills for casual shirting and chinos.'
  },
  {
    img: '/fabrics/silk-crepe.jpg',
    title: 'Heritage Pure Silk',
    sub: 'Crepe 20/22D · Charmeuse 22 Momme',
    desc: 'Lustrous mulberry silk woven for saree, occasion wear and luxury lining houses.'
  },
  {
    img: '/fabrics/suiting-charcoal.jpg',
    title: 'Executive Suiting',
    sub: 'Worsted 2/48s · Poly-Wool 80/20 | 230–240 GSM',
    desc: 'Fine twill suiting with superior drape and crease recovery for formal wear.'
  },
  {
    img: '/fabrics/viscose-floral.jpg',
    title: 'Blended Essentials',
    sub: 'Poly-Cotton · Viscose Crepe · Poly Crepe',
    desc: 'Value-volume qualities for uniforms, daily wear and ladies fashion segments.'
  },
  {
    img: '/fabrics/canvas-natural.jpg',
    title: 'Utility Canvas & Drill',
    sub: 'Canvas 10s · Drill 3/1 Twill | 245–285 GSM',
    desc: 'Heavy, rugged weaves for workwear, bags, upholstery and industrial use.'
  }
];

const processSteps = [
  { icon: <Layers size={22} />, title: 'Yarn Sourcing', desc: 'Combed cotton, silk & synthetic yarns from certified Tamil Nadu spinning mills.' },
  { icon: <Ruler size={22} />, title: 'Warping & Sizing', desc: 'Automated warping and slurry sizing for uniform beam preparation.' },
  { icon: <Factory size={22} />, title: 'Precision Weaving', desc: '120+ air-jet & rapier looms with live SCADA telemetry on every machine.' },
  { icon: <Droplets size={22} />, title: 'Dyeing & Processing', desc: 'Jet dye vessels, stenter & calendering lines for shade-perfect finishing.' },
  { icon: <FlaskConical size={22} />, title: '4-Point Quality Lab', desc: 'GSM, shrinkage, colour fastness and 4-point inspection on every batch.' },
  { icon: <Truck size={22} />, title: 'Global Dispatch', desc: 'Bale-packed, barcoded rolls dispatched with gate-pass controlled logistics.' }
];

const Landing = () => {
  return (
    <div className="landing">
      {/* ---------- Top navigation ---------- */}
      <header className="landing-nav">
        <div className="landing-logo">
          <Sparkles size={18} />
          <span>ROYAL FABRICS</span>
        </div>
        <nav className="landing-links">
          <a href="#collections">Collections</a>
          <a href="#process">Our Process</a>
          <a href="#quality">Quality</a>
          <a href="#contact">Contact</a>
        </nav>
        <Link to="/login" className="landing-login-btn">Staff Login</Link>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="landing-hero">
        <div className="hero-inner">
          <span className="hero-kicker">Premium Fabric Manufacturer · Coimbatore, India</span>
          <h1>Weaving Excellence<br />for the World.</h1>
          <p className="hero-sub">
            From certified combed yarn to export-grade finished fabric — Royal Fabrics operates a
            fully integrated weaving, dyeing and finishing mill with live digital traceability on
            every single roll.
          </p>
          <div className="hero-ctas">
            <a href="#collections" className="cta-gold">Explore Collections <ArrowRight size={16} /></a>
            <a href="#process" className="cta-outline">See How We Weave</a>
          </div>
        </div>
      </section>

      {/* ---------- Stats strip ---------- */}
      <section className="landing-stats">
        <div className="stat-box">
          <strong>120+</strong>
          <span>Air-Jet & Rapier Looms</span>
        </div>
        <div className="stat-box">
          <strong>1.2M</strong>
          <span>Meters Woven / Month</span>
        </div>
        <div className="stat-box">
          <strong>25+</strong>
          <span>Export Countries Served</span>
        </div>
        <div className="stat-box">
          <strong>450+</strong>
          <span>Skilled Workforce</span>
        </div>
      </section>

      {/* ---------- Collections ---------- */}
      <section className="landing-section" id="collections">
        <span className="sec-kicker">Our Fabric Collections</span>
        <h2>Woven for Every Purpose</h2>
        <div className="collection-grid">
          {collections.map((c) => (
            <div className="collection-card" key={c.title}>
              <div className="collection-img">
                <img src={c.img} alt={c.title} />
              </div>
              <div className="collection-body">
                <h3>{c.title}</h3>
                <p className="collection-sub">{c.sub}</p>
                <p>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className="landing-section alt" id="process">
        <span className="sec-kicker">Mill-to-Market Process</span>
        <h2>From Yarn to Export Bale</h2>
        <div className="process-grid">
          {processSteps.map((s, i) => (
            <div className="process-card" key={s.title}>
              <div className="process-step-num">0{i + 1}</div>
              <div className="process-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Quality & compliance ---------- */}
      <section className="landing-section" id="quality">
        <span className="sec-kicker">Quality & Compliance</span>
        <h2>Certified. Audited. Trusted.</h2>
        <div className="quality-grid">
          <div className="quality-card">
            <ShieldCheck size={26} />
            <h3>ISO 9001:2015</h3>
            <p>Certified quality management across weaving, processing and dispatch operations.</p>
          </div>
          <div className="quality-card">
            <Award size={26} />
            <h3>OEKO-TEX® Standard 100</h3>
            <p>Every fabric tested for harmful substances — safe for skin-contact garments.</p>
          </div>
          <div className="quality-card">
            <CheckCircle2 size={26} />
            <h3>4-Point Inspection</h3>
            <p>100% batch-wise 4-point fabric inspection with digital defect mapping.</p>
          </div>
          <div className="quality-card">
            <Recycle size={26} />
            <h3>Zero Liquid Discharge</h3>
            <p>In-house ETP recycles 92% of process water back into the dye house.</p>
          </div>
        </div>
      </section>

      {/* ---------- Contact / footer ---------- */}
      <footer className="landing-footer" id="contact">
        <div className="footer-grid">
          <div>
            <div className="landing-logo">
              <Sparkles size={18} />
              <span>ROYAL FABRICS</span>
            </div>
            <p className="footer-blurb">
              Integrated weaving, dyeing and finishing mill serving shirting, suiting,
              silk and utility fabric buyers across 25+ countries since 1998.
            </p>
          </div>
          <div className="footer-col">
            <h4>Mill Office</h4>
            <p><MapPin size={14} /> SIDCO Industrial Estate, Kurichi,<br />Coimbatore – 641021, Tamil Nadu</p>
          </div>
          <div className="footer-col">
            <h4>Merchandising & Sales</h4>
            <p><Phone size={14} /> +91 422 450 8800</p>
            <p><Mail size={14} /> sales@royalfabrics.in</p>
          </div>
          <div className="footer-col">
            <h4>Export Division</h4>
            <p><Globe2 size={14} /> exports@royalfabrics.in</p>
            <p><Globe2 size={14} /> IEC 0498012345</p>
            <p><Globe2 size={14} /> GSTIN 33AABCR1234A1Z5</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Royal Fabrics Pvt Ltd. All rights reserved.</span>
          <Link to="/login">Staff Login</Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
