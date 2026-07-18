import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Badge, Card, EmptyState, PageHeader } from '../components/ui';
import { fighterDisplayName, formatDate } from '../utils/helpers';

export default function Dashboard() {
  const { fighters, weightClasses, events, fights } = useStore();
  const fighterById = useMemo(() => new Map(fighters.map((f) => [f.id, f])), [fighters]);

  const champions = weightClasses.filter((wc) => wc.championId);

  const upcoming = useMemo(
    () =>
      events
        .filter((e) => e.status === 'Upcoming')
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3),
    [events]
  );

  const recentResults = useMemo(
    () =>
      fights
        .filter((f) => f.result)
        .sort((a, b) => b.order - a.order)
        .slice(0, 5),
    [fights]
  );

  const eventById = useMemo(() => new Map(events.map((e) => [e.id, e])), [events]);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Your promotion, at a glance." />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Fighters" value={fighters.length} to="/roster" />
        <StatCard label="Events" value={events.length} to="/events" />
        <StatCard label="Champions Crowned" value={champions.length} to="/rankings" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-2">Current Champions</h2>
          {champions.length === 0 ? (
            <EmptyState title="No champions yet" subtitle="Set a champion from the Rankings page." />
          ) : (
            <Card className="divide-y divide-neutral-800">
              {champions.map((wc) => {
                const champ = fighterById.get(wc.championId!);
                return (
                  <div key={wc.id} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-neutral-400">{wc.name}</span>
                    <span className="font-medium text-neutral-100">{champ ? fighterDisplayName(champ) : 'Vacant'}</span>
                  </div>
                );
              })}
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-2">Upcoming Events</h2>
          {upcoming.length === 0 ? (
            <EmptyState title="Nothing scheduled" subtitle="Create an event to book fights." />
          ) : (
            <Card className="divide-y divide-neutral-800">
              {upcoming.map((e) => (
                <Link key={e.id} to={`/events/${e.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-neutral-900/60">
                  <span className="font-medium text-neutral-100">{e.name}</span>
                  <span className="text-xs text-neutral-500">{formatDate(e.date)}</span>
                </Link>
              ))}
            </Card>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-2">Recent Results</h2>
        {recentResults.length === 0 ? (
          <EmptyState title="No results recorded yet" subtitle="Record fight results from an event's card." />
        ) : (
          <Card className="divide-y divide-neutral-800">
            {recentResults.map((f) => {
              const f1 = fighterById.get(f.fighter1Id);
              const f2 = fighterById.get(f.fighter2Id);
              const winner = f.result?.winnerId ? fighterById.get(f.result.winnerId) : undefined;
              const ev = eventById.get(f.eventId);
              return (
                <div key={f.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm text-neutral-100">
                      {f1 && fighterDisplayName(f1)} <span className="text-neutral-600">vs</span> {f2 && fighterDisplayName(f2)}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {ev?.name} · {winner ? `${fighterDisplayName(winner)} won` : f.result?.method} · {f.result?.method}
                    </p>
                  </div>
                  {f.isTitleFight && <Badge tone="gold">Title Fight</Badge>}
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, to }: { label: string; value: number; to: string }) {
  return (
    <Link to={to}>
      <Card className="px-4 py-4 hover:border-neutral-700 transition-colors">
        <p className="text-2xl font-bold text-neutral-50">{value}</p>
        <p className="text-xs text-neutral-500 mt-1">{label}</p>
      </Card>
    </Link>
  );
}
