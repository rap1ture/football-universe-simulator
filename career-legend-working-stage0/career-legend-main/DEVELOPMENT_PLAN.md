# Career Legend — Custom Football Universe Development Notes

## Baseline audit (uploaded repository)

**Decision: keep Career Legend as the prototype/base for now. Do not rewrite it from scratch yet.** Its existing career loop is substantial enough to preserve, but the long-term game will need a clearer domain/data boundary before major features are added.

### What is already here
- Plain HTML/CSS/JavaScript; no build step or package dependencies.
- 22 bundled leagues, 454 club entries and 32 academy entries in the uploaded snapshot.
- A functioning player-growth, training, match, season, transfer/contract, national-team, awards, sponsorship and life-event loop.
- Five browser-local save slots with additive save migration.
- A useful separation into `player.js`, `engine.js`, `career.js`, data files and `ui.js`.

### Important limitations discovered
- The app is built around browser globals and script load order rather than modules or explicit services.
- `newCareer()` copies the bundled `LEAGUES` into each save, while much of the surrounding logic expects the existing league/team shape and IDs. A custom-world editor cannot safely be bolted on as arbitrary UI forms; it needs validated world data and a versioned schema.
- The current world simulation is primarily rule-based match/season simulation, not a continuously evolving population of individually modelled AI players and clubs.
- The bundled `STARS_SEED` and generated names do not amount to a complete, editable database of real-world player squads.
- There is no LLM integration or AI-provider abstraction in this snapshot. Existing random events, generated messages and match decisions are authored/procedural systems, not generative AI.
- Saves use `localStorage`. This is convenient but has browser storage limits and is not a robust export/backup strategy by itself.
- UI, simulation and persistence are coupled in several places. Large feature additions without tests would risk breaking existing careers.

## AI design goal: practically unbounded variation, not a fake “infinite” button

The goal is for an AI storyteller to make career and life situations feel open-ended while the deterministic simulation remains responsible for facts and rules. The model should be able to propose new conversations, dilemmas, media stories, relationships, agent negotiations and career/life events based on the save. The game—not the model—must validate choices and apply effects to attributes, money, contracts, fixtures, relationships and other structured state.

Design constraints:
1. Keep an ordinary playable mode when AI is disabled, unavailable or offline.
2. Put AI behind a provider interface, so local models and hosted APIs can be swapped without rewriting career logic.
3. Never put private provider API keys in browser JavaScript. Hosted providers need a small local/server-side proxy; a local model can be called through a local adapter where supported.
4. Send only the minimum relevant save context to a model. Make external requests opt-in and explain what is sent.
5. Require structured outputs (for example, JSON event proposals), validate them against a schema and allowed effects, cap output sizes, and reject invalid responses. The model must not directly execute code or mutate the save.
6. Give the player controls for AI frequency, tone, realism, content boundaries, offline fallback and whether AI-generated text is stored in saves.
7. Use templates/rules for core football truth: standings, transfers, wages, contracts, match results and competition formats must stay internally consistent. AI supplies variety, not authoritative arithmetic.

“Near-infinite” should mean a large combinatorial world plus context-aware generative content and player-authored customisation. It cannot literally mean unlimited memory, perfectly factual real-world data, or guaranteed coherent output forever.

## Build sequence

### Stage 0 — Baseline and safety net (started in this snapshot)
- Preserve the downloaded ZIP unchanged as `career-legend-original-untouched.zip` outside the working source folder.
- Add a Node smoke-test harness without changing game behaviour.
- Verify source syntax, data loading, new-career creation and a complete 48-week season simulation.

### Stage 1 — Save and world foundations
- Define and document a versioned world schema for nations, clubs, players, leagues, cups, formats and rules.
- Add explicit import/export/backup for saves and worlds, plus validation and migration tests.
- Separate built-in world data from a save's editable world copy; prevent edits from mutating other save slots.

### Stage 2 — Custom Universe MVP
- Create/edit/delete nations, clubs, players and leagues.
- Configure team count, schedule format, points and promotion/relegation rules where supported.
- Validate references, duplicates, invalid ratings and impossible competition configurations before allowing a world to start.
- Make one custom league playable end-to-end before adding every competition type.

### Stage 3 — Deeper living simulation
- Give AI clubs budgets, squad needs, contracts, youth development, managers and strategic priorities.
- Add persistent player identities and world-wide transfer/retirement/new-generation flows.
- Add reproducible simulation tests so a multi-season sim cannot silently corrupt a world.

### Stage 4 — AI storyteller and life simulator
- Add a provider interface and a structured event schema.
- Start with optional AI-generated conversations and life/career events, using game-validated choices and effects.
- Extend into agents, relationships, teammates, rivals, media, sponsors and emergent story arcs.
- Add rate/cost controls, caching, fallback content and privacy settings.

### Stage 5 — Advanced control and polish
- In-game world editor, control/switch player or club, simulation settings, multiple save slots, import/export, autosave recovery and regression coverage.

## Baseline tests

From this folder, run:

```bash
node tests/smoke-test.js
```

The test loads the core JavaScript in a Node VM, checks the bundled world data and player creation, then auto-resolves decisions through a 48-week season. It is a smoke test, not proof that every UI path or every competition is bug-free. The original browser game should still be launched and manually tested before a release.
