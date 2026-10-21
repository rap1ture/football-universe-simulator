"use strict";
/* ===== SEASON / MATCH ENGINE ===== */

/* circle-method round robin: returns array of rounds, each an array of [home, away] */
function roundRobin(n, double) {
  const teams = [];
  for (let i = 0; i < n; i++) teams.push(i);
  const rounds = [];
  for (let r = 0; r < n - 1; r++) {
    const pairs = [];
    for (let i = 0; i < n / 2; i++) {
      const a = teams[i], b = teams[n - 1 - i];
      pairs.push(r % 2 === 0 ? [a, b] : [b, a]);
    }
    rounds.push(pairs);
    teams.splice(1, 0, teams.pop()); // rotate all but first
  }
  if (double) {
    const back = rounds.map(rd => rd.map(([h, a]) => [a, h]));
    return rounds.concat(back);
  }
  return rounds;
}

function newTable(n) {
  const t = [];
  for (let i = 0; i < n; i++) t.push({ i, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });
  return t;
}
function applyResult(table, hi, ai, gh, ga) {
  const H = table.find(r => r.i === hi), A = table.find(r => r.i === ai);
  if (!H || !A) return;
  H.p++; A.p++; H.gf += gh; H.ga += ga; A.gf += ga; A.ga += gh;
  if (gh > ga) { H.w++; A.l++; H.pts += 3; }
  else if (gh < ga) { A.w++; H.l++; A.pts += 3; }
  else { H.d++; A.d++; H.pts++; A.pts++; }
}
function tableSorted(table) {
  return table.slice().sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf);
}
function tablePos(table, idx) {
  return tableSorted(table).findIndex(r => r.i === idx) + 1;
}

/* simulate a score between two team ratings */
function simScore(rH, rA, homeAdv = 2.5) {
  const d = (rH + homeAdv - rA);
  const lh = clamp(1.38 + d * 0.055, 0.15, 3.8);
  const la = clamp(1.32 - d * 0.055, 0.12, 3.8);
  return [poisson(lh), poisson(la)];
}

/* current club record for the player */
function myClub(state) {
  const lg = state.leagues.find(l => l.id === state.club.leagueId);
  const idx = lg ? lg.teams.findIndex(t => t.n === state.club.name) : -1;
  return { lg, idx };
}

/* ============ SEASON CALENDAR ============ */
const NT_WEEKS = [10, 15, 21, 29, 34];

function buildSeason(state) {
  const { lg, idx } = myClub(state);
  const S = {
    myIdx: idx, leagueId: lg.id,
    rounds: [], weekRounds: {}, table: newTable(lg.teams.length),
    cup: null, cup2: null, cont: null, playoff: null, mls: null,
    youth: null, lastLeagueWeek: 0, log: [],
  };
  const n = lg.teams.length;
  const double = n <= 24;
  S.rounds = roundRobin(n, double);
  const R = S.rounds.length;

  // Occupied slot-B weeks (cups etc.) so overflow league rounds avoid them
  const busy = new Set(NT_WEEKS);
  // domestic cup (player path only) — pros only
  if (!state.academy) {
    const cupWeeks = [8, 13, 19, 26, 32, 38];
    const stages = ["Round of 64", "Round of 32", "Round of 16", "Quarter-Final", "Semi-Final", "FINAL"];
    const entry = lg.tier >= 3 ? 0 : 1; // top two tiers join at R32
    S.cup = { name: lg.cup, weeks: cupWeeks, stages, next: entry, alive: true };
    cupWeeks.slice(entry).forEach(w => busy.add(w));
    if (lg.cup2) {
      const c2w = [7, 12, 18, 24, 30];
      S.cup2 = { name: lg.cup2, weeks: c2w, stages: ["Round of 32", "Round of 16", "Quarter-Final", "Semi-Final", "FINAL"], next: 0, alive: true };
      c2w.forEach(w => busy.add(w));
    }
    // continental
    if (state.contQual) {
      if (lg.conf === "eu") {
        S.cont = { comp: state.contQual, phase: "lp", pts: 0, played: 0, lpWeeks: [6, 9, 11, 16, 22, 25, 28, 31], koWeeks: { PO: 33, R16: 35, QF: 37, SF: 40, F: 42 }, alive: true, results: [] };
        S.cont.lpWeeks.forEach(w => busy.add(w));
        Object.values(S.cont.koWeeks).forEach(w => busy.add(w));
      } else if (lg.conf === "sa") {
        S.cont = { comp: state.contQual, phase: "gp", pts: 0, played: 0, lpWeeks: [6, 9, 11, 16, 22, 25], koWeeks: { R16: 28, QF: 31, SF: 35, F: 40 }, alive: true, results: [] };
        S.cont.lpWeeks.forEach(w => busy.add(w));
        Object.values(S.cont.koWeeks).forEach(w => busy.add(w));
      }
    }
  }

  // assign league rounds to weeks
  if (state.academy) {
    // youth league: 14 teams double RR = 26 rounds, weeks 6..31; youth cup at 38/40/42
    const peers = shuffle(state.leagues.filter(l => l.cc === lg.cc).flatMap(l => l.teams)).slice(0, 13);
    const yTeams = [{ n: state.club.name + " U18", r: clamp(lg.teams[idx].r - 22, 40, 68) }]
      .concat(peers.map(t => ({ n: t.n + " U18", r: clamp(t.r - 22 + ri(-3, 3), 38, 66) })));
    S.youth = { teams: yTeams, rounds: roundRobin(14, true), table: newTable(14), myIdx: 0, weekRounds: {}, cupStage: 0, cupAlive: true };
    let w = 6;
    for (let i = 0; i < S.youth.rounds.length; i++) {
      S.youth.weekRounds[w] = i;
      w++;
    }
    S.lastLeagueWeek = w - 1;
  } else {
    let assigned = 0;
    if (R <= 38) {
      const skip26 = R === 38;
      for (let w = 5; w <= 43 && assigned < R; w++) {
        if (skip26 && w === 26) continue;
        if (n > 24 || R < 34) { /* spread single-RR leagues */ }
        S.weekRounds[w] = [assigned++];
      }
      if (n > 24) { // re-spread for long single RR (ARG1, MLS)
        for (const k of Object.keys(S.weekRounds)) delete S.weekRounds[k];
        for (let i = 0; i < R; i++) {
          const w = 5 + Math.floor(i * 38 / R);
          (S.weekRounds[w] = S.weekRounds[w] || []).push(i);
        }
      }
    } else {
      for (let w = 5; w <= 43; w++) S.weekRounds[w] = [assigned++];
      for (let w = 6; w <= 42 && assigned < R; w++) {
        if (!busy.has(w) && (S.weekRounds[w] || []).length < 2) {
          S.weekRounds[w].push(assigned++);
        }
      }
      // desperate fill
      for (let w = 6; w <= 43 && assigned < R; w++) {
        if ((S.weekRounds[w] || []).length < 2) S.weekRounds[w].push(assigned++);
      }
    }
    S.lastLeagueWeek = Math.max(...Object.keys(S.weekRounds).map(Number));
    // MLS playoffs
    if (lg.playoffTop) S.mls = { stage: 0, weeks: [44, 45, 46], alive: null };
    // promotion playoff placeholder (resolved after last league week)
    if (lg.playoff) S.playoff = { weeks: [44, 45], stage: 0, active: null };
  }
  // bad life events: at least one per season, sometimes two
  S.badWeeks = [ri(6, 40)];
  if (chance(65)) {
    let w2 = ri(6, 40);
    while (Math.abs(w2 - S.badWeeks[0]) < 6) w2 = ri(6, 40);
    S.badWeeks.push(w2);
  }
  state.season = S;
  state.results = [];
}

/* sim every non-player pairing of a league round, update table; returns player pair or null */
function processLeagueRound(state, roundIdx) {
  const S = state.season;
  const { lg } = myClub(state);
  const round = S.rounds[roundIdx];
  let myPair = null;
  for (const [h, a] of round) {
    if (h === S.myIdx || a === S.myIdx) { myPair = [h, a]; continue; }
    const [gh, ga] = simScore(lg.teams[h].r + rf(-2, 2), lg.teams[a].r + rf(-2, 2));
    applyResult(S.table, h, a, gh, ga);
  }
  return myPair;
}

/* ============ OPPONENT POOLS ============ */
function euroPool(state, comp) {
  const range = comp === "UCL" ? [76, 92] : comp === "UEL" ? [69, 82] : [61, 78];
  const pool = [];
  for (const l of state.leagues) {
    if (l.conf !== "eu" || l.tier > 2) continue;
    for (const t of l.teams) {
      if (t.n === state.club.name) continue;
      if (t.r >= range[0] && t.r <= range[1]) pool.push(t);
    }
  }
  return pool.length ? pool : state.leagues.filter(l => l.conf === "eu").flatMap(l => l.teams);
}
function saPool(state, comp) {
  const min = comp === "LIB" ? 68 : 60;
  const pool = [];
  for (const l of state.leagues) {
    if (l.conf !== "sa") continue;
    for (const t of l.teams) if (t.n !== state.club.name && t.r >= min) pool.push(t);
  }
  return pool;
}
function cupOpponent(state, stageIdx) {
  const { lg } = myClub(state);
  const pool = state.leagues.filter(l => l.cc === lg.cc).flatMap(l => l.teams).filter(t => t.n !== state.club.name);
  // later rounds → stronger opponents
  const sorted = pool.slice().sort((a, b) => b.r - a.r);
  const sliceEnd = Math.max(8, Math.round(sorted.length * (1 - stageIdx * 0.15)));
  return pick(sorted.slice(0, sliceEnd));
}

/* ============ PLAYER SELECTION ============ */
function effClubRating(state) {
  const { lg } = myClub(state);
  const base = lg ? lg.teams[state.season.myIdx].r : 60;
  const p = state.player;
  return p.ovr > base ? base + (p.ovr - base) * 0.2 : base;
}
function selectionFor(state, fx) {
  const p = state.player;
  if (p.injury > 0) return "injured";
  if (fx.comp === "youth" || fx.comp === "nt") return "start";
  if (p.bans > 0) return "banned";
  if (p.energy < 15) return "bench";
  const { lg } = myClub(state);
  const teamR = lg.teams[state.season.myIdx].r;
  const roleBonus = { star: 7, first: 3.5, rotation: 0, prospect: -4 }[state.contract?.role || "rotation"] || 0;
  const margin = p.ovr + p.trust / 6 + (p.form - 6) * 3 + roleBonus - (teamR - 3);
  if (margin >= -3) return "start";
  if (margin >= -11) return "bench";
  return "out";
}

/* ============ MOMENTS ============ */
function momentPoolFor(pos) {
  const grp = POS_INFO[pos].grp;
  return MOMENTS.filter(m =>
    m.grp === grp ||
    m.grp === "ANY" && grp !== "GK" ||
    (grp === "ATT" && m.grp === "MID") ||
    (grp === "MID" && m.grp === "ATT" && Math.random() < 0.5) ||
    (grp === "DEF" && m.grp === "MID" && Math.random() < 0.3)
  );
}
function momentChance(state, opt) {
  const p = state.player;
  const val = p.attrs[opt.attr];
  return Math.round(clamp(opt.base + (val - 64) * 1.05 + (p.form - 6) * 3.5 + DIFFS[state.diff].moment, 6, 93));
}

/* ============ PENALTY SHOOTOUT ============ */
async function runShootout(state, fx, ui, opts) {
  const p = state.player;
  const myR = fx.myR !== undefined ? fx.myR : effClubRating(state);
  const edge = clamp((myR - fx.oppR) * 0.7, -8, 8);
  let my = 0, opp = 0, dr = 0;
  if (ui && ui.tick) await ui.tick({ min: 90, cls: "goal", txt: "⚖️ All level at full time — PENALTY SHOOTOUT!" });
  const kicks = opts.onPitch && p.pos !== "GK";
  const gloves = opts.onPitch && p.pos === "GK";
  for (let round = 1; round <= 20; round++) {
    // ——— our kick
    let scored;
    if (kicks && round === 3) {
      const m = { txt: "Shootout, round 3 — YOUR turn. The walk from halfway takes a lifetime...", opts: [
        { t: "Blast it high and hard", attr: "sho", base: 60, ok: { dr: 0.35, txt: "BURIED! Top of the net — unsaveable!" }, ko: { dr: -0.45, txt: "Over the bar... you can't bear to look." } },
        { t: "Pass it into the corner", attr: "sho", base: 66, ok: { dr: 0.3, txt: "Ice cold. The keeper dived early." }, ko: { dr: -0.45, txt: "Too close to the keeper — SAVED." } },
        { t: "Panenka. In a shootout.", attr: "dri", base: 38, ok: { dr: 0.6, txt: "PANENKA!! The most disrespectful penalty this stadium has ever seen!" }, ko: { dr: -0.7, txt: "He stood still and caught it. The silence is deafening." } },
      ]};
      const chances = m.opts.map(o => momentChance(state, o));
      let idx = 1;
      if (ui && ui.moment) idx = await ui.moment("P", m, chances);
      else idx = chances.indexOf(Math.max(...chances));
      scored = chance(chances[idx]);
      const out = scored ? m.opts[idx].ok : m.opts[idx].ko;
      dr += out.dr;
      if (ui && ui.tick) await ui.tick({ min: 90, cls: scored ? "goal you" : "bad you", txt: (scored ? "✅ " : "❌ ") + out.txt });
    } else {
      scored = chance(clamp(75 + edge, 45, 92));
    }
    if (scored) my++;
    // ——— their kick
    let theirs;
    if (gloves && round === 3) {
      const m = { txt: "Shootout, round 3 — their captain steps up against YOU...", opts: [
        { t: "Dive to your favourite corner", attr: "dri", base: 34, ok: { dr: 0.8, txt: "SAVED!!! You guessed right — the stadium ERUPTS!" }, ko: { dr: -0.1, txt: "Wrong corner. No shame in it." } },
        { t: "Wait and react late", attr: "def", base: 30, ok: { dr: 0.9, txt: "You wait... and CLAW it off the line! Superhuman!" }, ko: { dr: -0.1, txt: "Too well placed to reach." } },
        { t: "Mind games on the line", attr: "phy", base: 28, ok: { dr: 0.8, txt: "He's rattled — blazes it OVER! The dark arts deliver!" }, ko: { dr: -0.15, txt: "Unbothered. Bottom corner." } },
      ]};
      const chances = m.opts.map(o => momentChance(state, o));
      let idx = 0;
      if (ui && ui.moment) idx = await ui.moment("P", m, chances);
      else idx = chances.indexOf(Math.max(...chances));
      const saved = chance(chances[idx]);
      const out = saved ? m.opts[idx].ok : m.opts[idx].ko;
      dr += out.dr;
      theirs = !saved;
      if (ui && ui.tick) await ui.tick({ min: 90, cls: saved ? "goal you" : "bad", txt: (saved ? "✅ " : "❌ ") + out.txt });
    } else {
      theirs = chance(clamp(75 - edge, 45, 92));
    }
    if (theirs) opp++;
    if (ui && ui.tick && !((kicks || gloves) && round === 3)) await ui.tick({ min: 90, cls: "", txt: `Pens round ${round}: ${scored ? "✅" : "❌"} us · ${theirs ? "✅" : "❌"} them — ${my}-${opp}` });
    if (round >= 5 && my !== opp) break;
    if (round >= 19) { chance(50) ? my++ : opp++; break; }
  }
  if (ui && ui.tick) await ui.tick({ min: 90, cls: my > opp ? "goal you" : "bad", txt: my > opp ? `🏆 SHOOTOUT WON ${my}-${opp}!` : `💔 Shootout lost ${my}-${opp}.` });
  return { score: `${my}-${opp}`, won: my > opp, dr };
}

/* ============ MATCH ============ */
/* ui hooks: start(info), tick(evt), moment(m, opts)→Promise<idx>, end(res). All optional (quick sim). */
async function playMatch(state, fx, ui) {
  const p = state.player;
  const sel = selectionFor(state, fx);
  const myR = fx.myR !== undefined ? fx.myR : effClubRating(state);
  const oppR = fx.oppR;
  const homeAdv = fx.comp === "nt" || fx.neutral ? 1.2 : (fx.home ? 2.5 : 0);
  const oppAdv = fx.comp === "nt" || fx.neutral ? 1.2 : (fx.home ? 0 : 2.5);

  // player doesn't feature
  if (sel === "injured" || sel === "banned" || sel === "out") {
    const [gf, ga] = simScore(myR + homeAdv, oppR + oppAdv, 0);
    const res = { played: false, sel, gf, ga, fx, rating: 0, goals: 0, assists: 0 };
    if (fx.ko && gf === ga) { res.pensWon = chance(50); res.pens = res.pensWon ? "4-3" : "3-4"; }
    finishTeamResult(state, fx, gf, ga);
    if (sel === "out") { p.morale = clamp(p.morale - 3, 0, 100); p.trust = clamp(p.trust - 0.5, 0, 100); }
    if (sel === "banned") p.bans--;
    state.results.push(describeResult(state, fx, res));
    return res;
  }

  const starting = sel === "start";
  const subOn = !starting && chance(55);
  if (!starting && !subOn) {
    const [gf, ga] = simScore(myR + homeAdv, oppR + oppAdv, 0);
    const res = { played: false, sel: "unused", gf, ga, fx, rating: 0, goals: 0, assists: 0 };
    if (fx.ko && gf === ga) { res.pensWon = chance(50); res.pens = res.pensWon ? "4-3" : "3-4"; }
    finishTeamResult(state, fx, gf, ga);
    p.morale = clamp(p.morale - 2, 0, 100);
    state.results.push(describeResult(state, fx, res));
    return res;
  }
  const mins = starting ? 90 : ri(20, 40);
  const fromMin = 90 - mins;

  // base scoreline
  const d = (myR + homeAdv) - (oppR + oppAdv);
  const lamMy = clamp(1.25 + d * 0.055, 0.12, 3.6);
  const lamOpp = clamp(1.25 - d * 0.055, 0.10, 3.6);
  let gf = poisson(lamMy), ga = poisson(lamOpp);

  // timeline events
  const events = [];
  const oppName = fx.oppName;
  const teamName = fx.comp === "nt" ? natById(p.nat)[1] : state.club.name;
  const info = POS_INFO[p.pos];
  const mates = state.mates || [];
  for (let i = 0; i < gf; i++) {
    const isYou = starting && chance(info.gShare * 42);
    const isAst = !isYou && starting && chance(info.aShare * 42);
    events.push({ min: ri(2, 90), type: "goal", side: "my", you: isYou, ast: isAst, scorer: isYou ? p.name : (mates.length ? pick(mates) : genName(natPool(p.nat))) });
  }
  for (let i = 0; i < ga; i++) events.push({ min: ri(2, 90), type: "goal", side: "opp" });

  // moments — avoid ones you've seen recently so matches stay fresh
  const grp = info.grp;
  const nMoments = !starting ? 1 : grp === "ATT" ? 3 : grp === "MID" ? ri(2, 3) : 2;
  const pool = momentPoolFor(p.pos);
  if (!Array.isArray(state.recentMoments)) state.recentMoments = [];
  const recent = new Set(state.recentMoments);
  let fresh = pool.filter(mm => !recent.has(MOMENTS.indexOf(mm)));
  if (fresh.length < nMoments) fresh = pool;
  const chosen = shuffle(fresh).slice(0, nMoments);
  for (const mm of chosen) {
    state.recentMoments.push(MOMENTS.indexOf(mm));
    while (state.recentMoments.length > 16) state.recentMoments.shift();
  }
  for (const m of chosen) events.push({ min: ri(Math.max(4, fromMin + 2), 88), type: "moment", m });
  // flavor
  const flavor = ["A scrappy midfield battle.", "Corner comes to nothing.", "Big tackle in the middle of the park!", "The crowd lifts the tempo.", "Half-chance flashes wide.", "The managers are screaming instructions.", "A slick passing move breaks down."];
  for (let i = 0; i < 4; i++) events.push({ min: ri(3, 88), type: "flavor", txt: pick(flavor) });
  events.sort((a, b) => a.min - b.min);

  // run
  let curFG = 0, curGA = 0, goals = 0, assists = 0, momDr = 0, card = null;
  if (ui && ui.start) await ui.start({ fx, teamName, oppName, starting, mins });
  for (const ev of events) {
    if (ev.type === "goal") {
      if (ev.side === "my") {
        curFG++;
        if (ev.you) { goals++; }
        else if (ev.ast) { assists++; }
        if (ui && ui.tick) await ui.tick({ min: ev.min, cls: "goal" + (ev.you || ev.ast ? " you" : ""), txt: ev.you ? `⚽ GOOOAL! ${p.name} scores for ${teamName}!` : ev.ast ? `⚽ GOAL ${teamName} — ${ev.scorer} finishes YOUR assist!` : `⚽ Goal for ${teamName} — ${ev.scorer}!`, score: [curFG, curGA] });
      } else {
        curGA++;
        if (ui && ui.tick) await ui.tick({ min: ev.min, cls: "bad", txt: `🥅 ${oppName} score.`, score: [curFG, curGA] });
      }
    } else if (ev.type === "moment") {
      const m = ev.m;
      // inject a trained skill-move option — matched to the SITUATION, never to drama moments
      let opts = m.opts;
      const sk = !m.noSkill && chance(70) ? pickSkillFor(state, m.grp) : null;
      if (sk) opts = m.opts.concat([buildSkillOption(state, sk)]);
      const effM = { txt: m.txt, opts };
      let optIdx;
      const chances = opts.map(o => o.skill ? skillChance(state, o) : momentChance(state, o));
      if (ui && ui.moment) optIdx = await ui.moment(ev.min, effM, chances);
      else { // auto: prefer best expected value
        let best = 0, bestEv = -1;
        opts.forEach((o, i) => {
          const evv = chances[i] / 100 * ((o.ok.g || o.ok.a) ? 1.2 : 0.5) - (1 - chances[i] / 100) * (o.ko.og ? 0.8 : 0.2);
          if (evv > bestEv) { bestEv = evv; best = i; }
        });
        optIdx = best;
      }
      const opt = opts[optIdx];
      const success = chance(chances[optIdx]);
      const out = success ? opt.ok : opt.ko;
      if (opt.skill) skillUseXp(state, opt.skill, success);
      if (out.flair) {
        p.followers += out.flair.foll || 0;
        if (state.fans) state.fans.love = clamp(state.fans.love + (out.flair.love || 0), 0, 100);
      }
      if (out.inj && p.injury === 0) { p.injury = ri(1, out.inj); p.injuryName = "Knock carried in the match"; }
      if (out.g) { curFG++; goals++; }
      if (out.a) { curFG++; assists++; }
      if (out.og) { curGA++; }
      momDr += out.dr || 0;
      if (out.card === "y") { p.yellows++; if (card !== "r") card = card === "y" ? "r" : "y"; if (card === "r") momDr -= 0.5; }
      if (out.card === "r") card = "r";
      if (ui && ui.tick) await ui.tick({ min: ev.min, cls: (out.g || out.a || (out.dr || 0) > 0.3 ? "goal you" : "bad you"), txt: (success ? "✅ " : "❌ ") + out.txt, score: [curFG, curGA] });
    } else if (ev.type === "flavor") {
      if (ui && ui.tick) await ui.tick({ min: ev.min, cls: "", txt: ev.txt, score: [curFG, curGA] });
    }
  }
  gf = curFG; ga = curGA;

  // penalty shootout for drawn knockout ties
  let pens = null, pensWon = null;
  if (fx.ko && gf === ga) {
    const so = await runShootout(state, fx, ui, { pos: p.pos, onPitch: true });
    pens = so.score; pensWon = so.won; momDr += so.dr;
  }

  // rating
  let rating = 6.05 + goals * 1.05 + assists * 0.75 + momDr;
  rating += gf > ga ? 0.2 : gf < ga ? -0.25 : 0;
  if (grp === "DEF" || grp === "GK") rating += ga === 0 ? 0.7 : -0.1 * ga;
  rating += gauss(0, 0.3) + (p.energy < 45 ? -0.35 : 0) + (p.morale > 75 ? 0.1 : p.morale < 40 ? -0.15 : 0);
  if (state.grief && state.grief.weeks > 0) rating -= 0.22 * state.grief.sev; // heavy heart, heavy legs
  if (card === "r") rating -= 1.0;
  rating = clamp(rating, 3, 10);
  rating = Math.round(rating * 10) / 10;

  // consequences
  updateForm(p, rating);
  p.energy = clamp(p.energy - (starting ? 22 : 10), 0, 100);
  p.trust = clamp(p.trust + (rating >= 7.5 ? 3 : rating >= 6.8 ? 1.5 : rating < 5.8 ? -2 : 0), 0, 100);
  p.morale = clamp(p.morale + (gf > ga ? 2 : gf < ga ? -2 : 0) + (rating >= 8 ? 3 : 0), 0, 100);
  const repGain = (rating - 6.4) * (fx.big ? 0.8 : 0.35) * (fx.comp === "nt" ? 1.4 : 1);
  p.rep = clamp(p.rep + Math.max(-0.3, repGain), 0, 100);
  p.followers = Math.max(0, Math.round(p.followers + Math.max(0, (rating - 6) * (50 + p.rep * 40)) + goals * (200 + p.rep * 150)));
  if (card === "r") { p.bans = 2; }
  if (p.yellows >= 5) { p.bans = Math.max(p.bans, 1); p.yellows = 0; }
  matchXp(state, rating, mins);

  // injury roll
  let injMult = 1;
  for (const it of state.items) { const si = SHOP_ITEMS.find(s => s.id === it); if (si && si.fx.injMult) injMult *= si.fx.injMult; }
  if (chance(3.2 * injMult * (p.energy < 40 ? 1.8 : 1) * (p.age > 32 ? 1.5 : 1))) {
    const roll = Math.random();
    const inj = roll < 0.62 ? [ri(1, 2), pick(["Sprained ankle", "Bruised ribs", "Dead leg", "Twisted knee"])]
      : roll < 0.92 ? [ri(3, 6), pick(["Hamstring strain", "Groin strain", "Ankle ligament damage"])]
      : [ri(9, 22), pick(["ACL tear", "Broken metatarsal", "Meniscus injury"])];
    p.injury = inj[0]; p.injuryName = inj[1];
  }

  // stats
  if (!state.academy && fx.comp !== "youth" && !state.ach.debut) {
    unlock(state, "debut");
    if (p.age <= 16) unlock(state, "teen_debut");
  }
  const bucket = statBucket(state, fx.comp);
  bucket.app++; bucket.gls += goals; bucket.ast += assists; bucket.ratSum += rating;
  if (rating >= 8.2) bucket.motm++;
  state.career.apps++; state.career.goals += goals; state.career.assists += assists;
  if (goals >= 4) unlock(state, "poker");
  if (goals >= 3) unlock(state, "hattrick");

  const res = { played: true, sel, starting, mins, gf, ga, goals, assists, rating, card, fx, injured: p.injury > 0 ? p.injuryName : null, pens, pensWon };
  finishTeamResult(state, fx, gf, ga);
  state.results.push(describeResult(state, fx, res));
  if (ui && ui.end) await ui.end(res);
  return res;
}

function statBucket(state, comp) {
  if (!state.stats[comp]) state.stats[comp] = { app: 0, gls: 0, ast: 0, ratSum: 0, motm: 0 };
  return state.stats[comp];
}

/* record result into league table / cup progress */
function finishTeamResult(state, fx, gf, ga) {
  const S = state.season;
  if (fx.comp === "league" && fx.pair) {
    const [h, a] = fx.pair;
    if (fx.home) applyResult(S.table, h, a, gf, ga);
    else applyResult(S.table, h, a, ga, gf);
  } else if (fx.comp === "youth" && fx.pair) {
    const [h, a] = fx.pair;
    if (fx.home) applyResult(S.youth.table, h, a, gf, ga);
    else applyResult(S.youth.table, h, a, ga, gf);
  }
}

function describeResult(state, fx, res) {
  const score = `${res.gf}-${res.ga}` + (res.pens ? ` (${res.pens}p)` : "");
  const out = res.gf > res.ga ? "W" : res.gf < res.ga ? "L" : res.pens ? (res.pensWon ? "W" : "L") : "D";
  return { wk: state.week, season: state.year, comp: fx.compName || fx.comp, opp: fx.oppName, home: fx.home, score, out, rating: res.played ? res.rating : null, goals: res.goals, assists: res.assists, played: res.played, sel: res.sel };
}

/* ============ END OF SEASON WORLD SIM ============ */
function endOfSeasonWorld(state) {
  const news = [];
  const { lg: myLg } = myClub(state);
  // fake standings for every other league; player league uses its real table
  const standings = {};
  for (const l of state.leagues) {
    let done = false;
    if (l.id === myLg.id && state.season && state.season.finalOrderNames) {
      const mapped = state.season.finalOrderNames.map(n => l.teams.find(t => t.n === n)).filter(Boolean);
      if (mapped.length === l.teams.length) { standings[l.id] = mapped; done = true; }
    }
    if (!done) standings[l.id] = l.teams.slice().sort((a, b) => (b.r + gauss(0, 4)) - (a.r + gauss(0, 4)));
  }
  // champions news for big leagues
  for (const id of ["ENG1", "ESP1", "ITA1", "GER1", "FRA1", "ARG1", "BRA1", "USA1"]) {
    const l = findLeague(id);
    if (standings[id] && standings[id][0]) news.push(`🏆 ${standings[id][0].n} win the ${l.name}!`);
  }
  state.lastStandings = {};
  for (const l of state.leagues) state.lastStandings[l.id] = standings[l.id].map(t => t.n);

  // promotion / relegation between adjacent tiers of same country
  for (const country of ["ENG", "ESP", "ITA", "GER", "FRA", "ARG", "BRA"]) {
    const tiers = state.leagues.filter(l => l.cc === country).sort((a, b) => a.tier - b.tier);
    for (let t = 0; t < tiers.length - 1; t++) {
      const top = tiers[t], bot = tiers[t + 1];
      const nDown = Math.min(top.down || 0, bot.up || 0) || Math.min(top.down || 3, 3);
      const relegated = standings[top.id].slice(-nDown);
      const promoted = standings[bot.id].slice(0, nDown);
      top.teams = top.teams.filter(x => !relegated.includes(x)).concat(promoted);
      bot.teams = bot.teams.filter(x => !promoted.includes(x)).concat(relegated);
      promoted.forEach(x => { x.r = clamp(x.r + 2, 45, 92); });
      relegated.forEach(x => { x.r = clamp(x.r - 2, 40, 90); });
    }
  }
  // update player's club league id if moved
  const loc = findClubIn(state.leagues, state.club.name);
  if (loc) state.club.leagueId = loc.league.id;

  // ratings drift
  for (const l of state.leagues) for (const t of l.teams) t.r = clamp(Math.round(t.r + gauss(0, 1.2)), 42, 92);

  // stars age & refresh
  for (const s of state.stars) {
    s.age++;
    if (s.age < 27) s.rating = clamp(s.rating + ri(0, 1), 70, 94);
    else if (s.age > 30) s.rating = clamp(s.rating - ri(1, 2), 70, 94);
    s.gls = 0; s.club = s.club;
  }
  const retiring = state.stars.filter(s => s.age >= 37 || (s.age >= 35 && s.rating < 80));
  for (const s of retiring) {
    news.push(`👋 ${s.name} announces retirement at ${s.age}.`);
    const nat = pick(NATIONS);
    const bigClubs = state.leagues.filter(l => l.tier === 1).flatMap(l => l.teams).filter(t => t.r >= 80);
    const idx = state.stars.indexOf(s);
    state.stars[idx] = { name: genName(nat[4]), pos: pick(POSITIONS.filter(x => x !== "GK")), nat: nat[0], age: ri(19, 22), rating: ri(82, 88), club: bigClubs.length ? pick(bigClubs).n : "Real Madrid", gls: 0 };
  }
  // seasonal star stats for award races
  for (const s of state.stars) {
    const att = ["ST", "W", "CAM"].includes(s.pos);
    s.gls = att ? Math.max(0, Math.round(gauss((s.rating - 70) * 1.6, 6))) : ri(0, 8);
  }
  // continental champions
  if (!state.seasonHonours.cl) {
    const elite = state.leagues.filter(l => l.conf === "eu" && l.tier === 1).flatMap(l => l.teams).filter(t => t.r >= 82);
    if (elite.length) news.push(`⭐ ${pick(elite).n} are crowned Champions League winners.`);
  }
  return news;
}

/* achievements helper (defined here for engine use, surfaced via UI) */
function unlock(state, id) {
  if (state.ach[id]) return;
  state.ach[id] = { season: state.year };
  const a = ACHIEVEMENTS.find(x => x.id === id);
  if (a) state.pendingToasts.push({ title: "🏅 Achievement: " + a.name, body: a.desc });
}
