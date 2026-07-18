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
