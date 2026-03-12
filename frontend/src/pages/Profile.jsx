import { useState } from "react"
import Navbar from "../components/Navbar"
import { FaUser, FaEnvelope, FaBirthdayCake, FaWeight, FaRuler } from "react-icons/fa"

const defaultProfile = {
  name: "Guest User",
  email: "user@example.com",
  dob: "",
  weight: "",
  height: "",
  bloodType: "",
  allergies: "",
  conditions: "",
}

export default function Profile() {
  const [profile, setProfile] = useState(defaultProfile)
  const [saved, setSaved] = useState(false)

  const handleChange = (field, value) => {
    setProfile(p => ({ ...p, [field]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    // TODO: save to backend
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={pageStyle}>
      <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        .profile-input:focus { border-color: #52b788 !important; outline: none; }
        .save-btn:hover { background: #1a4731 !important; }
      `}</style>

      <div style={bodyStyle}>
        {/* Header */}
        <div style={heroStyle}>
          <div style={avatarCircleStyle}>
            <FaUser size={30} color="#fff" />
          </div>
          <div>
            <h1 style={nameTitleStyle}>{profile.name}</h1>
            <p style={emailStyle}>{profile.email}</p>
          </div>
        </div>

        <div style={gridStyle}>
          {/* Personal info */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Personal Information</h3>
            <div style={fieldsStyle}>
              <Field icon={<FaUser size={12} />}         label="Full Name"    field="name"      value={profile.name}      onChange={handleChange} />
              <Field icon={<FaEnvelope size={12} />}     label="Email"        field="email"     value={profile.email}     onChange={handleChange} type="email" />
              <Field icon={<FaBirthdayCake size={12} />} label="Date of Birth" field="dob"      value={profile.dob}       onChange={handleChange} type="date" />
            </div>
          </div>

          {/* Health info */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Health Information</h3>
            <div style={fieldsStyle}>
              <Field icon={<FaWeight size={12} />} label="Weight (kg)" field="weight" value={profile.weight} onChange={handleChange} type="number" placeholder="e.g. 70" />
              <Field icon={<FaRuler size={12} />}  label="Height (cm)" field="height" value={profile.height} onChange={handleChange} type="number" placeholder="e.g. 170" />
              <div style={fieldStyle}>
                <label style={labelStyle}>Blood Type</label>
                <select
                  style={inputStyle}
                  value={profile.bloodType}
                  onChange={e => handleChange("bloodType", e.target.value)}
                >
                  <option value="">Select</option>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Medical notes */}
          <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
            <h3 style={cardTitleStyle}>Medical Notes</h3>
            <div style={fieldsStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Known Allergies</label>
                <textarea
                  className="profile-input"
                  style={{ ...inputStyle, height: 80, resize: "vertical" }}
                  placeholder="e.g. penicillin, peanuts..."
                  value={profile.allergies}
                  onChange={e => handleChange("allergies", e.target.value)}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Existing Conditions</label>
                <textarea
                  className="profile-input"
                  style={{ ...inputStyle, height: 80, resize: "vertical" }}
                  placeholder="e.g. asthma, diabetes..."
                  value={profile.conditions}
                  onChange={e => handleChange("conditions", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, maxWidth: 860, margin: "0 auto" }}>
          {saved && <span style={savedBadgeStyle}>✓ Saved successfully</span>}
          <button className="save-btn" style={saveBtnStyle} onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ icon, label, field, value, onChange, type = "text", placeholder }) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>
        <span style={{ color: "#52b788", marginRight: 5 }}>{icon}</span>
        {label}
      </label>
      <input
        className="profile-input"
        type={type}
        value={value}
        placeholder={placeholder || ""}
        onChange={e => onChange(field, e.target.value)}
        style={inputStyle}
      />
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
  maxWidth: 900,
  margin: "0 auto",
  padding: "32px 24px 48px",
}

const heroStyle = {
  display: "flex",
  alignItems: "center",
  gap: 20,
  marginBottom: 32,
}

const avatarCircleStyle = {
  width: 72,
  height: 72,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #2d6a4f, #52b788)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 16px rgba(45,106,79,0.25)",
  flexShrink: 0,
}

const nameTitleStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "1.7rem",
  color: "#1a4731",
  margin: "0 0 4px",
}

const emailStyle = {
  fontSize: "0.88rem",
  color: "#7a9e87",
  margin: 0,
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
  marginBottom: 20,
}

const cardStyle = {
  background: "#fff",
  border: "1px solid #d8f3dc",
  borderRadius: 16,
  padding: "22px 24px",
  boxShadow: "0 2px 10px rgba(26,71,49,0.05)",
}

const cardTitleStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "1rem",
  color: "#1a4731",
  margin: "0 0 18px",
  paddingBottom: 12,
  borderBottom: "1px solid #e8f5ec",
}

const fieldsStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
}

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 5,
}

const labelStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: "#3a5c46",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  display: "flex",
  alignItems: "center",
}

const inputStyle = {
  padding: "9px 12px",
  borderRadius: 9,
  border: "1.5px solid #d8f3dc",
  fontSize: 13,
  fontFamily: "'DM Sans', sans-serif",
  color: "#1a4731",
  background: "#f7fdf9",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
  width: "100%",
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
  background: "#d8f3dc",
  color: "#1a4731",
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 600,
}
