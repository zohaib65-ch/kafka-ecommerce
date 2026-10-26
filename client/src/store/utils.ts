/** Returns the list without the item with the given id (a no-op when it is not in the list). */
export const removeById = <T extends { _id: string }>(
  items: T[],
  id: string
): T[] => items.filter(item => item._id !== id);
