import { useState, useRef, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faFaceSmile,
  faDroplet,
  faBolt,
  faClipboardCheck,
  faFileMedical,
  faLocationDot,
  faPhone,
  faTriangleExclamation,
  faMicrophone,
  faPaperPlane,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import AvatarCanvas from "../components/AvatarCanvas";
import CheckinModal from "../components/CheckinModal";
import { sendChatMessage, uploadMedicalPDF } from "../services/api";

const INIT_MSGS = [
  {
    role: "ai",
    text: "Good to see you. I'm AfyaAI — your personal health companion. I can help with general wellness questions, daily check-ins, or simply talk through how you're feeling. What's on your mind today?",
  },
];

const getMoodLabel = (moodValue) => {
  if (typeof moodValue !== "number") return "—";
  const map = {
    1: "Very low",
    2: "Low",
    3: "Neutral",
    4: "Good",
    5: "Excellent",
  };
  return map[moodValue] || "—";
};

export default function HomePage() {
  const [msgs, setMsgs] = useState(INIT_MSGS);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [sessionId, setSessionId] = useState(
    "session1"
    // localStorage.getItem("afya_session_id") || null
  );
  const [severityWarning, setSeverityWarning] = useState(null);
  const [nearbyClinics, setNearbyClinics] = useState([]);
  const [hotlines, setHotlines] = useState({});
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [showPDFUpload, setShowPDFUpload] = useState(false);
  const [uploadingPDF, setUploadingPDF] = useState(false);
  const [checkinData, setCheckinData] = useState(() => {
    const saved = localStorage.getItem("afya_last_checkin");
    return saved
      ? JSON.parse(saved)
      : { sleep: "—", mood: "—", hydration: "—", symptoms: [] };
  });
  const [lastCheckinDate, setLastCheckinDate] = useState(
    localStorage.getItem("afya_last_checkin_date") || null
  );
  const [skipToday, setSkipToday] = useState(() => {
    const skip = localStorage.getItem("afya_skip_today");
    const skipDate = localStorage.getItem("afya_skip_date");
    const today = new Date().toISOString().split("T")[0];
    if (skip === "true" && skipDate === today) return true;
    localStorage.removeItem("afya_skip_today");
    localStorage.removeItem("afya_skip_date");
    return false;
  });

  // NEW: country and audioUrl for TTS
  const [country, setCountry] = useState('South Africa');
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy]);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("afya_session_id", sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (!skipToday && lastCheckinDate !== today) {
      const timer = setTimeout(() => setIsCheckinModalOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [skipToday, lastCheckinDate]);

  const handleCheckinSave = (data) => {
    const today = new Date().toISOString().split("T")[0];
    setCheckinData(data);
    setLastCheckinDate(today);
    localStorage.setItem("afya_last_checkin", JSON.stringify(data));
    localStorage.setItem("afya_last_checkin_date", today);
    localStorage.removeItem("afya_skip_today");
    localStorage.removeItem("afya_skip_date");
    setSkipToday(false);
  };

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;

    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setBusy(true);

    try {
      console.log("giving", {
        user_input: text,
        language: "english",
        session_id: "session1",
      });

      // MODIFIED: added country and tts_enabled
      const response = await sendChatMessage({
        latitude: 0,
        longitude: 0,
        user_input: text,
        language: "english",
        session_id: "session1",
        country: country,
        tts_enabled: true,
      });

      if (!sessionId && response.session_id) {
        setSessionId(response.session_id);
        setSessionId("session1");
      }

      setMsgs((m) => [
        ...m,
        {
          role: "ai",
          text:
            response.response_text ||
            "I'm having trouble understanding. Could you rephrase that?",
        },
      ]);

      // NEW: if audio_url is present, set it to trigger avatar speech
      if (response.audio_url) {
        setCurrentAudioUrl(response.audio_url);
      }

      if (response.severity_level && response.severity_level !== "low") {
        setSeverityWarning({
          level: response.severity_level,
          message:
            response.severity_level === "high"
              ? "Please seek immediate medical attention."
              : "Consider consulting a healthcare professional.",
        });
        setTimeout(() => setSeverityWarning(null), 10000);
      }

      if (response.clinics && response.clinics.length > 0) {
        setNearbyClinics(response.clinics);
      }

      if (response.hotlines) {
        setHotlines(response.hotlines);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMsgs((m) => [
        ...m,
        {
          role: "ai",
          text: "Connection issue — please check your network and try again.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }, [input, busy, sessionId, country]); // added country to dependencies

  const handlePDFUpload = async (file) => {
    if (!file) return;
    setUploadingPDF(true);
    try {
      const response = await uploadMedicalPDF({
        file,
        session_id: sessionId,
      });
      setMsgs((m) => [...m, { role: "ai", text: response.response_text }]);
    } catch (err) {
      alert("PDF upload failed");
    } finally {
      setUploadingPDF(false);
      setShowPDFUpload(false);
    }
  };

  const stats = [
    { icon: faMoon,       label: "Sleep",     val: checkinData.sleep },
    { icon: faFaceSmile,  label: "Mood",      val: getMoodLabel(checkinData.mood) },
    { icon: faDroplet,    label: "Hydration", val: checkinData.hydration },
    { icon: faBolt,       label: "Streak",    val: "—" },
  ];

  return (
    <div className="afya-home-grid afya-fi">
      {/* LEFT: Avatar + Status */}
      <div className="afya-av-col">
        <div
          className="afya-av-stage"
          style={{
            backgroundImage: 'url("/background.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* MODIFIED: pass audioUrl prop */}
          <AvatarCanvas audioUrl={currentAudioUrl} />
          <div className="afya-av-badge">
            <div className="afya-av-dot" />
            <span className="afya-av-lbl">AfyaAI · Live</span>
          </div>
        </div>

        <button
          onClick={() => setIsCheckinModalOpen(true)}
          style={{
            background: "var(--a-green)",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px",
            cursor: "pointer",
            width: "100%",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <FontAwesomeIcon icon={faClipboardCheck} />
          Daily Check-in
        </button>

        <div className="afya-srow">
          {["Daily Status", "Weekly Average"].map((title) => (
            <div className="afya-scard" key={title}>
              <div className="afya-scard-title">{title}</div>
              <div className="afya-sgrid">
                {stats.map((s) => (
                  <div className="afya-sstat" key={s.label}>
                    <div className="afya-sibox">
                      <FontAwesomeIcon icon={s.icon} style={{ fontSize: 13, color: "white" }} />
                    </div>
                    <div>
                      <div className="afya-sval">{s.val}</div>
                      <div className="afya-slbl">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Chat */}
      <div className="afya-cpanel">
        <div className="afya-chead">
          <div className="afya-chead-title">Chat with Afya</div>
          <div className="afya-cstatus">
            <div className="afya-cdot" />
            Online
          </div>
        </div>

        <div className="afya-cmsgs">
          {/* Severity warning */}
          {severityWarning && (
            <div
              style={{
                background:
                  severityWarning.level === "high" ? "#e74c3c" : "#f39c12",
                color: "white",
                padding: "12px 20px",
                borderRadius: 8,
                marginBottom: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <FontAwesomeIcon icon={faTriangleExclamation} />
              {severityWarning.message}
            </div>
          )}

          {/* Clinics */}
          {nearbyClinics.length > 0 && (
            <div style={infoCardStyle}>
              <h4 style={infoTitleStyle}>
                <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 7 }} />
                Nearby Medical Facilities
              </h4>
              {nearbyClinics.map((clinic, idx) => (
                <div key={idx} style={clinicItemStyle}>
                  <strong>{clinic.name}</strong>
                  {clinic.address && (
                    <div style={{ fontSize: 12 }}>{clinic.address}</div>
                  )}
                  {clinic.phone && (
                    <div style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                      <FontAwesomeIcon icon={faPhone} style={{ fontSize: 11, color: "var(--a-green)" }} />
                      {clinic.phone}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Hotlines */}
          {Object.keys(hotlines).length > 0 && (
            <div style={infoCardStyle}>
              <h4 style={infoTitleStyle}>
                <FontAwesomeIcon icon={faPhone} style={{ marginRight: 7 }} />
                Emergency Hotlines
              </h4>
              {Object.entries(hotlines).map(([key, number]) => (
                <div key={key} style={hotlineItemStyle}>
                  <strong>{key.replace(/_/g, " ")}:</strong> {number}
                </div>
              ))}
            </div>
          )}

          {/* Chat messages */}
          {msgs.map((m, i) => (
            <div key={i} className={`afya-mw ${m.role}`}>
              <div className={`afya-mdot ${m.role}`}>
                {m.role === "ai" ? (
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--a-greenbr)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  >
                    <path d="M12 2C8 2 4 6 4 10c0 6 8 12 8 12s8-6 8-12c0-4-4-8-8-8z" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                ) : (
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: 10, color: "#fff" }} />
                )}
              </div>
              <div className="afya-mbubble">{m.text}</div>
            </div>
          ))}

          {busy && (
            <div className="afya-mw ai">
              <div className="afya-mdot ai">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--a-greenbr)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M12 2C8 2 4 6 4 10c0 6 8 12 8 12s8-6 8-12c0-4-4-8-8-8z" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
              </div>
              <div className="afya-mbubble">
                <div className="afya-tdots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="afya-cfoot">
          <div className="afya-cbar">
            <button
              className="afya-cico"
              title="Upload medical PDF"
              onClick={() => setShowPDFUpload(true)}
            >
              <FontAwesomeIcon icon={faFileMedical} style={{ fontSize: 14 }} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Tell me how you're feeling..."
            />
            <button className="afya-cico" title="Voice input">
              <FontAwesomeIcon icon={faMicrophone} style={{ fontSize: 14 }} />
            </button>
            <button className="afya-csend" onClick={send} title="Send">
              <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: 13, color: "#fff" }} />
            </button>
          </div>
          <div className="afya-cdisclaim">
            AfyaAI can make mistakes. Made with care by WeThinkCode's MetaMedics.
          </div>
        </div>
      </div>

      {/* Modals */}
      <CheckinModal
        key={isCheckinModalOpen ? 'open' : 'closed'}
        isOpen={isCheckinModalOpen}
        onClose={() => setIsCheckinModalOpen(false)}
        onSave={handleCheckinSave}
        sessionId={sessionId}
      />

      {showPDFUpload && (
        <div style={pdfOverlayStyle}>
          <div style={pdfModalStyle}>
            <h4 style={{ marginBottom: 16, color: "var(--a-green)", display: "flex", alignItems: "center", gap: 8 }}>
              <FontAwesomeIcon icon={faFileMedical} />
              Upload Medical PDF
            </h4>
            <input
              type="file"
              accept=".pdf"
              onChange={async (e) => {
                const file = e.target.files[0];
                await handlePDFUpload(file);
              }}
            />
            <button
              onClick={() => setShowPDFUpload(false)}
              disabled={uploadingPDF}
              style={{ marginTop: 16, padding: "8px 16px", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const infoCardStyle = {
  background: "var(--a-surface)",
  border: "1px solid var(--a-bdr)",
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
};

const infoTitleStyle = {
  fontSize: 14,
  fontWeight: 600,
  marginBottom: 12,
  color: "var(--a-green)",
  display: "flex",
  alignItems: "center",
};

const clinicItemStyle = {
  padding: "8px 0",
  borderBottom: "1px solid var(--a-bdr)",
};

const hotlineItemStyle = {
  padding: "6px 0",
  fontSize: 14,
};

const pdfOverlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const pdfModalStyle = {
  background: "white",
  borderRadius: 16,
  padding: 24,
  maxWidth: 400,
  width: "90%",
};