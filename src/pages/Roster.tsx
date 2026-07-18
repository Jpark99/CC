import { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import type { Fighter, FighterStatus, Stance } from '../types';
import { Badge, Button, Card, EmptyState, Input, Label, Modal, PageHeader, Select } from '../components/ui';
import { recordString, fighterDisplayName, fightsInDivision } from '../utils/helpers';

const STANCES: Stance[] = ['Orthodox', 'Southpaw', 'Switch'];
const STATUSES: FighterStatus[] = ['Active', 'Injured', 'Suspended', 'Retired'];

const emptyForm = {
  name: '',
  nickname: '',
  country: '',
  weightClassId: '',
  secondaryWeightClassIds: [] as string[],
  stance: 'Orthodox' as Stance,
  status: 'Active' as FighterStatus,
  wins: 0,
  losses: 0,
  draws: 0,
  noContests: 0,
};

export default function Roster() {
  const { fighters, weightClasses, addFighter, updateFighter, deleteFighter } = useStore();
  const [filterWc, setFilterWc] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const weightClassById = useMemo(() => new Map(weightClasses.map((wc) => [wc.id, wc])), [weightClasses]);

  const grouped = useMemo(() => {
    const matchesSearch = (f: Fighter) =>
      !search || fighterDisplayName(f).toLowerCase().includes(search.toLowerCase());

    if (filterWc !== 'all') {
      // Filtering to one division: show everyone eligible there (primary or secondary),
      // in a single group — not fragmented across each fighter's own primary division.
      const wc = weightClassById.get(filterWc);
      if (!wc) return [];
      const list = fighters
        .filter((f) => fightsInDivision(f, filterWc) && matchesSearch(f))
        .sort((a, b) => a.name.localeCompare(b.name));
      return list.length > 0 ? [{ wc, list }] : [];
    }

    const filtered = fighters.filter(matchesSearch);
    const byWc = new Map<string, Fighter[]>();
    for (const f of filtered) {
      const arr = byWc.get(f.weightClassId) ?? [];
      arr.push(f);
      byWc.set(f.weightClassId, arr);
    }
    return weightClasses
      .map((wc) => ({ wc, list: (byWc.get(wc.id) ?? []).sort((a, b) => a.name.localeCompare(b.name)) }))
      .filter((g) => g.list.length > 0);
  }, [fighters, weightClasses, weightClassById, filterWc, search]);

  function openAdd() {
    setEditingId(null);
    setForm({ ...emptyForm, weightClassId: weightClasses[0]?.id ?? '' });
    setModalOpen(true);
  }

  function openEdit(f: Fighter) {
    setEditingId(f.id);
    setForm({
      name: f.name,
      nickname: f.nickname ?? '',
      country: f.country ?? '',
      weightClassId: f.weightClassId,
      secondaryWeightClassIds: f.secondaryWeightClassIds ?? [],
      stance: f.stance ?? 'Orthodox',
      status: f.status,
      wins: f.wins,
      losses: f.losses,
      draws: f.draws,
      noContests: f.noContests,
    });
    setModalOpen(true);
  }

  function save() {
    if (!form.name.trim() || !form.weightClassId) return;
    const secondaryWeightClassIds = form.secondaryWeightClassIds.filter((id) => id !== form.weightClassId);
    const payload = {
      name: form.name.trim(),
      nickname: form.nickname.trim() || undefined,
      country: form.country.trim() || undefined,
      weightClassId: form.weightClassId,
      secondaryWeightClassIds: secondaryWeightClassIds.length > 0 ? secondaryWeightClassIds : undefined,
      stance: form.stance,
      status: form.status,
    };
    if (editingId) {
      updateFighter(editingId, {
        ...payload,
        wins: Number(form.wins) || 0,
        losses: Number(form.losses) || 0,
        draws: Number(form.draws) || 0,
        noContests: Number(form.noContests) || 0,
      });
    } else {
      addFighter(payload);
    }
    setModalOpen(false);
  }

  function remove(f: Fighter) {
    if (confirm(`Remove ${f.name} from the roster? This also removes them from rankings and any fight cards.`)) {
      deleteFighter(f.id);
    }
  }

  return (
    <div>
      <PageHeader
        title="Roster"
        subtitle={`${fighters.length} fighter${fighters.length === 1 ? '' : 's'} in your universe`}
        action={<Button onClick={openAdd}>+ Add Fighter</Button>}
      />

      <div className="flex gap-3 mb-6">
        <Input placeholder="Search fighters..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={filterWc} onChange={(e) => setFilterWc(e.target.value)} className="max-w-xs">
          <option value="all">All weight classes</option>
          {weightClasses.map((wc) => (
            <option key={wc.id} value={wc.id}>
              {wc.name}
            </option>
          ))}
        </Select>
      </div>

      {grouped.length === 0 ? (
        <EmptyState
          title="No fighters yet"
          subtitle="Add fighters to start building your promotion's roster."
          action={<Button onClick={openAdd}>+ Add Fighter</Button>}
        />
      ) : (
        <div className="space-y-8">
          {grouped.map(({ wc, list }) => (
            <div key={wc.id}>
              <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-2">{wc.name}</h2>
              <Card className="divide-y divide-neutral-800">
                {list.map((f) => (
                  <div key={f.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-100">{fighterDisplayName(f)}</span>
                          {wc.championId === f.id && <Badge tone="gold">Champion</Badge>}
                          {f.status !== 'Active' && <Badge>{f.status}</Badge>}
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5">
                          {recordString(f)} {f.country && `· ${f.country}`} {f.stance && `· ${f.stance}`}
                          {f.secondaryWeightClassIds && f.secondaryWeightClassIds.length > 0 && (
                            <>
                              {' '}
                              · also{' '}
                              {f.secondaryWeightClassIds
                                .map((id) => weightClassById.get(id)?.name)
                                .filter(Boolean)
                                .join(', ')}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => openEdit(f)}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => remove(f)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Fighter' : 'Add Fighter'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="fighter-name">Name</Label>
              <Input id="fighter-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jon Jones" />
            </div>
            <div>
              <Label htmlFor="fighter-nickname">Nickname</Label>
              <Input
                id="fighter-nickname"
                value={form.nickname}
                onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                placeholder="Bones"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="fighter-weightclass">Weight Class</Label>
              <Select
                id="fighter-weightclass"
                value={form.weightClassId}
                onChange={(e) => setForm({ ...form, weightClassId: e.target.value })}
              >
                {weightClasses.map((wc) => (
                  <option key={wc.id} value={wc.id}>
                    {wc.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="fighter-country">Country</Label>
              <Input id="fighter-country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="USA" />
            </div>
          </div>
          <div>
            <Label htmlFor="fighter-secondary-wc">Also eligible in (optional)</Label>
            <Select
              id="fighter-secondary-wc"
              multiple
              value={form.secondaryWeightClassIds}
              onChange={(e) =>
                setForm({ ...form, secondaryWeightClassIds: Array.from(e.target.selectedOptions, (o) => o.value) })
              }
              className="h-28"
            >
              {weightClasses
                .filter((wc) => wc.id !== form.weightClassId)
                .map((wc) => (
                  <option key={wc.id} value={wc.id}>
                    {wc.name}
                  </option>
                ))}
            </Select>
            <p className="text-[11px] text-neutral-600 mt-1">
              Ctrl/Cmd-click to select multiple. Lets this fighter be booked or ranked in more than one division —
              e.g. a champion who moved up, or a lightweight who took a one-off welterweight fight.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="fighter-stance">Stance</Label>
              <Select id="fighter-stance" value={form.stance} onChange={(e) => setForm({ ...form, stance: e.target.value as Stance })}>
                {STANCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="fighter-status">Status</Label>
              <Select
                id="fighter-status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as FighterStatus })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          {editingId && (
            <div>
              <Label>Record (W-L-D, NC)</Label>
              <div className="grid grid-cols-4 gap-2">
                <Input type="number" min={0} value={form.wins} onChange={(e) => setForm({ ...form, wins: Number(e.target.value) })} />
                <Input type="number" min={0} value={form.losses} onChange={(e) => setForm({ ...form, losses: Number(e.target.value) })} />
                <Input type="number" min={0} value={form.draws} onChange={(e) => setForm({ ...form, draws: Number(e.target.value) })} />
                <Input
                  type="number"
                  min={0}
                  value={form.noContests}
                  onChange={(e) => setForm({ ...form, noContests: Number(e.target.value) })}
                />
              </div>
              <p className="text-[11px] text-neutral-600 mt-1">Fight results recorded on event cards will update this automatically.</p>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={!form.name.trim() || !form.weightClassId}>
              {editingId ? 'Save Changes' : 'Add Fighter'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
