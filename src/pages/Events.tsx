import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Badge, Button, Card, EmptyState, Input, Label, Modal, PageHeader } from '../components/ui';
import { formatDate } from '../utils/helpers';

export default function Events() {
  const { events, fights, createEvent } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const sorted = useMemo(() => [...events].sort((a, b) => a.date.localeCompare(b.date)), [events]);
  const fightCountByEvent = useMemo(() => {
    const m = new Map<string, number>();
    for (const f of fights) m.set(f.eventId, (m.get(f.eventId) ?? 0) + 1);
    return m;
  }, [fights]);

  function save() {
    if (!name.trim() || !date) return;
    createEvent({ name: name.trim(), date, location: location.trim() || undefined });
    setModalOpen(false);
    setName('');
    setDate('');
    setLocation('');
  }

  return (
    <div>
      <PageHeader title="Events" subtitle="Build your own fight cards and record results." action={<Button onClick={() => setModalOpen(true)}>+ New Event</Button>} />

      {sorted.length === 0 ? (
        <EmptyState
          title="No events yet"
          subtitle="Create your first event and start booking fights."
          action={<Button onClick={() => setModalOpen(true)}>+ New Event</Button>}
        />
      ) : (
        <div className="space-y-3">
          {sorted.map((e) => (
            <Link key={e.id} to={`/events/${e.id}`}>
              <Card className="flex items-center justify-between px-4 py-3 hover:border-neutral-700 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-neutral-100">{e.name}</span>
                    <Badge tone={e.status === 'Completed' ? 'green' : 'neutral'}>{e.status}</Badge>
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {formatDate(e.date)} {e.location && `· ${e.location}`} · {fightCountByEvent.get(e.id) ?? 0} fight
                    {(fightCountByEvent.get(e.id) ?? 0) === 1 ? '' : 's'}
                  </div>
                </div>
                <span className="text-neutral-600 text-sm">View card →</span>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Event">
        <div className="space-y-4">
          <div>
            <Label htmlFor="event-name">Event Name</Label>
            <Input id="event-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="UFC 300" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="event-date">Date</Label>
              <Input id="event-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="event-location">Location</Label>
              <Input id="event-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Las Vegas, NV" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={!name.trim() || !date}>
              Create Event
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
