export type Stance = 'Orthodox' | 'Southpaw' | 'Switch';

export type FighterStatus = 'Active' | 'Injured' | 'Suspended' | 'Retired';

export interface Fighter {
  id: string;
  name: string;
  nickname?: string;
  country?: string;
  weightClassId: string;
  stance?: Stance;
  status: FighterStatus;
  wins: number;
  losses: number;
  draws: number;
  noContests: number;
  createdAt: number;
}

export interface WeightClass {
  id: string;
  name: string;
  division: 'Men' | 'Women';
  /** lbs upper limit, undefined for heavyweight/catch weight */
  limitLbs?: number;
  /** ordered list of fighter ids, rank 1 = top contender (champion tracked separately) */
  rankings: string[];
  championId?: string;
}

export type FightMethod =
  | 'KO/TKO'
  | 'Submission'
  | 'Decision - Unanimous'
  | 'Decision - Split'
  | 'Decision - Majority'
  | 'Draw'
  | 'No Contest'
  | 'DQ';

export interface FightResult {
  winnerId?: string; // undefined for Draw/No Contest
  method: FightMethod;
  round: number;
  time: string; // mm:ss
}

/** Bookkeeping captured when a result is recorded, so it can be fully undone later. */
export interface RankingUndo {
  weightClassId: string;
  previousRankings: string[];
  previousChampionId?: string;
}

export interface TitleUndo {
  weightClassId: string;
  kind: 'defense' | 'change';
  /** kind === 'defense': the reign whose defense count was incremented. */
  defendedReignId?: string;
  /** kind === 'change': the previous reign to reopen (clear its endDate). */
  endedReignId?: string;
  /** kind === 'change': the newly created reign to delete. */
  newReignId?: string;
}

export interface Fight {
  id: string;
  eventId: string;
  weightClassId: string;
  fighter1Id: string;
  fighter2Id: string;
  isTitleFight: boolean;
  isMainEvent: boolean;
  cardPosition: 'Main Card' | 'Prelims' | 'Early Prelims';
  order: number;
  result?: FightResult;
  /** When `result` was recorded (ms epoch) — used to undo multiple results in the right order. */
  resultRecordedAt?: number;
  rankingUndo?: RankingUndo;
  titleUndo?: TitleUndo;
}

export type EventStatus = 'Upcoming' | 'Completed';

export interface UFCEvent {
  id: string;
  name: string;
  date: string; // ISO date
  location?: string;
  status: EventStatus;
  createdAt: number;
}

export interface TitleReign {
  id: string;
  weightClassId: string;
  championId: string;
  wonEventId?: string;
  wonFightId?: string;
  wonMethod?: FightMethod;
  startDate: string;
  endDate?: string;
  defenses: number;
  vacated?: boolean;
}
