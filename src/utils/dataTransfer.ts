import type { Fighter, WeightClass, UFCEvent, Fight, TitleReign } from '../types';

export interface DataSnapshot {
  version: 1;
  exportedAt: string;
  fighters: Fighter[];
  weightClasses: WeightClass[];
  events: UFCEvent[];
  fights: Fight[];
  titleReigns: TitleReign[];
}

export function buildSnapshot(state: {
  fighters: Fighter[];
  weightClasses: WeightClass[];
  events: UFCEvent[];
  fights: Fight[];
  titleReigns: TitleReign[];
}): DataSnapshot {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    fighters: state.fighters,
    weightClasses: state.weightClasses,
    events: state.events,
    fights: state.fights,
    titleReigns: state.titleReigns,
  };
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function isValidSnapshot(data: unknown): data is DataSnapshot {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    Array.isArray(d.fighters) &&
    Array.isArray(d.weightClasses) &&
    Array.isArray(d.events) &&
    Array.isArray(d.fights) &&
    Array.isArray(d.titleReigns)
  );
}
