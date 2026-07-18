# Fight Universe — President Mode

A "president mode" companion app for tracking your own MMA promotion: build a
fighter roster, run divisional rankings, book events and fight cards, record
results, and watch title lineage update automatically. Built for people
running their own fictional universe alongside a UFC video game career mode.

## Features

- **Roster** — add fighters per weight class with nickname, country, stance,
  status, and record.
- **Rankings** — set a champion per division and maintain a drag-to-reorder
  top-15 contenders list. Rankings shift automatically when you record a
  result.
- **Events** — create events, build main card / prelims / early prelims,
  book fights (including title fights), and record results (method, round,
  time).
- **Title History** — championship lineage per division: who won the belt,
  how, and how many times they've defended it.
- **Dashboard** — current champions, upcoming events, and recent results at
  a glance.

All data is stored locally in your browser (`localStorage`) — there's no
backend or account system. Use the **Export**/**Import** buttons at the
bottom of the sidebar to back up your full universe (fighters, weight
classes, events, fights, and title history) to a JSON file, or restore one.
Importing replaces all current data, so export first if you want to keep
what you have.

## Starting roster

New installs start pre-loaded with the current UFC roster, champions, and
divisional rankings, generated from `data/ufc-fighters.csv`, plus a
hand-curated set of legends and retired fighters exclusive to the EA Sports
UFC 6 roster (Korean Zombie, GSP, Anderson Silva, Jon Jones, Ronda Rousey,
etc.), added active but unranked. Real fighters carry their real career
win/loss record from the CSV; legends/retired additions start at 0-0-0.
`src/utils/seedData.ts` is generated — don't hand-edit it. To refresh it
after updating `data/ufc-fighters.csv` or the legends list in
`scripts/generate-seed-data.py`, run:

```bash
npm run seed:generate   # requires python3
```

If you already have data in this browser, the seed is never re-applied — it
only affects a fresh install.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run lint      # oxlint
```

`npm install` only needs to run once (or after `package.json` changes) —
skip it on later runs and just use `npm run dev`, which starts in under a
second.

### Quick start

Double-click `start.bat` (Windows) or run `./start.sh` (macOS/Linux). Either
one installs dependencies on the very first run only, then starts the dev
server and opens the app in your browser automatically.
