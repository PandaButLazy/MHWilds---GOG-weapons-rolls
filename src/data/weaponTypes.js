import weaponsData from '../../weapons.json'

const ORDER = [
  'Great Sword',
  'Long Sword',
  'Sword & Shield',
  'Dual Blades',
  'Hammer',
  'Hunting Horn',
  'Lance',
  'Gunlance',
  'Switch Axe',
  'Charge Blade',
  'Insect Glaive',
  'Bow',
  'Light Bowgun',
  'Heavy Bowgun',
]

function slugify(name) {
  return name.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-')
}

const weaponsByName = new Map(weaponsData.weapons.map((weapon) => [weapon.name, weapon]))

export const weaponTypes = ORDER.map((name) => {
  const weapon = weaponsByName.get(name)
  return {
    id: slugify(name),
    name,
    description: weapon?.description ?? '',
    iconUrl: weapon?.icon_url ?? '',
    imageUrl: weapon?.image_url ?? '',
    url: weapon?.url ?? '',
    weaponTreeUrl: weapon?.weapon_tree_url ?? '',
  }
})
