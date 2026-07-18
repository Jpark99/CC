import type { Fighter } from '../types';

export function recordString(f: Pick<Fighter, 'wins' | 'losses' | 'draws' | 'noContests'>): string {
  const base = `${f.wins}-${f.losses}-${f.draws}`;
  return f.noContests > 0 ? `${base} (${f.noContests} NC)` : base;
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function fighterDisplayName(f: Fighter): string {
  return f.nickname ? `${f.name} "${f.nickname}"` : f.name;
}

/** All divisions a fighter can be booked/ranked in: their primary division plus any secondaries. */
export function fighterWeightClassIds(f: Pick<Fighter, 'weightClassId' | 'secondaryWeightClassIds'>): string[] {
  return [f.weightClassId, ...(f.secondaryWeightClassIds ?? [])];
}

export function fightsInDivision(f: Pick<Fighter, 'weightClassId' | 'secondaryWeightClassIds'>, weightClassId: string): boolean {
  return fighterWeightClassIds(f).includes(weightClassId);
}
