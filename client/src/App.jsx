import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000", {
  transports: ["websocket"]
});

function App() {
  const [members, setMembers] = useState([]);
  const [branding, setBranding] = useState({
    main: "MUDALIANS' MEDIA UNIT",
    sub: "PREFECT DAY - 2026"
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMember, setShowMember] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [formData, setFormData] = useState({ name: "", role: "" });

  /* SOCKET LISTENERS */
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

  /* ACTIONS */
  const addMember = e => {
    e.preventDefault();
    if (!formData.name) return;
    socket.emit("members:add", formData);
    setFormData({ name: "", role: "" });
  };

  const deleteMember = (e, id) => {
    e.stopPropagation();
    socket.emit("members:delete", id);
  };

  const goLive = index => socket.emit("display:member", index);
  const goBranding = () => socket.emit("display:branding");

  const updateBranding = updated => {
    setBranding(updated);
    socket.emit("branding:update", updated);
  };

  return (
    <div className="app-wrapper">
      {/* OVERLAY */}
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

      {/* ADMIN */}
      <div className="admin-panel">
        <div className="panel-header">
          <h2>CONTROL CENTER</h2>
          <button className={`reset-btn ${!showMember ? "active-live" : ""}`} onClick={goBranding}>
            {!showMember ? "● LIVE: BRANDING" : "SWITCH TO BRANDING"}
          </button>
        </div>

        <div className="panel-content">
          <section className="admin-section">
            <h3>Event Branding</h3>
            <div className="input-group">
              <input value={branding.main} onChange={e => updateBranding({ ...branding, main: e.target.value.toUpperCase() })} />
              <input value={branding.sub} onChange={e => updateBranding({ ...branding, sub: e.target.value.toUpperCase() })} />
            </div>

            <hr className="divider" />

            <h3>Add Recipient</h3>
            <form onSubmit={addMember} className="input-group">
              <input placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <input placeholder="Role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
              <button className="add-btn">Add</button>
            </form>
          </section>

          <section className="admin-section">
            <h3>Queue</h3>
            <div className="scroll-container">
              {members.map((m, i) => (
                <div key={m._id} className={`member-row ${currentIndex === i && showMember ? "live" : ""}`} onClick={() => goLive(i)}>
                  <div className="text-info">
                    <span className="m-name">{m.name}</span>
                    <span className="m-role">{m.role}</span>
                  </div>
                  <button className="del-btn" onClick={e => deleteMember(e, m._id)}>Delete</button>
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