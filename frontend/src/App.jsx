import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import PrivacyPage from "./pages/Privacy";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.replace("/", "") || "home";

  const handleSetPage = (id) => {
    if (id === "home") {
      navigate("/");
    } else {
      navigate("/" + id);
    }
  };

  return (
    <div className="afya-page">
      <Navbar page={page} setPage={handleSetPage} />
      <div className="afya-inner">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
}