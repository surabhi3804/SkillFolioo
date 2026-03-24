// src/services/api.js
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/* ─── Helper ─────────────────────────────────────────────────── */
const getToken = () => localStorage.getItem('skillfolio_token');

const request = async (method, endpoint, body = null) => {
  const headers = { 'Content-Type': 'application/json' };
  const token   = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const res  = await fetch(`${BASE_URL}${endpoint}`, config);
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
  // GET  /api/portfolio
  get: () => request('GET', '/portfolio'),

  // PUT  /api/portfolio — save / update portfolio data
  // Now includes targetRoles in payload so it persists to DB
  update: (payload) => request('PUT', '/portfolio', payload),

  // POST /api/portfolio/publish
  publish: (templateId, style) => request(
    'POST',
    '/portfolio/publish',
    { templateId: templateId || null, style: style || {} }
  ),

  // GET /api/portfolio/public/:slug — public, no auth needed
  getPublic: (slug) => request('GET', `/portfolio/public/${slug}`),
};

/* ─── ATS API ────────────────────────────────────────────────── */
export const atsAPI = {
  /**
   * Score a resume against selected target roles.
   * @param {Object}   params
   * @param {string}   params.resumeText   - Raw text from the resume file
   * @param {string[]} params.targetRoles  - Roles selected in the UI
   */
  score: ({ resumeText, targetRoles = [] }) =>
    request('POST', '/ats/score', { resumeText, targetRoles }),
};
/* ─── Custom Roles API ───────────────────────────────────────── */
export const customRolesAPI = {
  getAll: ()          => request('GET',    '/ats/custom-roles'),
  save:   (label, jd) => request('POST',   '/ats/custom-roles', { label, jd }),
  delete: (id)        => request('DELETE', `/ats/custom-roles/${id}`),
};

/* ─── Skills API ─────────────────────────────────────────────── */
export const skillsAPI = {
  /**
   * Analyse skills in a resume, tailored to the selected target roles.
   * @param {Object}   params
   * @param {string}   params.resumeText   - Raw text from the resume file
   * @param {string[]} params.targetRoles  - Roles selected in the UI
   */
  analyze: ({ resumeText, targetRoles = [] }) =>
    request('POST', '/skills/analyze', { resumeText, targetRoles }),

  /**
   * Fetch the supported target roles list from the backend.
   * Useful if you want the role list server-driven in future.
   */
  getRoles: () => request('GET', '/skills/roles'),
};

/* ─── Chatbot API ────────────────────────────────────────────── */
export const chatbotAPI = {
  send: (payload) => request('POST', '/chatbot', payload),
};

/* ─── AI Assistant API ───────────────────────────────────────── */
export const aiAPI = {
  assist: (payload) => request('POST', '/chatbot', payload),
};