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

/* ─── Auth API ───────────────────────────────────────────────── */
export const authAPI = {
  register: (payload) => request('POST', '/auth/register', payload),
  login:    (payload) => request('POST', '/auth/login',    payload),
  getMe:    ()        => request('GET',  '/auth/me'),
};

/* ─── Portfolio API ──────────────────────────────────────────── */
export const portfolioAPI = {
  get: () => request('GET', '/portfolio'),

  update: (payload) => request('PUT', '/portfolio', payload),

  publish: (templateId, style) => request(
    'POST',
    '/portfolio/publish',
    { templateId: templateId || null, style: style || {} }
  ),

  getPublic: (slug) => request('GET', `/portfolio/public/${slug}`),
};

/* ─── ATS API ────────────────────────────────────────────────── */
export const atsAPI = {
  /**
   * Score a resume against selected target roles.
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

  getRoles: () => request('GET', '/skills/roles'),
};

/* ─── Chatbot API ────────────────────────────────────────────── */
export const chatbotAPI = {
  send:    (payload) => request('POST', '/chatbot',         payload),
  enhance: (payload) => request('POST', '/chatbot/enhance', payload),
};

/* ─── AI Assistant API ───────────────────────────────────────── */
export const aiAPI = {
  assist: (payload) => request('POST', '/chatbot', payload),
};