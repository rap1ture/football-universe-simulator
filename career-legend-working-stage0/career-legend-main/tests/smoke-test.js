"use strict";
// Lightweight Node smoke tests for Career Legend's browser-global code.
// Run from the project root with: node tests/smoke-test.js
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const context = {
  console, Math, JSON, Date, Set, Map, Promise,
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  window: { addEventListener() {} },
  document: {
    addEventListener() {},
    getElementById() { return { innerHTML: "", classList: { add() {}, remove() {} }, appendChild() {} }; },
  },
};
vm.createContext(context);
for (const file of [
  "util.js", "data_clubs.js", "data_world.js", "data_press.js", "data_skills.js",
  "data_brands.js", "data_dms.js", "data_badevents.js", "player.js", "engine.js", "career.js",
]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}

function check(condition, message) { assert.ok(condition, message); }
const stats = vm.runInContext(`({
  leagues: LEAGUES.length,
  clubs: LEAGUES.reduce((n, league) => n + league.teams.length, 0),
  academyCount: ACADEMIES.length,
  positions: Object.keys(POS_INFO),
})`, context);
check(stats.leagues > 0, "league data should load");
check(stats.clubs > 400, "expected the bundled large club database to load");
check(stats.academyCount > 0, "academy data should load");
console.log(`PASS data loads (${stats.leagues} leagues, ${stats.clubs} clubs, ${stats.academyCount} academies)`);

const state = vm.runInContext(
  `newCareer({ name: "Regression Test", pos: "ST", nat: "ENG", diff: "normal", academy: ACADEMIES[0] })`,
  context,
);
check(state.player.name === "Regression Test", "player name should be retained");
check(state.player.age === 14, "new career should start at age 14");
check(state.player.ovr >= 1 && state.player.ovr <= 99, "overall rating should be within bounds");
check(state.leagues.length === stats.leagues, "career should clone league data into its save state");
console.log(`PASS new career creation (OVR ${state.player.ovr}, academy ${state.academy.name})`);

(async () => {
  let callbacks = 0;
  for (let i = 0; i < 48; i++) {
    await context.advanceWeek(state, {
      lifeEvent: async event => { callbacks++; return 0; },
      badEvent: async event => { callbacks++; return 0; },
      badEventNote: async () => {},
      seasonReview: async (save, review) => {
        callbacks++;
        for (const decision of review.decisions || []) {
          if (decision.type === "pro") {
            save.academy = null;
            save.contract = { wage: decision.wage, until: save.year + 1 + decision.years, role: "prospect" };
            const club = context.findClubIn(save.leagues, decision.club);
            if (club) save.club = { name: decision.club, leagueId: club.league.id };
          } else {
            save.contract = { wage: decision.wage, until: save.year + 1 + decision.years, role: save.contract ? save.contract.role : "rotation" };
          }
        }
        if (review.mustRetire) context.doRetire(save);
      },
    });
  }
  check(state.player.age >= 15, "a completed season should age the player");
  check(state.career.apps >= 0 && state.career.goals >= 0, "career statistics should remain non-negative");
  check(state.year >= 2027, "a full 48-week run should roll into the next season");
  check(state.leagues.every(league => league.teams.every(team => Number.isFinite(team.r))), "club ratings should remain numeric");
  console.log(`PASS 48-week season simulation (season ${state.year}, age ${state.player.age}, apps ${state.career.apps}, goals ${state.career.goals})`);
  console.log("ALL SMOKE TESTS PASSED");
})().catch(error => { console.error(error); process.exitCode = 1; });
