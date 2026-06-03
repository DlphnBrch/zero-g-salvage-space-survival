export const PLAYER_START = { x: 0, y: 1.5, z: 12 };
export const FIXED_TIME_STEP = 1 / 60;
export const MAX_DELTA = 0.05;

export const ITEM_TYPES = {
  FOOD: 'food',
  WATER: 'water',
  OXYGEN: 'oxygen',
  EXTINGUISHER: 'extinguisher',
  CRATE: 'crate',
  DEBRIS: 'debris'
};

export const RESOURCE_VALUES = {
  food: { hunger: 26 },
  water: { thirst: 26 },
  oxygen: { oxygen: 32 },
  extinguisher: { fuel: 34 },
  crate: { hunger: 12, thirst: 12, oxygen: 14, fuel: 10 }
};

export const SCANNER_COLORS = {
  food: 0x39ff6a,
  water: 0x3ca0ff,
  oxygen: 0xffee55,
  extinguisher: 0xff4a4a,
  crate: 0xffffff,
  debris: 0xbbbbbb,
  base: 0xffffff
};

export const RESOURCE_BARS = ['oxygen', 'thirst', 'hunger', 'fuel'];
