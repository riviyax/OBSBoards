import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css'; // Import your custom styles
import { Layout, Trophy, ChevronRight } from 'lucide-react';

// Import your other components
import LowerThird from './LowerThird';
import CricketBoardAdmin from './CricketBoardAdmin';

const Home = () => {
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-white overflow-hidden relative font-sans">
      
      {/* Animated Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />

      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="z-10 w-full max-w-4xl"
      >
        <header className="text-center mb-16">
          <motion.h1 
            variants={itemVars}
            className="text-6xl font-black tracking-tighter mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent"
          >
            OBSBOARD
          </motion.h1>
          <motion.p 
            variants={itemVars}
            className="text-slate-400 uppercase tracking-[0.3em] text-sm font-semibold"
          >
            Select the Control Interface
          </motion.p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <SelectionCard 
            to="/lower-third"
            variants={itemVars}
            title="Lower Third"
            icon={<Layout size={48} className="text-blue-400" />}
            description="Broadcast overlays & names"
          />

          <SelectionCard 
            to="/cricket"
            variants={itemVars}
            title="Cricket Scoreboard"
            icon={<Trophy size={48} className="text-emerald-400" />}
            description="Live match tracking & stats"
          />
        </div>

        <motion.p 
          variants={itemVars}
          className="text-center mt-12 text-slate-500 text-xs"
        >
          Made with ❤️ by <a href="https://riviyax.pages.dev" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Riviya_X</a>
        </motion.p>
      </motion.div>
    </div>
  );
};

const SelectionCard = ({ title, icon, description, variants, to }) => {
  return (
    <Link to={to} className="block">
      <motion.div
        variants={variants}
        whileHover={{ 
          scale: 1.03, 
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          borderColor: "rgba(255, 255, 255, 0.3)" 
        }}
        whileTap={{ scale: 0.98 }}
        className="relative group p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center overflow-hidden h-full"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="mb-6 p-4 rounded-2xl bg-slate-800/50 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all">
          {icon}
        </div>

        <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-300 transition-colors">
          {title}
        </h2>
        
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center text-xs font-bold text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
          Enter Board <ChevronRight size={14} className="ml-1" />
        </div>
      </motion.div>
    </Link>
  );
};

// Main App Component with Routing
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lower-third" element={<LowerThird />} />
        <Route path="/cricket" element={<CricketBoardAdmin />} />
      </Routes>
    </Router>
  );
};

export default App;