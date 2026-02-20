import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem("media_members_final");
    return saved ? JSON.parse(saved) : [];
  });

  const [branding, setBranding] = useState(() => {
    const saved = localStorage.getItem("event_branding_final");
    return saved ? JSON.parse(saved) : { main: "MUDALIANS' MEDIA UNIT", sub: "PREFECT DAY - 2026" };
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMember, setShowMember] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "" });
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    localStorage.setItem("media_members_final", JSON.stringify(members));
    localStorage.setItem("event_branding_final", JSON.stringify(branding));
  }, [members, branding]);

  const toggleDisplay = (index) => {
    setIsAnimating(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setShowMember(true);
      setIsAnimating(true);
    }, 300);
  };

  const showBranding = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowMember(false);
      setIsAnimating(true);
    }, 300);
  };

  const addMember = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    setMembers([...members, formData]);
    setFormData({ name: "", role: "" });
  };

  const deleteMember = (e, index) => {
    e.stopPropagation(); // Prevents clicking "Delete" from also triggering "Go Live"
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);
  };

  return (
    <div className="app-wrapper">
      <div className="overlay-layer">
        <div className={`lower-third ${isAnimating ? "active" : ""} ${showMember ? "member-mode" : "branding-mode"}`}>
          <div className="main-plate">
            <div className="gold-trim"></div>
            <h1 className="name-text">
              {showMember ? members[currentIndex]?.name : branding.main}
            </h1>
            <div className="shimmer"></div>
          </div>
          <div className="sub-plate">
            <span className="role-text">
              {showMember ? members[currentIndex]?.role : branding.sub}
            </span>
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="panel-header">
          <h2>CONTROL CENTER</h2>
          <button className={`reset-btn ${!showMember ? 'active-live' : ''}`} onClick={showBranding}>
            {!showMember ? "● LIVE: BRANDING" : "SWITCH TO BRANDING"}
          </button>
        </div>

        <div className="panel-content">
          <section className="admin-section">
            <div className="admin-box">
              <h3>Event Branding</h3>
              <div className="input-group">
                <input placeholder="Main Title" value={branding.main} onChange={(e) => setBranding({...branding, main: e.target.value.toUpperCase()})} />
                <input placeholder="Sub Title" value={branding.sub} onChange={(e) => setBranding({...branding, sub: e.target.value.toUpperCase()})} />
              </div>
              <hr className="divider" />
              <h3>Add Recipient</h3>
              <form onSubmit={addMember} className="input-group">
                <input placeholder="Student Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input placeholder="Award/Role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                <button type="submit" className="add-btn">Add to List</button>
              </form>
            </div>
          </section>

          <section className="admin-section">
            <h3>Member Queue (Click Box to Go Live)</h3>
            <div className="scroll-container">
              {members.map((m, i) => (
                <div 
                  key={i} 
                  className={`member-row ${currentIndex === i && showMember ? 'live' : ''}`}
                  onClick={() => toggleDisplay(i)}
                >
                  <div className="text-info">
                    <span className="m-name">{m.name}</span>
                    <span className="m-role">{m.role}</span>
                  </div>
                  <button className="del-btn" onClick={(e) => deleteMember(e, i)}>Delete</button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;