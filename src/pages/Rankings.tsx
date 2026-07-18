import { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { Button, Card, Label, PageHeader, Select } from '../components/ui';
import { recordString, fighterDisplayName } from '../utils/helpers';

export default function Rankings() {
  const { fighters, weightClasses, setRankings, setChampion } = useStore();
  const [openWc, setOpenWc] = useState<string | null>(weightClasses[0]?.id ?? null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [addingTo, setAddingTo] = useState<string | null>(null);

  const fighterById = useMemo(() => new Map(fighters.map((f) => [f.id, f])), [fighters]);

  return (
    <div>
      <PageHeader title="Rankings" subtitle="Champion + top contenders per division. Drag to reorder." />

      <div className="space-y-4">
        {weightClasses.map((wc) => {
          const champion = wc.championId ? fighterById.get(wc.championId) : undefined;
          const ranked = wc.rankings.map((id) => fighterById.get(id)).filter((f): f is NonNullable<typeof f> => !!f);
          const rankedIds = new Set(wc.rankings);
          const unranked = fighters.filter(
            (f) => f.weightClassId === wc.id && f.id !== wc.championId && !rankedIds.has(f.id) && f.status === 'Active'
          );
          const isOpen = openWc === wc.id;

          function move(from: number, to: number) {
            if (from === to) return;
            const next = [...ranked.map((f) => f.id)];
            const [item] = next.splice(from, 1);
            next.splice(to, 0, item);
            setRankings(wc.id, next);
          }

          return (
            <Card key={wc.id} className="overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-900/60"
                onClick={() => setOpenWc(isOpen ? null : wc.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-neutral-100">{wc.name}</span>
                  {champion ? (
                    <span className="text-sm text-amber-400">👑 {fighterDisplayName(champion)}</span>
                  ) : (
                    <span className="text-sm text-neutral-600">No champion set</span>
                  )}
                </div>
                <span className="text-neutral-500 text-sm">{isOpen ? '−' : '+'}</span>
              </button>

              {isOpen && (
                <div className="border-t border-neutral-800 px-4 py-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`champion-${wc.id}`}>Champion</Label>
                    <Select
                      id={`champion-${wc.id}`}
                      value={wc.championId ?? ''}
                      onChange={(e) => setChampion(wc.id, e.target.value || undefined)}
                      className="max-w-xs"
                    >
                      <option value="">— Vacant —</option>
                      {fighters
                        .filter((f) => f.weightClassId === wc.id && f.status === 'Active')
                        .map((f) => (
                          <option key={f.id} value={f.id}>
                            {fighterDisplayName(f)}
                          </option>
                        ))}
                    </Select>
                  </div>

                  <div>
                    <Label>Ranked Contenders</Label>
                    {ranked.length === 0 ? (
                      <p className="text-sm text-neutral-600 py-2">No ranked contenders yet.</p>
                    ) : (
                      <ol className="space-y-1">
                        {ranked.map((f, i) => (
                          <li
                            key={f.id}
                            draggable
                            onDragStart={() => setDragIndex(i)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => {
                              if (dragIndex !== null) move(dragIndex, i);
                              setDragIndex(null);
                            }}
                            className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 cursor-grab active:cursor-grabbing"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 text-right text-sm text-neutral-500 tabular-nums">{i + 1}</span>
                              <span className="text-sm text-neutral-100">{fighterDisplayName(f)}</span>
                              <span className="text-xs text-neutral-600">{recordString(f)}</span>
                            </div>
                            <button
                              className="text-xs text-neutral-600 hover:text-red-400"
                              onClick={() => setRankings(wc.id, wc.rankings.filter((id) => id !== f.id))}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>

                  <div>
                    {addingTo === wc.id ? (
                      <div className="flex gap-2">
                        <Select
                          autoFocus
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) setRankings(wc.id, [...wc.rankings, e.target.value]);
                            setAddingTo(null);
                          }}
                          className="max-w-xs"
                        >
                          <option value="" disabled>
                            Select a fighter to add…
                          </option>
                          {unranked.map((f) => (
                            <option key={f.id} value={f.id}>
                              {fighterDisplayName(f)}
                            </option>
                          ))}
                        </Select>
                        <Button variant="ghost" onClick={() => setAddingTo(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button variant="secondary" onClick={() => setAddingTo(wc.id)} disabled={unranked.length === 0}>
                        + Add to Rankings
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
