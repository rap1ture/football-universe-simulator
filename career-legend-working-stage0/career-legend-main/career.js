"use strict";
/* ===== CAREER LOGIC ===== */

function genAcademyOffers(natId, diff) {
  const map = { ENG: "ENG", SCO: "ENG", WAL: "ENG", IRL: "ENG", ESP: "ESP", ITA: "ITA", GER: "GER", AUT: "GER", SUI: "GER", FRA: "FRA", BEL: "FRA", NED: "NED", POR: "POR", ARG: "ARG", URU: "ARG", BRA: "BRA", USA: "USA", CAN: "USA", MEX: "USA" };
  const homeCc = map[natId] || pick(["ENG", "ESP", "ITA", "GER", "FRA", "POR", "NED", "ARG", "BRA", "USA"]);
  const home = ACADEMIES.filter(a => {
    const loc = findClubIn(LEAGUES.map(l => ({ ...l, teams: l.teams.map(t => ({ n: t[0], r: t[1] })) })), a.club);
    return loc && loc.league.cc === homeCc;
  });
  const d = DIFFS[diff];
  let pool = shuffle(ACADEMIES);
  const offers = [];
  if (home.length) offers.push(pick(home));
  while (offers.length < 4) {
    const a = pool.pop();
    if (!a || offers.includes(a)) continue;
    if ((diff === "hard" || diff === "legend") && a.q === 5 && chance(60)) continue;
    offers.push(a);
  }
  if (diff === "easy" && !offers.some(a => a.q === 5)) offers[1] = pick(ACADEMIES.filter(a => a.q === 5));
  // local fallback option
  const lowTier = LEAGUES.filter(l => l.cc === homeCc).sort((a, b) => b.tier - a.tier)[0];
  const localClub = pick(lowTier.teams)[0];
  offers.push({ name: "Hometown Club Academy", club: localClub, q: 2, local: true });
  return offers;
}

/* migrate old saves — additive only, never touches existing progress */
function migrateState(st) {
  if (!st) return st;
  st.settings = Object.assign({ pressConf: true, quickSim: false, speed: 1 }, st.settings || {});
  st.fans = Object.assign({ love: 55, lastPostWk: -1, posts: 0 }, st.fans || {});
  if (!Array.isArray(st.pressSeen)) st.pressSeen = [];
  if (typeof st.pressCount !== "number") st.pressCount = 0;
  if (!st.skills || typeof st.skills !== "object") st.skills = {};
  if (st.skillFocus === undefined) st.skillFocus = null;
  if (typeof st.skillUses !== "number") st.skillUses = 0;
  if (st.trainingFocus === "skill" && !skillById(st.skillFocus)) st.trainingFocus = "balanced";
  if (!Array.isArray(st.brandDeals)) st.brandDeals = [];
  if (!Array.isArray(st.brandOffers)) st.brandOffers = [];
  if (typeof st.brandSignedCount !== "number") st.brandSignedCount = 0;
  if (!Array.isArray(st.inbox)) st.inbox = [];
  if (!Array.isArray(st.fanbox)) st.fanbox = [];
  if (!Array.isArray(st.dmSeen)) st.dmSeen = [];
  if (!Array.isArray(st.fanSeen)) st.fanSeen = [];
  if (typeof st.dmReplies !== "number") st.dmReplies = 0;
  if (st.fanLikedWk === undefined) st.fanLikedWk = -1;
  if (st.grief === undefined) st.grief = null;
  if (!Array.isArray(st.badSeen)) st.badSeen = [];
  if (typeof st.badCount !== "number") st.badCount = 0;
  if (st.settings && st.settings.badEvents === undefined) st.settings.badEvents = true;
  if (st.season && !st.season.badWeeks) st.season.badWeeks = [ri(Math.max(6, st.week + 1), 44)];
  if (!Array.isArray(st.recentMoments)) st.recentMoments = [];
  st.ver = 7;
  return st;
}

function newCareer(cfg) {
  const leagues = LEAGUES.map(l => ({ ...l, teams: l.teams.map(t => ({ n: t[0], r: t[1] })) }));
  const acad = cfg.academy;
  const loc = findClubIn(leagues, acad.club);
  const state = {
    ver: 1, diff: cfg.diff, year: 2026, week: 1,
    player: createPlayer(cfg),
    academy: { name: acad.name, club: acad.club, q: acad.q },
    club: { name: acad.club, leagueId: loc.league.id },
    contract: null, loan: null,
    trainingFocus: "balanced",
    leagues, stars: STARS_SEED.map(s => ({ name: s[0], pos: s[1], nat: s[2], age: s[3], rating: s[4], club: s[5], gls: 0 })),
    season: null, results: [], stats: {},
    career: { apps: 0, goals: 0, assists: 0, seasons: [], trophies: [], awards: [], caps: 0, capGoals: 0, youthCaps: 0, transfers: [], clubs: [acad.club], countries: [loc.league.cc], feesTotal: 0, peakOvr: 0, peakValue: 0, ballons: 0 },
    money: 500, items: [], sponsor: null, agent: "cousin",
    ach: {}, pendingToasts: [], news: [], weekDelta: {},
    contQual: null, seasonHonours: {}, lastStandings: {},
    valueHistory: [], ovrHistory: [],
    offers: [], pendingDecisions: [],
    retired: false, legacyBonus: 0, ntTournament: null,
    mates: [],
    settings: { pressConf: true, quickSim: false, speed: 1, badEvents: true },
    fans: { love: 55, lastPostWk: -1, posts: 0 },
    pressSeen: [], pressCount: 0,
    skills: {}, skillFocus: null, skillUses: 0,
    brandDeals: [], brandOffers: [], brandSignedCount: 0,
    inbox: [], fanbox: [], dmSeen: [], fanSeen: [], dmReplies: 0, fanLikedWk: -1,
    grief: null, badSeen: [], badCount: 0,
    recentMoments: [],
  };
  regenMates(state);
  buildSeason(state);
  addNews(state, `🌱 Welcome to ${acad.name}! Your journey starts here, aged 14.`, "grn");
  return state;
}

function regenMates(state) {
  const loc = findClubIn(state.leagues, state.club.name);
  const pool = loc ? findLeague(loc.league.id).np : "english";
  state.mates = [];
  for (let i = 0; i < 14; i++) state.mates.push(genName(chance(70) ? pool : pick(Object.keys(POOLS))));
}

function addNews(state, txt, cls = "") {
  state.news.unshift({ wk: state.week, year: state.year, txt, cls });
  if (state.news.length > 70) state.news.pop();
}
function addTrophy(state, name, ico, comp) {
  state.career.trophies.push({ name, ico, season: seasonLabel(state.year), comp });
  unlock(state, "first_trophy");
  state.pendingToasts.push({ title: ico + " TROPHY WON!", body: name + " — " + seasonLabel(state.year), gold: true });
}
function addAward(state, name, ico) {
  state.career.awards.push({ name, ico, season: seasonLabel(state.year) });
  state.pendingToasts.push({ title: ico + " " + name, body: seasonLabel(state.year), gold: true });
}

/* ---------- weekly fixtures ---------- */
function fixturesForWeek(state, wk) {
  const S = state.season, out = [];
  const { lg } = myClub(state);
  if (!S) return out;
  if (state.academy && S.youth) {
    const yr = S.youth.weekRounds[wk];
    if (yr !== undefined) {
      const round = S.youth.rounds[yr];
      for (const [h, a] of round) {
        if (h === 0 || a === 0) {
          const oppIdx = h === 0 ? a : h;
          out.push({ comp: "youth", compName: "U18 League", pair: [h, a], home: h === 0, oppName: S.youth.teams[oppIdx].n, oppR: S.youth.teams[oppIdx].r, myR: S.youth.teams[0].r });
        } else {
          const [gh, ga] = simScore(S.youth.teams[h].r, S.youth.teams[a].r);
          applyResult(S.youth.table, h, a, gh, ga);
        }
      }
    }
    // youth cup
    if (S.youth.cupAlive && [38, 40, 42].includes(wk)) {
      const stage = ["Quarter-Final", "Semi-Final", "FINAL"][[38, 40, 42].indexOf(wk)];
      const opp = pick(S.youth.teams.slice(1));
      out.push({ comp: "youth", compName: "Youth Cup " + stage, oppName: opp.n, oppR: opp.r + 2, myR: S.youth.teams[0].r, home: chance(50), cupStage: stage, youthCup: true, ko: true });
    }
    return out;
  }
  // league round(s)
  const rounds = S.weekRounds[wk] || [];
  for (const rIdx of rounds) {
    const pair = processLeagueRound(state, rIdx);
    if (pair) {
      const home = pair[0] === S.myIdx;
      const oppIdx = home ? pair[1] : pair[0];
      const opp = lg.teams[oppIdx];
      out.push({ comp: "league", compName: lg.name, pair, home, oppName: opp.n, oppR: opp.r, big: opp.r >= 84 });
    }
  }
  // domestic cups
  for (const key of ["cup", "cup2"]) {
    const C = S[key];
    if (C && C.alive && C.stage === undefined) C.stage = C.next;
    if (C && C.alive && C.weeks[C.stage] === wk) {
      const opp = cupOpponent(state, C.stage);
      out.push({ comp: key, compName: C.name + " " + C.stages[C.stage], oppName: opp.n, oppR: opp.r, home: chance(50), cupKey: key, big: C.stage >= 4, ko: true });
    }
  }
  // continental
  const K = S.cont;
  if (K && K.alive) {
    const li = K.lpWeeks.indexOf(wk);
    const compNames = { UCL: "Champions League", UEL: "Europa League", UECL: "Conference League", LIB: "Copa Libertadores", SUD: "Copa Sudamericana" };
    if (li >= 0) {
      const opp = lg.conf === "eu" ? pick(euroPool(state, K.comp)) : pick(saPool(state, K.comp));
      out.push({ comp: "cont", compName: compNames[K.comp] + (K.phase === "lp" ? " League Phase" : " Group"), oppName: opp.n, oppR: opp.r, home: li % 2 === 0, contLP: true, big: opp.r >= 84 });
    } else {
      for (const [stage, w] of Object.entries(K.koWeeks)) {
        if (w !== wk) continue;
        // qualification gates
        if (stage === "PO") {
          if (lg.conf !== "eu") continue;
          if (K.pts >= 16) continue;             // straight to R16
          if (K.pts < 9) { K.alive = false; addNews(state, `❌ ${state.club.name} eliminated from the ${compNames[K.comp]} league phase.`, "red"); continue; }
        }
        if (stage === "R16" && lg.conf === "eu" && K.pts < 9 && !K.wonPO) continue;
        if (stage === "R16" && lg.conf === "sa" && K.pts < 9) { K.alive = false; addNews(state, `❌ ${state.club.name} out of the ${compNames[K.comp]} group stage.`, "red"); continue; }
        if (K.reached !== stage && K.reachedNext !== stage && stage !== "PO" && stage !== "R16" && K.koProgress !== stage) continue;
        const stageNames = { PO: "Knockout Play-off", R16: "Round of 16", QF: "Quarter-Final", SF: "Semi-Final", F: "FINAL" };
        const pool = lg.conf === "eu" ? euroPool(state, K.comp) : saPool(state, K.comp);
        const strong = pool.filter(t => t.r >= (stage === "F" ? 80 : stage === "SF" ? 77 : 70));
        const opp = pick(strong.length ? strong : pool);
        out.push({ comp: "cont", compName: compNames[K.comp] + " " + stageNames[stage], oppName: opp.n, oppR: opp.r, home: stage === "F" ? false : chance(50), neutral: stage === "F", koStage: stage, big: true, ko: true });
        break;
      }
    }
  }
  // MLS playoffs
  if (S.mls && [44, 45, 46].includes(wk)) {
    if (wk === 44) S.mls.alive = tablePos(S.table, S.myIdx) <= (lg.playoffTop || 8);
    if (S.mls.alive) {
      const stage = { 44: "Round One", 45: "Conference Final", 46: "MLS CUP FINAL" }[wk];
      const others = tableSorted(S.table).slice(0, 8).filter(r => r.i !== S.myIdx);
      const opp = lg.teams[pick(others).i];
      out.push({ comp: "playoff", compName: "MLS Playoffs — " + stage, oppName: opp.n, oppR: opp.r + 1, home: chance(50), mlsStage: wk, big: wk === 46, ko: true });
    }
  }
  // promotion playoffs
  if (S.playoff && [44, 45].includes(wk)) {
    if (wk === 44) {
      const pos = tablePos(S.table, S.myIdx);
      S.playoff.active = pos >= lg.playoff[0] && pos <= lg.playoff[1] && pos > (lg.up ? lg.up - 1 : 2);
    }
    if (S.playoff.active) {
      const stage = wk === 44 ? "Semi-Final" : "FINAL";
      const cands = tableSorted(S.table).slice(lg.playoff[0] - 1, lg.playoff[1]).filter(r => r.i !== S.myIdx);
      const opp = lg.teams[(cands.length ? pick(cands) : pick(S.table)).i];
      out.push({ comp: "playoff", compName: "Promotion Playoff " + stage, oppName: opp.n, oppR: opp.r + 1, home: wk === 44 ? chance(50) : false, neutral: wk === 45, promoStage: wk, big: true, ko: true });
    }
  }
  return out;
}

/* handle post-match cup/continental progression */
function afterMatch(state, fx, res) {
  const S = state.season;
  const won = res.gf > res.ga || (res.gf === res.ga && !!res.pensWon); // draws in knockouts → real shootout result
  const pens = !!res.pens;
  if (fx.cupKey) {
    const C = S[fx.cupKey];
    if (won) {
      if (C.stage === 5) {
        addTrophy(state, C.name, "🏆", "cup");
        unlock(state, "cup_win");
        state.seasonHonours[fx.cupKey] = true;
        addNews(state, `🏆 ${state.club.name} WIN the ${C.name}${pens ? " on penalties" : ""}!`, "gold");
        C.alive = false;
      } else {
        addNews(state, `✅ Through to the ${C.stages[C.stage + 1]} of the ${C.name}${pens ? " (pens)" : ""}.`, "grn");
        C.stage++;
      }
      state.money += 2000 * (C.stage + 1);
    } else {
      C.alive = false;
      addNews(state, `❌ Knocked out of the ${C.name} at the ${C.stages[C.stage]} stage.`, "red");
    }
  }
  if (fx.contLP) {
    const K = S.cont;
    K.played++;
    K.pts += res.gf > res.ga ? 3 : res.gf === res.ga ? 1 : 0;
    if (K.played >= K.lpWeeks.length) {
      addNews(state, `🌍 ${K.comp === "LIB" || K.comp === "SUD" ? "Group" : "League"} phase complete: ${K.pts} pts.`, "blu");
    }
  }
  if (fx.koStage) {
    const K = S.cont;
    const order = ["PO", "R16", "QF", "SF", "F"];
    if (won) {
      if (fx.koStage === "PO") K.wonPO = true;
      if (fx.koStage === "F") {
        const names = { UCL: "Champions League", UEL: "Europa League", UECL: "Conference League", LIB: "Copa Libertadores", SUD: "Copa Sudamericana" };
        addTrophy(state, names[K.comp], "⭐", "cont");
        if (K.comp === "UCL") { unlock(state, "cl_win"); state.seasonHonours.cl = true; }
        if (K.comp === "LIB") { unlock(state, "lib_win"); state.seasonHonours.lib = true; }
        state.seasonHonours.cont = K.comp;
        addNews(state, `⭐ ${state.club.name} are ${names[K.comp]} CHAMPIONS${pens ? " after a penalty shootout" : ""}!`, "gold");
        K.alive = false;
        state.money += 50000;
      } else {
        K.koProgress = order[order.indexOf(fx.koStage) + 1];
        addNews(state, `✅ ${state.club.name} advance in Europe${pens ? " on penalties" : ""}!`, "grn");
      }
    } else {
      K.alive = false;
      addNews(state, `❌ Continental run ends at the ${fx.koStage === "F" ? "final" : fx.koStage}. Heartbreak.`, "red");
    }
  }
  if (fx.youthCup) {
    const Y = S.youth;
    if (won) {
      if (fx.cupStage === "FINAL") { addTrophy(state, "Youth Cup", "🏆", "youth"); Y.cupAlive = false; }
    } else Y.cupAlive = false;
  }
  if (fx.mlsStage) {
    if (!won) S.mls.alive = false;
    else if (fx.mlsStage === 46) {
      addTrophy(state, "MLS Cup", "🏆", "league");
      unlock(state, "mls_cup");
      state.seasonHonours.mlsCup = true;
      addNews(state, `🏆 ${state.club.name} WIN THE MLS CUP!`, "gold");
    }
  }
  if (fx.promoStage) {
    if (!won) { S.playoff.active = false; addNews(state, `❌ Promotion playoff dream dies${fx.promoStage === 45 ? " in the final" : ""}.`, "red"); }
    else if (fx.promoStage === 45) {
      S.playoff.won = true;
      addTrophy(state, "Playoff Final Winner", "🪜", "playoff");
      addNews(state, `🎉 ${state.club.name} WIN THE PLAYOFF FINAL — PROMOTED!`, "gold");
    }
  }
}

/* ---------- national team ---------- */
function ntEligibility(state) {
  const p = state.player;
  const nat = natById(p.nat);
  const natR = nat[2];
  if (p.age >= 16 && p.ovr >= natR - 9 - p.rep / 25) return "senior";
  if (p.age >= 17 && p.age <= 20 && p.ovr >= natR - 22) return "U20";
  if (p.age >= 15 && p.age <= 16 && p.ovr >= natR - 30) return "U17";
  return null;
}
async function ntBreak(state, ui) {
  const p = state.player;
  const level = ntEligibility(state);
  if (!level || p.injury > 0) return;
  const nat = natById(p.nat);
  if (!state.career.firstCall) {
    state.career.firstCall = level;
    state.pendingToasts.push({ title: "📞 International call-up!", body: `${nat[1]} ${level === "senior" ? "" : level + " "}squad — first call-up!`, gold: true });
    addNews(state, `📞 First ${level} call-up for ${nat[1]}!`, "gold");
  }
  const myR = level === "senior" ? nat[2] : nat[2] - (level === "U20" ? 4 : 7);
  for (let i = 0; i < 2; i++) {
    const opp = pick(NATIONS.filter(n => n[0] !== p.nat && Math.abs(n[2] - nat[2]) < 14));
    const fx = { comp: "nt", compName: level === "senior" ? "International" : level + " International", oppName: opp[1] + (level === "senior" ? "" : " " + level), oppR: level === "senior" ? opp[2] : opp[2] - (level === "U20" ? 4 : 7), myR, home: chance(50), nt: true };
    const res = await playMatch(state, fx, ui);
    if (res.played) {
      if (level === "senior") { state.career.caps++; state.career.capGoals += res.goals; }
      else state.career.youthCaps++;
    }
  }
  if (state.career.caps >= 100) unlock(state, "caps100");
  else if (state.career.caps >= 50) unlock(state, "caps50");
}

/* ---------- summer tournaments ---------- */
function tournamentThisSummer(state) {
  const y = state.year + 1; // calendar year of the summer
  const p = state.player;
  const nat = natById(p.nat);
  const level = ntEligibility(state);
  if (!level) return null;
  if (level === "senior") {
    if (y >= 2030 && (y - 2030) % 4 === 0) return { name: "FIFA World Cup", ico: "🌏", level, key: "wc" };
    if ((y - 2028) % 4 === 0) return { name: CONFED_CUPS[nat[3]], ico: "🏆", level, key: "cont" };
    return null;
  }
  if (level === "U20" && y % 2 === 1) return { name: "U20 World Cup", ico: "🌍", level, key: "u20" };
  if (level === "U17") return { name: "U17 World Cup", ico: "🌍", level, key: "u17" };
  return null;
}
async function tournamentStep(state, ui, wk) {
  const T = state.ntTournament;
  if (!T || T.out) return;
  const p = state.player;
  const nat = natById(p.nat);
  const lvlAdj = T.level === "senior" ? 0 : T.level === "U20" ? -4 : -7;
  const myR = nat[2] + lvlAdj;
  // continental cups (Asian Cup, Euros, Copa América, AFCON, Gold Cup) only feature YOUR confederation
  const oppPool = () => {
    let pool = NATIONS.filter(n => n[0] !== p.nat);
    if (T.key === "cont") pool = pool.filter(n => n[3] === nat[3]);
    return pool;
  };
  const STAGE_ORDER = ["Group Stage — Match 1", "Group Stage — Match 2", "Group Stage — Match 3", "Round of 16", "Quarter-Final", "Semi-Final", "FINAL"];
  const games = wk === 44 ? [["Group Stage — Match 1", 0], ["Group Stage — Match 2", 0], ["Group Stage — Match 3", 0]]
    : wk === 45 ? [["Round of 16", 1], ["Quarter-Final", 2]]
    : [["Semi-Final", 3], ["FINAL", 4]];
  T.stageIdx = T.stageIdx || 0;
  for (const [stage, hard] of games) {
    if (T.out) break;
    // hard guard: stages can only ever be played in bracket order, exactly once
    const ord = STAGE_ORDER.indexOf(stage);
    if (ord < T.stageIdx) continue;
    T.stageIdx = ord + 1;
    const min = nat[2] - 16 + hard * 4;
    const cands = oppPool().filter(n => n[2] >= min);
    const opp = pick(cands.length ? cands : oppPool());
    const isKO = !stage.includes("Group");
    const fx = { comp: "nt", compName: T.name + " " + stage, oppName: opp[1] + (T.level === "senior" ? "" : " " + T.level), oppR: opp[2] + lvlAdj, myR, neutral: true, big: hard >= 2, nt: true, ko: isKO };
    const res = await playMatch(state, fx, ui);
    if (res.played && T.level === "senior") { state.career.caps++; state.career.capGoals += res.goals; }
    else if (res.played) state.career.youthCaps++;
    const won = res.gf > res.ga || (res.gf === res.ga && (stage.includes("Group") ? false : !!res.pensWon));
    if (stage.includes("Group")) {
      T.pts = (T.pts || 0) + (res.gf > res.ga ? 3 : res.gf === res.ga ? 1 : 0);
    } else if (!won) {
      T.out = true;
      addNews(state, `❌ ${nat[1]} eliminated from the ${T.name} (${stage}).`, "red");
    } else if (stage === "FINAL") {
      T.out = true; T.won = true;
      addTrophy(state, T.name, T.ico, "nation");
      if (T.key === "wc") { unlock(state, "wc_win"); state.seasonHonours.wc = true; }
      if (T.key === "cont") { unlock(state, "continental"); state.seasonHonours.contNat = true; }
      addNews(state, `${T.ico} ${nat[1]} WIN THE ${T.name.toUpperCase()}!!! Immortality.`, "gold");
    }
  }
  if (wk === 44 && (T.pts || 0) < 4) {
    T.out = true;
    addNews(state, `❌ ${nat[1]} crash out of the ${T.name} group stage.`, "red");
  }
}

/* ---------- transfers & contracts ---------- */
function offerRole(teamR, ovr) {
  if (ovr >= teamR + 2) return "star";
  if (ovr >= teamR - 3) return "first";
  if (ovr >= teamR - 8) return "rotation";
  return "prospect";
}
function generateOffers(state, kind) {
  const p = state.player;
  const d = DIFFS[state.diff];
  const agent = AGENTS.find(a => a.id === state.agent);
  const value = marketValue(state);
  const nOffers = clamp(Math.round((1 + p.rep / 25) * d.offer * agent.quality + rf(-0.5, 1.5)), kind === "forced" ? 1 : 0, 6);
  const offers = [];
  const reachUp = p.age <= 21 ? 11 : 7;
  const cands = [];
  for (const l of state.leagues) {
    for (const t of l.teams) {
      if (t.n === state.club.name) continue;
      if (t.r >= p.ovr - 5 && t.r <= p.ovr + reachUp) cands.push({ t, l });
    }
  }
  if (!cands.length) {
    if (kind !== "forced") return offers;
    // nobody in range — the world's minnows will still take a legend (or a relic)
    for (const l of state.leagues) for (const t of l.teams) { if (t.n !== state.club.name) cands.push({ t, l }); }
    cands.sort((a, b) => a.t.r - b.t.r);
    cands.splice(12);
  }
  for (let i = 0; i < nOffers; i++) {
    const c = pick(cands);
    if (offers.some(o => o.club === c.t.n)) continue;
    const fee = state.academy ? 0 : Math.round(value * rf(0.85, 1.35));
    offers.push({
      club: c.t.n, clubR: c.t.r, leagueId: c.l.id, leagueName: c.l.name, country: c.l.country,
      fee, wage: Math.round(fairWage(state) * rf(0.9, 1.3) * (c.t.r > p.ovr ? 1.15 : 1)),
      years: ri(2, 5), role: offerRole(c.t.r, p.ovr), kind: kind || "transfer",
    });
  }
  // loan offers for benched youngsters at big clubs
  const { lg: loanLg } = myClub(state);
  if (p.age <= 21 && !state.academy && !state.loan && loanLg && state.season) {
    const lg = loanLg;
    const mine = lg.teams[state.season.myIdx];
    const teamR = mine ? mine.r : 70;
    if (teamR - p.ovr > 4) {
      const loanCands = cands.filter(c => c.t.r <= p.ovr + 5);
      if (loanCands.length) {
        const c = pick(loanCands);
        offers.push({ club: c.t.n, clubR: c.t.r, leagueId: c.l.id, leagueName: c.l.name, country: c.l.country, fee: 0, wage: state.contract ? state.contract.wage : 800, years: 1, role: "first", kind: "loan" });
      }
    }
  }
  return offers;
}

function acceptOffer(state, offer) {
  const p = state.player;
  const agent = AGENTS.find(a => a.id === state.agent);
  if (offer.kind === "loan") {
    state.loan = { parent: state.club.name, parentLeagueId: state.club.leagueId, until: state.year + 1, contract: state.contract };
    state.club = { name: offer.club, leagueId: offer.leagueId };
    state.contract = { wage: offer.wage, until: state.year + 1, role: offer.role, loan: true };
    addNews(state, `🤝 Loan move! You join ${offer.club} until the end of the season.`, "blu");
  } else {
    if (offer.fee > 0) {
      state.career.feesTotal += offer.fee;
      if (offer.fee >= 100e6) unlock(state, "transfer100");
      addNews(state, `✍️ ${offer.club} sign you for ${fmtM(offer.fee)}!`, "gold");
    } else {
      addNews(state, `✍️ You sign for ${offer.club}!`, "gold");
    }
    state.loan = null;
    state.academy = null;
    state.club = { name: offer.club, leagueId: offer.leagueId };
    state.contract = { wage: offer.wage, until: state.year + offer.years, role: offer.role };
    state.money += offer.wage * 4; // signing bonus
    state.career.transfers.push({ season: seasonLabel(state.year), club: offer.club, fee: offer.fee });
    if (!state.career.clubs.includes(offer.club)) state.career.clubs.push(offer.club);
    const cc = findLeague(offer.leagueId).cc;
    if (!state.career.countries.includes(cc)) state.career.countries.push(cc);
    if (state.career.countries.length >= 3) unlock(state, "countries3");
  }
  p.trust = 45;
  p.rep = clamp(p.rep + (offer.clubR >= 80 ? 4 : 1), 0, 100);
  regenMates(state);
  // mid-season: rebuild season (cup-tied elsewhere)
  if (state.week > 1 && state.week < 44) rebuildSeasonMid(state);
  else buildSeason(state);
  state.offers = [];
}

function rebuildSeasonMid(state) {
  const wk = state.week;
  buildSeason(state);
  const S = state.season;
  // simulate already-played rounds without the player
  for (let w = 5; w < wk; w++) {
    const rounds = S.weekRounds[w] || [];
    for (const rIdx of rounds) {
      const pair = processLeagueRound(state, rIdx);
      if (pair) {
        const { lg } = myClub(state);
        const [gh, ga] = simScore(lg.teams[pair[0]].r, lg.teams[pair[1]].r);
        applyResult(S.table, pair[0], pair[1], gh, ga);
      }
    }
    if (S.weekRounds[w]) delete S.weekRounds[w];
  }
  // cup-tied
  if (S.cup && wk > S.cup.weeks[S.cup.next]) S.cup.alive = false;
  if (S.cup2 && wk > S.cup2.weeks[0]) S.cup2.alive = false;
  if (S.cont) S.cont.alive = false;
}

/* ---------- weekly loop ---------- */
async function advanceWeek(state, ui) {
  if (state.retired) return;
  const p = state.player;
  state.weekDelta = {};
  const wk = state.week;

  // grief ticks down
  griefWeekly(state);

  // bad life events (1-2 per season, toggle in Settings)
  if (state.settings.badEvents !== false && state.season && (state.season.badWeeks || []).includes(wk)) {
    const ev = fireBadEvent(state);
    let choiceIdx = 1;
    if (ui && ui.badEvent) choiceIdx = await ui.badEvent(ev);
    const note = applyBadEvent(state, ev, choiceIdx);
    if (ui && ui.badEventNote) await ui.badEventNote(ev, note);
  }

  // injury recovery
  if (p.injury > 0) {
    p.injury--;
    p.energy = clamp(p.energy + 12, 0, 100);
    if (p.injury === 0) { addNews(state, `💪 Back in full training after ${p.injuryName}.`, "grn"); p.injuryName = null; p.form = Math.max(5.5, p.form - 0.4); }
  } else {
    trainWeek(state);
  }

  // passive item/sponsor/wage effects
  let injF = 0;
  for (const it of state.items) {
    const si = SHOP_ITEMS.find(s => s.id === it);
    if (!si) continue;
    if (si.fx.moraleWk) p.morale = clamp(p.morale + si.fx.moraleWk, 0, 100);
    if (si.fx.energyWk) p.energy = clamp(p.energy + si.fx.energyWk, 0, 100);
    if (si.fx.folWk) p.followers += si.fx.folWk;
  }
  const agent = AGENTS.find(a => a.id === state.agent);
  if (state.contract) state.money += Math.round(state.contract.wage * (1 - agent.cut / 100));
  else if (state.academy) state.money += 120 + state.academy.q * 40;
  brandsWeekly(state);
  dmsWeekly(state);
  if (state.sponsor) {
    const sp = SPONSORS.find(s => s.id === state.sponsor);
    const loveMult = state.fans ? 1 + (state.fans.love - 50) / 250 : 1; // beloved players earn more
    const mult = (state.agent === "elite" ? 1.5 : 1) * loveMult;
    state.money += Math.round(sp.weekly * mult);
    p.followers += sp.folWk;
  }

  // fixtures
  const trophiesBefore = state.career.trophies.length;
  let lastRes = null, lastFx = null;
  const fixtures = fixturesForWeek(state, wk);
  for (const fx of fixtures) {
    if (state.retired) return;
    const res = await playMatch(state, fx, ui);
    afterMatch(state, fx, res);
    if (res.played) { lastRes = res; lastFx = fx; }
  }

  // international break
  if (NT_WEEKS.includes(wk) && !state.academy) await ntBreak(state, ui);
  if (NT_WEEKS.includes(wk) && state.academy && ntEligibility(state)) await ntBreak(state, ui);

  // summer tournament
  if (wk === 43) state.ntTournament = tournamentThisSummer(state);
  if ([44, 45, 46].includes(wk) && state.ntTournament) await tournamentStep(state, ui, wk);

  // post-match press conference (toggle in Settings)
  if (state.settings && state.settings.pressConf !== false && lastRes && !state.retired) {
    const pcChance = (lastFx.big ? 60 : 20) + state.player.rep / 5 + (lastRes.goals >= 3 || lastRes.card === "r" ? 30 : 0);
    if (chance(Math.min(80, pcChance))) {
      const ctx = {
        played: true, rating: lastRes.rating, goals: lastRes.goals, assists: lastRes.assists,
        hattrick: lastRes.goals >= 3, red: lastRes.card === "r",
        bigwin: lastFx.big && lastRes.gf > lastRes.ga, loss: lastRes.gf < lastRes.ga,
        cleansheet: lastRes.ga === 0 && ["GK", "DEF"].includes(POS_INFO[state.player.pos].grp),
        injured: !!lastRes.injured, nt: lastFx.comp === "nt",
        trophy: state.career.trophies.length > trophiesBefore,
      };
      const pc = genPressConf(state, ctx);
      let toneIdx;
      if (ui && ui.pressConf) toneIdx = await ui.pressConf(pc);
      else toneIdx = ri(0, 2);
      const outcome = applyPressAnswer(state, pc, toneIdx);
      if (ui && ui.pressOutcome) await ui.pressOutcome(outcome);
      addNews(state, `🎙️ Presser: ${outcome}`, "");
    }
  }

  // fans weekly: love drift, results, shirt money, perks
  if (state.fans) {
    const F = state.fans;
    F.love = clamp(F.love + (50 - F.love) * 0.006, 0, 100); // slow drift to neutral
    if (lastRes) {
      F.love = clamp(F.love + (lastRes.gf > lastRes.ga ? 0.6 : lastRes.gf < lastRes.ga ? -0.8 : 0)
        + lastRes.goals * 0.8 + lastRes.assists * 0.4 + (lastRes.card === "r" ? -2 : 0), 0, 100);
    }
    if (state.contract && !state.academy) state.money += Math.round(F.love * p.rep * 1.6); // shirt sales cut
    if (F.love >= 80) p.morale = clamp(p.morale + 1, 0, 100);
    if (F.love <= 20) p.morale = clamp(p.morale - 1, 0, 100);
  }

  // winter window
  if (wk === 24 && !state.academy) {
    state.offers = generateOffers(state, "transfer");
    if (state.offers.length) addNews(state, `📋 The January window opens — ${state.offers.length} offer(s) on the table. Check the Transfers tab.`, "blu");
  }
  if (wk === 28) state.offers = [];

  // sponsor upgrades
  const nextSp = SPONSORS.filter(s => p.rep >= s.rep && s.id !== state.sponsor).pop();
  if (nextSp && (!state.sponsor || SPONSORS.findIndex(s => s.id === state.sponsor) < SPONSORS.findIndex(s => s.id === nextSp.id)) && chance(18)) {
    state.pendingSponsor = nextSp.id;
    addNews(state, `${nextSp.ico} Sponsorship offer from ${nextSp.name}! (${fmtM(nextSp.weekly)}/wk + ${fmtM(nextSp.bonus)} signing bonus) — accept in the Life tab.`, "gold");
  }

  // random life event
  if (chance(20) && ui && ui.lifeEvent) {
    const pool = LIFE_EVENTS.filter(e => !e.cond || (e.cond === "pro" && state.contract) || (e.cond === "abroad" && state.career.countries.length > 1));
    const ev = pick(pool);
    const choiceIdx = await ui.lifeEvent(ev);
    const opt = ev.opts[choiceIdx];
    applyEventFx(state, opt);
    addNews(state, `💬 ${opt.r}`, "");
  }

  // milestone achievements
  if (state.money >= 10e6) unlock(state, "rich10");
  if (p.followers >= 100e6) unlock(state, "fame100");
  else if (p.followers >= 10e6) unlock(state, "fame10");
  if (state.career.goals >= 500) unlock(state, "goals500");
  else if (state.career.goals >= 300) unlock(state, "goals300");
  else if (state.career.goals >= 100) unlock(state, "goals100");
  if (state.career.apps >= 600) unlock(state, "apps600");
  if (state.career.goals >= 1 && !state.ach.first_goal) unlock(state, "first_goal");
  if (state.career.assists >= 1 && !state.ach.first_assist) unlock(state, "first_assist");
  if (legacyScore(state) >= 100) unlock(state, "goat");

  // tracking
  p.morale = clamp(p.morale - 0.2, 0, 100);
  state.career.peakOvr = Math.max(state.career.peakOvr, p.ovr);
  state.career.peakValue = Math.max(state.career.peakValue, marketValue(state));
  if (wk % 4 === 0) {
    state.valueHistory.push(marketValue(state));
    state.ovrHistory.push(p.ovr);
    if (state.valueHistory.length > 200) { state.valueHistory.shift(); state.ovrHistory.shift(); }
  }

  state.week++;
  if (state.week > 48) await rollover(state, ui);
}

function applyEventFx(state, opt) {
  const p = state.player;
  const fx = opt.fx || {};
  if (fx.morale) p.morale = clamp(p.morale + fx.morale, 0, 100);
  if (fx.energy) p.energy = clamp(p.energy + fx.energy, 0, 100);
  if (fx.rep) p.rep = clamp(p.rep + fx.rep, 0, 100);
  if (fx.trust) p.trust = clamp(p.trust + fx.trust, 0, 100);
  if (fx.followers) { p.followers += fx.followers; if (state.fans) state.fans.love = clamp(state.fans.love + 0.5, 0, 100); }
  if (fx.love && state.fans) state.fans.love = clamp(state.fans.love + fx.love, 0, 100);
  if (fx.money) state.money += fx.money;
  if (fx.moneyPct) {
    const stake = Math.round(state.money * 0.25);
    const won = chance(45);
    state.money += won ? stake : -stake;
    addNews(state, won ? `🃏 Bus poker: you WON ${fmtM(stake)}. The lads want a rematch.` : `🃏 Bus poker: you lost ${fmtM(stake)}. Never again. (Until next time.)`, won ? "grn" : "red");
  }
  if (fx.xp) gainAttr(state, fx.xp, 1.2 * DIFFS[state.diff].growth);
  if (fx.xpHalf) gainAttr(state, fx.xpHalf, 0.6 * DIFFS[state.diff].growth);
}

/* ---------- awards & legacy ---------- */
function computeAwards(state) {
  const p = state.player;
  const { lg } = myClub(state);
  const out = [];
  const L = state.stats.league || { app: 0, gls: 0, ast: 0, ratSum: 0 };
  const avg = L.app ? L.ratSum / L.app : 0;
  const H = state.seasonHonours;

  // league top scorer
  if (!state.academy && L.app >= 10) {
    const rivalGoals = Math.max(8, Math.round(gauss(lg.tier === 1 ? 24 : 20, 4)));
    if (L.gls > rivalGoals) {
      addAward(state, lg.name + " Top Scorer (" + L.gls + " goals)", "👑");
      unlock(state, "top_scorer");
      out.push("👑 League Top Scorer — " + L.gls + " goals");
    }
    if (avg >= 7.55 && L.app >= 20) {
      addAward(state, lg.name + " Player of the Season", "🌟");
      unlock(state, "poty");
      out.push("🌟 League Player of the Season");
    }
  }
  if (L.gls >= 30) unlock(state, "season30");

  // Ballon d'Or (senior, pro only)
  if (!state.academy && p.age >= 17) {
    let myScore = p.ovr + (L.gls + L.ast) * 0.10 + (avg - 6.8) * 4 + p.rep / 15;
    myScore += (H.cl ? 8 : 0) + (H.lib ? 5 : 0) + (H.wc ? 10 : 0) + (H.contNat ? 5 : 0) + (H.league && lg.tier === 1 ? 4 : 0) + (H.cont && !H.cl && !H.lib ? 3 : 0);
    const big5 = ["ENG1", "ESP1", "ITA1", "GER1", "FRA1"].includes(lg.id);
    if (lg.tier === 1 && !big5) myScore -= 6;
    if (lg.tier === 2) myScore -= 15;
    if (lg.tier === 3) myScore -= 24;
    const ranked = state.stars.map(s => ({ name: s.name, club: s.club, score: s.rating + s.gls * 0.13 + rf(0, 7) - (s.age > 33 ? 3 : 0), you: false }));
    ranked.push({ name: p.name, club: state.club.name, score: myScore, you: true });
    ranked.sort((a, b) => b.score - a.score);
    state.ballonTop = ranked.slice(0, 10);
    const myRank = ranked.findIndex(r => r.you) + 1;
    state.ballonRank = myRank;
    if (myRank === 1) {
      state.career.ballons++;
      addAward(state, "BALLON D'OR — " + seasonLabel(state.year), "🎖️");
      unlock(state, "ballon");
      if (state.career.ballons >= 3) unlock(state, "ballon3");
      out.push("🎖️ BALLON D'OR WINNER");
    } else if (myRank <= 10) {
      out.push(`🎖️ Ballon d'Or: finished ${ordinal(myRank)}`);
    }
    // Golden Boy
    if (p.age <= 20 && lg.conf === "eu") {
      const youngRivals = state.stars.filter(s => s.age <= 20).map(s => s.rating + rf(0, 4));
      const mine = p.ovr + avg * 1.5 + rf(0, 2);
      if (!youngRivals.length || mine > Math.max(...youngRivals)) {
        addAward(state, "Golden Boy " + (state.year + 1), "👶");
        unlock(state, "golden_boy");
        out.push("👶 Golden Boy — best U21 in the world");
      }
    }
  }
  if (state.academy) {
    const Y = state.stats.youth || { app: 0, ratSum: 0 };
    if (Y.app >= 15 && Y.ratSum / Y.app >= 7.3) {
      addAward(state, state.academy.name + " Youth Player of the Year", "🌱");
      out.push("🌱 Academy Player of the Year");
    }
  }
  return out;
}

function legacyScore(state) {
  const c = state.career;
  let s = 0;
  s += c.ballons * 14;
  for (const t of c.trophies) {
    if (t.comp === "nation" && t.name.includes("World Cup") && !t.name.includes("U")) s += 15;
    else if (t.comp === "nation") s += 5;
    else if (t.comp === "cont") s += 7;
    else if (t.comp === "league") s += 4;
    else if (t.comp === "cup") s += 2;
    else s += 1;
  }
  for (const a of c.awards) {
    if (a.name.includes("BALLON")) continue;
    s += a.name.includes("Top Scorer") ? 2 : a.name.includes("Player of the Season") ? 3 : a.name.includes("Golden Boy") ? 3 : 1;
  }
  s += c.caps * 0.06 + c.goals * 0.025 + c.apps * 0.008;
  s += Math.max(0, (c.peakOvr - 78) * 0.9);
  s += state.legacyBonus;
  return Math.round(s);
}
function legacyTier(score) {
  if (score >= 100) return ["🐐 THE GOAT", "Your name is the argument."];
  if (score >= 75) return ["👑 Legend", "Statues will be built."];
  if (score >= 50) return ["🌟 World Class", "Feared across continents."];
  if (score >= 30) return ["⭐ Star", "A household name."];
  if (score >= 15) return ["🔥 Cult Hero", "The fans sing your song."];
  if (score >= 5) return ["🧱 Solid Pro", "A respected career."];
  return ["🌱 Journeyman", "You lived the dream — briefly."];
}

/* ---------- season rollover ---------- */
async function rollover(state, ui) {
  const p = state.player;
  const S = state.season;
  const { lg } = myClub(state);
  const review = { seasonName: seasonLabel(state.year), items: [], awards: [], growth: 0 };

  // final league placement
  let finalPos = null;
  if (state.academy && S.youth) {
    finalPos = tablePos(S.youth.table, 0);
    review.items.push(`U18 League: finished ${ordinal(finalPos)} of 14`);
    if (finalPos === 1) addTrophy(state, "U18 League Title", "🏆", "youth");
  } else if (S.table) {
    finalPos = tablePos(S.table, S.myIdx);
    review.items.push(`${lg.name}: finished ${ordinal(finalPos)} of ${lg.teams.length}`);
    if (finalPos === 1 && !lg.playoffTop) {
      addTrophy(state, lg.name + " Title", "🥇", "league");
      state.seasonHonours.league = true;
      if (lg.tier === 1) unlock(state, "league_title");
      else review.promoted = true;
    }
    if (lg.playoffTop && finalPos === 1) { addTrophy(state, "Supporters' Shield", "🛡️", "cup"); }
    // capture the REAL final order; the world sim consumes it for promotion/relegation
    let order = tableSorted(S.table).map(r => (lg.teams[r.i] || {}).n).filter(Boolean);
    if (!lg.noRel && lg.playoff && lg.up) {
      // the last promotion slot goes to the playoff winner
      const autoN = Math.max(1, (lg.up || 1) - 1);
      const winner = S.playoff && S.playoff.won ? state.club.name
        : (pick(order.slice(autoN, lg.playoff[1]).filter(n => n !== state.club.name)) || null);
      if (winner) { order = order.filter(n => n !== winner); order.splice(autoN, 0, winner); }
    }
    S.finalOrderNames = order;
  }

  // awards
  review.awards = computeAwards(state);

  // world end-of-season (promo/releg elsewhere, star aging)
  const worldNews = endOfSeasonWorld(state);
  worldNews.slice(0, 4).forEach(n => addNews(state, n, "blu"));

  // did the world sim move our club up or down?
  state.contQual = null;
  const loc2 = findClubIn(state.leagues, state.club.name);
  const newLg = loc2 ? loc2.league : null;
  if (!state.academy && newLg && !lg.noRel && newLg.id !== lg.id && S.table) {
    if (newLg.tier < lg.tier) {
      review.promoted = true;
      unlock(state, "promotion");
      review.items.push(`🎉 PROMOTED to the ${newLg.name}!`);
      addNews(state, `🎉 ${state.club.name} are going UP to the ${newLg.name}!`, "gold");
    } else if (newLg.tier > lg.tier) {
      review.relegated = true;
      review.items.push(`📉 Relegated to the ${newLg.name}...`);
      addNews(state, `📉 ${state.club.name} drop to the ${newLg.name}.`, "red");
    }
  }
  if (newLg) state.club.leagueId = newLg.id;
  // continental qualification for next season (only if we stayed in the same top flight)
  if (!state.academy && newLg && newLg.id === lg.id && newLg.tier === 1 && finalPos) {
    if (newLg.conf === "eu" && newLg.slots) {
      if (finalPos <= newLg.slots.cl) state.contQual = "UCL";
      else if (finalPos <= newLg.slots.cl + newLg.slots.el) state.contQual = "UEL";
      else if (finalPos <= newLg.slots.cl + newLg.slots.el + newLg.slots.co) state.contQual = "UECL";
    } else if (newLg.conf === "sa" && newLg.slots) {
      if (finalPos <= newLg.slots.lib) state.contQual = "LIB";
      else if (finalPos <= newLg.slots.lib + newLg.slots.sud) state.contQual = "SUD";
    }
    if (state.contQual) review.items.push(`🌍 Qualified for the ${{ UCL: "Champions League", UEL: "Europa League", UECL: "Conference League", LIB: "Copa Libertadores", SUD: "Copa Sudamericana" }[state.contQual]}!`);
  }

  // archive season stats
  const ovrStart = state.seasonStartOvr || p.ovr;
  review.growth = p.ovr - ovrStart;
  const totals = { app: 0, gls: 0, ast: 0, ratSum: 0 };
  for (const b of Object.values(state.stats)) { totals.app += b.app; totals.gls += b.gls; totals.ast += b.ast; totals.ratSum += b.ratSum; }
  review.stats = { ...totals, avg: totals.app ? (totals.ratSum / totals.app).toFixed(2) : "—" };
  state.career.seasons.push({
    season: seasonLabel(state.year), club: state.club.name + (state.loan ? " (loan)" : ""), league: state.academy ? "U18" : lg.name,
    pos: finalPos, app: totals.app, gls: totals.gls, ast: totals.ast, avg: totals.app ? +(totals.ratSum / totals.app).toFixed(2) : 0, age: p.age,
  });
  if (state.career.seasons.filter(s => s.club.replace(" (loan)", "") === state.club.name).length >= 8) unlock(state, "oneclub");

  // birthday
  p.age++;
  ageDecline(state);
  p.yellows = 0; p.bans = 0;
  state.seasonStartOvr = p.ovr;

  // loan return
  if (state.loan && state.loan.until <= state.year + 1) {
    addNews(state, `↩️ Loan over — you return to ${state.loan.parent}.`, "blu");
    state.club = { name: state.loan.parent, leagueId: state.loan.parentLeagueId };
    state.contract = state.loan.contract;
    state.loan = null;
    regenMates(state);
    // contQual was computed from the loan club — recompute from the parent's final standing
    state.contQual = null;
    const ploc = findClubIn(state.leagues, state.club.name);
    if (ploc) {
      state.club.leagueId = ploc.league.id;
      const order = state.lastStandings[ploc.league.id];
      const pos = order ? order.indexOf(state.club.name) + 1 : 0;
      if (pos > 0 && ploc.league.tier === 1 && ploc.league.slots) {
        const sl = ploc.league.slots;
        if (ploc.league.conf === "eu") {
          if (pos <= sl.cl) state.contQual = "UCL";
          else if (pos <= sl.cl + sl.el) state.contQual = "UEL";
          else if (pos <= sl.cl + sl.el + sl.co) state.contQual = "UECL";
        } else if (ploc.league.conf === "sa") {
          if (pos <= sl.lib) state.contQual = "LIB";
          else if (pos <= sl.lib + sl.sud) state.contQual = "SUD";
        }
      }
    }
  }

  // academy graduation decisions
  review.decisions = [];
  if (state.academy) {
    const Y = state.stats.youth || { app: 0, ratSum: 0 };
    const avgY = Y.app ? Y.ratSum / Y.app : 6;
    if (p.age >= 16) {
      const parentLoc = findClubIn(state.leagues, state.academy.club);
      const parentR = parentLoc ? parentLoc.team.r : 70;
      const keep = avgY >= 6.7 || p.ovr >= parentR - 26 + state.academy.q * 2;
      if (keep && (p.age >= 17 || avgY >= 7.1 || p.potential >= 88)) {
        review.decisions.push({ type: "pro", club: state.academy.club, wage: Math.max(600, Math.round(fairWage(state) * 0.8)), years: 3 });
      } else if (!keep && p.age >= 17) {
        review.released = true;
        review.items.push(`💔 ${state.academy.club} released you. Time to prove them wrong.`);
        state.offers = generateOffers(state, "forced");
        state.academy = null;
        state.contract = null;
        state.club = { name: "Free Agent", leagueId: null };
      }
    }
  }

  // contract expiry / renewal
  if (!state.academy && state.contract && !state.contract.loan && loc2) {
    if (state.contract.until <= state.year + 1) {
      // expiring — club may renew based on standing
      const teamR = loc2.team.r;
      if (p.ovr >= teamR - 9 && p.age < 118) {
        review.decisions.push({ type: "renew", club: state.club.name, wage: Math.round(fairWage(state) * 1.05), years: ri(2, 4) });
      } else {
        review.freeAgent = true;
      }
    }
  }

  // summer offers
  if (!state.academy) {
    const kinds = review.freeAgent || state.club.name === "Free Agent" ? "forced" : "transfer";
    const newOffers = generateOffers(state, kinds);
    state.offers = (state.offers || []).concat(newOffers).slice(0, 7);
  }

  // retirement checks
  review.canRetire = p.age >= 33;
  review.mustRetire = p.age >= 120 || (p.age >= 118 && !state.offers.length && (review.freeAgent || state.club.name === "Free Agent"));

  state.ballonReview = state.ballonTop;
  if (ui && ui.seasonReview) await ui.seasonReview(state, review);
  if (state.retired) return;

  // apply decision results stored by UI
  // (UI mutates state directly via helper functions)

  // fallback: free agent with no club picked → force lowest offer or retire
  if (state.club.name === "Free Agent") {
    if (state.offers.length) acceptOffer(state, state.offers[0]);
    else { doRetire(state); return; }
  }

  // fresh season
  brandsRollover(state);
  state.year++;
  state.week = 1;
  state.stats = {};
  state.results = [];
  state.seasonHonours = {};
  state.ntTournament = null;
  state.offers = state.offers.filter(o => o.kind === "forced");
  buildSeason(state);
  const lgNow = findLeague(state.club.leagueId);
  addNews(state, `📅 The ${seasonLabel(state.year)} season begins! ${state.club.name} — ${lgNow ? lgNow.name : ""}.`, "grn");
}

function doRetire(state) {
  state.retired = true;
  state.retiredAt = { age: state.player.age, season: seasonLabel(state.year) };
}
