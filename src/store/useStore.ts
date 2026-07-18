import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type {
  Fighter,
  WeightClass,
  UFCEvent,
  Fight,
  FightResult,
  TitleReign,
} from '../types';
import { SEED_FIGHTERS, SEED_WEIGHT_CLASSES } from '../utils/seedData';

interface StoreState {
  fighters: Fighter[];
  weightClasses: WeightClass[];
  events: UFCEvent[];
  fights: Fight[];
  titleReigns: TitleReign[];

  // Fighters
  addFighter: (f: Omit<Fighter, 'id' | 'createdAt' | 'wins' | 'losses' | 'draws' | 'noContests'>) => string;
  updateFighter: (id: string, patch: Partial<Fighter>) => void;
  deleteFighter: (id: string) => void;

  // Weight classes
  addWeightClass: (wc: Omit<WeightClass, 'id' | 'rankings'>) => string;
  updateWeightClass: (id: string, patch: Partial<WeightClass>) => void;
  deleteWeightClass: (id: string) => void;
  setRankings: (weightClassId: string, orderedFighterIds: string[]) => void;
  setChampion: (weightClassId: string, fighterId: string | undefined) => void;

  // Events
  createEvent: (e: Omit<UFCEvent, 'id' | 'createdAt' | 'status'>) => string;
  updateEvent: (id: string, patch: Partial<UFCEvent>) => void;
  deleteEvent: (id: string) => void;

  // Fights
  addFight: (f: Omit<Fight, 'id' | 'order' | 'result'>) => string;
  updateFight: (id: string, patch: Partial<Fight>) => void;
  removeFight: (id: string) => void;
  reorderFights: (eventId: string, orderedFightIds: string[]) => void;
  recordResult: (fightId: string, result: FightResult) => void;
  clearResult: (fightId: string) => void;

  // Data transfer
  importData: (data: {
    fighters: Fighter[];
    weightClasses: WeightClass[];
    events: UFCEvent[];
    fights: Fight[];
    titleReigns: TitleReign[];
  }) => void;
}

function record(fighter: Fighter, delta: Partial<Pick<Fighter, 'wins' | 'losses' | 'draws' | 'noContests'>>): Fighter {
  return {
    ...fighter,
    wins: fighter.wins + (delta.wins ?? 0),
    losses: fighter.losses + (delta.losses ?? 0),
    draws: fighter.draws + (delta.draws ?? 0),
    noContests: fighter.noContests + (delta.noContests ?? 0),
  };
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      fighters: SEED_FIGHTERS,
      weightClasses: SEED_WEIGHT_CLASSES,
      events: [],
      fights: [],
      titleReigns: [],

      addFighter: (f) => {
        const id = uuid();
        const fighter: Fighter = {
          ...f,
          id,
          wins: 0,
          losses: 0,
          draws: 0,
          noContests: 0,
          createdAt: Date.now(),
        };
        set((s) => ({ fighters: [...s.fighters, fighter] }));
        return id;
      },

      updateFighter: (id, patch) =>
        set((s) => ({
          fighters: s.fighters.map((f) => (f.id === id ? { ...f, ...patch } : f)),
        })),

      deleteFighter: (id) =>
        set((s) => ({
          fighters: s.fighters.filter((f) => f.id !== id),
          weightClasses: s.weightClasses.map((wc) => ({
            ...wc,
            rankings: wc.rankings.filter((rid) => rid !== id),
            championId: wc.championId === id ? undefined : wc.championId,
          })),
          fights: s.fights.filter((fi) => fi.fighter1Id !== id && fi.fighter2Id !== id),
        })),

      addWeightClass: (wc) => {
        const id = uuid();
        set((s) => ({ weightClasses: [...s.weightClasses, { ...wc, id, rankings: [] }] }));
        return id;
      },

      updateWeightClass: (id, patch) =>
        set((s) => ({
          weightClasses: s.weightClasses.map((wc) => (wc.id === id ? { ...wc, ...patch } : wc)),
        })),

      deleteWeightClass: (id) =>
        set((s) => ({ weightClasses: s.weightClasses.filter((wc) => wc.id !== id) })),

      setRankings: (weightClassId, orderedFighterIds) =>
        set((s) => ({
          weightClasses: s.weightClasses.map((wc) =>
            wc.id === weightClassId ? { ...wc, rankings: orderedFighterIds } : wc
          ),
        })),

      setChampion: (weightClassId, fighterId) =>
        set((s) => ({
          weightClasses: s.weightClasses.map((wc) =>
            wc.id === weightClassId
              ? {
                  ...wc,
                  championId: fighterId,
                  rankings: fighterId ? wc.rankings.filter((id) => id !== fighterId) : wc.rankings,
                }
              : wc
          ),
        })),

      createEvent: (e) => {
        const id = uuid();
        const event: UFCEvent = { ...e, id, status: 'Upcoming', createdAt: Date.now() };
        set((s) => ({ events: [...s.events, event] }));
        return id;
      },

      updateEvent: (id, patch) =>
        set((s) => ({ events: s.events.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),

      deleteEvent: (id) =>
        set((s) => ({
          events: s.events.filter((e) => e.id !== id),
          fights: s.fights.filter((fi) => fi.eventId !== id),
        })),

      addFight: (f) => {
        const id = uuid();
        const order = get().fights.filter((fi) => fi.eventId === f.eventId).length;
        const fight: Fight = { ...f, id, order };
        set((s) => ({ fights: [...s.fights, fight] }));
        return id;
      },

      updateFight: (id, patch) =>
        set((s) => ({ fights: s.fights.map((fi) => (fi.id === id ? { ...fi, ...patch } : fi)) })),

      removeFight: (id) =>
        set((s) => ({
          fights: s.fights.filter((fi) => fi.id !== id),
          titleReigns: s.titleReigns.filter((tr) => tr.wonFightId !== id),
        })),

      reorderFights: (eventId, orderedFightIds) =>
        set((s) => ({
          fights: s.fights.map((fi) => {
            if (fi.eventId !== eventId) return fi;
            const order = orderedFightIds.indexOf(fi.id);
            return order === -1 ? fi : { ...fi, order };
          }),
        })),

      recordResult: (fightId, result) => {
        const s = get();
        const fight = s.fights.find((fi) => fi.id === fightId);
        if (!fight || fight.result) return;

        const { fighter1Id, fighter2Id, weightClassId, isTitleFight } = fight;
        const loserId =
          result.winnerId === fighter1Id ? fighter2Id : result.winnerId === fighter2Id ? fighter1Id : undefined;
        const isDraw = result.method === 'Draw';
        const isNC = result.method === 'No Contest';

        let fighters = s.fighters.map((f) => {
          if (isNC) return f;
          if (isDraw) {
            if (f.id === fighter1Id || f.id === fighter2Id) return record(f, { draws: 1 });
            return f;
          }
          if (f.id === result.winnerId) return record(f, { wins: 1 });
          if (f.id === loserId) return record(f, { losses: 1 });
          return f;
        });

        let weightClasses = s.weightClasses;
        let titleReigns = s.titleReigns;

        const wc = s.weightClasses.find((w) => w.id === weightClassId);

        if (wc && !isDraw && !isNC && result.winnerId && loserId) {
          if (isTitleFight) {
            const isChampionWinner = wc.championId === result.winnerId;
            if (isChampionWinner) {
              titleReigns = titleReigns.map((tr) =>
                tr.weightClassId === weightClassId && !tr.endDate
                  ? { ...tr, defenses: tr.defenses + 1 }
                  : tr
              );
            } else {
              const oldChampionId = wc.championId;
              titleReigns = titleReigns.map((tr) =>
                tr.weightClassId === weightClassId && !tr.endDate
                  ? { ...tr, endDate: new Date().toISOString(), vacated: false }
                  : tr
              );
              titleReigns = [
                ...titleReigns,
                {
                  id: uuid(),
                  weightClassId,
                  championId: result.winnerId,
                  wonEventId: fight.eventId,
                  wonFightId: fight.id,
                  wonMethod: result.method,
                  startDate: new Date().toISOString(),
                  defenses: 0,
                },
              ];
              let rankings = wc.rankings.filter((id) => id !== result.winnerId);
              if (oldChampionId) rankings = [oldChampionId, ...rankings.filter((id) => id !== oldChampionId)];
              weightClasses = weightClasses.map((w) =>
                w.id === weightClassId ? { ...w, championId: result.winnerId, rankings } : w
              );
            }
          } else {
            const rankings = [...wc.rankings];
            const winnerIdx = rankings.indexOf(result.winnerId);
            const loserIdx = rankings.indexOf(loserId);
            if (winnerIdx !== -1 && loserIdx !== -1 && winnerIdx > loserIdx) {
              rankings.splice(winnerIdx, 1);
              rankings.splice(loserIdx, 0, result.winnerId);
            } else if (winnerIdx === -1 && loserIdx !== -1) {
              rankings.splice(loserIdx, 0, result.winnerId);
            }
            weightClasses = weightClasses.map((w) => (w.id === weightClassId ? { ...w, rankings } : w));
          }
        }

        const fights = s.fights.map((fi) => (fi.id === fightId ? { ...fi, result } : fi));

        set({ fighters, weightClasses, titleReigns, fights });
      },

      clearResult: (fightId) => {
        const s = get();
        const fight = s.fights.find((fi) => fi.id === fightId);
        if (!fight || !fight.result) return;
        const { result, fighter1Id, fighter2Id } = fight;
        const loserId =
          result.winnerId === fighter1Id ? fighter2Id : result.winnerId === fighter2Id ? fighter1Id : undefined;
        const isDraw = result.method === 'Draw';
        const isNC = result.method === 'No Contest';

        const fighters = s.fighters.map((f) => {
          if (isNC) return f;
          if (isDraw) {
            if (f.id === fighter1Id || f.id === fighter2Id) return record(f, { draws: -1 });
            return f;
          }
          if (f.id === result.winnerId) return record(f, { wins: -1 });
          if (f.id === loserId) return record(f, { losses: -1 });
          return f;
        });

        set({
          fighters,
          fights: s.fights.map((fi) => (fi.id === fightId ? { ...fi, result: undefined } : fi)),
        });
      },

      importData: (data) =>
        set({
          fighters: data.fighters,
          weightClasses: data.weightClasses,
          events: data.events,
          fights: data.fights,
          titleReigns: data.titleReigns,
        }),
    }),
    { name: 'ufc-president-mode' }
  )
);
