import type { WeightClass } from '../types';

export const DEFAULT_WEIGHT_CLASSES: WeightClass[] = [
  { id: 'wc-m-flyweight', name: 'Flyweight', division: 'Men', limitLbs: 125, rankings: [] },
  { id: 'wc-m-bantamweight', name: 'Bantamweight', division: 'Men', limitLbs: 135, rankings: [] },
  { id: 'wc-m-featherweight', name: 'Featherweight', division: 'Men', limitLbs: 145, rankings: [] },
  { id: 'wc-m-lightweight', name: 'Lightweight', division: 'Men', limitLbs: 155, rankings: [] },
  { id: 'wc-m-welterweight', name: 'Welterweight', division: 'Men', limitLbs: 170, rankings: [] },
  { id: 'wc-m-middleweight', name: 'Middleweight', division: 'Men', limitLbs: 185, rankings: [] },
  { id: 'wc-m-light-heavyweight', name: 'Light Heavyweight', division: 'Men', limitLbs: 205, rankings: [] },
  { id: 'wc-m-heavyweight', name: 'Heavyweight', division: 'Men', limitLbs: 265, rankings: [] },
  { id: 'wc-w-strawweight', name: "Women's Strawweight", division: 'Women', limitLbs: 115, rankings: [] },
  { id: 'wc-w-flyweight', name: "Women's Flyweight", division: 'Women', limitLbs: 125, rankings: [] },
  { id: 'wc-w-bantamweight', name: "Women's Bantamweight", division: 'Women', limitLbs: 135, rankings: [] },
  { id: 'wc-w-featherweight', name: "Women's Featherweight", division: 'Women', limitLbs: 145, rankings: [] },
];
