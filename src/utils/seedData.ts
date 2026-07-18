import type { Fighter, WeightClass } from '../types';

/**
 * Best-effort snapshot of the real UFC roster/rankings (~July 2026) plus
 * fighters exclusive to the EA Sports UFC 6 roster (legends + new additions
 * not currently on the UFC roster). Only used as the store's initial state —
 * once a user has any local data, this seed is never re-applied.
 *
 * Records intentionally start at 0-0-0: this app tracks fights booked in the
 * user's own universe going forward, not real-world fight history.
 */

function fighter(id: string, name: string, weightClassId: string, opts: Partial<Fighter> = {}): Fighter {
  return {
    id,
    name,
    weightClassId,
    status: 'Active',
    wins: 0,
    losses: 0,
    draws: 0,
    noContests: 0,
    createdAt: Date.now(),
    ...opts,
  };
}

export const SEED_FIGHTERS: Fighter[] = [
  // --- Flyweight (125) ---
  fighter('f-joshua-van', 'Joshua Van', 'wc-m-flyweight'),

  // --- Bantamweight (135) ---
  fighter('f-petr-yan', 'Petr Yan', 'wc-m-bantamweight'),
  fighter('f-merab-dvalishvili', 'Merab Dvalishvili', 'wc-m-bantamweight'),
  fighter('f-umar-nurmagomedov', 'Umar Nurmagomedov', 'wc-m-bantamweight'),
  fighter('f-sean-omalley', "Sean O'Malley", 'wc-m-bantamweight'),
  fighter('f-aiemann-zahabi', 'Aiemann Zahabi', 'wc-m-bantamweight'), // UFC 6 addition

  // --- Featherweight (145) ---
  fighter('f-alexander-volkanovski', 'Alexander Volkanovski', 'wc-m-featherweight', { nickname: 'The Great' }),
  fighter('f-movsar-evloev', 'Movsar Evloev', 'wc-m-featherweight'),
  fighter('f-diego-lopes', 'Diego Lopes', 'wc-m-featherweight'),
  fighter('f-aljamain-sterling', 'Aljamain Sterling', 'wc-m-featherweight'),
  fighter('f-yair-rodriguez', 'Yair Rodríguez', 'wc-m-featherweight'),
  fighter('f-youssef-zalal', 'Youssef Zalal', 'wc-m-featherweight'), // UFC 6 addition
  fighter('f-patricio-freire', 'Patricio Freire', 'wc-m-featherweight', { nickname: 'Pitbull' }), // UFC 6 addition
  fighter('f-david-onama', 'David Onama', 'wc-m-featherweight'), // UFC 6 addition
  fighter('f-kevin-vallejos', 'Kevin Vallejos', 'wc-m-featherweight'), // UFC 6 addition
  fighter('f-arnold-allen', 'Arnold Allen', 'wc-m-featherweight'),
  fighter('f-brian-ortega', 'Brian Ortega', 'wc-m-featherweight', { nickname: 'T-City' }),

  // --- Lightweight (155) ---
  fighter('f-justin-gaethje', 'Justin Gaethje', 'wc-m-lightweight', { nickname: 'The Highlight' }),
  fighter('f-arman-tsarukyan', 'Arman Tsarukyan', 'wc-m-lightweight'),
  fighter('f-ilia-topuria', 'Ilia Topuria', 'wc-m-lightweight'),
  fighter('f-charles-oliveira', 'Charles Oliveira', 'wc-m-lightweight', { nickname: 'do Bronx' }),
  fighter('f-grant-dawson', 'Grant Dawson', 'wc-m-lightweight'), // UFC 6 addition
  fighter('f-conor-mcgregor', 'Conor McGregor', 'wc-m-lightweight', { nickname: 'The Notorious' }),

  // --- Welterweight (170) ---
  fighter('f-islam-makhachev', 'Islam Makhachev', 'wc-m-welterweight'),
  fighter('f-ian-machado-garry', 'Ian Machado Garry', 'wc-m-welterweight', { nickname: 'The Future' }),
  fighter('f-jack-della-maddalena', 'Jack Della Maddalena', 'wc-m-welterweight'),
  fighter('f-uros-medic', 'Uros Medic', 'wc-m-welterweight'), // UFC 6 addition
  fighter('f-georges-st-pierre', 'Georges St-Pierre', 'wc-m-welterweight', { nickname: 'Rush' }), // UFC 6 legend

  // --- Middleweight (185) ---
  fighter('f-sean-strickland', 'Sean Strickland', 'wc-m-middleweight'),
  fighter('f-khamzat-chimaev', 'Khamzat Chimaev', 'wc-m-middleweight', { nickname: 'Borz' }),
  fighter('f-dricus-du-plessis', 'Dricus Du Plessis', 'wc-m-middleweight'),
  fighter('f-gregory-rodrigues', 'Gregory Rodrigues', 'wc-m-middleweight'), // UFC 6 addition
  fighter('f-anderson-silva', 'Anderson Silva', 'wc-m-middleweight', { nickname: 'The Spider' }), // UFC 6 legend

  // --- Light Heavyweight (205) ---
  fighter('f-carlos-ulberg', 'Carlos Ulberg', 'wc-m-light-heavyweight'),
  fighter('f-magomed-ankalaev', 'Magomed Ankalaev', 'wc-m-light-heavyweight'),
  fighter('f-jiri-prochazka', 'Jiří Procházka', 'wc-m-light-heavyweight'),
  fighter('f-alex-pereira', 'Alex Pereira', 'wc-m-light-heavyweight', { nickname: 'Poatan' }),
  fighter('f-paulo-costa', 'Paulo Costa', 'wc-m-light-heavyweight'),
  fighter('f-jamahal-hill', 'Jamahal Hill', 'wc-m-light-heavyweight'),
  fighter('f-khalil-rountree', 'Khalil Rountree Jr.', 'wc-m-light-heavyweight'),
  fighter('f-dominick-reyes', 'Dominick Reyes', 'wc-m-light-heavyweight'),
  fighter('f-volkan-oezdemir', 'Volkan Oezdemir', 'wc-m-light-heavyweight'),
  fighter('f-aleksandar-rakic', 'Aleksandar Rakić', 'wc-m-light-heavyweight'),
  fighter('f-azamat-murzakanov', 'Azamat Murzakanov', 'wc-m-light-heavyweight'),
  fighter('f-bogdan-guskov', 'Bogdan Guskov', 'wc-m-light-heavyweight'), // UFC 6 addition
  fighter('f-jon-jones', 'Jon Jones', 'wc-m-light-heavyweight', { nickname: 'Bones' }), // UFC 6 roster
  fighter('f-tito-ortiz', 'Tito Ortiz', 'wc-m-light-heavyweight'), // UFC 6 roster
  fighter('f-ken-shamrock', 'Ken Shamrock', 'wc-m-light-heavyweight'), // UFC 6 legend
  fighter('f-alexander-gustafsson', 'Alexander Gustafsson', 'wc-m-light-heavyweight'), // UFC 6 roster
  fighter('f-glover-teixeira', 'Glover Teixeira', 'wc-m-light-heavyweight'), // UFC 6 roster
  fighter('f-chuck-liddell', 'Chuck Liddell', 'wc-m-light-heavyweight', { nickname: 'The Iceman' }), // UFC 6 legend

  // --- Heavyweight (265) ---
  fighter('f-tom-aspinall', 'Tom Aspinall', 'wc-m-heavyweight'),
  fighter('f-ciryl-gane', 'Ciryl Gane', 'wc-m-heavyweight', { nickname: 'Bon Gamin' }),
  fighter('f-randy-couture', 'Randy Couture', 'wc-m-heavyweight', { nickname: 'The Natural' }), // UFC 6 legend
  fighter('f-curtis-blaydes', 'Curtis Blaydes', 'wc-m-heavyweight'), // UFC 6 roster
  fighter('f-derrick-lewis', 'Derrick Lewis', 'wc-m-heavyweight', { nickname: 'The Black Beast' }), // UFC 6 roster
  fighter('f-stipe-miocic', 'Stipe Miocic', 'wc-m-heavyweight'), // UFC 6 roster
  fighter('f-alexander-volkov', 'Alexander Volkov', 'wc-m-heavyweight'), // UFC 6 roster
  fighter('f-shamil-gaziev', 'Shamil Gaziev', 'wc-m-heavyweight'), // UFC 6 addition
  fighter('f-waldo-cortes-acosta', 'Waldo Cortes Acosta', 'wc-m-heavyweight'), // UFC 6 addition
  fighter('f-tank-abbott', 'Tank Abbott', 'wc-m-heavyweight'), // UFC 6 legend

  // --- Women's Strawweight (115) ---
  fighter('f-mackenzie-dern', 'Mackenzie Dern', 'wc-w-strawweight'),
  fighter('f-virna-jandiroba', 'Virna Jandiroba', 'wc-w-strawweight'),

  // --- Women's Flyweight (125) ---
  fighter('f-valentina-shevchenko', 'Valentina Shevchenko', 'wc-w-flyweight', { nickname: 'Bullet' }),
  fighter('f-miranda-maverick', 'Miranda Maverick', 'wc-w-flyweight'), // UFC 6 addition

  // --- Women's Bantamweight (135) ---
  fighter('f-kayla-harrison', 'Kayla Harrison', 'wc-w-bantamweight'),
  fighter('f-ronda-rousey', 'Ronda Rousey', 'wc-w-bantamweight', { nickname: 'Rowdy' }), // UFC 6 legend
  fighter('f-ailin-perez', 'Ailín Pérez', 'wc-w-bantamweight'), // UFC 6 addition
];

export const SEED_WEIGHT_CLASSES: WeightClass[] = [
  {
    id: 'wc-m-flyweight',
    name: 'Flyweight',
    division: 'Men',
    limitLbs: 125,
    championId: 'f-joshua-van',
    rankings: [],
  },
  {
    id: 'wc-m-bantamweight',
    name: 'Bantamweight',
    division: 'Men',
    limitLbs: 135,
    championId: 'f-petr-yan',
    rankings: ['f-merab-dvalishvili', 'f-umar-nurmagomedov', 'f-sean-omalley'],
  },
  {
    id: 'wc-m-featherweight',
    name: 'Featherweight',
    division: 'Men',
    limitLbs: 145,
    championId: 'f-alexander-volkanovski',
    rankings: ['f-movsar-evloev', 'f-diego-lopes', 'f-aljamain-sterling', 'f-yair-rodriguez'],
  },
  {
    id: 'wc-m-lightweight',
    name: 'Lightweight',
    division: 'Men',
    limitLbs: 155,
    championId: 'f-justin-gaethje',
    rankings: ['f-arman-tsarukyan'],
  },
  {
    id: 'wc-m-welterweight',
    name: 'Welterweight',
    division: 'Men',
    limitLbs: 170,
    championId: 'f-islam-makhachev',
    rankings: ['f-ian-machado-garry'],
  },
  {
    id: 'wc-m-middleweight',
    name: 'Middleweight',
    division: 'Men',
    limitLbs: 185,
    championId: 'f-sean-strickland',
    rankings: ['f-khamzat-chimaev'],
  },
  {
    id: 'wc-m-light-heavyweight',
    name: 'Light Heavyweight',
    division: 'Men',
    limitLbs: 205,
    championId: 'f-carlos-ulberg',
    rankings: [
      'f-magomed-ankalaev',
      'f-jiri-prochazka',
      'f-alex-pereira',
      'f-paulo-costa',
      'f-jamahal-hill',
      'f-khalil-rountree',
      'f-dominick-reyes',
      'f-volkan-oezdemir',
      'f-aleksandar-rakic',
      'f-azamat-murzakanov',
    ],
  },
  {
    id: 'wc-m-heavyweight',
    name: 'Heavyweight',
    division: 'Men',
    limitLbs: 265,
    championId: 'f-tom-aspinall',
    rankings: ['f-ciryl-gane'],
  },
  {
    id: 'wc-w-strawweight',
    name: "Women's Strawweight",
    division: 'Women',
    limitLbs: 115,
    championId: 'f-mackenzie-dern',
    rankings: ['f-virna-jandiroba'],
  },
  {
    id: 'wc-w-flyweight',
    name: "Women's Flyweight",
    division: 'Women',
    limitLbs: 125,
    championId: 'f-valentina-shevchenko',
    rankings: [],
  },
  {
    id: 'wc-w-bantamweight',
    name: "Women's Bantamweight",
    division: 'Women',
    limitLbs: 135,
    championId: 'f-kayla-harrison',
    rankings: [],
  },
  {
    id: 'wc-w-featherweight',
    name: "Women's Featherweight",
    division: 'Women',
    limitLbs: 145,
    // vacant — division has been inactive since Amanda Nunes' 2023 retirement
    rankings: [],
  },
];
