"use strict";
/* ===== PLAYER MODEL ===== */

function createPlayer(cfg) {
  const diff = DIFFS[cfg.diff];
  const info = POS_INFO[cfg.pos];
  const attrs = {};
  // base attributes for a 14-year-old, biased toward the position's key stats
  for (const k of ATTR_KEYS) {
    const weight = info.w[k];
    const bias = weight * 30;                       // key attrs a bit higher
    attrs[k] = clamp(Math.round(gauss(38 + bias + diff.startBoost, 4)), 22, 62);
  }
  const p = {
    name: cfg.name, pos: cfg.pos, nat: cfg.nat, foot: pick(["Left", "Right"]),
    age: 14, attrs,
    potential: ri(diff.potMin, diff.potMax),
    form: 6.0, morale: 70, energy: 100, sharp: 50,
    rep: 1, followers: ri(40, 300),
    injury: 0, injuryName: null, bans: 0, yellows: 0,
    trust: 45,
    lastRatings: [],
  };
  p.ovr = calcOverall(p);
  return p;
}

function calcOverall(p) {
  const w = POS_INFO[p.pos].w;
  let s = 0;
  for (const k of ATTR_KEYS) s += p.attrs[k] * w[k];
  return Math.round(s);
}

function attrLabel(p, k) { return p.pos === "GK" ? GK_LABELS[k] : ATTR_LABELS[k]; }

/* age growth multiplier */
function ageMult(age) {
  if (age <= 17) return 1.45;
  if (age <= 21) return 1.15;
  if (age <= 25) return 0.72;
  if (age <= 29) return 0.40;
  if (age <= 32) return 0.15;
  return 0.05;
}

/* soft cap near potential */
function potBrake(p) {
  const gap = p.potential - p.ovr;
  if (gap <= 0) return 0.06;
  return clamp(gap / 14, 0.12, 1);
}

/* apply xp to a specific attribute (handles fractions) */
function gainAttr(state, key, amount) {
  const p = state.player;
  p.attrs[key] = clamp(p.attrs[key] + amount, 1, 99);
  const before = p.ovr;
  p.ovr = calcOverall(p);
  if (p.ovr > before) state.weekDelta.ovrUp = (state.weekDelta.ovrUp || 0) + (p.ovr - before);
}

/* weekly training */
function trainWeek(state) {
  const p = state.player;
  const focus = state.trainingFocus;
  if (p.injury > 0) return;
  const diff = DIFFS[state.diff];
  const loc = findClubIn(state.leagues, state.club.name);
  const clubR = loc ? loc.team.r : 60;
  const fac = state.academy ? 0.75 + state.academy.q * 0.11 : clamp(0.8 + (clubR - 55) * 0.011, 0.8, 1.28);
  const moraleM = 0.85 + p.morale / 400;                 // 0.85–1.10
  const griefM = state.grief && state.grief.weeks > 0 ? 0.55 : 1; // the mind is elsewhere
  const base = 0.26 * ageMult(p.age) * fac * diff.growth * moraleM * griefM * potBrake(p);
  if (focus === "rest") {
    p.energy = clamp(p.energy + 18, 0, 100);
    p.morale = clamp(p.morale + 1, 0, 100);
    return;
  }
  p.energy = clamp(p.energy - 4, 0, 100);
  if (focus === "skill") {
    const sk = skillById(state.skillFocus);
    if (!sk) { // no move picked — don't waste the week
      for (const k of ATTR_KEYS) gainAttr(state, k, base * 0.24);
      return;
    }
    if (!state.skills[sk.id]) state.skills[sk.id] = 0;
    const lvl = state.skills[sk.id];
    const gain = 2.0 * fac * diff.growth * moraleM * (1 - lvl / 115) * (0.7 + p.attrs[sk.attr] / 200);
    state.skills[sk.id] = clamp(lvl + gain, 0, 100);
    gainAttr(state, sk.attr, base * 0.25); // spillover to the linked attribute
    if (state.skills[sk.id] >= 100) unlock(state, "skill_master");
    if (Object.values(state.skills).filter(v => v >= 50).length >= 5) unlock(state, "skill_five");
    state.weekDelta.trained = "skill:" + sk.name;
    return;
  }
  if (focus === "balanced") {
    for (const k of ATTR_KEYS) gainAttr(state, k, base * 0.24);
  } else {
    gainAttr(state, focus, base);
    // slight spillover
    gainAttr(state, pick(ATTR_KEYS), base * 0.15);
  }
  state.weekDelta.trained = focus;
}

/* xp from playing a match */
function matchXp(state, rating, mins) {
  const p = state.player;
  const diff = DIFFS[state.diff];
  const amt = Math.max(0, (rating - 5.2) * 0.085) * (mins / 90) * ageMult(p.age) * diff.growth * potBrake(p);
  const w = POS_INFO[p.pos].w;
  for (const k of ATTR_KEYS) gainAttr(state, k, amt * (w[k] + 0.05) * 2.2);
}

/* yearly age decline (applied at season rollover for 30+) */
function ageDecline(state) {
  const p = state.player;
  if (p.age >= 34) {
    for (const k of ATTR_KEYS) p.attrs[k] = Math.max(30, p.attrs[k] - rf(0.8, 2.2));
  } else if (p.age >= 31) {
    p.attrs.pac = Math.max(30, p.attrs.pac - rf(0.8, 1.8));
    p.attrs.phy = Math.max(30, p.attrs.phy - rf(0.4, 1.2));
  } else if (p.age >= 29) {
    p.attrs.pac = Math.max(30, p.attrs.pac - rf(0.2, 0.8));
  }
  p.ovr = calcOverall(p);
}

function marketValue(state) {
  const p = state.player;
  if (state.academy) return Math.round(Math.pow(Math.max(1, p.ovr - 40), 3) * 250);
  const ageF = p.age <= 21 ? 1.45 : p.age <= 25 ? 1.3 : p.age <= 28 ? 1.0 : p.age <= 31 ? 0.55 : p.age <= 34 ? 0.22 : 0.08;
  const repF = 0.55 + p.rep / 90;
  return Math.round(Math.pow(Math.max(1, p.ovr - 40), 3) * 420 * ageF * repF);
}

function fairWage(state) {
  const v = marketValue(state);
  return Math.max(400, Math.round(v * 0.0016));
}

function updateForm(p, rating) {
  p.lastRatings.push(rating);
  if (p.lastRatings.length > 5) p.lastRatings.shift();
  p.form = p.lastRatings.reduce((a, b) => a + b, 0) / p.lastRatings.length;
}
