import React, { useState, useEffect } from "react";
import axios from "axios";

const API_ROOT = "http://localhost:5000/api/score";

const initialGameState = {
  runs: 0,
  wickets: 0,
  balls: 0,
  players: [
    { name: "PLAYER 1", runs: 0, balls: 0 },
    { name: "PLAYER 2", runs: 0, balls: 0 }
  ],
  nextBatsman: "NEXT BATSMAN",
  strikerIndex: 0,
  bowler: "BOWLER NAME",
  nextBowler: "UPCOMING BOWL",
  bowlerWickets: 0,
  bowlerRuns: 0,
  overHistory: [], 
  isFreeHit: false,
  manualRR: "0.00"
};

const initialBrandingState = {
  matchTitle: "T20 WORLD CUP",
  themeColor: "#0f172a",
  accentColor: "#38bdf8",
  team1Logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR86AXDyCzQ_j4ZuIkRDQrjY4-QOlR11bw75g&s",
  team2Logo: "https://media.istockphoto.com/id/2095317544/vector/pakistan-flag-circular-icon-round-national-flag-standard-color-digital-illustration-computer.jpg?s=612x612&w=0&k=20&c=I3eafKYN-Lz_O0XE-wuB7bpNjc67k1KaLKKSK4wvVtM=",
  displayMode: "RR",
  targetValue: "180",
};

export default function ICCScoreboardAdmin() {
  const [score, setScore] = useState(initialGameState);
  const [branding, setBranding] = useState(initialBrandingState);
  const [animation, setAnimation] = useState(null);
  const [animStatus, setAnimStatus] = useState("");

  useEffect(() => {
    axios.get(`${API_ROOT}/latest`).then(res => {
      if (res.data && res.data.game) {
        setScore(res.data.game);
        setBranding(res.data.branding);
      }
    }).catch(() => console.log("Local Mode Active"));
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      axios.post(`${API_ROOT}/save`, { game: score, branding: branding }).catch(() => {});
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [score, branding]);

  // --- ADDED RESET FUNCTION ---
  const resetMatch = () => {
    if (window.confirm("Are you sure you want to reset the entire match?")) {
      setScore(initialGameState);
      setBranding(initialBrandingState);
    }
  };

  const triggerAnimation = (type) => {
    setAnimStatus("entering");
    setAnimation(type);
    setTimeout(() => setAnimStatus("exiting"), 2000);
    setTimeout(() => { setAnimation(null); setAnimStatus(""); }, 2500);
  };

  const handleNewOver = () => {
    setScore(prev => ({
      ...prev,
      overHistory: [],
      bowlerRuns: 0,
      bowlerWickets: 0,
      bowler: prev.nextBowler,
      nextBowler: "NEW BOWL",
      strikerIndex: prev.strikerIndex === 0 ? 1 : 0
    }));
  };

  const addRun = (r) => {
    if (score.wickets >= 10) return;
    if (r === 4) triggerAnimation("FOUR");
    if (r === 6) triggerAnimation("SIX");

    setScore(prev => {
      const updatedPlayers = prev.players.map((p, idx) => 
        idx === prev.strikerIndex ? { ...p, runs: p.runs + r, balls: p.balls + 1 } : p
      );
      
      const newStrikerIndex = (r % 2 !== 0) ? (prev.strikerIndex === 0 ? 1 : 0) : prev.strikerIndex;
      
      return {
        ...prev,
        runs: prev.runs + r,
        balls: prev.balls + 1,
        players: updatedPlayers,
        strikerIndex: newStrikerIndex,
        bowlerRuns: prev.bowlerRuns + r,
        overHistory: [...prev.overHistory, r === 0 ? "0" : r].slice(-6),
        isFreeHit: false,
      };
    });
  };

  const addWicket = () => {
    if (score.wickets >= 10 || score.isFreeHit) return;
    triggerAnimation("WICKET");
    setScore(prev => {
      const updatedPlayers = prev.players.map((p, idx) => 
        idx === prev.strikerIndex ? { name: prev.nextBatsman, runs: 0, balls: 0 } : p
      );
      return {
        ...prev,
        wickets: prev.wickets + 1,
        balls: prev.balls + 1,
        players: updatedPlayers,
        nextBatsman: "NEXT PLAYER",
        bowlerWickets: prev.bowlerWickets + 1,
        overHistory: [...prev.overHistory, "W"].slice(-6),
      };
    });
  };

  return (
    <div style={styles.page}>
      <style>{broadcastFX}</style>
      
      <div style={styles.panel}>
        <div style={styles.adminGrid}>
          <div style={styles.adminCol}>
            <label style={styles.label}>BATSMEN LINEUP</label>
            <input style={styles.input} value={score.players[0].name} onChange={e => {
                const p = [...score.players]; p[0].name = e.target.value.toUpperCase(); setScore({...score, players: p});
            }} />
            <input style={styles.input} value={score.players[1].name} onChange={e => {
                const p = [...score.players]; p[1].name = e.target.value.toUpperCase(); setScore({...score, players: p});
            }} />
            <input style={styles.input} value={score.nextBatsman} onChange={e => setScore({...score, nextBatsman: e.target.value.toUpperCase()})} placeholder="Next Batsman" />
            <button style={styles.swapBtn} onClick={() => setScore(p => ({...p, strikerIndex: p.strikerIndex === 0 ? 1 : 0}))}>SWAP STRIKE</button>
          </div>

          <div style={styles.adminCol}>
            <label style={styles.label}>BOWLING & RUN RATE</label>
            <input style={styles.input} value={score.bowler} onChange={e => setScore({...score, bowler: e.target.value.toUpperCase()})} placeholder="Current Bowler" />
            <input style={styles.input} value={score.nextBowler} onChange={e => setScore({...score, nextBowler: e.target.value.toUpperCase()})} placeholder="Upcoming Bowler" />
            <div style={{display:'flex', gap: 5}}>
                <input style={{...styles.input, flex: 1}} value={score.manualRR} onChange={e => setScore({...score, manualRR: e.target.value})} placeholder="RR" />
                <input style={{...styles.input, flex: 1}} value={branding.targetValue} onChange={e => setBranding({...branding, targetValue: e.target.value})} placeholder="Target" />
            </div>
            <button style={styles.newOverBtn} onClick={handleNewOver}>START NEW OVER (RESET BOWLER)</button>
          </div>

          <div style={styles.adminCol}>
            <label style={styles.label}>LOGOS & THEME</label>
            <input style={styles.input} value={branding.matchTitle} onChange={e => setBranding({...branding, matchTitle: e.target.value.toUpperCase()})} placeholder="Match Title" />
            <div style={{display:'flex', gap: 5}}>
                <div style={{flex: 1}}>
                    <small style={{fontSize: 9}}>THEME</small>
                    <input type="color" style={{...styles.input, width:'100%', padding: 2}} value={branding.themeColor} onChange={e => setBranding({...branding, themeColor: e.target.value})} />
                </div>
                <div style={{flex: 1}}>
                    <small style={{fontSize: 9}}>ACCENT</small>
                    <input type="color" style={{...styles.input, width:'100%', padding: 2}} value={branding.accentColor} onChange={e => setBranding({...branding, accentColor: e.target.value})} />
                </div>
            </div>
            <input style={styles.input} value={branding.team1Logo} onChange={e => setBranding({...branding, team1Logo: e.target.value})} placeholder="Team 1 Logo URL" />
            <input style={styles.input} value={branding.team2Logo} onChange={e => setBranding({...branding, team2Logo: e.target.value})} placeholder="Team 2 Logo URL" />
            
            <div style={{display:'flex', gap: 5}}>
              <button style={{...styles.modeToggleBtn, flex: 1}} onClick={() => setBranding(b => ({...b, displayMode: b.displayMode === 'RR' ? 'TARGET' : 'RR'}))}>
                TOGGLE RR / TARGET
              </button>
              <button style={{...styles.resetBtn, flex: 1}} onClick={resetMatch}>
                RESET MATCH
              </button>
            </div>
          </div>
        </div>

        <div style={styles.buttonRow}>
          {[0, 1, 2, 3, 4, 6].map(r => <button key={r} onClick={() => addRun(r)} style={styles.runBtn}>+{r}</button>)}
          <button onClick={addWicket} style={styles.wicketBtn}>OUT</button>
          <button style={{...styles.freeHitBtn, background: score.isFreeHit ? '#ff3e3e' : '#ffd700'}} onClick={() => setScore({...score, isFreeHit: !score.isFreeHit})}>FREE HIT</button>
        </div>
      </div>

      <div style={styles.obsContainer}>
        <div style={styles.mainWrapper}>
            <div style={styles.logoCircle}>
                <img src={branding.team1Logo} style={styles.logoImg} alt="T1" />
            </div>
            
            <div style={{ ...styles.scoreBar, background: `linear-gradient(90deg, ${branding.themeColor} 0%, #000 100%)` }}>
              <div style={styles.batsSection}>
                  {score.players.map((p, i) => (
                  <div key={i} style={{ ...styles.playerRow, opacity: score.strikerIndex === i ? 1 : 0.5 }}>
                      <span style={styles.playerName}>{score.strikerIndex === i ? '▸ ' : ''}{p.name}</span>
                      <span style={styles.playerRuns}>{p.runs} <small style={{fontSize: 14, opacity: 0.6}}>({p.balls})</small></span>
                  </div>
                  ))}
              </div>

              <div style={styles.centerSection}>
                  {animation ? (
                  <div className={`celeb ${animStatus}`} style={{color: animation === 'WICKET' ? '#ff4757' : '#ffd700'}}>{animation}</div>
                  ) : (
                  <>
                      <div style={styles.matchTitle}>{score.isFreeHit ? <span className="blink">FREE HIT</span> : branding.matchTitle}</div>
                      <div style={styles.mainScoreRow}>
                        <span style={styles.scoreBig}>{score.runs}-{score.wickets}</span>
                        <div key={branding.displayMode} className="mode-anim" style={styles.rrBox}>
                            <small style={{fontSize: 9, display: 'block', opacity: 0.7}}>{branding.displayMode}</small>
                            <span style={{color: branding.accentColor, fontSize: 22}}>{branding.displayMode === 'RR' ? score.manualRR : branding.targetValue}</span>
                        </div>
                        <span style={styles.oversBig}>{Math.floor(score.balls/6)}.{score.balls%6}</span>
                      </div>
                  </>
                  )}
              </div>

              <div style={styles.bowlerSection}>
                  <div style={styles.bowlerRow}>
                    <span style={styles.bowlerName}>{score.bowler}</span>
                    <span style={styles.bowlerScore}>{score.bowlerWickets}-{score.bowlerRuns}</span>
                  </div>
                  <div style={styles.overHistoryRow}>
                      {[...Array(6)].map((_, i) => (
                          <div key={i} style={{...styles.ballDot, background: score.overHistory[i] === 'W' ? '#e63946' : score.overHistory[i] ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'}}>
                              {score.overHistory[i]}
                          </div>
                      ))}
                  </div>
              </div>
            </div>

            <div style={styles.logoCircle}>
              <img src={branding.team2Logo} style={styles.logoImg} alt="T2" />
            </div>
        </div>
      </div>

      <div style={styles.backupPanel}>
          <h3 style={{margin: '0 0 15px 0', fontSize: 13, color: '#94a3b8'}}>SCOREBOARD BACKUP (MANUAL OVERRIDE)</h3>
          <div style={styles.backupGrid}>
              <div style={styles.backupItem}><span>TOTAL RUNS</span><input style={styles.backupInput} type="number" value={score.runs} onChange={e => setScore({...score, runs: parseInt(e.target.value)||0})} /></div>
              <div style={styles.backupItem}><span>WICKETS</span><input style={styles.backupInput} type="number" value={score.wickets} onChange={e => setScore({...score, wickets: parseInt(e.target.value)||0})} /></div>
              <div style={styles.backupItem}><span>BALLS</span><input style={styles.backupInput} type="number" value={score.balls} onChange={e => setScore({...score, balls: parseInt(e.target.value)||0})} /></div>
              <div style={styles.backupItem}><span>STRIKER RUNS</span><input style={styles.backupInput} type="number" value={score.players[score.strikerIndex].runs} onChange={e => {const p=[...score.players];p[score.strikerIndex].runs=parseInt(e.target.value)||0;setScore({...score,players:p})}} /></div>
              <div style={styles.backupItem}><span>BOWLER RUNS</span><input style={styles.backupInput} type="number" value={score.bowlerRuns} onChange={e => setScore({...score, bowlerRuns: parseInt(e.target.value)||0})} /></div>
              <div style={styles.backupItem}><span>BOWLER WKTS</span><input style={styles.backupInput} type="number" value={score.bowlerWickets} onChange={e => setScore({...score, bowlerWickets: parseInt(e.target.value)||0})} /></div>
          </div>
      </div>
    </div>
  );
}

const broadcastFX = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&display=swap');
  .celeb { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 42px; font-weight: 900; z-index: 50; }
  .celeb.entering { animation: zoomIn 0.3s ease-out; }
  .celeb.exiting { animation: fadeOut 0.3s ease-in forwards; }
  .mode-anim { animation: flipIn 0.5s ease-out; }
  @keyframes flipIn { from { transform: rotateX(90deg); opacity: 0; } to { transform: rotateX(0); opacity: 1; } }
  @keyframes zoomIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
  .blink { animation: blink 0.5s infinite alternate; }
  @keyframes blink { from { opacity: 1; } to { opacity: 0.3; } }
`;

const styles = {
  page: { minHeight: "100vh", background: "#06141f", padding: "20px 50px", color: "#fff", fontFamily: "'Oswald', sans-serif" },
  panel: { background: "#0f172a", padding: 25, borderRadius: 12, border: "1px solid #1e293b", marginBottom: 30 },
  adminGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 },
  adminCol: { display: 'flex', flexDirection: 'column', gap: 10 },
  label: { fontSize: 11, color: '#38bdf8', fontWeight: 'bold' },
  input: { padding: "10px", background: "#020617", border: "1px solid #334155", color: "#fff", borderRadius: 6 },
  buttonRow: { display: 'flex', gap: 10, marginTop: 25 },
  runBtn: { flex: 1, padding: 12, background: "#2ec4b6", border: 0, borderRadius: 6, fontWeight: 'bold', color: '#fff', cursor: 'pointer' },
  wicketBtn: { padding: "12px 25px", background: "#ef4444", border: 0, borderRadius: 6, fontWeight: 'bold', color: '#fff', cursor: 'pointer' },
  swapBtn: { padding: 8, background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: 6, cursor: 'pointer' },
  newOverBtn: { padding: 8, background: '#6366f1', border: 0, color: '#fff', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' },
  modeToggleBtn: { padding: 8, background: '#0ea5e9', border: 0, color: '#fff', borderRadius: 6, cursor: 'pointer' },
  // ADDED RESET STYLE
  resetBtn: { padding: 8, background: '#ef4444', border: 0, color: '#fff', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' },
  freeHitBtn: { padding: "0 15px", border: 0, borderRadius: 6, fontWeight: 'bold' },

  obsContainer: { width: "100%", height: "200px", background: "#00ff00", display: "flex", alignItems: "center", justifyContent: "center" },
  mainWrapper: { display: 'flex', alignItems: 'center', gap: 10 },
  scoreBar: { display: "flex", width: "950px", height: "90px", overflow: "hidden", borderRadius: "45px", position: 'relative' },
  
  logoCircle: { position: 'relative', width: 70, height: 70 },
  logoImg: { width: "100%", height: "100%", borderRadius: '50%', objectFit: 'cover', background: '#fff', border: '3px solid #fff' },
  
  batsSection: { flex: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 45 },
  playerRow: { display: 'flex', justifyContent: 'space-between', paddingRight: 20 },
  playerName: { fontSize: 17, fontWeight: 500 },
  playerRuns: { fontSize: 22, fontWeight: 700 },

  centerSection: { flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 25px' },
  matchTitle: { fontSize: 10, textAlign: 'center', opacity: 0.8, letterSpacing: '2px', marginTop: 8 },
  mainScoreRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  scoreBig: { fontSize: 46, fontWeight: 700 },
  rrBox: { textAlign: 'center', minWidth: 60 },
  oversBig: { fontSize: 24, fontWeight: 500 },

  bowlerSection: { flex: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 45, paddingLeft: 10 },
  bowlerRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 5 },
  bowlerName: { fontSize: 13, opacity: 0.8 },
  bowlerScore: { fontSize: 24, fontWeight: 700 },
  overHistoryRow: { display: 'flex', gap: 5 },
  ballDot: { width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 },

  backupPanel: { background: "#0b1120", padding: 25, borderRadius: 12, marginTop: 20, border: '1px dashed #334155' },
  backupGrid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 15 },
  backupItem: { display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'center', fontSize: 10, color: '#64748b' },
  backupInput: { background: '#020617', border: '1px solid #1e293b', color: '#38bdf8', padding: '8px', borderRadius: 6, textAlign: 'center', fontSize: 18, fontWeight: 'bold', outline: 'none' }
};