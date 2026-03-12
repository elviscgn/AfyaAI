import { useState, useRef, useEffect } from "react"
import { FaSignOutAlt } from "react-icons/fa"

// Replace with your actual asset or a URL once auth is set up
const PLACEHOLDER_PFP = "https://github.com/elviscgn.png"

export default function ProfileDropdown({ user }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Swap these out when you wire up real auth
  const displayName  = user?.name  || "Elvis Chege"
  const displayEmail = user?.email || "elvischege@gmail.com"
  const displayPfp   = user?.avatar || PLACEHOLDER_PFP

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <img
        src={displayPfp}
        alt="Profile"
        style={profileStyle}
        onClick={() => setOpen(!open)}
      />

      <div style={{
        ...dropdownStyle,
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0px)" : "translateY(-5px)",
        pointerEvents: open ? "auto" : "none"
      }}>
        <img src={displayPfp} alt="Profile" style={{ width: 50, height: 50, borderRadius: "50%", marginBottom: 6 }} />
        <p style={nameStyle}>{displayName}</p>
        <p style={emailStyle}>{displayEmail}</p>

        <hr style={dividerStyle} />

        <button style={logoutButtonStyle}>
          <FaSignOutAlt style={{ marginRight: 6 }} /> Logout
        </button>
      </div>
    </div>
  )
}

const profileStyle = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  objectFit: "cover",
  cursor: "pointer",
  border: "2px solid #10B981"
}

const dropdownStyle = {
  position: "absolute",
  top: "42px",
  right: 0,
  width: 180,
  backgroundColor: "#F9FAFB",
  borderRadius: 10,
  padding: "10px 12px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.12)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  transition: "all 0.15s ease",
  zIndex: 20
}

const nameStyle  = { fontWeight: 600, margin: "2px 0", color: "#1F2937", fontSize: 14 }
const emailStyle = { fontSize: 11, color: "#6B7280", margin: "2px 0 6px 0" }

const dividerStyle = {
  width: "100%",
  border: "0",
  borderTop: "1px solid #E5E7EB",
  margin: "6px 0"
}

const logoutButtonStyle = {
  width: "100%",
  padding: "6px 0",
  backgroundColor: "#EF4444",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 13,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.2s"
}

