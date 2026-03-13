import { useState, useRef, useEffect, useCallback } from "react";
import Icon from "../icons/Icon";
import AvatarCanvas from "../components/AvatarCanvas";

const INIT_MSGS = [
  {
    role: "ai",
    text: "Good to see you. I'm AfyaAI — your personal health companion. I can help with general wellness questions, daily check-ins, or simply talk through how you're feeling. What's on your mind today?",
  },
];

export default function HomePage() {
  const [msgs, setMsgs]   = useState(INIT_MSGS);
  const [input, setInput] = useState("");
  const [busy, setBusy]   = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;
    
    setMsgs(m => [...m, { role: "user", text }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": "YOUR_API_KEY",
          "anthropic-version": "2023-06-01" 
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229", 
          max_tokens: 1000,
          system: "You are AfyaAI, a calm health companion. Provide clear wellness guidance. No markdown. No bullets. Suggest professional help when needed.",
          messages: [{ role: "user", content: text }],
        }),
      });

      const data = await res.json();
      const reply = data.content?.[0]?.text || "I'm having trouble connecting. Let's try that again.";
      setMsgs(m => [...m, { role: "ai", text: reply }]);
    } catch (err) {
      setMsgs(m => [...m, { role: "ai", text: "Connection issue — please check your network." }]);
    } finally {
      setBusy(false);
    }
  }, [input, busy]);

  const stats = [
    { icon: "bed",     label: "Sleep",     val: "7h 20m" },
    { icon: "smile",   label: "Mood",      val: "Stable" },
    { icon: "droplet", label: "Hydration", val: "1.2L" },
    { icon: "flame",   label: "Streak",    val: "12 Days" },
  ];

  return (
    <div className="afya-home-grid afya-fi">
      {/* LEFT: Avatar + Status */}
      <div className="afya-av-col">
        <div 
          className="afya-av-stage" 
          style={{ 
            backgroundImage: 'url("/background.jpg")', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }}>
          <AvatarCanvas />
          <div className="afya-av-badge">
            <div className="afya-av-dot" />
            <span className="afya-av-lbl">AfyaAI · Live</span>
          </div>
        </div>

        <div className="afya-srow">
          <div className="afya-scard">
            <div className="afya-scard-title">Daily Overview</div>
            <div className="afya-sgrid">
              {stats.slice(0,2).map(s => (
                <div className="afya-sstat" key={s.label}>
                  <div className="afya-sibox">
                    <Icon n={s.icon} size={14} />
                  </div>
                  <div>
                    <div className="afya-sval">{s.val}</div>
                    <div className="afya-slbl">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="afya-scard">
            <div className="afya-scard-title">Weekly Overview</div>
            <div className="afya-sgrid">
              {stats.slice(2,4).map(s => (
                <div className="afya-sstat" key={s.label}>
                  <div className="afya-sibox">
                    <Icon n={s.icon} size={14} />
                  </div>
                  <div>
                    <div className="afya-sval">{s.val}</div>
                    <div className="afya-slbl">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Chat */}
      <div className="afya-cpanel">
        <div className="afya-chead">
          <div className="afya-chead-title">Wellness Assistant</div>
          <div className="afya-cstatus">
            <div className="afya-cdot" />
            Live
          </div>
        </div>

        <div className="afya-cmsgs">
          {msgs.map((m, i) => (
            <div key={i} className={`afya-mw ${m.role}`}>
              <div className="afya-mdot">
                {m.role === "ai" ? (
                  // <div className="afya-nav-mark" style={{ width: 24, height: 24, borderRadius: 6 }}>
                  //   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  //     <path d="M12 2v20M2 12h20" strokeLinecap="round"/>
                  //   </svg>
                  // </div>
                  <img src="/logo.svg" alt="AfyaAI" width="24" height="24" />
                ) : (
                  <div style={{ background: 'var(--a-bg3)', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Icon n="user" size={12} color="var(--a-green)" />
                  </div>
                )}
              </div>
              <div className="afya-mbubble">{m.text}</div>
            </div>
          ))}

          {busy && (
            <div className="afya-mw ai">
              <div className="afya-mdot">
                <div className="afya-nav-mark" style={{ width: 24, height: 24, borderRadius: 6, opacity: 0.5 }}>
                  <div className="afya-av-dot" style={{ background: '#fff' }} />
                </div>
              </div>
              <div className="afya-mbubble">
                <div className="afya-tdots"><span /><span /><span /></div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="afya-cfoot">
          <div className="afya-cbar">
            <button className="afya-cico">
              <Icon n="paperclip" size={16} />
            </button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="How are you feeling today?"
            />
            <button className="afya-csend" onClick={send}>
              <Icon n="send" size={16} />
            </button>
          </div>
          <div className="afya-cdisclaim">
            Designed for wellness. Consult a professional for medical advice.
          </div>
        </div>
      </div>
    </div>
  );
}