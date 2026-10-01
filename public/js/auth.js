/**
 * JeevSahay shared auth helper.
 * Stores the JWT + user object in localStorage (token is also set as an
 * httpOnly cookie by the server for same-origin requests, but we keep a
 * copy here so pages can read the role/name for UI without another request).
 */
const JeevAuth = (() => {
  const TOKEN_KEY = 'jeevsahay_token';
  const USER_KEY = 'jeevsahay_user';

  function saveSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    } catch {
      return null;
    }
  }

  function isLoggedIn() {
    return !!getToken();
  }

  async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = Object.assign(
      { 'Content-Type': 'application/json' },
      options.headers || {},
      token ? { Authorization: `Bearer ${token}` } : {}
    );
    const res = await fetch(path, { ...options, headers, credentials: 'include' });
    let data;
    try {
      data = await res.json();
    } catch {
      data = { success: false, message: 'Unexpected server response.' };
    }
    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong.');
    }
    return data;
  }

  async function login(email, password, remember) {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, remember }),
    });
    saveSession(data.token, data.user);
    return data.user;
  }

  async function signup(payload) {
    const data = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    saveSession(data.token, data.user);
    return data.user;
  }

  async function logout() {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      clearSession();
    }
  }

  function redirectByRole(user) {
    if (user.role === 'admin') {
      window.location.href = '/dashboard.html';
    } else {
      window.location.href = '/homepage.html';
    }
  }

  // Call on pages that require login. Redirects to login.html if missing.
  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.href = '/login.html';
    }
  }

  return { saveSession, clearSession, getToken, getUser, isLoggedIn, apiFetch, login, signup, logout, redirectByRole, requireAuth };
})();
