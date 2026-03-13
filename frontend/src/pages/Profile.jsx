// components/afya/ProfilePage.jsx

import Icon from "../icons/Icon";

export default function ProfilePage() {
  return (
    <div className="afya-inner afya-fi">

      {/* Hero */}
      <div className="afya-phero2">
        <div style={{ position: "relative" }}>
          <div className="afya-pav">
            <Icon n="user" size={32} stroke="var(--a-greenbr)" />
            <div className="afya-paved">
              <Icon n="edit" size={9} />
            </div>
          </div>
        </div>
        <div>
          <div className="afya-pname">Jane Doe</div>
          <div className="afya-pemail">jane.doe@example.com</div>
        </div>
      </div>

      <div className="afya-pcontent">

        {/* Two-column cards */}
        <div className="afya-pgrid">
          <div className="afya-card">
            <div className="afya-card-t">Personal Information</div>
            <div className="afya-field">
              <label>Full Name</label>
              <input className="afya-inp" defaultValue="Jane Doe" />
            </div>
            <div className="afya-field">
              <label>Email Address</label>
              <input className="afya-inp" defaultValue="jane.doe@example.com" />
            </div>
            <div className="afya-field" style={{ marginBottom: 0 }}>
              <label>Date of Birth</label>
              <input className="afya-inp" type="date" defaultValue="1995-06-15" />
            </div>
          </div>

          <div className="afya-card">
            <div className="afya-card-t">Health Information</div>
            <div className="afya-field">
              <label>Weight (kg)</label>
              <input className="afya-inp" placeholder="e.g. 65" />
            </div>
            <div className="afya-field">
              <label>Height (cm)</label>
              <input className="afya-inp" placeholder="e.g. 168" />
            </div>
            <div className="afya-field" style={{ marginBottom: 0 }}>
              <label>Blood Type</label>
              <input className="afya-inp" placeholder="e.g. O+" />
            </div>
          </div>
        </div>

        {/* Medical notes */}
        <div className="afya-card">
          <div className="afya-card-t">Medical Notes</div>
          <div className="afya-field">
            <label>Known Allergies</label>
            <textarea className="afya-inp" rows={3} placeholder="List any known allergies..." />
          </div>
          <div className="afya-field" style={{ marginBottom: 0 }}>
            <label>Existing Conditions</label>
            <textarea className="afya-inp" rows={3} placeholder="List any existing medical conditions..." />
          </div>
        </div>

        <div className="afya-saverow">
          <button className="afya-btng">Discard</button>
          <button className="afya-btn">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
