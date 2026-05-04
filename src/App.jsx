import React from 'react';
import { 
  BarChart3, 
  Database, 
  LineChart, 
  TrendingUp, 
  Briefcase, 
  GraduationCap,
  Mail, 
  Server,
  ArrowRight,
  Target,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import './index.css';

const skillData = [
  { name: 'SQL/ETL', level: 95 },
  { name: 'Power BI', level: 90 },
  { name: 'Python', level: 85 },
  { name: 'Machine Learning', level: 80 },
  { name: 'AWS Cloud', level: 75 },
];

function App() {
  return (
    <div className="dashboard-container">
      
      {/* HEADER */}
      <header>
        <div className="profile-section">
          <span className="title-badge">Google Certified</span>
          <h1>Akash Sharma</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
            Data Analyst & Business Support Engineer
          </p>
          <p style={{ maxWidth: '600px', marginTop: '1rem' }}>
            Transforming complex datasets into actionable business intelligence. Specialized in developing predictive models, real-time dashboards, and robust data pipelines to drive strategic decisions.
          </p>
        </div>
        <div className="contact-links" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
          <a href="mailto:akashsharma.irl@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}><Mail size={18}/> akashsharma.irl@gmail.com</a>
          <a href="https://linkedin.com/in/akash-sharma24" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}><FaLinkedin size={18}/> LinkedIn Profile</a>
          <a href="https://github.com/AS741614" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}><FaGithub size={18}/> GitHub Portfolio</a>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Dublin, Ireland</span>
        </div>
      </header>

      {/* EXECUTIVE SUMMARY KPIs */}
      <section>
        <h2><TrendingUp size={24}/> Executive Summary</h2>
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-title">Data Processed</span>
            <span className="kpi-value">100K+</span>
            <span className="kpi-subtitle">Records cleaned & modeled</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-title">Experience</span>
            <span className="kpi-value">3+ Yrs</span>
            <span className="kpi-subtitle">In Data & Operations</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-title">Model Accuracy</span>
            <span className="kpi-value">92%</span>
            <span className="kpi-subtitle">Predictive sales forecasting</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-title">Certifications</span>
            <span className="kpi-value">Google</span>
            <span className="kpi-subtitle">Professional Data Analyst</span>
          </div>
        </div>
      </section>

      {/* TECHNICAL COMPETENCIES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
        
        {/* Analytics Stack */}
        <section className="panel">
          <h2><BarChart3 size={24}/> Analytics Competency</h2>
          <div style={{ width: '100%', height: '300px', marginTop: '1.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={120} tick={{ fill: 'var(--text-secondary)' }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="level" fill="var(--accent-blue)" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Data Architecture */}
        <section className="panel">
          <h2><Database size={24}/> Data Pipeline Architecture</h2>
          <p style={{ marginBottom: '1rem' }}>Proficient in end-to-end data lifecycle management.</p>
          
          <div className="pipeline-flow">
            <div className="pipeline-stage">
              <h4>1. Extract</h4>
              <p>SQL / APIs</p>
            </div>
            <ArrowRight className="pipeline-arrow" />
            <div className="pipeline-stage">
              <h4>2. Transform</h4>
              <p>Python (Pandas)</p>
            </div>
            <ArrowRight className="pipeline-arrow" />
            <div className="pipeline-stage">
              <h4>3. Load</h4>
              <p>AWS (S3, RDS)</p>
            </div>
            <ArrowRight className="pipeline-arrow" />
            <div className="pipeline-stage" style={{ background: 'var(--accent-light)', borderColor: 'var(--accent-blue)' }}>
              <h4 style={{ color: 'var(--accent-blue)' }}>4. Visualize</h4>
              <p>PowerBI / Tableau</p>
            </div>
          </div>
        </section>
      </div>

      {/* CASE STUDIES */}
      <section className="panel">
        <h2><Target size={24}/> Project Case Studies</h2>
        <div className="case-study-list">
          
          {/* Case Study 1 */}
          <div className="case-study">
            <div className="case-study-header">
              <div className="case-study-title">
                <h3>Customer Churn Prediction Model</h3>
                <div className="tech-tags">
                  <span className="tech-tag">Python</span>
                  <span className="tech-tag">Scikit-learn</span>
                  <span className="tech-tag">Pandas</span>
                </div>
              </div>
              <a href="https://github.com/AS741614" className="btn-link" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 500 }}>View Repo →</a>
            </div>
            <div className="case-study-body">
              <div className="par-section">
                <h4><Target size={16}/> Problem</h4>
                <p>High attrition rates required a predictive approach to identify at-risk customers before they churned.</p>
              </div>
              <div className="par-section">
                <h4><Wrench size={16}/> Action</h4>
                <p>Performed EDA and data cleaning. Engineered features from usage patterns and applied classification algorithms to train a predictive model.</p>
              </div>
              <div className="par-section">
                <h4><CheckCircle2 size={16}/> Result</h4>
                <p>Successfully deployed a model identifying high-risk segments, enabling targeted retention strategies and improving decision-making capabilities.</p>
              </div>
            </div>
          </div>

          {/* Case Study 2 */}
          <div className="case-study">
            <div className="case-study-header">
              <div className="case-study-title">
                <h3>Retail Sales Analytics Dashboard</h3>
                <div className="tech-tags">
                  <span className="tech-tag">Power BI</span>
                  <span className="tech-tag">SQL</span>
                  <span className="tech-tag">Excel</span>
                </div>
              </div>
              <a href="https://github.com/AS741614" className="btn-link" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 500 }}>View Repo →</a>
            </div>
            <div className="case-study-body">
              <div className="par-section">
                <h4><Target size={16}/> Problem</h4>
                <p>Stakeholders lacked real-time visibility into sales trends, inventory, and customer behavior across different regions.</p>
              </div>
              <div className="par-section">
                <h4><Wrench size={16}/> Action</h4>
                <p>Extracted and structured raw data via SQL. Designed an interactive Power BI dashboard tracking KPIs and performance metrics.</p>
              </div>
              <div className="par-section">
                <h4><CheckCircle2 size={16}/> Result</h4>
                <p>Improved operational visibility significantly, directly supporting inventory planning and data-driven sales optimization strategies.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* EXPERIENCE & EDUCATION GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        <section className="panel">
          <h2><Briefcase size={24}/> Professional History</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-date">AUG 2022 — MAY 2023</div>
              <div className="timeline-role">Data Analyst</div>
              <div className="timeline-company">Pavana Industries | India</div>
              <p>Designed Power BI dashboards for real-time KPI monitoring. Optimized SQL reporting pipelines and automated data extraction.</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">FEB 2022 — AUG 2022</div>
              <div className="timeline-role">Business Operations Analyst</div>
              <div className="timeline-company">Planet Spark | India</div>
              <p>Analyzed 100K+ customer records using statistical models to identify performance drivers and improve conversion rates.</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">JAN 2021 — JAN 2022</div>
              <div className="timeline-role">Customer Operations Analyst</div>
              <div className="timeline-company">Ienergizer | India</div>
              <p>Managed 50+ cases daily, maintained strict SLA compliance, and identified recurring patterns to improve processes.</p>
            </div>
          </div>
        </section>

        <section className="panel">
          <h2 style={{ color: 'var(--accent-teal)' }}><GraduationCap size={24}/> Education & Credentials</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-date">EXPECTED AUG 2025</div>
              <div className="timeline-role">MSc Artificial Intelligence for Business</div>
              <div className="timeline-company">National College of Ireland, Dublin</div>
              <p>Focusing on AI Technologies, Machine Learning, and Data Governance.</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">CREDENTIAL</div>
              <div className="timeline-role">Google Data Analytics Professional</div>
              <div className="timeline-company">Google Certification</div>
              <p>Data cleaning, Tableau, SQL, R Programming, and statistical analysis.</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">GRADUATED JUNE 2021</div>
              <div className="timeline-role">BTech Electrical & Electronics</div>
              <div className="timeline-company">Amity University, India</div>
              <p>Relevant coursework: Python, OOP C++, Machine Learning.</p>
            </div>
          </div>
        </section>

      </div>

      <footer>
        <p>© {new Date().getFullYear()} Akash Sharma. Built for Professional Analytics.</p>
      </footer>
    </div>
  );
}

export default App;
