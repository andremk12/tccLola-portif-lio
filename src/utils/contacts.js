// Only order is persisted. URLs and display data always come from trusted code.
export function restoreContactOrder(contacts, stored) {
  if (!Array.isArray(stored)) return contacts
  const names = stored.map(item => typeof item === 'string' ? item : item?.name)
  const ordered = [...new Set(names)].flatMap(name => contacts.filter(item => item.name === name))
  return [...ordered, ...contacts.filter(item => !ordered.includes(item))]
}

export function readContactOrder(contacts) {
  try {
    return restoreContactOrder(contacts, JSON.parse(localStorage.getItem('contactsOrder')))
  } catch {
    // Storage can be unavailable or contain data from an older version.
    return contacts
  }
}

export function saveContactOrder(contacts) {
  try {
    localStorage.setItem('contactsOrder', JSON.stringify(contacts.map(item => item.name)))
  } catch {
    // Reordering still works in memory when the browser disables storage.
  }
}
