"use strict";
/* ===== UI ===== */
const App = { screen: "menu", state: null, slot: 0, tab: "home", wizard: null, busy: false, worldLeague: null };
const UI = {};
const $app = () => document.getElementById("app");
const $ov = () => document.getElementById("overlay");

UI.speed = 1; // 1x, 2x, 0 = instant
UI.quickSim = false;

/* ---------- helpers ---------- */
function showToasts(state) {
  const holder = document.getElementById("toasts");
  for (const t of state.pendingToasts.splice(0)) {
    const el = document.createElement("div");
    el.className = "toast" + (t.gold ? " gold" : "");
    el.innerHTML = `<b>${esc(t.title)}</b>${esc(t.body || "")}`;
    holder.appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 450); }, 4200);
  }
}
function modal(html, cls = "") {
  $ov().innerHTML = `<div class="modal ${cls}">${html}</div>`;
  $ov().classList.remove("hidden");
}
function closeModal() { $ov().classList.add("hidden"); $ov().innerHTML = ""; }

function moraleWord(m) { return m >= 80 ? "🔥 Buzzing" : m >= 60 ? "🙂 Happy" : m >= 40 ? "😐 OK" : m >= 20 ? "😟 Low" : "😞 Miserable"; }
function formWord(f) { return f >= 7.6 ? "🔥" : f >= 7 ? "📈" : f >= 6.2 ? "➖" : "📉"; }
function potStars(p) {
  const q = p.potential >= 90 ? 5 : p.potential >= 85 ? 4 : p.potential >= 78 ? 3 : p.potential >= 72 ? 2 : 1;
  return starsHtml(q);
}
function compDisplay(k) {
  return { league: "League", cup: "Cup", cup2: "League Cup", cont: "Continental", nt: "International", youth: "Youth", playoff: "Playoffs" }[k] || k;
}

/* ---------- MENU ---------- */
UI.renderMenu = function () {
  App.screen = "menu";
  let slots = "";
  for (let i = 1; i <= SAVE_SLOTS; i++) {
    const meta = Saves.meta(i);
    slots += meta
      ? `<div class="slotrow">
           <button class="slotcard" onclick="UI.loadSlot(${i})">
             <span>${badgeHtml(meta.club, 30)} <b>${esc(meta.name)}</b><br>
             <small class="muted">${esc(meta.club)} · ${esc(meta.pos)} · Age ${meta.age} · OVR ${meta.ovr} · ${esc(meta.season)}</small></span>
             <span class="pill grn">LOAD</span>
           </button>
           <button class="slotdel" title="Delete this career" onclick="UI.confirmDelete(${i})">🗑️</button>
         </div>`
      : `<div class="slotrow">
           <button class="slotcard" onclick="UI.newInSlot(${i})"><span class="muted">Career ${i} — empty</span><span class="pill dim">NEW</span></button>
         </div>`;
  }
  $app().innerHTML = `
  <div class="menu-wrap">
    <div>
      <div class="logo-big">CAREER LEGEND</div>
      <div class="logo-sub">Road to GOAT</div>
    </div>
    <div class="muted" style="max-width:520px">Start at 14 in a world-famous academy. Train, fight for minutes, move clubs, win it all — from Sunday-league rain to the Ballon d'Or stage.</div>
    <div class="menu-btns">${slots}</div>
    <div class="dim" style="font-size:11px">${SAVE_SLOTS} career slots · 470+ real clubs · 68 national teams · interactive matches · autosaves every week</div>
  </div>`;
};
UI.confirmDelete = function (i) {
  const meta = Saves.meta(i);
  if (!meta) return;
  modal(`
    <div class="comp-tag" style="color:var(--red)">🗑️ Delete career</div>
    <div class="center" style="margin:12px 0">
      ${badgeHtml(meta.club, 46)}
      <div style="font-size:18px;font-weight:900;margin-top:8px">${esc(meta.name)}</div>
      <div class="muted" style="font-size:13px">${esc(meta.club)} · ${esc(meta.pos)} · Age ${meta.age} · OVR ${meta.ovr} · ${esc(meta.season)}</div>
    </div>
    <div class="center" style="font-size:14px;line-height:1.5;margin-bottom:16px">
      This permanently deletes the career in slot ${i}.<br><span class="muted">It cannot be undone.</span>
    </div>
    <div class="spread">
      <button class="btn ghost" onclick="UI.renderMenu();closeModal()">Cancel — keep it</button>
      <button class="btn danger" onclick="UI.doDelete(${i})">Delete forever</button>
    </div>`);
};
UI.doDelete = function (i) {
  Saves.clear(i);
  closeModal();
  UI.renderMenu();
};
UI.loadSlot = function (i) {
  const st = Saves.load(i);
  if (!st) return UI.newInSlot(i);
  App.slot = i; App.state = st;
  UI.quickSim = !!st.settings.quickSim;
  UI.speed = typeof st.settings.speed === "number" ? st.settings.speed : 1;
  if (st.retired) UI.renderRetired(); else { App.tab = "home"; UI.renderHub(); }
};
UI.newInSlot = function (i) {
  App.slot = i;
  App.wizard = { step: 0, cfg: { name: "", pos: "ST", nat: "ENG", diff: "normal" } };
  UI.renderWizard();
};

/* ---------- WIZARD ---------- */
UI.renderWizard = function () {
  App.screen = "wizard";
  const w = App.wizard, c = w.cfg;
  let body = "";
  if (w.step === 0) {
    const natOpts = NATIONS.map(n => `<option value="${n[0]}" ${c.nat === n[0] ? "selected" : ""}>${esc(n[1])} (${n[2]})</option>`).join("");
    body = `
    <h1>👤 Who are you?</h1><div class="muted">Every legend has a beginning. Age 14, a ball, and a dream.</div>
    <div class="field"><label>Your name</label><input id="wzName" maxlength="24" placeholder="e.g. Ahmed Gorah" value="${esc(c.name)}"></div>
    <div class="field"><label>Nationality (your national team)</label><select id="wzNat">${natOpts}</select></div>
    <div class="field"><label>Position</label>
      <div class="optgrid">${POSITIONS.map(p => `<button class="optcard ${c.pos === p ? "sel" : ""}" onclick="UI.wzPos('${p}')"><div class="big-ico">${POS_INFO[p].ico}</div><b>${p}</b><small>${esc(POS_INFO[p].name)}</small></button>`).join("")}</div>
    </div>
    <div class="spread"><span></span><button class="btn primary big" onclick="UI.wzNext0()">Next →</button></div>`;
  } else if (w.step === 1) {
    body = `
    <h1>🎚️ Difficulty</h1><div class="muted">How hard should the road be?</div>
    <div class="optgrid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">
      ${Object.entries(DIFFS).map(([k, d]) => `<button class="optcard ${c.diff === k ? "sel" : ""}" onclick="UI.wzDiff('${k}')"><div class="big-ico">${d.ico}</div><b>${esc(d.label)}</b><small>${esc(d.desc)}</small></button>`).join("")}
    </div>
    <div class="spread" style="margin-top:16px"><button class="btn ghost" onclick="UI.wzBack(0)">← Back</button><button class="btn primary big" onclick="UI.wzNext1()">Next →</button></div>`;
  } else if (w.step === 2) {
    const offers = w.offers;
    body = `
    <h1>🏫 Academy offers</h1><div class="muted">Scouts have been watching you. Choose where your journey begins — better academies grow you faster, but the parent club is harder to break into.</div>
    <div style="margin-top:14px">
    ${offers.map((a, i) => {
      const loc = findClubIn(LEAGUES.map(l => ({ ...l, teams: l.teams.map(t => ({ n: t[0], r: t[1] })) })), a.club);
      return `<button class="acadcard" onclick="UI.wzPick(${i})">${badgeHtml(a.club, 44)}
        <span style="flex:1"><b>${esc(a.name)}</b><br><small class="muted">${esc(a.club)} · ${esc(loc.league.name)} (${esc(loc.league.country)})</small></span>
        <span class="stars">${starsHtml(a.q)}</span></button>`;
    }).join("")}
    </div>
    <div class="spread"><button class="btn ghost" onclick="UI.wzBack(1)">← Back</button><span></span></div>`;
  }
  $app().innerHTML = `<div class="wizard card">${body}</div>`;
};
UI.wzPos = function (p) { App.wizard.cfg.pos = p; UI.saveWzInputs(); UI.renderWizard(); };
UI.wzDiff = function (d) { App.wizard.cfg.diff = d; UI.renderWizard(); };
UI.saveWzInputs = function () {
  const n = document.getElementById("wzName"), na = document.getElementById("wzNat");
  if (n) App.wizard.cfg.name = n.value.trim();
  if (na) App.wizard.cfg.nat = na.value;
};
UI.wzBack = function (s) { UI.saveWzInputs(); App.wizard.step = s; UI.renderWizard(); };
UI.wzNext0 = function () {
  UI.saveWzInputs();
  if (!App.wizard.cfg.name) { App.wizard.cfg.name = genName(natPool(App.wizard.cfg.nat)); }
  App.wizard.step = 1; UI.renderWizard();
};
UI.wzNext1 = function () {
  App.wizard.step = 2;
  App.wizard.offers = genAcademyOffers(App.wizard.cfg.nat, App.wizard.cfg.diff);
  UI.renderWizard();
};
UI.wzPick = function (i) {
  const cfg = App.wizard.cfg;
  cfg.academy = App.wizard.offers[i];
  App.state = newCareer(cfg);
  Saves.save(App.slot, App.state);
  App.tab = "home";
  UI.renderHub();
  showToasts(App.state);
};

/* ---------- HUB ---------- */
UI.renderHub = function () {
  App.screen = "hub";
  const st = App.state, p = st.player;
  const lg = findLeague(st.club.leagueId);
  const val = marketValue(st);
  const unread = (st.inbox || []).filter(d => d.replied === null).length;
  const tabs = [["home", "🏠 Home"], ["matches", "📅 Matches"], ["stats", "📊 My Player"], ["transfers", "🔁 Transfers"], ["dms", "📱 DMs" + (unread ? ` <span class="pill red" style="padding:1px 7px">${unread}</span>` : "")], ["life", "💎 Life"], ["world", "🌍 World"], ["legacy", "🏆 Legacy"]];
  $app().innerHTML = `
  <div class="hub-head">
    <div class="ovr-ball" style="--p:${p.ovr}%"><span>${p.ovr}</span></div>
    <div class="who">
      <b>${esc(p.name)}</b> <span class="pill blu">${p.pos}</span> ${st.loan ? '<span class="pill gold">LOAN</span>' : ""}
      <div class="sub">${badgeHtml(st.club.name, 16)} ${esc(st.club.name)}${st.academy ? " (Academy)" : ""} · ${lg ? esc(lg.name) : ""} · ${esc(natById(p.nat)[1])}</div>
      <div class="sub">📅 ${weekMonth(st.week)} · Week ${st.week} · Season ${seasonLabel(st.year)} · Age ${p.age}</div>
    </div>
    <div class="statchips">
      <div class="chip"><b>${fmtM(st.money)}</b><small>Bank</small></div>
      <div class="chip"><b>${fmtM(val)}</b><small>Value</small></div>
      <div class="chip"><b>${p.energy < 35 ? "🪫" : "⚡"} ${Math.round(p.energy)}</b><small>Energy</small></div>
      <div class="chip"><b>${formWord(p.form)} ${p.form.toFixed(1)}</b><small>Form</small></div>
      <div class="chip"><b>${moraleWord(p.morale).split(" ")[0]}</b><small>Morale</small></div>
      ${p.injury > 0 ? `<div class="chip" style="border-color:var(--red)"><b class="red">🤕 ${p.injury}w</b><small>${esc(p.injuryName || "Injured")}</small></div>` : ""}
      ${st.grief && st.grief.weeks > 0 ? `<div class="chip" style="border-color:var(--pur)"><b style="color:var(--pur)">${esc(st.grief.label)}</b><small>${st.grief.weeks}w to heal</small></div>` : ""}
      <button class="btn small ghost" title="Settings" onclick="UI.settingsModal()" style="font-size:16px;padding:8px 10px">⚙️</button>
    </div>
  </div>
  <div class="tabs">${tabs.map(([k, l]) => `<button class="tab ${App.tab === k ? "on" : ""}" onclick="UI.tab('${k}')">${l}</button>`).join("")}</div>
  <div id="tabbody"></div>
  <div class="continue-bar"><button class="btn primary big" id="btnAdvance" onclick="UI.advance()" ${App.busy ? "disabled" : ""}>▶ Continue — ${weekMonth(st.week)}, Week ${st.week}</button></div>`;
  UI.renderTab();
};
UI.tab = function (t) { App.tab = t; UI.renderHub(); };

UI.renderTab = function () {
  const body = document.getElementById("tabbody");
  const st = App.state;
  if (!body || !st) return;
  const fn = { home: tabHome, matches: tabMatches, stats: tabStats, transfers: tabTransfers, dms: tabDMs, life: tabLife, world: tabWorld, legacy: tabLegacy }[App.tab];
  body.innerHTML = fn(st);
  if (App.tab === "stats") drawSpark(st);
};

/* ---------- TAB: HOME ---------- */
function peekWeek(st) {
  const S = st.season, wk = st.week, out = [];
  if (!S) return out;
  const lg = st.leagues.find(l => l.id === st.club.leagueId);
  if (st.academy && S.youth) {
    const yr = S.youth.weekRounds[wk];
    if (yr !== undefined) {
      const pair = S.youth.rounds[yr].find(([h, a]) => h === 0 || a === 0);
      if (pair) {
        const opp = S.youth.teams[pair[0] === 0 ? pair[1] : pair[0]];
        out.push({ comp: "U18 League", opp: opp.n, home: pair[0] === 0 });
      }
    }
    if (S.youth.cupAlive && [38, 40, 42].includes(wk)) out.push({ comp: "Youth Cup " + ["Quarter-Final", "Semi-Final", "FINAL"][[38, 40, 42].indexOf(wk)], opp: "Cup draw", home: true });
  } else {
    for (const rIdx of (S.weekRounds[wk] || [])) {
      const pair = S.rounds[rIdx].find(([h, a]) => h === S.myIdx || a === S.myIdx);
      if (pair && lg) {
        const home = pair[0] === S.myIdx;
        const opp = lg.teams[home ? pair[1] : pair[0]];
        if (opp) out.push({ comp: lg.name, opp: opp.n, home });
      }
    }
    for (const key of ["cup", "cup2"]) {
      const C = S[key];
      if (C && C.alive && C.weeks[C.stage !== undefined ? C.stage : C.next] === wk) out.push({ comp: C.name + " " + C.stages[C.stage !== undefined ? C.stage : C.next], opp: "Cup draw", home: true });
    }
    if (S.cont && S.cont.alive) {
      if (S.cont.lpWeeks.includes(wk)) out.push({ comp: { UCL: "Champions League", UEL: "Europa League", UECL: "Conference League", LIB: "Copa Libertadores", SUD: "Copa Sudamericana" }[S.cont.comp], opp: "European night", home: true });
      else for (const [stg, w] of Object.entries(S.cont.koWeeks)) if (w === wk) out.push({ comp: S.cont.comp + " " + stg, opp: "Knockout draw", home: true });
    }
  }
  if (NT_WEEKS.includes(wk) && ntEligibility(st)) out.push({ comp: "🌐 International break", opp: natById(st.player.nat)[1] + " duty", home: true });
  if ([44, 45, 46].includes(wk) && st.ntTournament && !st.ntTournament.out) out.push({ comp: st.ntTournament.name, opp: "Tournament football!", home: true });
  return out;
}
function tabHome(st) {
  const p = st.player;
  const nexts = peekWeek(st);
  const fixHtml = nexts.length ? nexts.map(n => `
    <div class="comp-tag">${esc(n.comp)}</div>
    <div class="next-match">
      <div class="nm-team">${badgeHtml(n.home ? st.club.name : n.opp, 44)}<b>${esc(n.home ? st.club.name : n.opp)}</b></div>
      <div class="nm-vs">VS</div>
      <div class="nm-team">${badgeHtml(n.home ? n.opp : st.club.name, 44)}<b>${esc(n.home ? n.opp : st.club.name)}</b></div>
    </div>`).join("<div style='height:8px'></div>")
    : `<div class="muted center" style="padding:18px">No match this week — a good week to train hard or rest up.</div>`;
  const focusOpts = [["balanced", "⚖️ Balanced"], ...ATTR_KEYS.map(k => [k, (p.pos === "GK" ? GK_LABELS[k] : ATTR_LABELS[k])]), ["skill", "🎪 Skill Moves"], ["rest", "😴 Rest & Recover"]];
  let skillPicker = "";
  if (st.trainingFocus === "skill") {
    const groups = Object.entries(SKILL_CATS).map(([cat, label]) => {
      const opts = SKILL_MOVES.filter(s => s.cat === cat).map(s => {
        const lvl = Math.round((st.skills && st.skills[s.id]) || 0);
        return `<option value="${s.id}" ${st.skillFocus === s.id ? "selected" : ""}>${s.ico} ${esc(s.name)} — Lv ${lvl}${lvl >= 100 ? " ⭐MAX" : ""}</option>`;
      }).join("");
      return `<optgroup label="${esc(label)}">${opts}</optgroup>`;
    }).join("");
    const cur = skillById(st.skillFocus);
    skillPicker = `
    <div class="field" style="margin-top:10px">
      <label>Which move are you drilling? (${SKILL_MOVES.length} to master — usable in matches once Lv 8+)</label>
      <select onchange="UI.setSkillFocus(this.value)"><option value="" ${!cur ? "selected" : ""}>— pick a skill move —</option>${groups}</select>
      ${cur ? `<div style="margin-top:8px">${pctBar(Math.round(st.skills[cur.id] || 0), 100, "gold")}<small class="muted">${cur.ico} ${esc(cur.name)} — Lv ${Math.round(st.skills[cur.id] || 0)}/100 · trains faster with high ${esc(attrLabel(p, cur.attr))}</small></div>` : ""}
    </div>`;
  }
  const feed = st.news.slice(0, 25).map(n => `<div class="feed-item ${n.cls}">${esc(n.txt)}<small>Wk ${n.wk} · ${seasonLabel(n.year)}</small></div>`).join("") || `<div class="muted">Your story starts now.</div>`;
  return `
  <div class="row">
    <div class="card" style="flex:1.2">
      <h3>This week</h3>
      ${fixHtml}
      <hr class="sep">
      <h3>Training focus</h3>
      <div class="optgrid" style="grid-template-columns:repeat(auto-fill,minmax(120px,1fr))">
        ${focusOpts.map(([k, l]) => `<button class="optcard ${st.trainingFocus === k ? "sel" : ""}" style="padding:9px" onclick="UI.setFocus('${k}')"><b style="font-size:12px">${l}</b></button>`).join("")}
      </div>
      ${skillPicker}
      <hr class="sep">
      <label style="display:flex;gap:8px;align-items:center;font-size:13px;cursor:pointer">
        <input type="checkbox" ${UI.quickSim ? "checked" : ""} onchange="UI.setQuick(this.checked)"> ⚡ Quick-sim matches (skip interactive play)
      </label>
    </div>
    <div class="card" style="flex:1">
      <h3>News feed</h3>
      <div class="feed">${feed}</div>
    </div>
  </div>`;
}
UI.setFocus = function (k) { App.state.trainingFocus = k; Saves.save(App.slot, App.state); UI.renderTab(); };
UI.setSkillFocus = function (id) { App.state.skillFocus = id || null; Saves.save(App.slot, App.state); UI.renderTab(); };
UI.setQuick = function (v) { UI.quickSim = v; App.state.settings.quickSim = v; Saves.save(App.slot, App.state); };

/* ---------- TAB: MATCHES ---------- */
function tabMatches(st) {
  const S = st.season;
  const res = st.results.slice(-15).reverse().map(r => {
    const cls = r.out === "W" ? "grn" : r.out === "L" ? "red" : "";
    const badge = r.played ? `<span class="rating-badge ${ratingClass(r.rating)}" style="min-width:38px;height:26px;font-size:13px">${r.rating.toFixed(1)}</span>` : `<span class="pill dim">${r.sel === "out" ? "not selected" : r.sel === "injured" ? "injured" : r.sel === "banned" ? "suspended" : "unused sub"}</span>`;
    return `<tr><td class="dim">Wk${r.wk}</td><td>${esc(r.comp)}</td><td>${r.home ? "vs" : "@"} ${esc(r.opp)}</td><td class="r ${cls}" style="font-weight:800">${r.out} ${r.score}</td><td class="r">${r.goals ? "⚽" + r.goals : ""}${r.assists ? " 🅰" + r.assists : ""}</td><td class="r">${badge}</td></tr>`;
  }).join("");
  let tableHtml = "";
  const lg = st.leagues.find(l => l.id === st.club.leagueId);
  const tbl = st.academy && S.youth ? S.youth.table : S.table;
  const teams = st.academy && S.youth ? S.youth.teams : (lg ? lg.teams : []);
  const meIdx = st.academy && S.youth ? 0 : S.myIdx;
  if (tbl) {
    const sorted = tableSorted(tbl);
    const n = sorted.length;
    tableHtml = sorted.map((r, i) => {
      const zone = !st.academy && lg ? (lg.tier === 1 && lg.slots && i < (lg.slots.cl || 0) ? "zone-cl" : lg.tier > 1 && i < 2 ? "zone-cl" : !lg.noRel && i >= n - (lg.down || 0) ? "zone-rel" : "") : "";
      return `<tr class="${r.i === meIdx ? "me" : ""} ${zone}"><td>${i + 1}</td><td>${esc(teams[r.i] ? teams[r.i].n : "?")}</td><td class="r">${r.p}</td><td class="r">${r.w}-${r.d}-${r.l}</td><td class="r">${r.gf - r.ga}</td><td class="r"><b>${r.pts}</b></td></tr>`;
    }).join("");
    tableHtml = `<table class="tbl"><tr><th>#</th><th>Team</th><th class="r">P</th><th class="r">W-D-L</th><th class="r">GD</th><th class="r">Pts</th></tr>${tableHtml}</table>`;
  }
  let comps = "";
  if (!st.academy) {
    if (S.cup) comps += `<div class="kv"><span>🏆 ${esc(S.cup.name)}</span><b>${S.cup.alive ? esc(S.cup.stages[S.cup.stage !== undefined ? S.cup.stage : S.cup.next]) + " next" : "Out"}</b></div>`;
    if (S.cup2) comps += `<div class="kv"><span>🏆 ${esc(S.cup2.name)}</span><b>${S.cup2.alive ? esc(S.cup2.stages[S.cup2.stage !== undefined ? S.cup2.stage : 0]) + " next" : "Out"}</b></div>`;
    if (S.cont) comps += `<div class="kv"><span>🌍 ${esc(S.cont.comp)}</span><b>${S.cont.alive ? S.cont.played + " played · " + S.cont.pts + " pts" : "Out"}</b></div>`;
  } else if (S.youth) {
    comps += `<div class="kv"><span>🏆 Youth Cup</span><b>${S.youth.cupAlive ? "Alive" : "Out"}</b></div>`;
  }
  return `
  <div class="row">
    <div class="card" style="flex:1.3"><h3>Recent matches</h3><div style="overflow-x:auto"><table class="tbl">${res || "<tr><td class='muted'>No matches yet.</td></tr>"}</table></div>
    <hr class="sep"><h3>Competitions</h3>${comps || "<span class='muted'>League only.</span>"}</div>
    <div class="card" style="flex:1"><h3>${st.academy ? "U18 League table" : esc(lg ? lg.name : "League") + " table"}</h3><div style="max-height:520px;overflow-y:auto">${tableHtml}</div></div>
  </div>`;
}

/* ---------- TAB: STATS ---------- */
function tabStats(st) {
  const p = st.player;
  const attrs = ATTR_KEYS.map(k => `
    <div class="attr-row"><span class="lbl">${esc(attrLabel(p, k))}</span>
    ${pctBar(p.attrs[k], 99, p.attrs[k] >= 80 ? "gold" : "")}
    <span class="val">${Math.round(p.attrs[k])}</span></div>`).join("");
  const statRows = Object.entries(st.stats).map(([k, b]) => `<tr><td>${esc(compDisplay(k))}</td><td class="r">${b.app}</td><td class="r">${b.gls}</td><td class="r">${b.ast}</td><td class="r">${b.app ? (b.ratSum / b.app).toFixed(2) : "—"}</td><td class="r">${b.motm}</td></tr>`).join("");
  const seasonRows = st.career.seasons.slice(-12).reverse().map(s => `<tr><td>${esc(s.season)}</td><td>${esc(s.club)}</td><td class="dim">${esc(s.league)}</td><td class="r">${s.pos ? ordinal(s.pos) : "—"}</td><td class="r">${s.app}</td><td class="r">${s.gls}</td><td class="r">${s.ast}</td><td class="r">${s.avg || "—"}</td></tr>`).join("");
  return `
  <div class="row">
    <div class="card" style="flex:1">
      <h3>Attributes ${p.pos === "GK" ? "(Goalkeeper)" : ""}</h3>${attrs}
      <hr class="sep">
      <div class="kv"><span>Overall</span><b>${p.ovr}</b></div>
      <div class="kv"><span>Scout potential</span><b class="stars">${potStars(p)}</b></div>
      <div class="kv"><span>Preferred foot</span><b>${p.foot}</b></div>
      <div class="kv"><span>Reputation</span><b>${Math.round(p.rep)}/100</b></div>
      <div class="kv"><span>Manager trust</span><b>${Math.round(p.trust)}/100</b></div>
      <div class="kv"><span>Market value</span><b class="gold">${fmtM(marketValue(st))}</b></div>
      <hr class="sep"><h3>Growth (overall)</h3><canvas class="spark" id="sparkOvr" width="400" height="60"></canvas>
      <hr class="sep"><h3>🎪 Skill moves (${Object.values(st.skills || {}).filter(v => v >= 8).length} match-ready · ${st.skillUses || 0} used in games)</h3>
      ${(() => {
        const learned = SKILL_MOVES.map(s => ({ s, lvl: Math.round((st.skills && st.skills[s.id]) || 0) })).filter(x => x.lvl > 0).sort((a, b) => b.lvl - a.lvl);
        if (!learned.length) return `<div class="muted" style="font-size:12px">No moves trained yet — pick "🎪 Skill Moves" as your training focus on the Home tab. Moves at Lv 8+ appear as extra options during match moments, and get more reliable the higher you train them.</div>`;
        return learned.slice(0, 14).map(x => `<div class="attr-row"><span class="lbl">${x.s.ico} ${esc(x.s.name)}</span>${pctBar(x.lvl, 100, x.lvl >= 80 ? "gold" : "")}<span class="val">${x.lvl}</span></div>`).join("") + (learned.length > 14 ? `<small class="muted">…and ${learned.length - 14} more</small>` : "");
      })()}
    </div>
    <div class="card" style="flex:1.2">
      <h3>This season</h3>
      <div style="overflow-x:auto"><table class="tbl"><tr><th>Competition</th><th class="r">Apps</th><th class="r">Goals</th><th class="r">Assists</th><th class="r">Avg</th><th class="r">MOTM</th></tr>${statRows || "<tr><td class='muted'>Nothing yet.</td></tr>"}</table></div>
      <hr class="sep">
      <h3>Career history</h3>
      <div style="overflow-x:auto;max-height:320px;overflow-y:auto"><table class="tbl"><tr><th>Season</th><th>Club</th><th>League</th><th class="r">Pos</th><th class="r">Apps</th><th class="r">Gls</th><th class="r">Ast</th><th class="r">Avg</th></tr>${seasonRows || "<tr><td class='muted'>First season in progress.</td></tr>"}</table></div>
      <hr class="sep">
      <div class="statgrid">
        <div class="statbox"><b>${st.career.apps}</b><small>Career apps</small></div>
        <div class="statbox"><b>${st.career.goals}</b><small>Career goals</small></div>
        <div class="statbox"><b>${st.career.assists}</b><small>Career assists</small></div>
        <div class="statbox"><b>${st.career.caps}</b><small>Senior caps</small></div>
      </div>
    </div>
  </div>`;
}
function drawSpark(st) {
  const cv = document.getElementById("sparkOvr");
  if (!cv || st.ovrHistory.length < 2) return;
  const ctx = cv.getContext("2d");
  const data = st.ovrHistory;
  const min = Math.min(...data) - 2, max = Math.max(...data) + 2;
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.strokeStyle = "#2ee06e"; ctx.lineWidth = 2; ctx.beginPath();
  data.forEach((v, i) => {
    const x = i / (data.length - 1) * (cv.width - 4) + 2;
    const y = cv.height - 4 - (v - min) / (max - min) * (cv.height - 8);
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.stroke();
}

/* ---------- TAB: TRANSFERS ---------- */
function tabTransfers(st) {
  const p = st.player;
  const c = st.contract;
  const agent = AGENTS.find(a => a.id === st.agent);
  const inWindow = (st.week >= 24 && st.week <= 27) || st.week >= 44 || st.week <= 3;
  const offers = st.offers.map((o, i) => `
    <div class="offer">
      <div class="head">${badgeHtml(o.club, 38)}<div><b>${esc(o.club)}</b> ${o.kind === "loan" ? '<span class="pill blu">LOAN</span>' : ""}<br><small class="muted">${esc(o.leagueName)} · ${esc(o.country)} · Team rating ${o.clubR}</small></div></div>
      <div class="terms">
        ${o.fee ? `<span>Fee: <b>${fmtM(o.fee)}</b></span>` : ""}
        <span>Wage: <b>${fmtM(o.wage)}/wk</b></span>
        <span>Length: <b>${o.years}yr</b></span>
        <span>Role: <b>${o.role.toUpperCase()}</b></span>
      </div>
      <div class="spread"><button class="btn primary" onclick="UI.acceptOfferIdx(${i})">Accept & sign</button><button class="btn ghost small" onclick="UI.rejectOfferIdx(${i})">Reject</button></div>
    </div>`).join("");
  const agents = AGENTS.map(a => `
    <div class="offer ${st.agent === a.id ? "" : ""}" style="${st.agent === a.id ? "border-color:var(--grn)" : ""}">
      <div class="spread"><b>${a.ico} ${esc(a.name)}</b>${st.agent === a.id ? '<span class="pill grn">YOUR AGENT</span>' : p.rep >= a.rep ? `<button class="btn small" onclick="UI.hireAgent('${a.id}')">Hire</button>` : `<span class="pill dim">Rep ${a.rep} needed</span>`}</div>
      <small class="muted">${esc(a.desc)}</small>
    </div>`).join("");
  return `
  <div class="row">
    <div class="card" style="flex:1">
      <h3>Current deal</h3>
      ${st.academy ? `<div class="kv"><span>Status</span><b>Academy player — ${esc(st.academy.name)}</b></div><div class="kv"><span>Stipend</span><b>${fmtM(120 + st.academy.q * 40)}/wk</b></div><div class="muted" style="margin-top:8px;font-size:12px">Impress in the U18 league to earn a professional contract at 16-17.</div>`
      : c ? `<div class="kv"><span>Club</span><b>${esc(st.club.name)}</b></div>
        <div class="kv"><span>Wage</span><b>${fmtM(c.wage)}/wk</b></div>
        <div class="kv"><span>Expires</span><b>Summer ${c.until}</b></div>
        <div class="kv"><span>Squad role</span><b>${(c.role || "rotation").toUpperCase()}</b></div>
        ${st.loan ? `<div class="kv"><span>On loan from</span><b>${esc(st.loan.parent)}</b></div>` : ""}`
      : `<div class="muted">No contract — free agent.</div>`}
      <hr class="sep">
      <h3>Your agent</h3>${agents}
    </div>
    <div class="card" style="flex:1.2">
      <h3>Offers ${inWindow ? '<span class="pill grn">WINDOW OPEN</span>' : '<span class="pill dim">window closed</span>'}</h3>
      ${offers || `<div class="muted" style="padding:14px">No offers right now.${inWindow && !st.academy ? " Your agent is working the phones…" : ""} Play well, raise your reputation, and clubs will come.</div>`}
      ${!st.academy && inWindow ? `<button class="btn" onclick="UI.requestMove()">📢 Ask agent to find offers</button>` : ""}
    </div>
  </div>`;
}
UI.acceptOfferIdx = function (i) {
  const st = App.state, o = st.offers[i];
  if (!o) return;
  acceptOffer(st, o);
  Saves.save(App.slot, st);
  UI.renderHub(); showToasts(st);
};
UI.rejectOfferIdx = function (i) { App.state.offers.splice(i, 1); UI.renderTab(); };
UI.hireAgent = function (id) {
  App.state.agent = id;
  addNews(App.state, `🤝 ${AGENTS.find(a => a.id === id).name} now represent you.`, "blu");
  UI.renderTab();
};
UI.requestMove = function () {
  const st = App.state;
  if (st.moveRequestedWk === st.week) return;
  st.moveRequestedWk = st.week;
  st.offers = st.offers.concat(generateOffers(st, "transfer")).slice(0, 7);
  if (!st.offers.length) addNews(st, "📵 Your agent shopped you around... crickets. Keep performing.", "red");
  UI.renderTab();
};

/* ---------- TAB: DMS ---------- */
const DM_CAT_PILL = { teammate: "grn", agent: "gold", manager: "red", family: "blu", journalist: "dim", rival: "red", brand: "gold", mentor: "blu" };
function tabDMs(st) {
  const inbox = st.inbox || [];
  const threads = inbox.map((d, i) => {
    const answered = d.replied !== null;
    const replyHtml = answered
      ? `<div style="text-align:right;margin-top:8px"><span style="display:inline-block;background:linear-gradient(135deg,#1f4d33,#153a26);border:1px solid #2c7d4d;border-radius:14px 14px 2px 14px;padding:8px 12px;font-size:12px;color:var(--grn)">${esc(d.replies[d.replied])}</span><div class="dim" style="font-size:10px;margin-top:3px">✓ sent</div></div>`
      : `<div style="display:flex;flex-direction:column;gap:6px;margin-top:9px">${d.replies.map((r, t) => `<button class="moment-opt" style="padding:8px 12px;font-size:12.5px" onclick="UI.dmReply(${i},${t})"><span>${esc(r)}</span></button>`).join("")}</div>`;
    return `
    <div class="offer" style="${answered ? "opacity:.75" : "border-color:#31477c"}">
      <div class="head" style="margin-bottom:4px">${badgeHtml(d.from, 34)}
        <div style="flex:1"><b>${esc(d.from)}</b> <span class="pill ${DM_CAT_PILL[d.cat] || "dim"}">${d.ico} ${esc(d.label)}</span>
        <div class="dim" style="font-size:10px">Wk ${d.week} · ${seasonLabel(d.year)}${answered ? "" : ' · <b class="red">unread</b>'}</div></div>
      </div>
      <div style="background:var(--bg2);border-radius:2px 14px 14px 14px;padding:10px 13px;font-size:13.5px;line-height:1.5">${esc(d.text)}</div>
      ${replyHtml}
    </div>`;
  }).join("") || `<div class="muted" style="padding:16px">No messages yet — play some matches, make some noise, and the phone starts buzzing.</div>`;

  const key = st.year * 100 + st.week;
  const fanHtml = (st.fanbox || []).map(f => `
    <div class="feed-item ${f.liked ? "grn" : ""}" style="font-size:12px">${f.liked ? "❤️ " : ""}<b>@${esc(f.from)}</b>: ${esc(f.text)}</div>`).join("")
    || `<div class="muted" style="font-size:12px">No fan mail yet. Score a worldie and check back.</div>`;

  return `
  <div class="card" style="margin-bottom:14px">
    <div class="spread"><h3 style="margin:0">📱 Direct messages</h3>
    <small class="dim">${DM_TOTAL.toLocaleString()} unique DMs · 3 replies each · ${FANMSG_TOTAL.toLocaleString()} fan messages · ${st.dmReplies || 0} replied</small></div>
  </div>
  <div class="row">
    <div class="card" style="flex:1.4">
      <h3>Inbox</h3>
      <div style="max-height:640px;overflow-y:auto;padding-right:4px">${threads}</div>
    </div>
    <div class="card" style="flex:1">
      <h3>❤️ Fan messages <span class="pill dim">less important, all heart</span></h3>
      <button class="btn small gold" style="margin-bottom:10px" ${st.fanLikedWk === key ? "disabled" : ""} onclick="UI.likeFans()">${st.fanLikedWk === key ? "❤️ Liked this week" : "❤️ Like them all (+fan love)"}</button>
      <div class="feed" style="max-height:560px">${fanHtml}</div>
    </div>
  </div>`;
}
UI.dmReply = function (i, tone) {
  replyDM(App.state, i, tone);
  Saves.save(App.slot, App.state);
  UI.renderHub();
  showToasts(App.state);
};
UI.likeFans = function () {
  if (likeAllFans(App.state)) {
    addNews(App.state, "❤️ You liked every fan message. The group chats are going wild.", "grn");
    Saves.save(App.slot, App.state);
  }
  UI.renderHub();
};

/* ---------- TAB: LIFE ---------- */
function tabLife(st) {
  const p = st.player;
  const sp = st.sponsor ? SPONSORS.find(s => s.id === st.sponsor) : null;
  const pending = st.pendingSponsor ? SPONSORS.find(s => s.id === st.pendingSponsor) : null;
  const shop = SHOP_ITEMS.map(it => {
    const owned = st.items.includes(it.id);
    return `<div class="shop-item ${owned ? "owned" : ""}">
      <div class="ico">${it.ico}</div><b>${esc(it.name)}</b><small>${esc(it.desc)}</small>
      ${owned ? '<span class="pill grn">OWNED</span>' : `<button class="btn small ${st.money >= it.cost ? "gold" : ""}" ${st.money < it.cost ? "disabled" : ""} onclick="UI.buy('${it.id}')">${fmtM(it.cost)}</button>`}
    </div>`;
  }).join("");
  const F = st.fans;
  const postedThisWeek = F.lastPostWk === st.year * 100 + st.week;
  const fanClub = Math.round(p.followers * (F.love / 100) * 0.8);
  const shirtWk = st.contract && !st.academy ? Math.round(F.love * p.rep * 1.6) : 0;
  const posts = SOCIAL_POSTS.map(sp => `
    <button class="optcard" style="padding:10px" ${postedThisWeek ? "disabled" : ""} onclick="UI.post('${sp.id}')">
      <div class="big-ico" style="font-size:20px;margin-bottom:2px">${sp.ico}</div>
      <b style="font-size:12px">${esc(sp.name)}</b><small>${esc(sp.desc)}</small>
    </button>`).join("");
  return `
  <div class="row">
    <div class="card" style="flex:1">
      <h3>The life</h3>
      <div class="statgrid">
        <div class="statbox"><b>${fmtM(st.money)}</b><small>Bank</small></div>
        <div class="statbox"><b>${fmtNum(p.followers)}</b><small>Followers</small></div>
        <div class="statbox"><b>${Math.round(p.rep)}</b><small>Reputation</small></div>
      </div>
      <hr class="sep">
      <h3>📣 Your fans</h3>
      <div class="spread" style="margin-bottom:6px"><span style="font-weight:800;font-size:15px">${fanLoveWord(F.love)}</span><b class="gold">${Math.round(F.love)}/100 love</b></div>
      ${pctBar(F.love, 100, F.love >= 60 ? "gold" : F.love <= 30 ? "red" : "")}
      <div class="kv" style="margin-top:10px"><span>Fan club size</span><b>${fmtNum(fanClub)}</b></div>
      <div class="kv"><span>Shirt-sale income</span><b>${shirtWk ? fmtM(shirtWk) + "/wk" : "— (pros only)"}</b></div>
      <div class="kv"><span>Total posts made</span><b>${F.posts || 0}</b></div>
      <div class="kv"><span>Press conferences faced</span><b>${(st.pressCount || 0).toLocaleString()} / ${PRESS_TOTAL.toLocaleString()}</b></div>
      <div class="muted" style="font-size:11px;margin-top:8px">High fan love = weekly morale boost + bigger sponsor payouts. Win, score, post, and give good pressers to keep them singing.</div>
      <hr class="sep">
      <h3>📱 Post to social media ${postedThisWeek ? '<span class="pill dim">posted this week</span>' : '<span class="pill grn">READY</span>'}</h3>
      <div class="optgrid" style="grid-template-columns:repeat(auto-fill,minmax(105px,1fr))">${posts}</div>
      <hr class="sep">
      <h3>🤝 Brand endorsements (${st.brandDeals.length}/${brandSlots(p.rep)} slots)</h3>
      ${st.brandDeals.length ? st.brandDeals.map(d => `<div class="kv"><span>${d.ico} ${esc(d.name)} ${"⭐".repeat(d.tier)}</span><b>${fmtM(d.weekly)}/wk · until ${d.until}</b></div>`).join("") : `<div class="muted" style="font-size:12px">No deals yet. ${brandSlots(p.rep) === 0 ? "Reach 15 reputation and brands will start calling." : "Brands approach you as your rep and followers grow — offers appear here."}</div>`}
      ${st.brandOffers.map((o, i) => `
      <div class="offer" style="margin-top:10px"><div class="spread"><b>${o.ico} ${esc(o.name)} ${"⭐".repeat(o.tier)}</b><span class="gold">${fmtM(o.weekly)}/wk · ${fmtM(o.bonus)} bonus · ${o.years}yr</span></div>
        <div class="spread" style="margin-top:8px">
          <button class="btn primary small" ${st.brandDeals.length >= brandSlots(p.rep) ? "disabled title='No free slots — raise your reputation'" : ""} onclick="UI.signBrand(${i})">Sign deal</button>
          <button class="btn ghost small" onclick="UI.declineBrand(${i})">Decline</button>
        </div></div>`).join("")}
      <hr class="sep">
      <h3>Boot sponsorship</h3>
      ${sp ? `<div class="kv"><span>${sp.ico} ${esc(sp.name)}</span><b>${fmtM(sp.weekly)}/wk</b></div>` : `<div class="muted">No sponsor yet — raise your reputation.</div>`}
      ${pending ? `<div class="offer" style="margin-top:10px"><div class="spread"><b>${pending.ico} ${esc(pending.name)}</b><span class="gold">${fmtM(pending.weekly)}/wk + ${fmtM(pending.bonus)}</span></div>
        <div class="spread" style="margin-top:8px"><button class="btn primary small" onclick="UI.signSponsor()">Sign deal</button><button class="btn ghost small" onclick="UI.declineSponsor()">Decline</button></div></div>` : ""}
    </div>
    <div class="card" style="flex:1.6">
      <h3>Shop — spend it like a footballer</h3>
      <div class="shop-grid">${shop}</div>
    </div>
  </div>`;
}
UI.buy = function (id) {
  const st = App.state, it = SHOP_ITEMS.find(s => s.id === id);
  if (!it || st.items.includes(id) || st.money < it.cost) return;
  st.money -= it.cost;
  st.items.push(id);
  if (it.fx.repOnce) st.player.rep = clamp(st.player.rep + it.fx.repOnce, 0, 100);
  if (it.fx.folOnce) st.player.followers += it.fx.folOnce;
  if (it.fx.legacy) st.legacyBonus += it.fx.legacy;
  addNews(st, `${it.ico} Purchased: ${it.name}!`, "gold");
  st.player.morale = clamp(st.player.morale + 4, 0, 100);
  Saves.save(App.slot, st);
  UI.renderHub();
};
UI.signBrand = function (i) {
  signBrandDeal(App.state, i);
  Saves.save(App.slot, App.state);
  UI.renderHub();
  showToasts(App.state);
};
UI.declineBrand = function (i) { App.state.brandOffers.splice(i, 1); UI.renderTab(); };
UI.post = function (id) {
  const st = App.state;
  if (st.fans.lastPostWk === st.year * 100 + st.week) return;
  const note = doSocialPost(st, id);
  if (note) addNews(st, note, "blu");
  Saves.save(App.slot, st);
  UI.renderHub();
};
UI.signSponsor = function () {
  const st = App.state, sp = SPONSORS.find(s => s.id === st.pendingSponsor);
  if (!sp) return;
  st.sponsor = sp.id; st.money += sp.bonus; st.pendingSponsor = null;
  addNews(st, `${sp.ico} Signed with ${sp.name}! ${fmtM(sp.bonus)} bonus lands in your account.`, "gold");
  Saves.save(App.slot, st);
  UI.renderHub();
};
UI.declineSponsor = function () { App.state.pendingSponsor = null; UI.renderTab(); };

/* ---------- TAB: WORLD ---------- */
function tabWorld(st) {
  const p = st.player;
  const ballon = (st.ballonTop || []).map((r, i) => `<tr class="${r.you ? "me" : ""}"><td>${i + 1}</td><td>${esc(r.name)}${r.you ? " (YOU)" : ""}</td><td class="dim">${esc(r.club)}</td></tr>`).join("");
  const stars = st.stars.slice().sort((a, b) => b.rating - a.rating).slice(0, 18).map((s, i) => `<tr><td>${i + 1}</td><td>${esc(s.name)}</td><td class="dim">${s.pos}</td><td class="dim">${esc(s.club)}</td><td class="r">${s.age}</td><td class="r"><b>${s.rating}</b></td></tr>`).join("");
  const natR = natById(p.nat);
  const elig = ntEligibility(st);
  const leagueOpts = LEAGUES.map(l => `<option value="${l.id}" ${App.worldLeague === l.id ? "selected" : ""}>${esc(l.country)} — ${esc(l.name)}</option>`).join("");
  let lgView = "";
  const sel = App.worldLeague || st.club.leagueId;
  if (sel === st.club.leagueId && !st.academy && st.season.table) {
    const lg = st.leagues.find(l => l.id === sel);
    lgView = tableSorted(st.season.table).map((r, i) => `<tr class="${r.i === st.season.myIdx ? "me" : ""}"><td>${i + 1}</td><td>${esc(lg.teams[r.i] ? lg.teams[r.i].n : "?")}</td><td class="r">${r.pts}</td></tr>`).join("");
  } else {
    const order = st.lastStandings[sel];
    const lg = st.leagues.find(l => l.id === sel);
    lgView = (order || (lg ? lg.teams.map(t => t.n) : [])).map((n, i) => `<tr><td>${i + 1}</td><td>${esc(n)}</td><td class="r dim">${order ? "final" : "—"}</td></tr>`).join("");
  }
  return `
  <div class="row">
    <div class="card" style="flex:1">
      <h3>🎖️ Ballon d'Or — latest top 10</h3>
      ${ballon ? `<table class="tbl">${ballon}</table>` : `<div class="muted">First rankings released at the end of the season.</div>`}
      <hr class="sep">
      <h3>🌐 Your national team — ${esc(natR[1])} (${natR[2]})</h3>
      <div class="kv"><span>Status</span><b>${elig ? (elig === "senior" ? "✅ In senior squad contention" : "✅ " + elig + " squad contention") : "❌ Not close yet — improve your level"}</b></div>
      <div class="kv"><span>Senior caps / goals</span><b>${st.career.caps} / ${st.career.capGoals}</b></div>
      <div class="kv"><span>Youth caps</span><b>${st.career.youthCaps}</b></div>
    </div>
    <div class="card" style="flex:1.2">
      <h3>⭐ World's best players</h3>
      <div style="max-height:300px;overflow-y:auto"><table class="tbl">${stars}</table></div>
      <hr class="sep">
      <h3>🏟️ League explorer</h3>
      <div class="field"><select onchange="UI.worldLg(this.value)">${leagueOpts}</select></div>
      <div style="max-height:280px;overflow-y:auto"><table class="tbl">${lgView}</table></div>
    </div>
  </div>`;
}
UI.worldLg = function (id) { App.worldLeague = id; UI.renderTab(); };

/* ---------- TAB: LEGACY ---------- */
function tabLegacy(st) {
  const score = legacyScore(st);
  const [tier, tierDesc] = legacyTier(score);
  const trophies = st.career.trophies.map(t => `<div class="trophy"><div class="ico">${t.ico}</div><b>${esc(t.name)}</b><small>${esc(t.season)}</small></div>`).join("") || `<div class="muted">The cabinet is empty… for now.</div>`;
  const awards = st.career.awards.map(a => `<div class="kv"><span>${a.ico} ${esc(a.name)}</span><b>${esc(a.season)}</b></div>`).join("") || `<div class="muted">No individual awards yet.</div>`;
  const achs = ACHIEVEMENTS.map(a => `<div class="ach ${st.ach[a.id] ? "" : "locked"}"><span class="ico">${a.ico}</span><span><b>${esc(a.name)}</b><small>${esc(a.desc)}</small></span></div>`).join("");
  const transfers = st.career.transfers.map(t => `<div class="kv"><span>${esc(t.season)} → ${esc(t.club)}</span><b>${t.fee ? fmtM(t.fee) : "Free/Youth"}</b></div>`).join("") || `<div class="muted">No transfers yet.</div>`;
  const unlocked = Object.keys(st.ach).length;
  return `
  <div class="card">
    <h3>GOAT-O-METER</h3>
    <div class="goat-title">${tier}</div>
    <div class="center muted" style="margin-bottom:10px">${tierDesc} — Legacy score: <b class="gold">${score}</b></div>
    <div class="goat-wrap"><div class="goat-track"><i style="width:${clamp(score / 120 * 100, 2, 100)}%"></i></div>
    <div class="goat-marks"><span>Journeyman</span><span>Solid Pro</span><span>Cult Hero</span><span>Star</span><span>World Class</span><span>Legend</span><span>GOAT</span></div></div>
  </div>
  <div class="row" style="margin-top:14px">
    <div class="card" style="flex:1.2"><h3>🏆 Trophy cabinet (${st.career.trophies.length})</h3><div class="trophy-grid">${trophies}</div>
      <hr class="sep"><h3>🎖️ Individual awards</h3>${awards}
      <hr class="sep"><h3>💸 Transfer history (total fees ${fmtM(st.career.feesTotal)})</h3>${transfers}</div>
    <div class="card" style="flex:1"><h3>🏅 Achievements (${unlocked}/${ACHIEVEMENTS.length})</h3><div class="ach-grid" style="grid-template-columns:1fr">${achs}</div></div>
  </div>`;
}

/* ---------- ADVANCE ---------- */
UI.advance = async function () {
  if (App.busy || !App.state || App.state.retired) return;
  App.busy = true;
  const btn = document.getElementById("btnAdvance");
  if (btn) { btn.disabled = true; btn.textContent = "…"; }
  const hooks = {
    lifeEvent: UI.lifeEventModal,
    seasonReview: UI.seasonReviewModal,
    pressConf: UI.pressConf,
    pressOutcome: UI.pressOutcome,
    badEvent: UI.badEventModal,
    badEventNote: UI.badEventNoteModal,
  };
  if (!UI.quickSim) {
    hooks.start = UI.mStart; hooks.tick = UI.mTick; hooks.moment = UI.mMoment; hooks.end = UI.mEnd;
  }
  try {
    await advanceWeek(App.state, hooks);
  } catch (e) {
    console.error(e);
  }
  App.busy = false;
  Saves.save(App.slot, App.state);
  if (App.state.retired) UI.renderRetired();
  else UI.renderHub();
  showToasts(App.state);
};

/* ---------- MATCH OVERLAY ---------- */
const M = { delayBase: 620 };
function mDelay() { return UI.speed === 0 ? 15 : M.delayBase / UI.speed; }
const sleep = ms => new Promise(r => setTimeout(r, ms));

UI.mStart = async function (info) {
  M.info = info;
  modal(`
    <div class="comp-tag">${esc(info.fx.compName || "")}</div>
    <div class="scoreboard">
      <div class="team">${badgeHtml(info.fx.home || info.fx.neutral ? info.teamName : info.oppName, 46)}${esc(info.fx.home || info.fx.neutral ? info.teamName : info.oppName)}</div>
      <div class="score" id="mScore">0 - 0</div>
      <div class="team">${badgeHtml(info.fx.home || info.fx.neutral ? info.oppName : info.teamName, 46)}${esc(info.fx.home || info.fx.neutral ? info.oppName : info.teamName)}</div>
    </div>
    <div class="match-min" id="mMin">KICK-OFF ${info.starting ? "— you're in the starting XI!" : "— you start on the bench."}</div>
    <div class="ticker" id="mTicker"></div>
    <div id="mMoment"></div>
    <div class="speed-row">
      <button class="btn small ${UI.speed === 1 ? "primary" : "ghost"}" onclick="UI.setSpeed(1)">▶ 1x</button>
      <button class="btn small ${UI.speed === 2 ? "primary" : "ghost"}" onclick="UI.setSpeed(2)">⏩ 2x</button>
      <button class="btn small ${UI.speed === 0 ? "primary" : "ghost"}" onclick="UI.setSpeed(0)">⚡ Instant</button>
    </div>`);
  M.home = info.fx.home || info.fx.neutral;
  await sleep(mDelay());
};
UI.setSpeed = function (s) {
  UI.speed = s;
  document.querySelectorAll(".speed-row .btn").forEach((b, i) => {
    b.className = "btn small " + ([1, 2, 0][i] === s ? "primary" : "ghost");
  });
};
UI.mTick = async function (evt) {
  const tk = document.getElementById("mTicker");
  if (!tk) return;
  const div = document.createElement("div");
  div.className = "tick " + (evt.cls || "");
  div.innerHTML = `<span class="m">${evt.min}'</span>${esc(evt.txt)}`;
  tk.appendChild(div);
  tk.scrollTop = tk.scrollHeight;
  const sc = document.getElementById("mScore");
  if (sc && evt.score) sc.textContent = M.home ? `${evt.score[0]} - ${evt.score[1]}` : `${evt.score[1]} - ${evt.score[0]}`;
  const mm = document.getElementById("mMin");
  if (mm) mm.textContent = evt.min + "'";
  await sleep(mDelay() * (evt.cls && evt.cls.includes("goal") ? 1.6 : 1));
};
UI.mMoment = function (min, m, chances) {
  return new Promise(resolve => {
    const box = document.getElementById("mMoment");
    if (!box) return resolve(0);
    box.innerHTML = `<div class="moment-box">
      <h2>⚡ ${min}' — KEY MOMENT</h2>
      <div>${esc(m.txt)}</div>
      <div class="moment-opts">${m.opts.map((o, i) => {
        const c = chances[i];
        const cls = c >= 60 ? "grn" : c >= 40 ? "gold" : "red";
        return `<button class="moment-opt" data-i="${i}"><span>${esc(o.t)}</span><span class="odds ${cls}">${c}%</span></button>`;
      }).join("")}</div></div>`;
    box.querySelectorAll(".moment-opt").forEach(b => {
      b.onclick = () => { box.innerHTML = ""; resolve(+b.dataset.i); };
    });
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
};
UI.mEnd = function (res) {
  return new Promise(resolve => {
    const box = document.getElementById("mMoment");
    const st = App.state;
    const out = res.gf > res.ga ? `<span class="grn">VICTORY</span>` : res.gf < res.ga ? `<span class="red">DEFEAT</span>` : `<span class="gold">DRAW</span>`;
    if (!box) return resolve();
    box.innerHTML = `
      <hr class="sep">
      <div class="spread">
        <div><div style="font-size:19px;font-weight:900">FULL TIME — ${out}</div>
        <div class="muted" style="font-size:13px;margin-top:4px">
          ${res.goals ? "⚽ " + res.goals + " goal" + (res.goals > 1 ? "s" : "") + " · " : ""}${res.assists ? "🅰 " + res.assists + " assist" + (res.assists > 1 ? "s" : "") + " · " : ""}${res.mins} mins played
          ${res.card === "y" ? " · 🟨 booked" : res.card === "r" ? " · 🟥 SENT OFF" : ""}
          ${res.injured ? ` · <span class="red">🤕 ${esc(res.injured)} (${st.player.injury}w)</span>` : ""}
        </div></div>
        <div class="rating-badge ${ratingClass(res.rating)}">${res.rating.toFixed(1)}</div>
      </div>
      <div class="center" style="margin-top:14px"><button class="btn primary big" id="mDone">Continue</button></div>`;
    document.getElementById("mDone").onclick = () => { closeModal(); resolve(); };
  });
};

/* ---------- SETTINGS ---------- */
UI.settingsModal = function () {
  const st = App.state;
  const S = st.settings;
  modal(`
    <div class="comp-tag">⚙️ Settings</div>
    <div style="display:flex;flex-direction:column;gap:14px;margin-top:10px">
      <label class="spread" style="cursor:pointer;font-size:14px">
        <span>🎙️ <b>Press conferences</b><br><small class="muted">Post-match media questions. ${PRESS_TOTAL.toLocaleString()} unique conferences in the game — you've faced ${(st.pressCount || 0).toLocaleString()}.</small></span>
        <input type="checkbox" ${S.pressConf !== false ? "checked" : ""} onchange="UI.setSetting('pressConf', this.checked)" style="width:20px;height:20px">
      </label>
      <label class="spread" style="cursor:pointer;font-size:14px">
        <span>💔 <b>Bad life events</b><br><small class="muted">Losses, grief, and hard weeks that hurt your form (${BAD_TOTAL} unique events, 1-2 per season). Turn off for a lighter game.</small></span>
        <input type="checkbox" ${S.badEvents !== false ? "checked" : ""} onchange="UI.setSetting('badEvents', this.checked)" style="width:20px;height:20px">
      </label>
      <label class="spread" style="cursor:pointer;font-size:14px">
        <span>⚡ <b>Quick-sim matches</b><br><small class="muted">Skip interactive match play and jump to results.</small></span>
        <input type="checkbox" ${S.quickSim ? "checked" : ""} onchange="UI.setSetting('quickSim', this.checked)" style="width:20px;height:20px">
      </label>
      <div class="spread" style="font-size:14px">
        <span>🎬 <b>Default match speed</b></span>
        <span>
          <button class="btn small ${S.speed === 1 ? "primary" : "ghost"}" onclick="UI.setSetting('speed',1)">1x</button>
          <button class="btn small ${S.speed === 2 ? "primary" : "ghost"}" onclick="UI.setSetting('speed',2)">2x</button>
          <button class="btn small ${S.speed === 0 ? "primary" : "ghost"}" onclick="UI.setSetting('speed',0)">Instant</button>
        </span>
      </div>
    </div>
    <hr class="sep">
    <div class="spread">
      <button class="btn ghost" onclick="UI.backToMenu()">🏠 Main menu (switch career)</button>
      <button class="btn primary" onclick="UI.closeSettings()">Done</button>
    </div>
    <div class="dim center" style="font-size:11px;margin-top:8px">Your career autosaves every week — it's safe to leave any time.</div>`);
};
UI.backToMenu = function () {
  if (App.state) Saves.save(App.slot, App.state);
  closeModal();
  UI.renderMenu();
};
UI.setSetting = function (key, val) {
  const st = App.state;
  st.settings[key] = val;
  if (key === "quickSim") UI.quickSim = val;
  if (key === "speed") { UI.speed = val; UI.settingsModal(); }
  Saves.save(App.slot, st);
};
UI.closeSettings = function () { closeModal(); UI.renderHub(); };

/* ---------- PRESS CONFERENCE MODAL ---------- */
UI.pressConf = function (pc) {
  return new Promise(resolve => {
    modal(`
      <div class="comp-tag">🎙️ Press conference${pc.special ? ' — <span class="gold">SPECIAL</span>' : ""}</div>
      <div style="font-size:16px;line-height:1.55;margin:10px 0 16px;font-style:italic">“${esc(pc.text)}”</div>
      <div class="moment-opts">${pc.answers.map((a, i) => `<button class="moment-opt" data-i="${i}"><span>${a.ico} ${esc(a.text)}</span></button>`).join("")}</div>`);
    $ov().querySelectorAll(".moment-opt").forEach(b => {
      b.onclick = () => resolve(+b.dataset.i);
    });
  });
};
UI.pressOutcome = function (outcome) {
  return new Promise(resolve => {
    modal(`
      <div class="comp-tag">🎙️ Press conference</div>
      <div style="font-size:15px;line-height:1.5;margin:12px 0 16px">${esc(outcome)}</div>
      <div class="center"><button class="btn primary" id="pcDone">Continue</button></div>`);
    document.getElementById("pcDone").onclick = () => { closeModal(); resolve(); };
  });
};

/* ---------- BAD EVENT MODAL ---------- */
UI.badEventModal = function (ev) {
  return new Promise(resolve => {
    const sevTag = ev.sev === 3 ? '<span class="pill red">DEVASTATING NEWS</span>' : ev.sev === 2 ? '<span class="pill red">BAD NEWS</span>' : '<span class="pill dim">ROUGH WEEK</span>';
    modal(`
      <div class="comp-tag" style="color:var(--red)">💔 Life happens — the hard kind</div>
      <div class="center" style="font-size:34px;margin:6px 0">${ev.ico}</div>
      <div class="center" style="margin-bottom:10px">${sevTag}</div>
      <div style="font-size:16px;line-height:1.6;margin:8px 0 16px;text-align:center">${esc(ev.t)}</div>
      <div class="moment-opts">${BAD_RESPONSES.map((r, i) => `<button class="moment-opt" style="border-color:#4a2833" data-i="${i}"><span>${esc(r.t)}<br><small class="dim">${esc(r.d)}</small></span></button>`).join("")}</div>`);
    $ov().querySelectorAll(".moment-opt").forEach(b => {
      b.onclick = () => resolve(+b.dataset.i);
    });
  });
};
UI.badEventNoteModal = function (ev, note) {
  return new Promise(resolve => {
    const st = App.state;
    modal(`
      <div class="comp-tag" style="color:var(--red)">💔</div>
      <div style="font-size:15px;line-height:1.6;margin:10px 0 6px;text-align:center">${esc(note)}</div>
      <div class="center muted" style="font-size:12px;margin-bottom:14px">${st.grief ? `Your head won't fully be in the game for ~${st.grief.weeks} week${st.grief.weeks === 1 ? "" : "s"}. Expect performances to dip.` : ""}</div>
      <div class="center"><button class="btn primary" id="beDone">Keep going</button></div>`);
    document.getElementById("beDone").onclick = () => { closeModal(); resolve(); };
  });
};

/* ---------- LIFE EVENT MODAL ---------- */
UI.lifeEventModal = function (ev) {
  return new Promise(resolve => {
    modal(`
      <div class="comp-tag">💬 Life happens</div>
      <div style="font-size:16px;line-height:1.5;margin:8px 0 14px">${esc(ev.txt)}</div>
      <div class="moment-opts">${ev.opts.map((o, i) => `<button class="moment-opt" data-i="${i}"><span>${esc(o.t)}</span></button>`).join("")}</div>`);
    $ov().querySelectorAll(".moment-opt").forEach(b => {
      b.onclick = () => { closeModal(); resolve(+b.dataset.i); };
    });
  });
};

/* ---------- SEASON REVIEW ---------- */
UI.seasonReviewModal = function (st, review) {
  return new Promise(resolve => {
    M.reviewResolve = resolve;
    M.review = review;
    UI.drawReview(st, review);
  });
};
UI.drawReview = function (st, review) {
  const p = st.player;
  const items = review.items.map(t => `<div class="feed-item ${t.includes("PROMOTED") || t.includes("🏆") ? "gold" : t.includes("Relegated") || t.includes("released") ? "red" : "blu"}">${esc(t)}</div>`).join("");
  const awards = review.awards.map(t => `<div class="feed-item gold">${esc(t)}</div>`).join("");
  const ballon = (st.ballonTop || []).slice(0, 5).map((r, i) => `<div class="kv"><span>${i + 1}. ${esc(r.name)}${r.you ? " ⭐(YOU)" : ""}</span><b class="dim">${esc(r.club)}</b></div>`).join("");
  const decisions = (review.decisions || []).map((d, i) => d.type === "pro"
    ? `<div class="offer"><div class="head">${badgeHtml(d.club, 36)}<b>PROFESSIONAL CONTRACT — ${esc(d.club)}</b></div>
       <div class="terms"><span>Wage: <b>${fmtM(d.wage)}/wk</b></span><span>Length: <b>${d.years}yr</b></span></div>
       <button class="btn gold" onclick="UI.reviewPro(${i})">✍️ Sign your first pro deal</button></div>`
    : `<div class="offer"><div class="head">${badgeHtml(d.club, 36)}<b>CONTRACT RENEWAL — ${esc(d.club)}</b></div>
       <div class="terms"><span>New wage: <b>${fmtM(d.wage)}/wk</b></span><span>Length: <b>${d.years}yr</b></span></div>
       <div class="spread"><button class="btn primary" onclick="UI.reviewRenew(${i})">Renew</button><button class="btn ghost small" onclick="UI.reviewDeclineRenew(${i})">Let it run out</button></div></div>`
  ).join("");
  const offers = st.offers.map((o, i) => `
    <div class="offer"><div class="head">${badgeHtml(o.club, 36)}<div><b>${esc(o.club)}</b> ${o.kind === "loan" ? '<span class="pill blu">LOAN</span>' : ""}<br><small class="muted">${esc(o.leagueName)} · rating ${o.clubR}</small></div></div>
    <div class="terms">${o.fee ? `<span>Fee: <b>${fmtM(o.fee)}</b></span>` : ""}<span>Wage: <b>${fmtM(o.wage)}/wk</b></span><span>Role: <b>${o.role.toUpperCase()}</b></span></div>
    <button class="btn primary small" onclick="UI.reviewAccept(${i})">Accept</button></div>`).join("");
  modal(`
    <div class="comp-tag">Season review — ${esc(review.seasonName)}</div>
    <div class="season-title center">${esc(p.name)}, age ${p.age}</div>
    <div class="statgrid" style="margin:12px 0">
      <div class="statbox"><b>${review.stats.app}</b><small>Apps</small></div>
      <div class="statbox"><b>${review.stats.gls}</b><small>Goals</small></div>
      <div class="statbox"><b>${review.stats.ast}</b><small>Assists</small></div>
      <div class="statbox"><b>${review.stats.avg}</b><small>Avg rating</small></div>
      <div class="statbox"><b class="${review.growth >= 0 ? "grn" : "red"}">${review.growth >= 0 ? "+" : ""}${review.growth}</b><small>OVR growth</small></div>
    </div>
    ${items}${awards}
    ${ballon ? `<hr class="sep"><h3 style="font-size:12px;color:var(--mut);text-transform:uppercase;letter-spacing:.1em">🎖️ Ballon d'Or podium</h3>${ballon}` : ""}
    ${decisions ? `<hr class="sep">${decisions}` : ""}
    ${offers ? `<hr class="sep"><h3 style="font-size:12px;color:var(--mut);text-transform:uppercase;letter-spacing:.1em">📋 Summer offers</h3>${offers}` : ""}
    <hr class="sep">
    <div class="spread">
      ${review.mustRetire ? "" : `<button class="btn primary big" onclick="UI.reviewDone()">Start ${esc(seasonLabel(st.year + 1))} →</button>`}
      ${review.canRetire || review.mustRetire ? `<button class="btn ${review.mustRetire ? "danger big" : "ghost"}" onclick="UI.reviewRetire()">🌅 Retire${review.mustRetire ? " (no options left)" : ""}</button>` : ""}
    </div>`, "wide");
};
UI.reviewPro = function (i) {
  const st = App.state, d = M.review.decisions[i];
  st.academy = null;
  st.contract = { wage: d.wage, until: st.year + 1 + d.years, role: "prospect" };
  st.club = { name: d.club, leagueId: findClubIn(st.leagues, d.club).league.id };
  unlock(st, "debut");
  if (st.player.age <= 17) unlock(st, "teen_debut");
  addNews(st, `✍️ First professional contract signed with ${d.club}!`, "gold");
  M.review.decisions.splice(i, 1);
  UI.drawReview(st, M.review);
};
UI.reviewRenew = function (i) {
  const st = App.state, d = M.review.decisions[i];
  st.contract = { wage: d.wage, until: st.year + 1 + d.years, role: st.contract ? st.contract.role : "rotation" };
  addNews(st, `✍️ Contract renewed with ${st.club.name} until ${st.contract.until}.`, "grn");
  M.review.decisions.splice(i, 1);
  M.review.freeAgent = false;
  UI.drawReview(st, M.review);
};
UI.reviewDeclineRenew = function (i) {
  M.review.decisions.splice(i, 1);
  M.review.freeAgent = true;
  App.state.contract = null;
  App.state.club = { name: "Free Agent", leagueId: null };
  App.state.offers = App.state.offers.concat(generateOffers(App.state, "forced")).slice(0, 7);
  UI.drawReview(App.state, M.review);
};
UI.reviewAccept = function (i) {
  const st = App.state;
  acceptOffer(st, st.offers[i]);
  M.review.freeAgent = false;
  UI.drawReview(st, M.review);
};
UI.reviewDone = function () {
  const st = App.state;
  if (st.club.name === "Free Agent" && !st.offers.length && !(M.review.decisions || []).length) {
    // nothing to continue with
    return UI.reviewRetire();
  }
  closeModal();
  if (M.reviewResolve) { M.reviewResolve(); M.reviewResolve = null; }
};
UI.reviewRetire = function () {
  doRetire(App.state);
  closeModal();
  if (M.reviewResolve) { M.reviewResolve(); M.reviewResolve = null; }
};

/* ---------- RETIRED ---------- */
UI.renderRetired = function () {
  App.screen = "retired";
  const st = App.state, c = st.career, p = st.player;
  const score = legacyScore(st);
  const [tier, tierDesc] = legacyTier(score);
  const seasons = c.seasons.map(s => `<tr><td>${esc(s.season)}</td><td>${esc(s.club)}</td><td class="dim">${esc(s.league)}</td><td class="r">${s.app}</td><td class="r">${s.gls}</td><td class="r">${s.ast}</td><td class="r">${s.avg || "—"}</td></tr>`).join("");
  const trophies = c.trophies.map(t => `<div class="trophy"><div class="ico">${t.ico}</div><b>${esc(t.name)}</b><small>${esc(t.season)}</small></div>`).join("") || "<div class='muted'>None — but you lived it.</div>";
  $app().innerHTML = `
  <div class="wizard">
    <div class="card center" style="margin-bottom:14px">
      <div class="comp-tag">CAREER COMPLETE</div>
      <div class="logo-big" style="font-size:34px">${esc(p.name)}</div>
      <div class="muted">${esc(POS_INFO[p.pos].name)} · ${esc(natById(p.nat)[1])} · retired at ${st.retiredAt ? st.retiredAt.age : p.age} (${st.retiredAt ? esc(st.retiredAt.season) : ""})</div>
      <div class="goat-title" style="margin-top:14px">${tier}</div>
      <div class="muted">${tierDesc}</div>
      <div class="goat-wrap"><div class="goat-track"><i style="width:${clamp(score / 120 * 100, 2, 100)}%"></i></div></div>
      <div class="gold" style="font-weight:900;font-size:20px">Legacy score: ${score}</div>
      <div class="statgrid" style="margin-top:14px">
        <div class="statbox"><b>${c.apps}</b><small>Apps</small></div>
        <div class="statbox"><b>${c.goals}</b><small>Goals</small></div>
        <div class="statbox"><b>${c.assists}</b><small>Assists</small></div>
        <div class="statbox"><b>${c.caps}</b><small>Caps</small></div>
        <div class="statbox"><b>${c.trophies.length}</b><small>Trophies</small></div>
        <div class="statbox"><b>${c.ballons}</b><small>Ballons d'Or</small></div>
        <div class="statbox"><b>${c.peakOvr}</b><small>Peak OVR</small></div>
        <div class="statbox"><b>${fmtM(c.peakValue)}</b><small>Peak value</small></div>
      </div>
    </div>
    <div class="card" style="margin-bottom:14px"><h3>🏆 Honours</h3><div class="trophy-grid">${trophies}</div></div>
    <div class="card" style="margin-bottom:14px"><h3>📜 Season by season</h3><div style="overflow-x:auto"><table class="tbl"><tr><th>Season</th><th>Club</th><th>League</th><th class="r">Apps</th><th class="r">Gls</th><th class="r">Ast</th><th class="r">Avg</th></tr>${seasons}</table></div></div>
    <div class="center"><button class="btn primary big" onclick="UI.newInSlot(${App.slot})">🔄 Start a new career</button>
    <button class="btn ghost" onclick="UI.renderMenu()">Main menu</button></div>
  </div>`;
};
