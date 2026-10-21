"use strict";
/* ===== utility helpers ===== */
const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;          // int incl
const rf = (a, b) => Math.random() * (b - a) + a;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const chance = p => Math.random() * 100 < p;                               // p in %
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const gauss = (mu, sig) => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mu + sig * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
const poisson = lambda => {
  const L = Math.exp(-Math.max(0.02, lambda));
  let k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
};
const shuffle = arr => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const deepClone = o => JSON.parse(JSON.stringify(o));

const fmtM = n => {
  const neg = n < 0 ? "-" : "";
  n = Math.abs(n);
  if (n >= 1e9) return neg + "€" + (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return neg + "€" + (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + "M";
  if (n >= 1e3) return neg + "€" + (n / 1e3).toFixed(0) + "K";
  return neg + "€" + Math.round(n);
};
const fmtNum = n => {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return "" + Math.round(n);
};
const ordinal = n => {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* week (1-48) → month label */
const WEEK_MONTHS = ["Jul","Jul","Jul","Jul","Aug","Aug","Aug","Aug","Sep","Sep","Sep","Sep","Oct","Oct","Oct","Oct","Oct","Nov","Nov","Nov","Nov","Dec","Dec","Dec","Dec","Dec","Jan","Jan","Jan","Jan","Feb","Feb","Feb","Feb","Mar","Mar","Mar","Mar","Mar","Apr","Apr","Apr","Apr","May","May","May","May","Jun"];
const weekMonth = wk => WEEK_MONTHS[clamp(wk, 1, 48) - 1];
const seasonLabel = y => y + "/" + String((y + 1) % 100).padStart(2, "0");

/* deterministic hue from string, for club badges */
const hashHue = str => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % 360;
};
const badgeHtml = (name, size = 34) => {
  const hue = hashHue(name);
  const hue2 = (hue + 40) % 360;
  const initials = name.split(/\s+/).filter(w => /[A-Za-zÀ-ÿ0-9]/.test(w[0])).slice(0, 2).map(w => w[0].toUpperCase()).join("") || "?";
  return `<span class="badge" style="width:${size}px;height:${size}px;font-size:${Math.round(size * .38)}px;background:linear-gradient(135deg,hsl(${hue},62%,42%),hsl(${hue2},70%,28%))">${esc(initials)}</span>`;
};
const starsHtml = q => "★".repeat(q) + "☆".repeat(5 - q);
const ratingClass = r => r >= 8 ? "rat-great" : r >= 7 ? "rat-good" : r >= 6 ? "rat-mid" : "rat-poor";
const pctBar = (v, max = 100, cls = "") => `<div class="bar ${cls}"><i style="width:${clamp(v / max * 100, 0, 100)}%"></i></div>`;
