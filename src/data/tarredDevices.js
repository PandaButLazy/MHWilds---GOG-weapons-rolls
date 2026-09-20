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
