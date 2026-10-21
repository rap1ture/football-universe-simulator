# ⚽ Career Legend — Road to GOAT

A free, open-source **soccer/football career simulator** that runs entirely in your browser. No install, no account, no server — just open it and play.

You start at **14 years old** in a youth academy and live an entire career: earn your first professional contract, fight for minutes, move clubs, play for your country, win the Ballon d'Or… or grind out a living in the third division. Every career is different.

**▶️ [Play it now in your browser](https://randomprojects1234.github.io/career-legend/)** — free, no install, no account.

---

## Features

- **470+ real clubs** — top 3 divisions of England, Spain, Italy, Germany & France, plus the Eredivisie, Liga Portugal, the top 2 divisions of Argentina & Brazil, and all 30 MLS teams. Promotion and relegation run across the whole world every season.
- **68 national teams** with World Cups, Euros, Copa América, AFCON, Asian Cup and Gold Cup (U17, U20 and senior levels).
- **Interactive matches** — a live ticker plus "key moment" decisions where you choose what to do, with odds based on your attributes and form.
- **53 trainable skill moves** — Rainbow Flick, Rabona, Air Elastico, Panenka and more. Train each one individually; the higher the level, the more reliably it works in matches.
- **48 match scenarios** that rotate so games stay fresh, plus real penalty shootouts in knockouts (you take a kick yourself).
- **10,629 unique press conferences** with answers tailored to each question.
- **20,000 unique Instagram DMs** from teammates, your agent, the manager, family, journalists, rivals and brands — plus 10,000 fan messages.
- **101 brand endorsements** (McDonald's, Costco, Uber Eats, Apple, Ferrari…), boot sponsors, agents and a shop to spend it all in.
- **A life outside football** — fan love, social media, morale, injuries, and 100 unforgettable bad life events that genuinely affect how you play.
- **4 difficulties**, from a relaxed Wonderkid run to the brutal Road to GOAT.
- **5 career slots**, autosaved every week, with a full career retrospective and a GOAT-o-meter legacy rank when you retire.

## Running it locally

It's a static site — no build step and no dependencies. Any static file server works:

```bash
python -m http.server 3999
```

Then open <http://localhost:3999>. (Windows users can double-click `Start Soccer Career.bat`.)

Opening `index.html` directly via `file://` also mostly works, but a local server is recommended.

## Project layout

| File | What's in it |
| --- | --- |
| `index.html` | Entry point and script order |
| `styles.css` | All styling |
| `util.js` | Math, formatting and random helpers |
| `data_clubs.js` | Every league and club |
| `data_world.js` | Nations, academies, positions, difficulties, base match moments |
| `data_press.js` | Press conference system |
| `data_skills.js` | Skill moves + extra match moments |
| `data_brands.js` | Brand endorsements |
| `data_dms.js` | Instagram DM inbox and fan mail |
| `data_badevents.js` | Bad life events and grief |
| `player.js` | Attributes, growth, training, market value |
| `engine.js` | Match engine, shootouts, fixtures, world simulation |
| `career.js` | Season flow, transfers, contracts, awards, save migration |
| `ui.js` | All rendering and interaction |
| `main.js` | Save system and boot |

## Saves

Careers are stored in your browser's `localStorage`, so they live on the device you play on and aren't uploaded anywhere. Saves are migrated forward automatically when the game updates, so updating never costs you progress.

> **Note on updates:** script tags in `index.html` carry a `?v=N` cache-busting stamp. If you fork this and ship a change, bump that number so players don't run stale code.

## Contributing

Issues and pull requests are welcome — new clubs, new match scenarios, balance tweaks, bug fixes, translations, anything. The codebase is plain vanilla JavaScript with no build tooling, so you can edit a file and hit refresh.

## License

[MIT](LICENSE) — free to use, modify and distribute.

Club, competition and brand names are referenced for identification only; this is a non-commercial fan project and is not affiliated with or endorsed by any club, league or company.
