import Icon from "../icons/Icon";

export default function Navbar({ page, setPage }) {
  const links = [
    { id: "home",    label: "Home" },
    { id: "about",   label: "About" },
    { id: "privacy", label: "Privacy" },
  ];

  return (
    <nav className="afya-nav">
      <div className="afya-nav-logo" onClick={() => setPage("home")}>
        <div className="afya-nav-mark">
          <img src="/logo.svg" alt="AfyaAI" width="30" height="30" />
        </div>
        <span className="afya-nav-name" style={{ fontFamily: 'Zain, sans-serif', fontWeight: 700 }}>
          <span>Afya</span>
          <span>AI</span>
        </span>
      </div>

      <div className="afya-nav-center">
        {links.map(l => (
          <button
            key={l.id}
            className={`afya-nav-btn ${page === l.id ? "active" : ""}`}
            onClick={() => setPage(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="afya-nav-right">
        <button className="afya-nav-icon" title="GitHub">
          <Icon n="github" size={16} />
        </button>
        <button className="afya-nav-icon" title="Settings" onClick={() => setPage("settings")}>
          <Icon n="settings" size={16} />
        </button>
        <div className="afya-nav-avatar" onClick={() => setPage("profile")} title="Profile">
          <Icon n="user" size={16} />
        </div>
      </div>
    </nav>
  );
}