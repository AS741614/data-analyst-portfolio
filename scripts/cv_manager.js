import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../src/cv_data.json');
const HISTORY_FILE = path.join(__dirname, '../src/cv_history.json');

// Helper to load JSON
function loadJSON(filePath, defaultVal = {}) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error(`Error loading JSON from ${filePath}:`, err.message);
  }
  return defaultVal;
}

// Helper to save JSON
function saveJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error saving JSON to ${filePath}:`, err.message);
    return false;
  }
}

// Basic validators
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRegex = /^(https?:\/\/)?([\da-zA-Z.-]+)\.([a-zA-Z.]{2,6})([\/\w .-]*)*\/?$/;

// Parse date string (e.g. "Jan 2021" or "Present") to approximate timestamp for comparison
function parseDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr.toLowerCase() === 'present') return new Date();
  
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length === 2) {
    const monthStr = parts[0].substring(0, 3).toLowerCase();
    const year = parseInt(parts[1], 10);
    const months = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };
    const month = months[monthStr] !== undefined ? months[monthStr] : 0;
    if (!isNaN(year)) {
      return new Date(year, month, 1);
    }
  }
  
  // Try raw Date parsing
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

// Validate CV Schema and data integrity
function validateCV(data) {
  const errors = [];

  // Top level fields
  const requiredTopFields = ['personal', 'bio', 'identity_cards', 'projects', 'skills', 'experience', 'education', 'certifications', 'metadata'];
  requiredTopFields.forEach(f => {
    if (!data[f]) errors.push(`Missing required top-level section: '${f}'`);
  });

  if (errors.length > 0) return { valid: false, errors };

  // Personal validation
  const personal = data.personal;
  if (!personal.name) errors.push("personal.name is required");
  if (!personal.title) errors.push("personal.title is required");
  if (personal.email && !emailRegex.test(personal.email)) {
    errors.push(`Invalid email format: '${personal.email}'`);
  }
  if (personal.social_links) {
    Object.entries(personal.social_links).forEach(([key, val]) => {
      if (val && !urlRegex.test(val)) {
        errors.push(`Invalid URL format for social link '${key}': '${val}'`);
      }
    });
  }

  // Projects validation
  if (Array.isArray(data.projects)) {
    data.projects.forEach((p, idx) => {
      const label = p.name || `Index ${idx}`;
      if (!p.id) errors.push(`Project '${label}' is missing an 'id'`);
      if (!p.name) errors.push(`Project at index ${idx} is missing a 'name'`);
      if (!p.status) errors.push(`Project '${label}' is missing a 'status'`);
      if (!Array.isArray(p.tech_stack)) errors.push(`Project '${label}': 'tech_stack' must be an array`);
      if (!Array.isArray(p.metrics)) errors.push(`Project '${label}': 'metrics' must be an array`);
      if (!Array.isArray(p.story_paragraphs)) errors.push(`Project '${label}': 'story_paragraphs' must be an array`);
      if (p.github_url && !urlRegex.test(p.github_url)) {
        errors.push(`Project '${label}': Invalid github_url format: '${p.github_url}'`);
      }
    });
  } else {
    errors.push("'projects' must be an array");
  }

  // Experience validation
  if (Array.isArray(data.experience)) {
    data.experience.forEach((e, idx) => {
      const label = `${e.title || 'Role'} at ${e.company || 'Company'}`;
      if (!e.id) errors.push(`Experience '${label}' is missing an 'id'`);
      if (!e.title) errors.push(`Experience at index ${idx} is missing a 'title'`);
      if (!e.company) errors.push(`Experience at index ${idx} is missing a 'company'`);
      if (!e.start_date) errors.push(`Experience '${label}' is missing a 'start_date'`);
      if (!e.end_date && e.current === false) {
        errors.push(`Experience '${label}' must have an 'end_date' or be marked as 'current: true'`);
      }
      
      // Date order checking
      if (e.start_date && e.end_date) {
        const start = parseDate(e.start_date);
        const end = parseDate(e.end_date);
        if (start && end && start > end) {
          errors.push(`Experience '${label}': start_date (${e.start_date}) cannot be after end_date (${e.end_date})`);
        }
      }
    });
  } else {
    errors.push("'experience' must be an array");
  }

  // Education validation
  if (Array.isArray(data.education)) {
    data.education.forEach((edu, idx) => {
      const label = `${edu.degree || 'Degree'} at ${edu.institution || 'Institution'}`;
      if (!edu.degree) errors.push(`Education at index ${idx} is missing 'degree'`);
      if (!edu.institution) errors.push(`Education at index ${idx} is missing 'institution'`);
    });
  } else {
    errors.push("'education' must be an array");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Log history of changes
function logHistory(section, action, previousValue, newValue, message = '') {
  const history = loadJSON(HISTORY_FILE, { logs: [] });
  
  const newLog = {
    timestamp: new Date().toISOString(),
    section,
    action,
    message: message || `${action.toUpperCase()} in section ${section}`,
    previous: previousValue,
    current: newValue
  };
  
  history.logs.push(newLog);
  saveJSON(HISTORY_FILE, history);
  console.log(`[History] Change logged for section: ${section}`);
}

// Update helper
function applyUpdate(section, action, filterFn, updatedItem, commitMessage = '') {
  const currentData = loadJSON(DATA_FILE);
  const previousDataCopy = JSON.parse(JSON.stringify(currentData));
  
  if (!currentData[section]) {
    console.error(`Error: Section '${section}' does not exist.`);
    process.exit(1);
  }
  
  const previousSectionVal = JSON.parse(JSON.stringify(currentData[section]));
  
  if (Array.isArray(currentData[section])) {
    if (action === 'add') {
      currentData[section].push(updatedItem);
    } else if (action === 'remove') {
      currentData[section] = currentData[section].filter(item => !filterFn(item));
    } else if (action === 'modify') {
      const idx = currentData[section].findIndex(item => filterFn(item));
      if (idx !== -1) {
        currentData[section][idx] = { ...currentData[section][idx], ...updatedItem };
      } else {
        console.error(`Error: Item matching filter not found in section '${section}'`);
        process.exit(1);
      }
    }
  } else {
    // Non-array updates (e.g. personal, bio)
    if (action === 'modify') {
      currentData[section] = { ...currentData[section], ...updatedItem };
    } else {
      console.error(`Action '${action}' not supported for non-array section '${section}'`);
      process.exit(1);
    }
  }

  // Auto increment version & update date in metadata
  if (currentData.metadata) {
    const prevVer = currentData.metadata.version || '1.0';
    const verParts = prevVer.split('.').map(Number);
    if (verParts.length === 2 && !isNaN(verParts[1])) {
      verParts[1] += 1;
      currentData.metadata.version = verParts.join('.');
    } else if (verParts.length === 3 && !isNaN(verParts[2])) {
      verParts[2] += 1;
      currentData.metadata.version = verParts.join('.');
    }
    
    // Set last updated to local timezone formatted date
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000));
    currentData.metadata.last_updated = localDate.toISOString().split('T')[0];
  }

  // Validate the resulting data structure
  const validation = validateCV(currentData);
  if (!validation.valid) {
    console.error("Validation failed. Aborting update. Errors:");
    validation.errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  // Save changes
  if (saveJSON(DATA_FILE, currentData)) {
    console.log(`[Success] Updated section '${section}' successfully.`);
    logHistory(section, action, previousSectionVal, currentData[section], commitMessage);
  }
}

// Command dispatcher
const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log(`
CV Manager CLI
Usage:
  node scripts/cv_manager.js validate
  node scripts/cv_manager.js update-field --section <sec> --field <fld> --value <val> [--message <msg>]
  node scripts/cv_manager.js add-item --section <sec> --data <json_string> [--message <msg>]
  node scripts/cv_manager.js remove-item --section <sec> --key <key> --val <val> [--message <msg>]
  `);
  process.exit(0);
}

if (command === 'validate') {
  const data = loadJSON(DATA_FILE);
  const result = validateCV(data);
  if (result.valid) {
    console.log("✔ CV structure and schema are fully valid!");
    process.exit(0);
  } else {
    console.error("❌ CV validation failed. Errors found:");
    result.errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }
}

// Update field helper (for personal, bio, etc.)
if (command === 'update-field') {
  let section, field, value, message = '';
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--section') section = args[++i];
    if (args[i] === '--field') field = args[++i];
    if (args[i] === '--value') value = args[++i];
    if (args[i] === '--message') message = args[++i];
  }

  if (!section || !field || value === undefined) {
    console.error("Error: --section, --field, and --value are required.");
    process.exit(1);
  }

  const updateData = {};
  // Handle nested fields or primitive values
  if (field.includes('.')) {
    const [parent, child] = field.split('.');
    const current = loadJSON(DATA_FILE);
    updateData[parent] = { ...current[section][parent], [child]: value };
  } else {
    // Check if value is JSON
    try {
      updateData[field] = JSON.parse(value);
    } catch {
      updateData[field] = value;
    }
  }

  applyUpdate(section, 'modify', null, updateData, message);
}

// Add item helper (for projects, experience, education, certifications list, etc.)
if (command === 'add-item') {
  let section, dataStr, message = '';
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--section') section = args[++i];
    if (args[i] === '--data') dataStr = args[++i];
    if (args[i] === '--message') message = args[++i];
  }

  if (!section || !dataStr) {
    console.error("Error: --section and --data are required.");
    process.exit(1);
  }

  let item;
  try {
    item = JSON.parse(dataStr);
  } catch (err) {
    console.error("Error parsing JSON data string:", err.message);
    process.exit(1);
  }

  // If section is certifications, it's structured as certifications.completed or certifications.in_progress
  if (section.startsWith('certifications.')) {
    const subSec = section.split('.')[1]; // 'completed' or 'in_progress'
    const current = loadJSON(DATA_FILE);
    const updatedList = [...current.certifications[subSec], item];
    applyUpdate('certifications', 'modify', null, { [subSec]: updatedList }, message);
  } else {
    applyUpdate(section, 'add', null, item, message);
  }
}

// Remove item helper
if (command === 'remove-item') {
  let section, key, val, message = '';
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--section') section = args[++i];
    if (args[i] === '--key') key = args[++i];
    if (args[i] === '--val') val = args[++i];
    if (args[i] === '--message') message = args[++i];
  }

  if (!section || !key || !val) {
    console.error("Error: --section, --key, and --val are required.");
    process.exit(1);
  }

  if (section.startsWith('certifications.')) {
    const subSec = section.split('.')[1];
    const current = loadJSON(DATA_FILE);
    const updatedList = current.certifications[subSec].filter(item => item !== val);
    applyUpdate('certifications', 'modify', null, { [subSec]: updatedList }, message);
  } else {
    const filterFn = (item) => String(item[key]) === String(val);
    applyUpdate(section, 'remove', filterFn, null, message);
  }
}
