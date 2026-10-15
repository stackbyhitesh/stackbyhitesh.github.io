// localStorage can throw (private mode, blocked cookies), so every access is wrapped.
export const safeStorage = {
  get(key) {
    try { return window.localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { window.localStorage.setItem(key, value); } catch { /* storage unavailable: ignore */ }
  },
};
