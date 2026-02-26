import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./LowerThird.css";

const socket = io("http://localhost:5000", {
  transports: ["websocket"]
});

function LowerThird() {
  const [members, setMembers] = useState([]);
  const [branding, setBranding] = useState({
    main: "Main Event Title",
    sub: "Subtitle or Description",
    primary: "#0033cc",
    secondary: "#ffcc00"
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMember, setShowMember] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [formData, setFormData] = useState({ name: "", role: "" });

  useEffect(() => {
    socket.on("members:update", setMembers);
    socket.on("branding:update", setBranding);
    socket.on("display:member", index => {
      setIsAnimating(false);
      setTimeout(() => {
        setCurrentIndex(index);
        setShowMember(true);
        setIsAnimating(true);
      }, 300);
    });
    socket.on("display:branding", () => {
      setIsAnimating(false);
      setTimeout(() => {
        setShowMember(false);
        setIsAnimating(true);
      }, 300);
    });
    return () => socket.off();
  }, []);

  const addMember = e => {
    e.preventDefault();
    if (!formData.name) return;
    socket.emit("members:add", formData);
    setFormData({ name: "", role: "" });
  };

  const updateBranding = updated => {
    setBranding(updated);
    socket.emit("branding:update", updated);
  };

  const dynamicStyles = {
    "--blue": branding.primary,
    "--gold": branding.secondary,
    "--dark-blue": branding.primary === "#0033cc" ? "#001a66" : branding.primary 
  };

  return (
    <div className="app-wrapper" style={dynamicStyles}>
      <div className="overlay-layer">
        <div className={`lower-third ${isAnimating ? "active" : ""} ${showMember ? "member-mode" : "branding-mode"}`}>
          <div className="main-plate">
            <div className="gold-trim" />
            <h1 className="name-text">
              {showMember ? members[currentIndex]?.name : branding.main}
            </h1>
            <div className="shimmer" />
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
          <button 
            className={`reset-btn ${!showMember ? "active-live" : ""}`} 
            onClick={() => socket.emit("display:branding")}
          >
            {!showMember ? "● LIVE: BRANDING" : "SWITCH TO BRANDING"}
          </button>
        </div>

        <div className="panel-content">
          <section className="admin-section left-col">
            <div className="branding-controls">
              <h3>Event Branding & Colors</h3>
              <div className="branding-inputs">
                <input 
                  className="themed-input"
                  value={branding.main} 
                  onChange={e => updateBranding({ ...branding, main: e.target.value.toUpperCase() })} 
                />
                <input 
                  className="themed-input"
                  value={branding.sub} 
                  onChange={e => updateBranding({ ...branding, sub: e.target.value.toUpperCase() })} 
                />
              </div>
              
              <div className="color-pickers">
                <div className="picker-box">
                  <label>Primary</label>
                  <input type="color" value={branding.primary} onChange={e => updateBranding({ ...branding, primary: e.target.value })} />
                </div>
                <div className="picker-box">
                  <label>Accent</label>
                  <input type="color" value={branding.secondary} onChange={e => updateBranding({ ...branding, secondary: e.target.value })} />
                </div>
              </div>
            </div>

            <hr className="divider" />

            <div className="add-recipient-form">
              <h3>Add Recipient</h3>
              <form onSubmit={addMember} className="input-group">
                <input className="themed-input" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                <input className="themed-input" placeholder="Role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                <button type="submit" className="add-btn">ADD TO QUEUE</button>
              </form>
            </div>
          </section>

          <section className="admin-section right-col">
            <h3>Queue</h3>
            <div className="scroll-container custom-scrollbar">
              {members.length > 0 ? (
                members.map((m, i) => (
                  <div 
                    key={m._id || i} 
                    className={`member-row ${currentIndex === i && showMember ? "live" : ""}`} 
                    onClick={() => socket.emit("display:member", i)}
                  >
                    <div className="text-info">
                      <span className="m-name">{m.name}</span>
                      <span className="m-role">{m.role}</span>
                    </div>
                    <button className="del-btn" onClick={e => { e.stopPropagation(); socket.emit("members:delete", m._id); }}>Delete</button>
                  </div>
                ))
              ) : (
                <div className="empty-msg">Queue is empty</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default LowerThird;