"use strict";
/* ===== SAVES & BOOT ===== */
const SAVE_SLOTS = 5;
const Saves = {
  key: i => "career_legend_slot_" + i,
  save(i, state) {
    try { localStorage.setItem(this.key(i), JSON.stringify(state)); } catch (e) { console.warn("save failed", e); }
  },
  load(i) {
    try {
      const raw = localStorage.getItem(this.key(i));
      return raw ? migrateState(JSON.parse(raw)) : null;
    } catch (e) { return null; }
  },
  meta(i) {
    const st = this.load(i);
    if (!st) return null;
    return { name: st.player.name, club: st.club.name, pos: st.player.pos, age: st.player.age, ovr: st.player.ovr, season: seasonLabel(st.year) + (st.retired ? " (retired)" : "") };
  },
  clear(i) { localStorage.removeItem(this.key(i)); },
};

/* debug hook */
window.__CL = {
  get state() { return App.state; },
  App, UI,
  async simWeeks(n) {
    const prevQuick = UI.quickSim;
    UI.quickSim = true;
    for (let i = 0; i < n; i++) {
      if (!App.state || App.state.retired) break;
      await advanceWeek(App.state, {
        lifeEvent: async ev => ri(0, ev.opts.length - 1),
        seasonReview: async (st, review) => {
          // auto-resolve: sign pro/renewals, take best offer if free agent, never retire unless forced
          for (const d of (review.decisions || [])) {
            if (d.type === "pro") {
              st.academy = null;
              st.contract = { wage: d.wage, until: st.year + 1 + d.years, role: "prospect" };
              st.club = { name: d.club, leagueId: findClubIn(st.leagues, d.club).league.id };
            } else {
              st.contract = { wage: d.wage, until: st.year + 1 + d.years, role: st.contract ? st.contract.role : "rotation" };
            }
          }
          if (review.mustRetire) doRetire(st);
        },
      });
    }
    UI.quickSim = prevQuick;
    Saves.save(App.slot, App.state);
    if (App.state.retired) UI.renderRetired(); else UI.renderHub();
    return { week: App.state.week, year: App.state.year, ovr: App.state.player.ovr, age: App.state.player.age, club: App.state.club.name };
  },
  newTest(diff = "normal", pos = "ST") {
    App.slot = 3;
    App.state = newCareer({ name: "Test Player", pos, nat: "ENG", diff, academy: pick(ACADEMIES) });
    UI.renderHub();
    return "ok";
  },
};

window.addEventListener("error", e => console.error("[CL]", e.message, e.filename, e.lineno));
document.addEventListener("DOMContentLoaded", () => UI.renderMenu());
