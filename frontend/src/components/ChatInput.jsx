import React from "react";
import { FaPlus, FaMicrophone, FaPaperPlane } from "react-icons/fa";

export default function ChatInput({ inputText, setInputText, handleSend }) {
  return (
    <div className="afya-cbar">
      <FaPlus style={{ color: "var(--a-cream2)", cursor: "pointer" }} />
      <input
        type="text"
        placeholder="How are you feeling?"
        value={inputText}
        onChange={e => setInputText(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSend()}
      />
      <FaMicrophone style={{ color: "var(--a-cream2)", cursor: "pointer" }} />
      <button 
        onClick={handleSend}
        style={{ background: "var(--a-green)", border: "none", color: "white", padding: "8px 12px", borderRadius: "8px", cursor: "pointer" }}
      >
        <FaPaperPlane size={12} />
      </button>
    </div>
  );
}