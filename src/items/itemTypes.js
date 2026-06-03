import { ITEM_TYPES } from '../utils/constants.js';

export const VARIANT_ORDER = ['small', 'medium', 'large'];

export const ITEM_VARIANTS = {
  small: {
    label: 'Small',
    scale: 0.72,
    massMultiplier: 0.62,
    valueMultiplier: 0.65,
    scoreMultiplier: 0.75
  },
  medium: {
    label: 'Medium',
    scale: 1.0,
    massMultiplier: 1.0,
    valueMultiplier: 1.0,
    scoreMultiplier: 1.0
  },
  large: {
    label: 'Large',
    scale: 1.35,
    massMultiplier: 1.75,
    valueMultiplier: 1.6,
    scoreMultiplier: 1.55
  }
};

export const ITEM_DEFINITIONS = {
  [ITEM_TYPES.FOOD]: {
    label: 'Food Package',
    color: 0x48c774,
    emissive: 0x062f16,
    mass: 0.8,
    useful: true,
    count: 10,
    scoreValue: 10,
    baseValues: { hunger: 26 }
  },
  [ITEM_TYPES.WATER]: {
    label: 'Water Bottle',
    color: 0x2d9cff,
    emissive: 0x041b33,
    mass: 0.7,
    useful: true,
    count: 10,
    scoreValue: 10,
    baseValues: { thirst: 26 }
  },
  [ITEM_TYPES.OXYGEN]: {
    label: 'Oxygen Tank',
    color: 0xffe45e,
    emissive: 0x332a02,
    mass: 1.4,
    useful: true,
    count: 9,
    scoreValue: 12,
    baseValues: { oxygen: 32 }
  },
  [ITEM_TYPES.EXTINGUISHER]: {
    label: 'Fire Extinguisher',
    color: 0xff3030,
    emissive: 0x330505,
    mass: 1.2,
    useful: true,
    count: 7,
    scoreValue: 12,
    baseValues: { fuel: 34 }
  },
  [ITEM_TYPES.CRATE]: {
    label: 'Emergency Supply Crate',
    color: 0x9b6b3a,
    emissive: 0x130806,
    mass: 3.0,
    useful: true,
    count: 7,
    scoreValue: 18,
    baseValues: { hunger: 12, thirst: 12, oxygen: 14, fuel: 10 }
  },
  [ITEM_TYPES.DEBRIS]: {
    label: 'Debris',
    color: 0x777b82,
    emissive: 0x000000,
    mass: 2.2,
    useful: false,
    count: 18,
    scoreValue: 0,
    baseValues: null
  }
};

function scaleValues(values, multiplier) {
  if (!values) return null;
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, Math.round(value * multiplier)])
  );
}

export function getVariantKey(index = 0) {
  return VARIANT_ORDER[index % VARIANT_ORDER.length];
}

export function buildItemDefinition(type, variantKey = 'medium') {
  const base = ITEM_DEFINITIONS[type];
  const variant = ITEM_VARIANTS[variantKey] ?? ITEM_VARIANTS.medium;

  return {
    ...base,
    type,
    variantKey,
    variantLabel: variant.label,
    label: `${variant.label} ${base.label}`,
    mass: base.mass * variant.massMultiplier,
    scale: variant.scale,
    values: scaleValues(base.baseValues, variant.valueMultiplier),
    scoreValue: Math.round(base.scoreValue * variant.scoreMultiplier)
  };
}
