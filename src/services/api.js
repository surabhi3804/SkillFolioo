const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/* ─── Helper ────────────────────────────────────────────────── */
const getToken = () => localStorage.getItem('skillfolio_token');

const request = async (method, endpoint, body = null) => {
  const headers = { 'Content-Type': 'application/json' };
  const token   = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data;
};

/* ─── Auth API ───────────────────────────────────────────────── */
export const authAPI = {
  register: (payload) => request('POST', '/auth/register', payload),
  login:    (payload) => request('POST', '/auth/login',    payload),
  getMe:    ()        => request('GET',  '/auth/me'),
};

/* ─── Portfolio API ──────────────────────────────────────────── */
export const portfolioAPI = {
  // GET  /api/portfolio  — load saved portfolio for logged-in user
  get: () => request('GET', '/portfolio'),

  // PUT  /api/portfolio  — save / update portfolio data
  update: (payload) => request('PUT', '/portfolio', payload),

  // POST /api/portfolio/publish — publish and get a public URL
  publish: () => request('POST', '/portfolio/publish'),

  // GET  /api/portfolio/public/:slug — public, no auth needed
  getPublic: (slug) => request('GET', `/portfolio/public/${slug}`),
};

/* ─── ATS API ────────────────────────────────────────────────── */
export const atsAPI = {
  score: (payload) => request('POST', '/ats/score', payload),
};

/* ─── Skills API ─────────────────────────────────────────────── */
export const skillsAPI = {
  analyze: (payload) => request('POST', '/skills/analyze', payload),
};

/* ─── Chatbot API ────────────────────────────────────────────── */
export const chatbotAPI = {
  send: (payload) => request('POST', '/chatbot', payload),
};

/* ─── AI Assistant API ───────────────────────────────────────── */
export const aiAPI = {
  assist: (payload) => request('POST', '/chatbot', payload),
};