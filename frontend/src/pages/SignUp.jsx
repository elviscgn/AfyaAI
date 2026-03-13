import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaHeartbeat, FaEye, FaEyeSlash } from "react-icons/fa"

export default function SignUp() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "" })

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: connect to auth backend
    navigate("/")
  }

  return (
    <div style={pageStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');

        .auth-input:focus { border-color: #52b788 !important; outline: none; }
        .auth-btn:hover { background: #1a4731 !important; }
        .toggle-btn:hover { color: #2d6a4f !important; }
      `}</style>

      {/* Left decorative panel */}
      <div style={leftPanelStyle}>
        <div style={brandStyle}>
          <div style={logoIconStyle}>
            <FaHeartbeat size={22} color="#fff" />
          </div>
          <span style={logoTextStyle}>AfyaAI</span>
        </div>
        <div style={taglineStyle}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#fff", margin: "0 0 14px", lineHeight: 1.25 }}>
            Your personal<br />health companion
          </h2>
          <p style={{ color: "#a8d5bb", fontSize: "0.92rem", lineHeight: 1.75, margin: 0 }}>
            AfyaAI provides calm, supportive wellness guidance — helping you understand
            your body and make informed decisions every day.
          </p>
        </div>
        <div style={featureListStyle}>
          {["3D health avatar", "Daily check-ins", "Symptom guidance", "Nearby facilities"].map(f => (
            <div key={f} style={featureChipStyle}>
              <span style={{ color: "#52b788", marginRight: 6 }}>✓</span> {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={rightPanelStyle}>
        <div style={formCardStyle}>
          <h2 style={formTitleStyle}>{isLogin ? "Welcome back" : "Create your account"}</h2>
          <p style={formSubStyle}>{isLogin ? "Sign in to continue your wellness journey." : "Join AfyaAI and start your wellness journey today."}</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {!isLogin && (
              <div style={fieldStyle}>
                <label style={labelStyle}>Full Name</label>
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required={!isLogin}
                  style={inputStyle}
                />
              </div>
            )}

            <div style={fieldStyle}>
              <label style={labelStyle}>Email address</label>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="auth-input"
                  type={showPass ? "text" : "password"}
                  placeholder={isLogin ? "Your password" : "Min. 8 characters"}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                  style={{ ...inputStyle, paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={eyeBtnStyle}
                >
                  {showPass ? <FaEyeSlash size={14} color="#7a9e87" /> : <FaEye size={14} color="#7a9e87" />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn" style={submitBtnStyle}>
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p style={switchStyle}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="toggle-btn"
              onClick={() => setIsLogin(!isLogin)}
              style={toggleBtnStyle}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

const pageStyle = {
  display: "flex",
  minHeight: "100vh",
  fontFamily: "'DM Sans', sans-serif",
}

const leftPanelStyle = {
  flex: "0 0 42%",
  background: "linear-gradient(160deg, #1a4731 0%, #2d6a4f 60%, #3a9d6e 100%)",
  padding: "48px 48px",
  display: "flex",
  flexDirection: "column",
  gap: 0,
}

const brandStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: "auto",
}

const logoIconStyle = {
  width: 40,
  height: 40,
  borderRadius: 11,
  background: "rgba(255,255,255,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(255,255,255,0.2)",
}

const logoTextStyle = {
  fontFamily: "'Playfair Display', serif",
  fontWeight: 700,
  fontSize: "1.4rem",
  color: "#fff",
}

const taglineStyle = {
  marginBottom: 40,
}

const featureListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
}

const featureChipStyle = {
  fontSize: "0.88rem",
  color: "#d8f3dc",
  fontWeight: 500,
}

const rightPanelStyle = {
  flex: 1,
  background: "#f7fdf9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 24px",
}

const formCardStyle = {
  width: "100%",
  maxWidth: 400,
  background: "#fff",
  borderRadius: 20,
  padding: "36px 32px",
  border: "1px solid #d8f3dc",
  boxShadow: "0 4px 24px rgba(26,71,49,0.09)",
}

const formTitleStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "1.7rem",
  color: "#1a4731",
  margin: "0 0 6px",
}

const formSubStyle = {
  fontSize: "0.88rem",
  color: "#7a9e87",
  margin: "0 0 24px",
}

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 5,
}

const labelStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: "#3a5c46",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}

const inputStyle = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1.5px solid #d8f3dc",
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  color: "#1a4731",
  background: "#f7fdf9",
  transition: "border-color 0.2s",
  width: "100%",
  boxSizing: "border-box",
}

const eyeBtnStyle = {
  position: "absolute",
  right: 12,
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 2,
  display: "flex",
}

const submitBtnStyle = {
  width: "100%",
  padding: "12px",
  background: "#2d6a4f",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  transition: "background 0.2s",
  marginTop: 4,
}

const switchStyle = {
  textAlign: "center",
  fontSize: 13,
  color: "#7a9e87",
  margin: "18px 0 0",
}

const toggleBtnStyle = {
  background: "none",
  border: "none",
  color: "#52b788",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
  padding: 0,
  transition: "color 0.15s",
}
