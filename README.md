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
backend or account system.

## Starting roster

New installs start pre-loaded with a best-effort snapshot of the real UFC
roster/champions/rankings (~July 2026), plus fighters exclusive to the
EA Sports UFC 6 roster (legends and new additions), seeded as active but
unranked (`src/utils/seedData.ts`). Every seeded fighter starts at 0-0-0 —
this app tracks fights booked in *your* universe going forward, not real
fight history. Rankings depth varies by division depending on what could be
reliably sourced at seed time; add or reorder fighters on the Rankings page
to fill in the rest. If you already have data in this browser, the seed is
never re-applied — it only affects a fresh install.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run lint      # oxlint
```
