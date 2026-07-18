import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Badge, Card, EmptyState, PageHeader } from '../components/ui';
import { fighterDisplayName, formatDate } from '../utils/helpers';

export default function TitleHistory() {
  const { weightClasses, fighters, titleReigns, events } = useStore();
  const fighterById = useMemo(() => new Map(fighters.map((f) => [f.id, f])), [fighters]);
  const eventById = useMemo(() => new Map(events.map((e) => [e.id, e])), [events]);

  const divisions = weightClasses.filter((wc) => titleReigns.some((tr) => tr.weightClassId === wc.id));

  return (
    <div>
      <PageHeader title="Title History" subtitle="Championship lineage across every division." />

      {divisions.length === 0 ? (
        <EmptyState
          title="No title history yet"
          subtitle="Set a champion on the Rankings page or record a title fight result to start building lineage."
        />
      ) : (
        <div className="space-y-8">
          {divisions.map((wc) => {
            const reigns = titleReigns
              .filter((tr) => tr.weightClassId === wc.id)
              .sort((a, b) => b.startDate.localeCompare(a.startDate));
            return (
              <div key={wc.id}>
                <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-2">{wc.name}</h2>
                <Card className="divide-y divide-neutral-800">
                  {reigns.map((tr) => {
                    const champ = fighterById.get(tr.championId);
                    const wonEvent = tr.wonEventId ? eventById.get(tr.wonEventId) : undefined;
                    return (
                      <div key={tr.id} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-neutral-100">{champ ? fighterDisplayName(champ) : 'Unknown'}</span>
                            {!tr.endDate && <Badge tone="gold">Current Champion</Badge>}
                          </div>
                          <div className="text-xs text-neutral-500 mt-0.5">
                            {wonEvent ? `Won title at ${wonEvent.name} (${formatDate(wonEvent.date)})` : `Reign began ${formatDate(tr.startDate)}`}
                            {tr.wonMethod && ` · ${tr.wonMethod}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-neutral-300">
                            {tr.defenses} defense{tr.defenses === 1 ? '' : 's'}
                          </div>
                          <div className="text-xs text-neutral-600">{tr.endDate ? 'Reign ended' : 'Ongoing'}</div>
                        </div>
                      </div>
                    );
                  })}
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
