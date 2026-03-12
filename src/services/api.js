const BASE_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('skillfolio_token');

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  getMe:    ()     => request('/auth/me'),
};

export const portfolioAPI = {
  get:    ()     => request('/portfolio'),
  update: (body) => request('/portfolio', { method: 'PUT', body: JSON.stringify(body) }),
  publish: ()    => request('/portfolio/publish', { method: 'POST' }),
};

export const aiAPI = {
  chat:               (body) => request('/ai/chat',                { method: 'POST', body: JSON.stringify(body) }),
  improveBio:         (body) => request('/ai/improve-bio',         { method: 'POST', body: JSON.stringify(body) }),
  improveDescription: (body) => request('/ai/improve-description', { method: 'POST', body: JSON.stringify(body) }),
  suggestSkills:      (body) => request('/ai/suggest-skills',      { method: 'POST', body: JSON.stringify(body) }),
};

export const atsAPI = {
  score:          (body) => request('/ats/score',    { method: 'POST', body: JSON.stringify(body) }),
  extractKeywords:(body) => request('/ats/keywords', { method: 'POST', body: JSON.stringify(body) }),
};

export const skillsAPI = {
  analytics:        ()     => request('/skills/analytics'),
  marketComparison: (body) => request('/skills/market-comparison', { method: 'POST', body: JSON.stringify(body) }),
  roadmap:          (body) => request('/skills/roadmap',           { method: 'POST', body: JSON.stringify(body) }),
};