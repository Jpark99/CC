import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { Fight, FightMethod, UFCEvent } from '../types';
import { Badge, Button, Card, EmptyState, Input, Label, Modal, PageHeader, Select } from '../components/ui';
import { fighterDisplayName, fightsInDivision, formatDate, recordString } from '../utils/helpers';

const METHODS: FightMethod[] = [
  'KO/TKO',
  'Submission',
  'Decision - Unanimous',
  'Decision - Split',
  'Decision - Majority',
  'Draw',
  'No Contest',
  'DQ',
];

const CARD_POSITIONS: Fight['cardPosition'][] = ['Main Card', 'Prelims', 'Early Prelims'];

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const {
    events,
    fighters,
    weightClasses,
    fights,
    updateEvent,
    deleteEvent,
    removeFight,
    reorderFights,
    recordResult,
    clearResult,
  } = useStore();

  const event = events.find((e) => e.id === eventId);
  const eventFights = useMemo(
    () => fights.filter((f) => f.eventId === eventId).sort((a, b) => a.order - b.order),
    [fights, eventId]
  );

  const [addOpen, setAddOpen] = useState(false);
  const [resultFor, setResultFor] = useState<Fight | null>(null);

  if (!event) {
    return (
      <EmptyState title="Event not found" action={<Button onClick={() => navigate('/events')}>Back to Events</Button>} />
    );
  }

  const currentEvent = event;
  const fighterById = new Map(fighters.map((f) => [f.id, f]));

  function move(fight: Fight, dir: -1 | 1) {
    const idx = eventFights.findIndex((f) => f.id === fight.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= eventFights.length) return;
    const order = eventFights.map((f) => f.id);
    [order[idx], order[swapIdx]] = [order[swapIdx], order[idx]];
    reorderFights(currentEvent.id, order);
  }

  return (
    <div>
      <button onClick={() => navigate('/events')} className="text-sm text-neutral-500 hover:text-neutral-300 mb-3">
        ← All Events
      </button>
      <PageHeader
        title={event.name}
        subtitle={`${formatDate(event.date)}${event.location ? ` · ${event.location}` : ''}`}
        action={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => updateEvent(event.id, { status: event.status === 'Completed' ? 'Upcoming' : 'Completed' })}
            >
              Mark {event.status === 'Completed' ? 'Upcoming' : 'Completed'}
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!confirm(`Delete ${event.name}?`)) return;
                deleteEvent(event.id);
                navigate('/events');
              }}
            >
              Delete
            </Button>
          </div>
        }
      />

      <div className="flex items-center justify-between mb-4">
        <Badge tone={event.status === 'Completed' ? 'green' : 'neutral'}>{event.status}</Badge>
        <Button onClick={() => setAddOpen(true)}>+ Add Fight</Button>
      </div>

      {eventFights.length === 0 ? (
        <EmptyState title="No fights booked yet" subtitle="Add fights to build this event's card." />
      ) : (
        <div className="space-y-6">
          {CARD_POSITIONS.map((pos) => {
            const list = eventFights.filter((f) => f.cardPosition === pos);
            if (list.length === 0) return null;
            return (
              <div key={pos}>
                <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-2">{pos}</h2>
                <div className="space-y-2">
                  {list.map((fight) => {
                    const f1 = fighterById.get(fight.fighter1Id);
                    const f2 = fighterById.get(fight.fighter2Id);
                    const wc = weightClasses.find((w) => w.id === fight.weightClassId);
                    return (
                      <Card key={fight.id} className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {fight.isMainEvent && <Badge tone="red">Main Event</Badge>}
                              {fight.isTitleFight && <Badge tone="gold">Title Fight</Badge>}
                              <span className="text-xs text-neutral-500">{wc?.name}</span>
                            </div>
                            <p className="font-medium text-neutral-100 mt-1">
                              {f1 ? fighterDisplayName(f1) : 'Unknown'}{' '}
                              <span className="text-neutral-600 font-normal">vs</span>{' '}
                              {f2 ? fighterDisplayName(f2) : 'Unknown'}
                            </p>
                            {fight.result ? (
                              <p className="text-sm text-emerald-400 mt-1">
                                {fight.result.winnerId
                                  ? `${fighterDisplayName(fighterById.get(fight.result.winnerId)!)} wins`
                                  : fight.result.method}{' '}
                                <span className="text-neutral-500">
                                  · {fight.result.method}
                                  {fight.result.method !== 'Draw' && fight.result.method !== 'No Contest'
                                    ? ` · R${fight.result.round} ${fight.result.time}`
                                    : ''}
                                </span>
                              </p>
                            ) : (
                              <p className="text-sm text-neutral-600 mt-1">
                                {f1 && recordString(f1)} vs {f2 && recordString(f2)}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="text-neutral-600 hover:text-neutral-300 px-1" onClick={() => move(fight, -1)} title="Move up">
                              ▲
                            </button>
                            <button className="text-neutral-600 hover:text-neutral-300 px-1" onClick={() => move(fight, 1)} title="Move down">
                              ▼
                            </button>
                            {fight.result ? (
                              <Button variant="ghost" onClick={() => clearResult(fight.id)}>
                                Clear Result
                              </Button>
                            ) : (
                              <Button variant="secondary" onClick={() => setResultFor(fight)}>
                                Record Result
                              </Button>
                            )}
                            <Button variant="danger" onClick={() => removeFight(fight.id)}>
                              Remove
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {addOpen && <AddFightModal event={event} onClose={() => setAddOpen(false)} />}
      {resultFor && (
        <ResultModal
          fight={resultFor}
          onClose={() => setResultFor(null)}
          onSubmit={(result) => {
            recordResult(resultFor.id, result);
            setResultFor(null);
          }}
        />
      )}
    </div>
  );
}

function AddFightModal({ event, onClose }: { event: UFCEvent; onClose: () => void }) {
  const { fighters, weightClasses, addFight } = useStore();
  const [weightClassId, setWeightClassId] = useState(weightClasses[0]?.id ?? '');
  const [fighter1Id, setFighter1Id] = useState('');
  const [fighter2Id, setFighter2Id] = useState('');
  const [isTitleFight, setIsTitleFight] = useState(false);
  const [isMainEvent, setIsMainEvent] = useState(false);
  const [cardPosition, setCardPosition] = useState<Fight['cardPosition']>('Main Card');

  const pool = fighters.filter((f) => fightsInDivision(f, weightClassId) && f.status === 'Active');
  const weightClassName = (id: string) => weightClasses.find((w) => w.id === id)?.name ?? '';

  function save() {
    if (!weightClassId || !fighter1Id || !fighter2Id || fighter1Id === fighter2Id) return;
    addFight({ eventId: event.id, weightClassId, fighter1Id, fighter2Id, isTitleFight, isMainEvent, cardPosition });
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Add Fight">
      <div className="space-y-4">
        <div>
          <Label htmlFor="fight-weightclass">Weight Class</Label>
          <Select
            id="fight-weightclass"
            value={weightClassId}
            onChange={(e) => {
              setWeightClassId(e.target.value);
              setFighter1Id('');
              setFighter2Id('');
            }}
          >
            {weightClasses.map((wc) => (
              <option key={wc.id} value={wc.id}>
                {wc.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="fight-fighter1">Fighter 1</Label>
            <Select id="fight-fighter1" value={fighter1Id} onChange={(e) => setFighter1Id(e.target.value)}>
              <option value="">Select…</option>
              {pool.map((f) => (
                <option key={f.id} value={f.id} disabled={f.id === fighter2Id}>
                  {fighterDisplayName(f)}
                  {f.weightClassId !== weightClassId ? ` (usually ${weightClassName(f.weightClassId)})` : ''}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="fight-fighter2">Fighter 2</Label>
            <Select id="fight-fighter2" value={fighter2Id} onChange={(e) => setFighter2Id(e.target.value)}>
              <option value="">Select…</option>
              {pool.map((f) => (
                <option key={f.id} value={f.id} disabled={f.id === fighter1Id}>
                  {fighterDisplayName(f)}
                  {f.weightClassId !== weightClassId ? ` (usually ${weightClassName(f.weightClassId)})` : ''}
                </option>
              ))}
            </Select>
          </div>
        </div>
        {pool.length < 2 && <p className="text-xs text-amber-500">Need at least 2 active fighters in this weight class.</p>}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="fight-cardposition">Card Position</Label>
            <Select id="fight-cardposition" value={cardPosition} onChange={(e) => setCardPosition(e.target.value as Fight['cardPosition'])}>
              {CARD_POSITIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col justify-center gap-2 pt-4">
            <label className="flex items-center gap-2 text-sm text-neutral-300">
              <input type="checkbox" checked={isMainEvent} onChange={(e) => setIsMainEvent(e.target.checked)} />
              Main Event
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-300">
              <input type="checkbox" checked={isTitleFight} onChange={(e) => setIsTitleFight(e.target.checked)} />
              Title Fight
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={!fighter1Id || !fighter2Id || fighter1Id === fighter2Id}>
            Add to Card
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function ResultModal({
  fight,
  onClose,
  onSubmit,
}: {
  fight: Fight;
  onClose: () => void;
  onSubmit: (result: { winnerId?: string; method: FightMethod; round: number; time: string }) => void;
}) {
  const { fighters } = useStore();
  const f1 = fighters.find((f) => f.id === fight.fighter1Id);
  const f2 = fighters.find((f) => f.id === fight.fighter2Id);
  const [winnerId, setWinnerId] = useState('');
  const [method, setMethod] = useState<FightMethod>('Decision - Unanimous');
  const [round, setRound] = useState(3);
  const [time, setTime] = useState('5:00');

  const noWinner = method === 'Draw' || method === 'No Contest';

  function save() {
    if (!noWinner && !winnerId) return;
    onSubmit({ winnerId: noWinner ? undefined : winnerId, method, round, time });
  }

  return (
    <Modal open onClose={onClose} title="Record Result">
      <div className="space-y-4">
        {!noWinner && (
          <div>
            <Label htmlFor="result-winner">Winner</Label>
            <Select id="result-winner" value={winnerId} onChange={(e) => setWinnerId(e.target.value)}>
              <option value="">Select winner…</option>
              {f1 && <option value={f1.id}>{fighterDisplayName(f1)}</option>}
              {f2 && <option value={f2.id}>{fighterDisplayName(f2)}</option>}
            </Select>
          </div>
        )}
        <div>
          <Label htmlFor="result-method">Method</Label>
          <Select id="result-method" value={method} onChange={(e) => setMethod(e.target.value as FightMethod)}>
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </div>
        {!noWinner && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="result-round">Round</Label>
              <Input id="result-round" type="number" min={1} max={5} value={round} onChange={(e) => setRound(Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="result-time">Time</Label>
              <Input id="result-time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="4:32" />
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={!noWinner && !winnerId}>
            Save Result
          </Button>
        </div>
      </div>
    </Modal>
  );
}
