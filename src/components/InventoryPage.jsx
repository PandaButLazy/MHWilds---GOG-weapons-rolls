import { useState } from 'react'
import { bonusSkillCategory, groupSkillCategory } from '../data/skills'
import { weaponTypes } from '../data/weaponTypes'
import { useInventory } from '../hooks/useInventory'
import { InventoryEntryModal } from './InventoryEntryModal'

function findWeapon(weaponId) {
  return weaponTypes.find((w) => w.id === weaponId)
}

export function InventoryPage() {
  const { items, addItem, updateItem, removeItem } = useInventory()
  const [editingItem, setEditingItem] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  function handleDelete(id) {
    const confirmed = window.confirm('Remove this weapon from your inventory? This action cannot be undone.')
    if (!confirmed) return
    removeItem(id)
    setEditingItem(null)
  }

  return (
    <div className="inventory-page">
      <h2>Weapon Inventory</h2>
      <p className="page-intro">All the Gogma weapons you've already crafted, with the skills you rolled on them.</p>

      <button type="button" className="btn-primary" onClick={() => setIsCreating(true)}>
        Add Weapon
      </button>

      <div className="table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Weapon</th>
              <th>Element</th>
              <th>Set Bonus Skill</th>
              <th>Group Skill</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const weapon = findWeapon(item.weaponId)
              return (
                <tr key={item.id} onClick={() => setEditingItem(item)}>
                  <td>
                    {weapon?.iconUrl && <img className="cell-icon" src={weapon.iconUrl} alt="" />}
                    {weapon?.name ?? item.weaponId}
                  </td>
                  <td>{item.element}</td>
                  <td>
                    {bonusSkillCategory?.image_url && (
                      <img className="cell-icon" src={bonusSkillCategory.image_url} alt="" />
                    )}
                    {item.bonusSkill}
                  </td>
                  <td>
                    {groupSkillCategory?.image_url && (
                      <img className="cell-icon" src={groupSkillCategory.image_url} alt="" />
                    )}
                    {item.groupSkill}
                  </td>
                  <td>{item.name || '—'}</td>
                </tr>
              )
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="inventory-empty">
                  No weapons yet. Click "Add Weapon" to log one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(isCreating || editingItem) && (
        <InventoryEntryModal
          initialValue={editingItem}
          onSave={(value) => {
            if (editingItem) {
              updateItem(editingItem.id, value)
            } else {
              addItem(value)
            }
            setEditingItem(null)
            setIsCreating(false)
          }}
          onDelete={editingItem ? () => handleDelete(editingItem.id) : undefined}
          onClose={() => {
            setEditingItem(null)
            setIsCreating(false)
          }}
        />
      )}
    </div>
  )
}
