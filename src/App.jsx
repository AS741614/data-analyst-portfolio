import { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Database, 
  Code2, 
  BarChart3, 
  BrainCircuit, 
  ShieldCheck, 
  Cpu, 
  ExternalLink,
  Mail,
  Download,
  GraduationCap,
  Briefcase,
  Award,
  Settings,
  GitBranch,
  Eye,
  LineChart,
  Link,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer 
} from 'recharts';
import cvData from './cv_data.json';
import './index.css';
import { Advanced3DBackground, Hero3DWebGL, ProjectWebGLPreview } from './components/Advanced3DScene';

// --- TILT CARD WRAPPER ---
function TiltCard({ children, className = '', isPurple = false }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    // Tilt calculation (max ~8 degrees tilt)
    const tiltX = -(y - yc) / (rect.height / 8);
    const tiltY = (x - xc) / (rect.width / 8);

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-2px)`;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  };

  const glowClass = isPurple ? 'purple-glow' : 'cyan-glow';

  return (
    <div 
      ref={cardRef} 
      className={`stark-panel ${glowClass} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

// --- INTERACTIVE TERMINAL CONSOLE ---
function TerminalConsole() {
  const [history, setHistory] = useState([
    { type: 'system', text: 'INITIALIZING LABORATORY INTERFACE v3.0...' },
    { type: 'system', text: 'SYSTEMS ONLINE. TYPE "help" FOR AVAILABLE DIRECTIVES.' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleCommand = (cmdText) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    const parts = trimmed.split(/\s+/);
    const primaryCmd = parts[0].toLowerCase();

    const newHistory = [...history, { type: 'input', text: `guest@systems-lab:~$ ${trimmed}` }];

    switch (primaryCmd) {
      case 'help':
        newHistory.push(
          { type: 'output', text: 'AVAILABLE DIRECTIVES:' },
          { type: 'output', text: '  about      - Display system personnel profile summary' },
          { type: 'output', text: '  skills     - List current capabilities matrix' },
          { type: 'output', text: '  projects   - Show database of featured projects' },
          { type: 'output', text: '  experience - View professional trajectory milestones' },
          { type: 'output', text: '  contact    - Retrieve communication channels' },
          { type: 'output', text: '  status     - Run system diagnostics checklist' },
          { type: 'output', text: '  clear      - Clear terminal console screen log' }
        );
        break;
      case 'about':
      case 'bio':
        newHistory.push(
          { type: 'output', text: `NAME: ${cvData.personal.name}` },
          { type: 'output', text: `TITLE: ${cvData.personal.title}` },
          { type: 'output', text: `BIO: ${cvData.bio.short_bio}` },
          { type: 'output', text: `PROFILE: ${cvData.bio.long_bio.join(' ')}` }
        );
        break;
      case 'skills':
        newHistory.push({ type: 'output', text: 'CAPABILITIES MATRIX:' });
        const categories = {};
        cvData.skills.forEach(s => {
          if (!categories[s.category]) categories[s.category] = [];
          categories[s.category].push(`${s.name} (${s.proficiency_level})`);
        });
        Object.entries(categories).forEach(([cat, list]) => {
          newHistory.push({ type: 'output', text: `  [${cat.toUpperCase()}]:` });
          newHistory.push({ type: 'output', text: `    ${list.join(' • ')}` });
        });
        break;
      case 'projects':
        newHistory.push({ type: 'output', text: 'FEATURED PROJECTS:' });
        cvData.projects.forEach((p, idx) => {
          newHistory.push(
            { type: 'output', text: `  [PROJECT 0${idx + 1}]: ${p.name.toUpperCase()} (${p.status})` },
            { type: 'output', text: `    Tagline: ${p.tagline}` },
            { type: 'output', text: `    Stack: ${p.tech_stack.join(', ')}` },
            { type: 'output', text: `    Metrics: ${p.metrics.map(m => `${m.label}: ${m.value}`).join(' • ')}` }
          );
        });
        break;
      case 'experience':
        newHistory.push({ type: 'output', text: 'TRAJECTORY WAYPOINTS:' });
        cvData.experience.forEach(e => {
          newHistory.push(
            { type: 'output', text: `  ● WAYPOINT 0${e.waypoint_number}: ${e.start_date} - ${e.end_date}` },
            { type: 'output', text: `    Role: ${e.title} at ${e.company} (${e.location})` },
            { type: 'output', text: `    Info: ${e.description}` }
          );
        });
        break;
      case 'contact':
        newHistory.push(
          { type: 'output', text: 'COMMUNICATION ENDPOINTS:' },
          { type: 'output', text: `  Email: ${cvData.personal.email}` },
          { type: 'output', text: `  LinkedIn: ${cvData.personal.social_links.linkedin}` },
          { type: 'output', text: `  GitHub: ${cvData.personal.social_links.github}` },
          { type: 'output', text: `  Location: ${cvData.personal.location}` }
        );
        break;
      case 'status':
        const buildDate = cvData.metadata.last_updated;
        newHistory.push(
          { type: 'output', text: 'SYSTEM DIAGNOSTICS:' },
          { type: 'output', text: `  CORE ENGINE  : Node.js (Vite Bundle)` },
          { type: 'output', text: `  UI VERSION   : v${cvData.metadata.version}` },
          { type: 'output', text: `  DATABASE     : MongoDB / local JSON (HEALTHY)` },
          { type: 'output', text: `  LAST BUILD   : ${buildDate}` },
          { type: 'output', text: `  SYS LOG LEVEL: INFO` },
          { type: 'output', text: '  ANALYTICS    : CONNECTED' }
        );
        break;
      case 'clear':
        setHistory([]);
        return;
      default:
        newHistory.push({ type: 'output', text: `Error: Command "${primaryCmd}" not recognized. Type "help" for a list of valid commands.` });
    }

    setHistory(newHistory);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
      setInputVal('');
    }
  };

  return (
    <div className="terminal-widget" style={{ height: '350px' }}>
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="term-dot red" />
          <div className="term-dot yellow" />
          <div className="term-dot green" />
        </div>
        <div style={{ fontSize: '0.8rem', opacity: 0.8, fontFamily: 'var(--font-mono)' }}>guest@systems-lab:~</div>
      </div>
      <div className="terminal-body">
        {history.map((line, idx) => (
          <div key={idx} className="term-line">
            {line.type === 'input' ? (
              <span>{line.text}</span>
            ) : (
              <span style={line.type === 'system' ? { color: 'var(--accent-purple)' } : {}}>{line.text}</span>
            )}
          </div>
        ))}
        <div className="term-line" style={{ display: 'flex', alignItems: 'center' }}>
          <span className="term-prompt">guest@systems-lab:~$ &nbsp;</span>
          <input 
            type="text" 
            className="term-input" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}



// --- Skill Constellation Component (Asset 5: Skill Constellation) ---
function SkillsConstellation({ skills }) {
  const canvasRef = useRef(null);
  const [filter, setFilter] = useState('All');
  
  // Track 3D rotation coordinates
  const rotationRef = useRef({ alpha: 0.002, beta: 0.003, rotX: 0, rotY: 0, isDragging: false, lastX: 0, lastY: 0 });

  const categories = ['All', 'Core Engineering', 'Data Engineering', 'AI / ML / Generative', 'DevOps & Infrastructure', 'Observability & Operations'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = 450);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
      }
    };
    window.addEventListener('resize', handleResize);

    // Map skill nodes in 3D coordinate space
    const filteredSkills = filter === 'All' ? skills : skills.filter(s => s.category === filter);
    
    const nodes = filteredSkills.map((s, idx) => {
      // Golden spiral distribution on sphere
      const offset = 2 / filteredSkills.length;
      const increment = Math.PI * (3 - Math.sqrt(5));
      const y = idx * offset - 1 + offset / 2;
      const radius = Math.sqrt(1 - y * y);
      const phi = idx * increment;
      const x = Math.cos(phi) * radius;
      const z = Math.sin(phi) * radius;

      // Extract numeric proficiency
      const profVal = parseInt(s.proficiency_level) || 80;

      return {
        name: s.name,
        category: s.category,
        prof: profVal,
        x: x * 150,
        y: y * 150,
        z: z * 150
      };
    });

    const rotState = rotationRef.current;

    // Mouse drag handlers to rotate 3D constellation
    const handleMouseDown = (e) => {
      rotState.isDragging = true;
      rotState.lastX = e.clientX;
      rotState.lastY = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (!rotState.isDragging) return;
      const dx = e.clientX - rotState.lastX;
      const dy = e.clientY - rotState.lastY;
      
      rotState.rotY += dx * 0.005;
      rotState.rotX += dy * 0.005;
      
      rotState.lastX = e.clientX;
      rotState.lastY = e.clientY;
    };

    const handleMouseUp = () => {
      rotState.isDragging = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    const animate = () => {
      ctx.fillStyle = '#02040a';
      ctx.fillRect(0, 0, width, height);

      // Slow passive rotation
      if (!rotState.isDragging) {
        rotState.rotX += rotState.alpha;
        rotState.rotY += rotState.beta;
      }

      const cosX = Math.cos(rotState.rotX);
      const sinX = Math.sin(rotState.rotX);
      const cosY = Math.cos(rotState.rotY);
      const sinY = Math.sin(rotState.rotY);

      // Projection mapping
      const projected = nodes.map(n => {
        // Rotate Y
        let x1 = n.x * cosY - n.z * sinY;
        let z1 = n.x * sinY + n.z * cosY;
        // Rotate X
        let y2 = n.y * cosX - z1 * sinX;
        let z2 = n.y * sinX + z1 * cosX;

        const distance = 400;
        const scale = 250;
        const f = scale / (z2 + distance);
        const px = x1 * f + width / 2;
        const py = y2 * f + height / 2;

        return {
          name: n.name,
          category: n.category,
          x: px,
          y: py,
          zDepth: z2,
          prof: n.prof
        };
      });

      // Sort by depth for correct Z-buffer rendering order
      projected.sort((a, b) => b.zDepth - a.zDepth);

      // Draw grid line connections
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes & labels
      projected.forEach(n => {
        const size = Math.max(3, (150 - n.zDepth) * 0.06);
        const alpha = Math.min(1.0, Math.max(0.15, (150 - n.zDepth) / 250));

        let nodeColor = 'rgba(0, 240, 255, '; // Cyan
        if (n.category.includes('Data')) nodeColor = 'rgba(176, 38, 255, '; // Purple
        else if (n.category.includes('AI')) nodeColor = 'rgba(255, 0, 110, '; // Pink
        else if (n.category.includes('DevOps')) nodeColor = 'rgba(0, 255, 148, '; // Green

        ctx.fillStyle = nodeColor + alpha + ')';
        ctx.shadowColor = nodeColor + '1)';
        ctx.shadowBlur = size;
        
        ctx.beginPath();
        ctx.arc(n.x, n.y, size + (n.prof / 25), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Render skill text tags
        if (alpha > 0.45) {
          ctx.fillStyle = `rgba(232, 244, 248, ${alpha * 0.95})`;
          ctx.font = '500 0.8rem Geist, system-ui';
          ctx.fillText(n.name, n.x + size + 6, n.y + 4);
        }
      });

      // Grid Coordinate text overlays
      ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.font = '10px Courier';
      ctx.fillText(`AXIS_ROT_X: ${rotState.rotX.toFixed(2)}`, 20, height - 40);
      ctx.fillText(`AXIS_ROT_Y: ${rotState.rotY.toFixed(2)}`, 20, height - 20);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [filter, skills]);

  return (
    <div className="skills-constellation-container">
      <div className="constellation-controls">
        {categories.map(cat => (
          <button 
            key={cat}
            className={`constellation-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
    </div>
  );
}



// --- Cursor Companion (Asset 8: Cursor Companion) ---
function CursorCompanion() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      // Check if hovering interactive elements
      const target = e.target;
      const isInteractive = target.closest('button') || target.closest('a') || target.closest('.stark-panel');
      setHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div 
      className={`cursor-companion ${hovering ? 'hovering' : ''}`} 
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    />
  );
}

// --- HUD TELEMETRY WIDGETS ---
function HUDTelemetryPanel() {
  const [telemetry, setTelemetry] = useState({
    cpu: '1.2%',
    mem: '14.5 GB / 32 GB',
    requests: 284021
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        cpu: `${(Math.random() * 2.8 + 1.1).toFixed(1)}%`,
        mem: `${(14.5 + Math.random() * 0.35).toFixed(2)} GB / 32 GB`,
        requests: prev.requests + Math.floor(Math.random() * 6)
      }));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hud-grid">
      <div className="hud-panel">
        <div className="hud-header">
          <span>System Scanner</span>
          <div className="pulsing-dot" />
        </div>
        <div className="hud-value">NODE_IE // HEALTHY</div>
        <div className="hud-status-row">
          <span>SYS_CPU:</span>
          <span>{telemetry.cpu}</span>
        </div>
        <div className="hud-status-row">
          <span>SYS_MEM:</span>
          <span>{telemetry.mem}</span>
        </div>
      </div>

      <div className="hud-panel">
        <div className="hud-header">
          <span>Database Radar</span>
          <div className="telemetry-radar" />
        </div>
        <div className="hud-value">POSTGRESQL STAR</div>
        <div className="hud-status-row">
          <span>Latency:</span>
          <span>1.8ms</span>
        </div>
        <div className="hud-status-row">
          <span>DWH Sync:</span>
          <span>PASS</span>
        </div>
      </div>

      <div className="hud-panel">
        <div className="hud-header">
          <span>Daily Operations</span>
          <span style={{ color: 'var(--accent-green)' }}>● ACTIVE DATA</span>
        </div>
        <div className="hud-value">{telemetry.requests.toLocaleString()}</div>
        <div className="hud-status-row">
          <span>AML compliance:</span>
          <span>PASS</span>
        </div>
        <div className="hud-status-row">
          <span>SAR triggers:</span>
          <span>0</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [liveTime, setLiveTime] = useState('');

  // Auto-updating Dublin live time display
  useEffect(() => {
    const updateTime = () => {
      const options = { timeZone: 'Europe/Dublin', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      const formatted = new Intl.DateTimeFormat('en-GB', options).format(new Date());
      setLiveTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="vibrant-mesh-backdrop" />
      <Advanced3DBackground />
      <div className="cyber-grid-overlay" />
      <CursorCompanion />
      
      {/* Navigation Header */}
      <nav>
        <div className="logo">
          <Cpu size={24} /> {cvData.personal.name.toUpperCase()}<span style={{color: '#fff'}}>_</span>
        </div>
        <div className="nav-tabs">
          <button 
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Terminal size={16} /> DASHBOARD
          </button>
          <button 
            className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            <Settings size={16} /> CORE_MATRIX
          </button>
          <button 
            className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            <Briefcase size={16} /> TRAJECTORY
          </button>
          <button 
            className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <Database size={16} /> DIRECTIVES
          </button>
          <button 
            className={`tab-btn ${activeTab === 'cv' ? 'active' : ''}`}
            onClick={() => setActiveTab('cv')}
          >
            <Award size={16} /> FILE_SYS
          </button>
        </div>
      </nav>

      {/* Main Tab Content */}
      <main style={{ flexGrow: 1 }}>
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="dashboard-grid">
              
              <TiltCard className="hero-card holographic-border">
                <div className="glow-orb" />
                <div className="sys-info" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>SYSTEM_STATUS: ACTIVE // {cvData.personal.status.toUpperCase()}</span>
                  <span style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> DUBLIN_TIME: {liveTime}
                  </span>
                </div>
                <h1>{cvData.personal.name}</h1>
                <p style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1rem', fontWeight: 500 }}>
                  {cvData.personal.title}
                </p>
                <p style={{ maxWidth: '800px', marginBottom: '2rem', fontSize: '1.05rem' }}>
                  {cvData.bio.short_bio}
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={() => setActiveTab('projects')}>
                    Explore My Work <ChevronRight size={16} />
                  </button>
                  <button className="btn btn-purple" onClick={() => setActiveTab('cv')}>
                    Initiate Contact <ChevronRight size={16} />
                  </button>
                  <a href={`mailto:${cvData.personal.email}`} className="btn">
                    <Mail size={16} /> Email.Secure()
                  </a>
                </div>
              </TiltCard>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Hero3DWebGL />
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="metrics-row">
              <TiltCard className="metric-card" isPurple={true}>
                <div className="metric-value">3+ Years</div>
                <div className="metric-label">Production Engineering</div>
              </TiltCard>
              <TiltCard className="metric-card" isPurple={false}>
                <div className="metric-value">200K+</div>
                <div className="metric-label">Transactions Daily</div>
              </TiltCard>
              <TiltCard className="metric-card" isPurple={true}>
                <div className="metric-value">100K+</div>
                <div className="metric-label">ML Pipeline Records</div>
              </TiltCard>
              <TiltCard className="metric-card" isPurple={false}>
                <div className="metric-value">99.9%</div>
                <div className="metric-label">System Reliability</div>
              </TiltCard>
            </div>

            {/* HUD Telemetry widgets */}
            <HUDTelemetryPanel />

            {/* Interactive Terminal Widget */}
            <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
              <TerminalConsole />
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div>
            <h2><Settings size={24} /> SKILL_CONSTELLATION_MATRIX</h2>
            
            {/* 3D Skills Constellation Navigation Sphere */}
            <SkillsConstellation skills={cvData.skills} />

            <div className="skills-container">
              <TiltCard>
                <h3>AI/LLM & Agents</h3>
                <ul className="skills-list">
                  {cvData.skills.filter(s => s.category === 'AI / ML / Generative').map(s => (
                    <SkillItem key={s.name} name={s.name} level={s.proficiency_level} />
                  ))}
                </ul>
              </TiltCard>

              <TiltCard isPurple={true}>
                <h3>Backend Development</h3>
                <ul className="skills-list">
                  {cvData.skills.filter(s => s.category === 'Core Engineering').map(s => (
                    <SkillItem key={s.name} name={s.name} level={s.proficiency_level} />
                  ))}
                </ul>
              </TiltCard>

              <TiltCard>
                <h3>Data Modeling & ETL</h3>
                <ul className="skills-list">
                  {cvData.skills.filter(s => s.category === 'Data Engineering').map(s => (
                    <SkillItem key={s.name} name={s.name} level={s.proficiency_level} />
                  ))}
                </ul>
              </TiltCard>

              <TiltCard isPurple={true}>
                <h3>DevOps & Infrastructure</h3>
                <ul className="skills-list">
                  {cvData.skills.filter(s => s.category === 'DevOps & Infrastructure').map(s => (
                    <SkillItem key={s.name} name={s.name} level={s.proficiency_level} />
                  ))}
                </ul>
              </TiltCard>
            </div>
          </div>
        )}

        {/* EXPERIENCE TAB (Asset 6: Waypoint path timeline) */}
        {activeTab === 'experience' && (
          <div>
            <h2><Briefcase size={24} /> TRAJECTORY_WAYPOINTS</h2>
            <div className="stark-panel" style={{ marginTop: '2rem' }}>
              <div className="timeline">
                
                {cvData.experience.slice().reverse().map((exp, idx) => {
                  let glowType = '';
                  if (exp.waypoint_number % 3 === 1) glowType = 'purple';
                  else if (exp.waypoint_number % 3 === 2) glowType = 'pink';

                  return (
                    <div key={exp.id} className={`timeline-item ${glowType}`}>
                      <div className="timeline-date">WAYPOINT 0{exp.waypoint_number} // {exp.start_date.toUpperCase()} — {exp.end_date.toUpperCase()}</div>
                      <div className="timeline-title">{exp.title}</div>
                      <div className="timeline-subtitle">{exp.company} • {exp.location}</div>
                      <div className="timeline-content">
                        <p style={{ marginBottom: '0.8rem' }}>{exp.description}</p>
                        {exp.highlights.length > 0 && (
                          <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            {exp.highlights.map((h, hidx) => (
                              <li key={hidx}>{h}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div>
            <h2><Database size={24} /> FEATURED_SYSTEM_DIRECTIVES</h2>
            <div className="projects-showcase" style={{ marginTop: '2rem' }}>
              
              {cvData.projects.map((proj, idx) => {
                const isPurple = idx % 2 === 1;
                return (
                  <TiltCard key={proj.id} className="expanded-project-card holographic-border" isPurple={isPurple}>
                    <div className="project-visual" style={isPurple ? { border: '1px solid var(--border-purple)' } : {}}>
                      <ProjectWebGLPreview projectId={proj.id} />
                      <div className="project-visual-content">
                        <h3>{proj.name.split(' ')[0]}</h3>
                        <div style={{ fontSize: '0.8rem', color: isPurple ? 'var(--accent-purple)' : 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                          STATUS: {proj.status}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>[PROJECT 0{idx + 1}]</span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          padding: '0.2rem 0.5rem', 
                          borderRadius: '4px',
                          border: `1px solid ${proj.status === 'PRODUCTION' || proj.status === 'LIVE' ? 'var(--accent-green)' : 'var(--text-muted)'}`,
                          color: proj.status === 'PRODUCTION' || proj.status === 'LIVE' ? 'var(--accent-green)' : 'var(--text-muted)'
                        }}>
                          ● {proj.status}
                        </span>
                      </div>
                      <h3 style={{ color: isPurple ? 'var(--accent-purple)' : 'var(--accent-cyan)', marginTop: '0.5rem' }}>{proj.name}</h3>
                      <div className="tech-tags">
                        {proj.tech_stack.map(tag => (
                          <span key={tag} className="tech-tag">{tag}</span>
                        ))}
                      </div>
                      
                      {proj.story_paragraphs.map((p, pidx) => (
                        <p key={pidx} style={{ fontSize: '0.95rem', marginBottom: '0.8rem' }}>{p}</p>
                      ))}

                      <div className="project-specs" style={isPurple ? { border: '1px solid var(--border-purple)' } : {}}>
                        SPECS: {proj.metrics.map(m => `${m.label}: ${m.value}`).join(' • ')}
                      </div>

                      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <a href={proj.github_url} target="_blank" rel="noreferrer" className={`btn ${isPurple ? 'btn-purple' : ''}`} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                          <FaGithub /> Source.Code()
                        </a>
                      </div>
                    </div>
                  </TiltCard>
                );
              })}

            </div>
          </div>
        )}

        {/* PERSONNEL FILE TAB */}
        {activeTab === 'cv' && (
          <div className="personnel-file">
            <div className="cv-actions">
              <button className="btn btn-primary" onClick={() => window.print()}>
                <Download size={16} /> Export.PDF()
              </button>
            </div>
            
            <div className="cv-document">
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <h1 style={{ color: '#0f172a', fontSize: '2.5rem', textShadow: 'none', marginBottom: '0.5rem' }}>{cvData.personal.name}</h1>
                <p style={{ fontWeight: '500', color: '#3b82f6', marginBottom: '0.5rem' }}>{cvData.personal.title}</p>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  {cvData.personal.location} | {cvData.personal.phone} | {cvData.personal.email} | github.com/AS741614 | linkedin.com/in/akash-sharma24
                </p>
              </div>

              <h2>🎯 PROFESSIONAL PROFILE</h2>
              <p style={{ marginTop: '0.5rem', color: '#334155' }}>
                {cvData.bio.long_bio[0]} {cvData.bio.long_bio[1]}
              </p>

              <h2>💻 TECHNICAL SKILLS</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                <div>
                  <strong style={{ color: '#0f172a' }}>AI/LLM & Agents:</strong> Claude, OpenAI API, Anthropic Tools, function calling, OnToolErrorHook, MCP concepts, LangChain, vector stores
                </div>
                <div>
                  <strong style={{ color: '#0f172a' }}>Backend & APIs:</strong> Python (Expert), SQL, Node.js, Java (learning), FastAPI, Flask, RESTful endpoints, event-driven designs
                </div>
                <div>
                  <strong style={{ color: '#0f172a' }}>Data Modeling & BI:</strong> Star & Snowflake schema, ETL pipeline architectures, data quality gates, reconciliation check frameworks, Tableau, Power BI, Google BigQuery, NL2SQL
                </div>
                <div>
                  <strong style={{ color: '#0f172a' }}>DevOps & Observability:</strong> Docker, GitHub Actions, Jenkins CI/CD, AWS (EC2/Lambda/S3/CloudWatch), Prometheus, Grafana, OpenTelemetry, structured logging
                </div>
                <div>
                  <strong style={{ color: '#0f172a' }}>Security & Governance:</strong> Role-Based Access Control (RBAC), input validation, secret management, audit logging, compliance thinking
                </div>
                <div>
                  <strong style={{ color: '#0f172a' }}>Tools & Graphic:</strong> Git, Pytest, R scripting, Adobe After Effects, Lumion, SketchUp 3D
                </div>
              </div>

              <h2>🚀 PROFESSIONAL EXPERIENCE</h2>
              
              {cvData.experience.slice().reverse().map(exp => (
                <div key={exp.id} className="cv-timeline-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>{exp.title}</h3>
                    <span className="cv-meta">{exp.start_date} – {exp.end_date}</span>
                  </div>
                  <div className="cv-meta" style={{ color: '#3b82f6', fontWeight: 500 }}>{exp.company} • {exp.location}</div>
                  <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '0.3rem' }}>{exp.description}</p>
                  {exp.highlights.length > 0 && (
                    <ul style={{ paddingLeft: '1.2rem', color: '#475569', fontSize: '0.95rem' }}>
                      {exp.highlights.map((h, hidx) => (
                        <li key={hidx}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              <h2>🎓 EDUCATION</h2>
              {cvData.education.map((edu, idx) => (
                <div key={idx} className="cv-timeline-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{edu.degree}</strong>
                    <span className="cv-meta">{edu.graduation_date}</span>
                  </div>
                  <div className="cv-meta">{edu.institution} | Grade: {edu.grade}</div>
                  <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Coursework: {edu.focus_areas.join(', ')}</p>
                </div>
              ))}

              <h2>📜 CERTIFICATIONS</h2>
              <ul style={{ paddingLeft: '1.2rem', color: '#475569', fontSize: '0.95rem' }}>
                {cvData.certifications.completed.map((cert, idx) => (
                  <li key={idx}>{cert}</li>
                ))}
              </ul>

              <h2>🏆 EXTRA-CURRICULAR ACHIEVEMENTS</h2>
              <ul style={{ paddingLeft: '1.2rem', color: '#475569', fontSize: '0.95rem' }}>
                <li><strong>Lead Guitarist:</strong> Participated in State-Level and Inter-College Music Competitions.</li>
                <li><strong>Computer Graphics Team (Amity University):</strong> Created visual content and graphic effects for events using Adobe After Effects, Lumion, and SketchUp.</li>
              </ul>
            </div>

            {/* Book a Conversation / Contact cards */}
            <div id="contact" className="stark-panel" style={{ marginTop: '3rem', border: '1px solid rgba(176, 38, 255, 0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ color: 'var(--accent-purple)' }}>[ESTABLISH CONNECTION]</h3>
                  <p style={{ maxWidth: '600px', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    Open to: Backend Engineering roles • AI Systems positions • Full-Stack opportunities • Consultations • Interesting problems
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--accent-green)' }}>● Available for inquiries — responds within 24 hours</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <a href={`mailto:${cvData.personal.email}`} className="btn btn-purple" style={{ fontSize: '0.85rem' }}>
                    <Mail size={16} /> Book a Conversation()
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer>
        <div className="footer-socials">
          <a href={cvData.personal.social_links.github} target="_blank" rel="noreferrer" className="social-link">
            <FaGithub size={20} />
          </a>
          <a href={cvData.personal.social_links.linkedin} target="_blank" rel="noreferrer" className="social-link">
            <FaLinkedin size={20} />
          </a>
          <a href={`mailto:${cvData.personal.email}`} className="social-link">
            <Mail size={20} />
          </a>
        </div>
        <p>SYSTEM DASHBOARD v{cvData.metadata.version} © {new Date().getFullYear()} {cvData.personal.name.toUpperCase()}</p>
      </footer>
    </div>
  );
}

// Inner helper components
function SkillItem({ name, level }) {
  return (
    <li>
      <div className="skill-tag-row">
        <span className="skill-name">{name}</span>
        <span className="skill-percent">{level}</span>
      </div>
      <div className="skill-bar-outer">
        <div className="skill-bar-inner" style={{ width: level }} />
      </div>
    </li>
  );
}

export default App;
