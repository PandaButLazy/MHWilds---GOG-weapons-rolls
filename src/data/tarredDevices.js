export const TARRED_DEVICE_TYPES = [
  {
    id: 'attack',
    name: 'Attack',
    focus: 'Attack',
    effect: '+10 Attack, −15% Affinity',
  },
  {
    id: 'affinity',
    name: 'Affinity',
    focus: 'Affinity',
    effect: '+10% Affinity, −10 Attack and an elemental penalty',
  },
  {
    id: 'element',
    name: 'Element',
    focus: 'Element',
    effect: '+50 Element, −5% Affinity',
  },
]

export const DEFAULT_TARRED_DEVICE_COUNTS = {
  attack: 0,
  affinity: 0,
  element: 0,
}

export const MATCHING_FOCUS_DEVICE_COST = 3
export const MISMATCHED_FOCUS_DEVICE_COST = 6

export function rollsFromDeviceUsage(used, matchesFocus) {
  const cost = matchesFocus ? MATCHING_FOCUS_DEVICE_COST : MISMATCHED_FOCUS_DEVICE_COST
  return Math.floor((Number(used) || 0) / cost)
}
