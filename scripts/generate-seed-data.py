#!/usr/bin/env python3
"""
Regenerates src/utils/seedData.ts from data/ufc-fighters.csv (the current
UFC roster/rankings snapshot) plus a small hand-curated list of legends and
retired fighters exclusive to the EA Sports UFC 6 roster.

Run: python3 scripts/generate-seed-data.py
"""
import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "data" / "ufc-fighters.csv"
OUT_PATH = ROOT / "src" / "utils" / "seedData.ts"

WC_MAP = {
    "flyweight": ("wc-m-flyweight", "Flyweight", "Men", 125),
    "bantamweight": ("wc-m-bantamweight", "Bantamweight", "Men", 135),
    "featherweight": ("wc-m-featherweight", "Featherweight", "Men", 145),
    "lightweight": ("wc-m-lightweight", "Lightweight", "Men", 155),
    "welterweight": ("wc-m-welterweight", "Welterweight", "Men", 170),
    "middleweight": ("wc-m-middleweight", "Middleweight", "Men", 185),
    "light heavyweight": ("wc-m-light-heavyweight", "Light Heavyweight", "Men", 205),
    "heavyweight": ("wc-m-heavyweight", "Heavyweight", "Men", 265),
    "women's strawweight": ("wc-w-strawweight", "Women's Strawweight", "Women", 115),
    "women's flyweight": ("wc-w-flyweight", "Women's Flyweight", "Women", 125),
    "women's bantamweight": ("wc-w-bantamweight", "Women's Bantamweight", "Women", 135),
    "women's featherweight": ("wc-w-featherweight", "Women's Featherweight", "Women", 145),
}
# Preserve a stable, sensible division order in the output.
WC_ORDER = [
    "wc-m-flyweight", "wc-m-bantamweight", "wc-m-featherweight", "wc-m-lightweight",
    "wc-m-welterweight", "wc-m-middleweight", "wc-m-light-heavyweight", "wc-m-heavyweight",
    "wc-w-strawweight", "wc-w-flyweight", "wc-w-bantamweight", "wc-w-featherweight",
]


def slugify(name: str, used: set) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    base = f"f-{base}"
    slug = base
    n = 2
    while slug in used:
        slug = f"{base}-{n}"
        n += 1
    used.add(slug)
    return slug


def ts_str(s: str) -> str:
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"


def load_csv_fighters():
    used_ids: set = set()
    fighters = []  # list of dict
    rankings_by_wc = {wc: [] for wc in WC_ORDER}  # (rank, name, id)
    champion_by_wc = {}

    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            name = row["fighter"].strip()
            gender = row["gender"].strip()
            wc_field = row["weightclass"].strip()
            if not name or not wc_field or gender not in ("male", "female"):
                continue  # incomplete rows (4 in the source data)

            primary_wc = wc_field.split(",")[0].strip().lower()
            if primary_wc not in WC_MAP:
                continue
            wc_id = WC_MAP[primary_wc][0]

            country_field = row.get("country", "").strip()
            country = country_field.split(",")[0].strip() if country_field and country_field != "NA" else None

            try:
                wins = int(row["wins"])
            except (ValueError, KeyError):
                wins = 0
            try:
                losses = int(row["losses"])
            except (ValueError, KeyError):
                losses = 0
            try:
                bouts = int(row["bouts"])
            except (ValueError, KeyError):
                bouts = wins + losses
            draws = max(0, bouts - wins - losses)

            fid = slugify(name, used_ids)
            fighters.append({
                "id": fid,
                "name": name,
                "weightClassId": wc_id,
                "country": country,
                "wins": wins,
                "losses": losses,
                "draws": draws,
            })

            rank_raw = row.get("current_rank", "").strip()
            try:
                rank = int(rank_raw)
            except ValueError:
                rank = None
            if rank == -1:
                champion_by_wc.setdefault(wc_id, fid)
            elif rank is not None and 0 <= rank <= 15:
                rankings_by_wc[wc_id].append((rank, fid))

    for wc_id in rankings_by_wc:
        rankings_by_wc[wc_id].sort(key=lambda t: t[0])

    return fighters, champion_by_wc, rankings_by_wc


# Hand-curated legends / retired fighters exclusive to the EA Sports UFC 6
# roster — not present in the current-roster CSV, added unranked.
LEGENDS = [
    ("Chan Sung Jung", "wc-m-featherweight", "Korean Zombie", "South Korea"),
    ("Jose Aldo", "wc-m-featherweight", "Scarface", "Brazil"),
    ("Khabib Nurmagomedov", "wc-m-lightweight", "The Eagle", "Russia"),
    ("Dustin Poirier", "wc-m-lightweight", "The Diamond", "United States"),
    ("Tony Ferguson", "wc-m-lightweight", "El Cucuy", "United States"),
    ("Anthony Pettis", "wc-m-lightweight", "Showtime", "United States"),
    ("Donald Cerrone", "wc-m-lightweight", "Cowboy", "United States"),
    ("Rafael dos Anjos", "wc-m-lightweight", "RDA", "Brazil"),
    ("Eddie Alvarez", "wc-m-lightweight", None, "United States"),
    ("Frankie Edgar", "wc-m-lightweight", "The Answer", "United States"),
    ("Georges St-Pierre", "wc-m-welterweight", "Rush", "Canada"),
    ("Colby Covington", "wc-m-welterweight", "Chaos", "United States"),
    ("Jorge Masvidal", "wc-m-welterweight", "Gamebred", "United States"),
    ("Gilbert Burns", "wc-m-welterweight", "Durinho", "Brazil"),
    ("Anderson Silva", "wc-m-middleweight", "The Spider", "Brazil"),
    ("Chuck Liddell", "wc-m-light-heavyweight", "The Iceman", "United States"),
    ("Jon Jones", "wc-m-light-heavyweight", "Bones", "United States"),
    ("Tito Ortiz", "wc-m-light-heavyweight", "The Huntington Beach Bad Boy", "United States"),
    ("Ken Shamrock", "wc-m-light-heavyweight", "The World's Most Dangerous Man", "United States"),
    ("Alexander Gustafsson", "wc-m-light-heavyweight", "The Mauler", "Sweden"),
    ("Glover Teixeira", "wc-m-light-heavyweight", None, "Brazil"),
    ("Randy Couture", "wc-m-heavyweight", "The Natural", "United States"),
    ("Tank Abbott", "wc-m-heavyweight", None, "United States"),
    ("Stipe Miocic", "wc-m-heavyweight", None, "United States"),
    ("Henry Cejudo", "wc-m-bantamweight", "Triple C", "United States"),
    ("TJ Dillashaw", "wc-m-bantamweight", None, "United States"),
    ("Ronda Rousey", "wc-w-bantamweight", "Rowdy", "United States"),
    ("Cris Cyborg", "wc-w-bantamweight", "Cyborg", "Brazil"),
    ("Holly Holm", "wc-w-bantamweight", "The Preacher's Daughter", "United States"),
    ("Joanna Jedrzejczyk", "wc-w-strawweight", None, "Poland"),
]


def build_legends(used_ids):
    fighters = []
    for name, wc_id, nickname, country in LEGENDS:
        fid = slugify(name, used_ids)
        fighters.append({
            "id": fid,
            "name": name,
            "weightClassId": wc_id,
            "nickname": nickname,
            "country": country,
            "status": "Retired",
            "wins": 0,
            "losses": 0,
            "draws": 0,
        })
    return fighters


def fighter_literal(f: dict) -> str:
    parts = [f"id: {ts_str(f['id'])}", f"name: {ts_str(f['name'])}", f"weightClassId: {ts_str(f['weightClassId'])}"]
    if f.get("nickname"):
        parts.append(f"nickname: {ts_str(f['nickname'])}")
    if f.get("country"):
        parts.append(f"country: {ts_str(f['country'])}")
    parts.append(f"status: {ts_str(f.get('status', 'Active'))}")
    parts.append(f"wins: {f['wins']}")
    parts.append(f"losses: {f['losses']}")
    parts.append(f"draws: {f['draws']}")
    parts.append("noContests: 0")
    parts.append("createdAt: Date.now()")
    return "  { " + ", ".join(parts) + " },"


def main():
    csv_fighters, champion_by_wc, rankings_by_wc = load_csv_fighters()
    used_ids = {f["id"] for f in csv_fighters}
    legend_fighters = build_legends(used_ids)
    all_fighters = csv_fighters + legend_fighters

    lines = []
    lines.append("import type { Fighter, WeightClass } from '../types';")
    lines.append("")
    lines.append("/**")
    lines.append(" * Generated by scripts/generate-seed-data.py from data/ufc-fighters.csv")
    lines.append(" * (current UFC roster/rankings snapshot) plus a hand-curated list of")
    lines.append(" * legends and retired fighters exclusive to the EA Sports UFC 6 roster.")
    lines.append(" * Do not hand-edit — re-run the script instead. Only used as the store's")
    lines.append(" * initial state; once a user has any local data, this seed is never")
    lines.append(" * re-applied.")
    lines.append(" *")
    lines.append(" * Records reflect real career win/loss totals from the source data at")
    lines.append(" * generation time; draws/no-contests beyond the CSV's wins+losses total")
    lines.append(" * are folded into `draws`. Legends/retired additions start at 0-0-0.")
    lines.append(" */")
    lines.append("")
    lines.append("export const SEED_FIGHTERS: Fighter[] = [")
    for f in all_fighters:
        lines.append(fighter_literal(f))
    lines.append("];")
    lines.append("")
    lines.append("export const SEED_WEIGHT_CLASSES: WeightClass[] = [")
    for wc_id in WC_ORDER:
        _, name, division, limit = next(v for v in WC_MAP.values() if v[0] == wc_id)
        champ = champion_by_wc.get(wc_id)
        ranks = rankings_by_wc.get(wc_id, [])
        ranking_ids = ", ".join(ts_str(fid) for _, fid in ranks)
        lines.append("  {")
        lines.append(f"    id: {ts_str(wc_id)},")
        lines.append(f"    name: {ts_str(name)},")
        lines.append(f"    division: {ts_str(division)},")
        lines.append(f"    limitLbs: {limit},")
        if champ:
            lines.append(f"    championId: {ts_str(champ)},")
        lines.append(f"    rankings: [{ranking_ids}],")
        lines.append("  },")
    lines.append("];")
    lines.append("")

    OUT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT_PATH} — {len(all_fighters)} fighters ({len(csv_fighters)} from CSV + {len(legend_fighters)} legends)")


if __name__ == "__main__":
    main()
