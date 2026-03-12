// components/afya/AboutPage.jsx

// import Icon from "../../icons/Icon";
import Icon from "../icons/Icon";

const FEATS = [
  { icon: "shield",  text: "Symptom-based guidance — informative, never diagnostic" },
  { icon: "smile",   text: "Daily wellness check-ins for sleep, mood, and hydration" },
  { icon: "bell",    text: "Calm explanations for recovery and medical procedures" },
  { icon: "mapPin",  text: "Nearby clinic and hospital suggestions by location" },
  { icon: "volume2", text: "Hotline references for urgent health concerns" },
];

const TEAM = [
  {
    name: "Elvis Chege",
    role: "Team Lead · Frontend · 3D Model",
    src:  "https://avatars.githubusercontent.com/u/96030189?v=4",
  },
  {
    name: "Mphele Moswane",
    role: "Software Developer · Backend · AI Integration",
    src:  "https://avatars.githubusercontent.com/u/132210848?v=4",
  },
];

export default function AboutPage() {
  return (
    <div className="afya-inner afya-fi">
      <div className="afya-wrap">

        {/* Hero */}
        <div className="afya-about-hero">
          <p className="afya-eyebrow" style={{ marginBottom: 14 }}>Who We Are</p>
          <h1 className="afya-ah1">
            Calm, accessible<br />
            <em>health guidance</em><br />
            for everyone.
          </h1>
          <p className="afya-alead">
            AfyaAI is a lightweight health companion powered by a live animated avatar and conversational AI.
            Built on React and FastAPI, driven by Meta Llama — bringing clear, warm health guidance to anyone, anywhere.
          </p>
        </div>

        {/* Mission */}
        <div className="afya-sec">
          <p className="afya-eyebrow" style={{ marginBottom: 12 }}>Our Mission</p>
          <h2 className="afya-sh2">Why AfyaAI exists</h2>
          <p className="afya-sp">
            Reliable health information shouldn't be gated by geography, income, or the fear of a waiting room.
            AfyaAI was built from a conviction that everyone deserves a calm, knowledgeable companion to navigate
            everyday health questions — without the anxiety of a cold search engine or an unpredictable late-night forum.
          </p>
        </div>

        {/* Features */}
        <div className="afya-sec">
          <p className="afya-eyebrow" style={{ marginBottom: 12 }}>Capabilities</p>
          <h2 className="afya-sh2">What AfyaAI Offers</h2>
          <div className="afya-fgrid">
            {FEATS.map(f => (
              <div className="afya-fitem" key={f.text}>
                <div className="afya-ficon">
                  <Icon n={f.icon} size={14} stroke="var(--a-greenbr)" />
                </div>
                {f.text}
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="afya-sec">
          <p className="afya-eyebrow" style={{ marginBottom: 12 }}>The Team</p>
          <h2 className="afya-sh2">Our Team</h2>
          <div className="afya-tgrid">
            {TEAM.map(m => (
              <div className="afya-tcard" key={m.name}>
                <div className="afya-timg">
                  <img src={m.src} alt={m.name} onError={e => { e.target.style.display = "none"; }} />
                  <Icon n="user" size={24} stroke="var(--a-cream3)" />
                </div>
                <div className="afya-tname">{m.name}</div>
                <div className="afya-trole">{m.role}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="afya-footer">
          Built with care by AfyaAI's MetaMedics &nbsp;·&nbsp; Powered by Meta Llama
        </div>
      </div>
    </div>
  );
}
