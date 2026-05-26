// src/services/api.js
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/* ─── Helper: JSON requests ──────────────────────────────────── */
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

<<<<<<< HEAD
=======
/* ─── Helper: FormData requests (for file uploads) ───────────── */
const requestFormData = async (method, endpoint, formData) => {
  const headers = {};
  const token   = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  // NOTE: Do NOT set Content-Type here — browser sets it automatically
  //       with the correct multipart boundary for FormData.

  const res  = await fetch(`${BASE_URL}${endpoint}`, { method, headers, body: formData });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data;
};

>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
/* ─── Auth API ───────────────────────────────────────────────── */
export const authAPI = {
  register: (payload) => request('POST', '/auth/register', payload),
  login:    (payload) => request('POST', '/auth/login',    payload),
  getMe:    ()        => request('GET',  '/auth/me'),
};

/* ─── Portfolio API ──────────────────────────────────────────── */
export const portfolioAPI = {
<<<<<<< HEAD
  // GET  /api/portfolio
  get: () => request('GET', '/portfolio'),

  // PUT  /api/portfolio — save / update portfolio data
  // Now includes targetRoles in payload so it persists to DB
  update: (payload) => request('PUT', '/portfolio', payload),

  // POST /api/portfolio/publish
=======
  get: () => request('GET', '/portfolio'),

  update: (payload) => request('PUT', '/portfolio', payload),

>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
  publish: (templateId, style) => request(
    'POST',
    '/portfolio/publish',
    { templateId: templateId || null, style: style || {} }
  ),

<<<<<<< HEAD
  // GET /api/portfolio/public/:slug — public, no auth needed
=======
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
  getPublic: (slug) => request('GET', `/portfolio/public/${slug}`),
};

/* ─── ATS API ────────────────────────────────────────────────── */
export const atsAPI = {
  /**
   * Score a resume against selected target roles.
<<<<<<< HEAD
   * @param {Object}   params
   * @param {string}   params.resumeText   - Raw text from the resume file
   * @param {string[]} params.targetRoles  - Roles selected in the UI
   */
  score: ({ resumeText, targetRoles = [] }) =>
    request('POST', '/ats/score', { resumeText, targetRoles }),
};
=======
   *
   * Pass EITHER:
   *   { file: File, targetRoles: string[] }   ← preferred (PDF/DOCX/TXT file)
   *   { resumeText: string, targetRoles: [] }  ← fallback (plain text)
   */
  score: ({ file, resumeText, targetRoles = [] }) => {
    // ✅ File upload path — sends as FormData so multer parses it correctly
    if (file) {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetRoles', JSON.stringify(targetRoles));
      return requestFormData('POST', '/ats/score', formData);
    }

    // Fallback: plain text (e.g. pasted text, not a file)
    return request('POST', '/ats/score', { resumeText, targetRoles });
  },
};

>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
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
<<<<<<< HEAD
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
=======
   *
   * Pass EITHER:
   *   { file: File, targetRoles: string[] }   ← preferred
   *   { resumeText: string, targetRoles: [] }  ← fallback
   */
  analyze: ({ file, resumeText, targetRoles = [] }) => {
    if (file) {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetRoles', JSON.stringify(targetRoles));
      return requestFormData('POST', '/skills/analyze', formData);
    }

    return request('POST', '/skills/analyze', { resumeText, targetRoles });
  },

>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
  getRoles: () => request('GET', '/skills/roles'),
};

/* ─── Chatbot API ────────────────────────────────────────────── */
export const chatbotAPI = {
<<<<<<< HEAD
  send: (payload) => request('POST', '/chatbot', payload),
=======
  send:    (payload) => request('POST', '/chatbot',         payload),
>>>>>>> 2c5ac94cc88365feeba81f6e163dad8dcdf46e44
  enhance: (payload) => request('POST', '/chatbot/enhance', payload),
};

/* ─── AI Assistant API ───────────────────────────────────────── */
export const aiAPI = {
  assist: (payload) => request('POST', '/chatbot', payload),
};