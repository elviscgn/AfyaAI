import React, { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";

export default function RightPanel({ messages, inputText, setInputText, handleSend }) {
  const chatEndRef = useRef(null);
  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  return (
    <div className="afya-cpanel">
      <div className="afya-cmsgs">
        {messages.map((msg, idx) => (
          <div key={idx} className={`afya-mw ${msg.from === "user" ? "user" : "ai"}`}>
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="afya-cfoot">
        <ChatInput inputText={inputText} setInputText={setInputText} handleSend={handleSend} />
      </div>
    </div>
  );
}