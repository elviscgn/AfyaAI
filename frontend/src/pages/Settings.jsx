import { useState } from "react"
import Navbar from "../components/Navbar"
import { FaBell, FaVolumeUp, FaMapMarkerAlt, FaPalette, FaShieldAlt } from "react-icons/fa"

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 99,
        background: checked ? "#2d6a4f" : "#d8f3dc",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: "#fff",
        position: "absolute",
        top: 3,
        left: checked ? 23 : 3,
        transition: "left 0.2s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
      }} />
    </div>
  )
}

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    dailyReminder: true,
    voiceResponses: false,
    locationAccess: false,
    darkMode: false,
    dataSharing: false,
  })

  const [saved, setSaved] = useState(false)

  const toggle = (key) => {
    setSettings(p => ({ ...p, [key]: !p[key] }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const sections = [
    {
      icon: <FaBell size={15} color="#52b788" />,
      title: "Notifications",
      items: [
        { key: "notifications",   label: "Push notifications",     desc: "Get alerts for new tips and updates." },
        { key: "dailyReminder",   label: "Daily check-in reminder", desc: "A gentle nudge to log your wellness each day." },
      ],
    },
    {
      icon: <FaVolumeUp size={15} color="#52b788" />,
      title: "Audio & Interaction",
      items: [
        { key: "voiceResponses", label: "Voice responses", desc: "AfyaAI will speak its replies aloud using TTS." },
      ],
    },
    {
      icon: <FaMapMarkerAlt size={15} color="#52b788" />,
      title: "Location",
      items: [
        { key: "locationAccess", label: "Location access", desc: "Required for the nearby medical facilities feature." },
      ],
    },
    {
      icon: <FaPalette size={15} color="#52b788" />,
      title: "Appearance",
      items: [
        { key: "darkMode", label: "Dark mode", desc: "Switch to a darker interface." },
      ],
    },
    {
      icon: <FaShieldAlt size={15} color="#52b788" />,
      title: "Privacy & Data",
      items: [
        { key: "dataSharing", label: "Anonymous data sharing", desc: "Help us improve AfyaAI by sharing anonymized usage data." },
      ],
    },
  ]

  return (
    <div style={pageStyle}>
      <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        .save-btn:hover { background: #1a4731 !important; }
      `}</style>

      <div style={bodyStyle}>
        <div style={heroStyle}>
          <h1 style={titleStyle}>Settings</h1>
          <p style={subStyle}>Manage your AfyaAI preferences.</p>
        </div>

        <div style={contentStyle}>
          {sections.map(section => (
            <div key={section.title} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <span style={cardIconStyle}>{section.icon}</span>
                <h3 style={cardTitleStyle}>{section.title}</h3>
              </div>
              <div style={itemsStyle}>
                {section.items.map(item => (
                  <div key={item.key} style={itemStyle}>
                    <div style={itemTextStyle}>
                      <p style={itemLabelStyle}>{item.label}</p>
                      <p style={itemDescStyle}>{item.desc}</p>
                    </div>
                    <Toggle checked={settings[item.key]} onChange={() => toggle(item.key)} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12 }}>
            {saved && <span style={savedBadgeStyle}>✓ Settings saved</span>}
            <button className="save-btn" style={saveBtnStyle} onClick={handleSave}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const pageStyle = {
  paddingTop: "60px",
  minHeight: "100vh",
  background: "#f7fdf9",
  fontFamily: "'DM Sans', sans-serif",
}

const bodyStyle = {
  maxWidth: 680,
  margin: "0 auto",
  padding: "32px 24px 60px",
}

const heroStyle = {
  marginBottom: 28,
}

const titleStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "2rem",
  color: "#1a4731",
  margin: "0 0 6px",
}

const subStyle = {
  fontSize: "0.9rem",
  color: "#7a9e87",
  margin: 0,
}

const contentStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
}

const cardStyle = {
  background: "#fff",
  border: "1px solid #d8f3dc",
  borderRadius: 16,
  padding: "20px 22px",
  boxShadow: "0 2px 10px rgba(26,71,49,0.05)",
}

const cardHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 16,
  paddingBottom: 12,
  borderBottom: "1px solid #e8f5ec",
}

const cardIconStyle = {
  width: 30,
  height: 30,
  borderRadius: 8,
  background: "#f0faf3",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

const cardTitleStyle = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.92rem",
  fontWeight: 700,
  color: "#1a4731",
  margin: 0,
}

const itemsStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
}

const itemStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
}

const itemTextStyle = {
  flex: 1,
}

const itemLabelStyle = {
  fontSize: 14,
  fontWeight: 600,
  color: "#1a4731",
  margin: "0 0 2px",
}

const itemDescStyle = {
  fontSize: 12,
  color: "#7a9e87",
  margin: 0,
  lineHeight: 1.4,
}

const saveBtnStyle = {
  padding: "11px 28px",
  background: "#2d6a4f",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "'DM Sans', sans-serif",
  transition: "background 0.2s",
}

const savedBadgeStyle = {
  display: "flex",
  alignItems: "center",
  padding: "0 14px",
  height: 40,
  background: "#d8f3dc",
  color: "#1a4731",
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 600,
}
