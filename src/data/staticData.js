// ===== RESUME TEMPLATE DEFINITIONS =====
export const TEMPLATES = [
  {
    id: 'classic-clean',
    name: 'Classic Clean',
    description: 'Bold centered name, clean section dividers — timeless ATS-perfect layout',
    tags: ['ATS-Ready', 'Corporate'],
    accent: '#111111',
  },
  {
    id: 'sidebar-pro',
    name: 'Sidebar Pro',
    description: 'Dark sidebar with photo, two-column layout for senior professionals',
    tags: ['ATS-Ready', 'Executive'],
    accent: '#2C3E6B',
  },
  {
    id: 'modern-header',
    name: 'Modern Header',
    description: 'Gray header band with structured info rows, great for developers',
    tags: ['ATS-Ready', 'Tech'],
    accent: '#4A5568',
  },
  {
    id: 'minimal-blue',
    name: 'Minimal Blue',
    description: 'Ultra-clean single-column with blue underlined section headers',
    tags: ['ATS-Ready', 'Minimal'],
    accent: '#1E40AF',
  },
  {
    id: 'red-accent',
    name: 'Red Accent',
    description: 'Bold red accent bars with clean three-panel info sections',
    tags: ['ATS-Ready', 'Creative'],
    accent: '#DC2626',
  },
  {
    id: 'auto-cv',
    name: 'Auto CV',
    description: 'Academic-style template with italic section headers, publications support, and clean typography',
    tags: ['ATS-Ready', 'Academic'],
    accent: '#1a56db',
  },
];

// ===== PORTFOLIO TEMPLATE DEFINITIONS =====
export const PORTFOLIO_TEMPLATES = [
  {
    id: 'devfolio',
    name: 'DevFolio',
    description: 'Dark terminal-inspired layout for developers. Minimal, focused, and striking.',
    tags: ['Developer', 'Dark'],
    primaryColor: '#7C3AED',
    accentColor: '#06B6D4',
    bgColor: '#0F172A',
    textColor: '#F8FAFC',
    layout: 'dark',
    style: 'terminal',
  },
  {
    id: 'glassmorphic',
    name: 'Glassmorphic',
    description: 'Modern glass-effect cards on a gradient background. Clean and contemporary.',
    tags: ['Modern', 'Dark'],
    primaryColor: '#8B5CF6',
    accentColor: '#22D3EE',
    bgColor: '#0C0A1E',
    textColor: '#E2E8F0',
    layout: 'dark',
    style: 'glass',
  },
  {
    id: 'techminimal',
    name: 'Tech Minimal',
    description: 'Clean white layout with sharp typography. Preferred by FAANG candidates.',
    tags: ['Minimal', 'Light'],
    primaryColor: '#7C3AED',
    accentColor: '#06B6D4',
    bgColor: '#FFFFFF',
    textColor: '#0F172A',
    layout: 'light',
    style: 'minimal',
  },
  {
    id: 'neonwave',
    name: 'Neon Wave',
    description: 'Bold neon accents on dark bg. Perfect for frontend & UI/UX designers.',
    tags: ['Bold', 'Dark', 'Creative'],
    primaryColor: '#F059DA',
    accentColor: '#06B6D4',
    bgColor: '#08001A',
    textColor: '#F8FAFC',
    layout: 'dark',
    style: 'neon',
  },
  {
    id: 'corporate',
    name: 'Corporate Pro',
    description: 'Professional light theme with sidebar navigation. Great for PMs and senior roles.',
    tags: ['Corporate', 'Light'],
    primaryColor: '#1D4ED8',
    accentColor: '#0EA5E9',
    bgColor: '#F8FAFC',
    textColor: '#1E293B',
    layout: 'light',
    style: 'corporate',
  },
  {
    id: 'gradientpro',
    name: 'Gradient Pro',
    description: 'Rich purple-to-cyan gradient background with animated sections.',
    tags: ['Gradient', 'Animated'],
    primaryColor: '#7C3AED',
    accentColor: '#06B6D4',
    bgColor: '#13001F',
    textColor: '#F8FAFC',
    layout: 'gradient',
    style: 'gradient',
  },
  {
    id: 'custom-portfolio',
    name: 'Create Your Own',
    description: 'Design your portfolio from scratch with full control over colors, fonts, and layout.',
    tags: ['Custom'],
    primaryColor: '#7C3AED',
    accentColor: '#06B6D4',
    bgColor: '#0F172A',
    textColor: '#F8FAFC',
    layout: 'dark',
    style: 'custom',
    isCustom: true,
  },
];

// ===== SECTION ORDER OPTIONS =====
export const PORTFOLIO_SECTIONS = [
  { id: 'hero', label: 'Hero / Introduction' },
  { id: 'about', label: 'About Me' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Work Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

// ===== PORTFOLIO PAGE OPTIONS =====
export const PORTFOLIO_PAGES = ['Home', 'About', 'Projects', 'Skills', 'Experience', 'Contact'];

// ===== ENGINEERING & TECH ROLES =====
export const TARGET_ROLES = [
  { id: 'swe', label: 'Software Engineer' },
  { id: 'fe', label: 'Frontend Developer' },
  { id: 'be', label: 'Backend Developer' },
  { id: 'fs', label: 'Full Stack Developer' },
  { id: 'ds', label: 'Data Scientist' },
  { id: 'ml', label: 'AI/ML Engineer' },
  { id: 'de', label: 'Data Engineer' },
  { id: 'devops', label: 'DevOps Engineer' },
  { id: 'cloud', label: 'Cloud Engineer' },
  { id: 'mobile', label: 'Mobile Developer' },
  { id: 'pm', label: 'Product Manager' },
  { id: 'uiux', label: 'UI/UX Designer' },
  { id: 'security', label: 'Cybersecurity Engineer' },
  { id: 'qa', label: 'QA / Test Engineer' },
  { id: 'embedded', label: 'Embedded Systems Engineer' },
  { id: 'blockchain', label: 'Blockchain Developer' },
  { id: 'other', label: 'Other (Paste Job Description)' },
];

// ===== SKILLS BY ROLE =====
export const ROLE_SKILLS = {
  swe: ['Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'Data Structures', 'Algorithms', 'System Design', 'REST APIs', 'Git', 'SQL', 'Docker', 'Agile', 'Problem Solving', 'OOP'],
  fe: ['React', 'Vue.js', 'Angular', 'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Webpack', 'Next.js', 'Figma', 'Accessibility', 'Performance Optimization', 'REST APIs', 'Git'],
  be: ['Node.js', 'Python', 'Java', 'Go', 'REST APIs', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Microservices', 'Authentication', 'System Design', 'SQL', 'AWS'],
  fs: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB', 'REST APIs', 'Docker', 'AWS', 'Git', 'System Design', 'HTML5', 'CSS3', 'Next.js', 'Redis', 'CI/CD'],
  ds: ['Python', 'Machine Learning', 'Deep Learning', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'SQL', 'Data Visualization', 'Statistics', 'R', 'Jupyter', 'Feature Engineering', 'A/B Testing', 'Tableau'],
  ml: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'MLOps', 'NLP', 'Computer Vision', 'Deep Learning', 'LLMs', 'Docker', 'Kubernetes', 'Model Deployment', 'Data Pipelines', 'SQL', 'Cloud (AWS/GCP)'],
  de: ['Python', 'SQL', 'Apache Spark', 'Airflow', 'Kafka', 'dbt', 'Snowflake', 'BigQuery', 'ETL', 'Data Modeling', 'AWS', 'GCP', 'Docker', 'Pandas', 'Data Warehousing'],
  devops: ['Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Terraform', 'AWS', 'Linux', 'Shell Scripting', 'Monitoring', 'Ansible', 'GitOps', 'Security', 'Networking', 'Python'],
  cloud: ['AWS', 'Azure', 'GCP', 'Terraform', 'Docker', 'Kubernetes', 'Serverless', 'Networking', 'Security', 'IAM', 'CloudFormation', 'Load Balancing', 'Monitoring', 'Python', 'Linux'],
  mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS Development', 'Android Development', 'REST APIs', 'Firebase', 'App Store Deployment', 'UI Design', 'TypeScript', 'State Management', 'Performance', 'Testing', 'Git'],
  pm: ['Product Strategy', 'Roadmapping', 'User Research', 'Agile', 'Scrum', 'Jira', 'Data Analysis', 'Stakeholder Management', 'A/B Testing', 'PRD Writing', 'SQL', 'Figma', 'OKRs', 'Market Research', 'Communication'],
  uiux: ['Figma', 'Adobe XD', 'Sketch', 'User Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'Design Systems', 'Accessibility', 'HTML/CSS', 'Motion Design', 'Information Architecture', 'Persona Creation', 'A/B Testing', 'Visual Design'],
  security: ['Penetration Testing', 'Network Security', 'SIEM', 'Vulnerability Assessment', 'Incident Response', 'Cryptography', 'Python', 'Linux', 'Firewalls', 'OWASP', 'SOC', 'Cloud Security', 'IDS/IPS', 'Risk Management', 'Compliance'],
  qa: ['Manual Testing', 'Automation Testing', 'Selenium', 'Jest', 'Cypress', 'API Testing', 'Postman', 'Test Planning', 'Bug Reporting', 'Agile', 'Python', 'SQL', 'Performance Testing', 'JIRA', 'CI/CD'],
  embedded: ['C', 'C++', 'RTOS', 'Microcontrollers', 'FPGA', 'ARM', 'Linux Kernel', 'Firmware Development', 'PCB Design', 'CAN/SPI/I2C', 'Python', 'MATLAB', 'Debugging', 'Assembly', 'Hardware Protocols'],
  blockchain: ['Solidity', 'Ethereum', 'Web3.js', 'Smart Contracts', 'DeFi', 'NFTs', 'Rust', 'Hardhat', 'Truffle', 'JavaScript', 'Python', 'Cryptography', 'Layer 2', 'IPFS', 'Consensus Mechanisms'],
};

// ===== GENERAL SKILL SUGGESTIONS =====
export const ALL_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C', 'Go', 'Rust', 'Swift', 'Kotlin', 'Ruby', 'PHP', 'R', 'Scala', 'Dart',
  'React', 'Vue.js', 'Angular', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Sass/SCSS', 'Redux', 'Zustand', 'Webpack', 'Vite',
  'Node.js', 'Express.js', 'FastAPI', 'Django', 'Flask', 'Spring Boot', 'GraphQL', 'REST APIs', 'gRPC', 'Microservices',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQLite', 'Cassandra', 'DynamoDB', 'Firebase',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform', 'CI/CD', 'GitHub Actions', 'Jenkins', 'Linux', 'Nginx',
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'LLMs', 'NLP', 'Computer Vision', 'Apache Spark', 'Airflow',
  'Git', 'Jira', 'Figma', 'Postman', 'VS Code', 'Jupyter', 'Tableau', 'Power BI',
  'Agile', 'Scrum', 'System Design', 'Problem Solving', 'Team Collaboration', 'Technical Writing',
];

// ===== ATS SCORE WEIGHTS =====
export const ATS_WEIGHTS = {
  summary: 15,
  skills: 30,
  workExperience: 25,
  education: 15,
  projects: 10,
  certifications: 5,
};

// ===== FONT OPTIONS =====
export const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Source Sans 3', label: 'Source Sans 3' },
  { value: 'Georgia', label: 'Georgia (Serif)' },
  { value: 'Times New Roman', label: 'Times New Roman' },
];

// ===== PORTFOLIO FONT OPTIONS =====
export const PORTFOLIO_FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Source Sans 3', label: 'Source Sans 3' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Georgia', label: 'Georgia (Serif)' },
  { value: 'monospace', label: 'Monospace (Code feel)' },
];

// ===== COLOR PRESETS =====
export const COLOR_PRESETS = [
  '#7C3AED', '#06B6D4', '#10B981', '#F59E0B',
  '#EF4444', '#0F172A', '#1D4ED8', '#DB2777',
];

// ===== PORTFOLIO BG PRESETS =====
export const PORTFOLIO_BG_PRESETS = [
  '#0F172A', '#08001A', '#0C0A1E', '#001219',
  '#FFFFFF', '#F8FAFC', '#1E293B', '#13001F',
];