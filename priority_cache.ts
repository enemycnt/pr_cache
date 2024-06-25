/**
 * Type alias for a map representing priorities.
 */
export type Priorities = Map<number, number>;

/**
 * Main function
 *
 * @param {number[][]} callLogs
 * @returns {number[]}
 */
export function cacheContents(callLogs: number[][]): number[] {
  const totalEntries = callLogs.shift()![0];
  const totalParameters = callLogs.shift()![0];

  let priorities: Priorities = new Map();
  const caches: Set<number> = new Set();

  console.log('totalEntries:', totalEntries, 'totalParameters:', totalParameters);
  const logsWithMultipliers = calcMultipliers(callLogs);
  // console.log("logsWithMultipliers", logsWithMultipliers)
  logsWithMultipliers.forEach(itemIdsOccuranceMap => {
    const itemIds = itemIdsOccuranceMap.keys();

    decreasePriorityOfOthers(itemIds, priorities);
    increasePriority(itemIdsOccuranceMap, priorities);

    handleCache(priorities, caches);
  });

  console.log('priorities:', priorities);
  console.log('caches:', caches);

  const result = caches.size > 0 ? Array.from(caches) : [-1];
  return result;
}

/**
 * Calculates multipliers for each itemId based on call logs.
 *
 * @param {number[][]} callLogs - An array of call logs, each containing [time, itemId].
 * @returns {Map<number, Map<number, number>>} - A map of itemIds and their occurrence counts.
 */
export function calcMultipliers(callLogs: number[][]): Map<number, Map<number, number>> {
  const newLogs: Map<number, Map<number, number>> = new Map();
  callLogs.sort((a, b) => a[0] - b[0]);
  const groupedCallLogs = Map.groupBy(callLogs, (entry: number[][]) => entry[0]);
  groupedCallLogs.forEach((value, key) => {
    const flatArrayOfItemIds = value.map(entry => entry[1]);
    const occurrencesMap = flatArrayOfItemIds.reduce((acc, curr) => {
      return acc.set(curr, (acc.get(curr) || 0) + 1);
    }, new Map());
    newLogs.set(Number(key), occurrencesMap);
  });
  return newLogs;
}

/**
 * Updates the cache based on item priorities.
 *
 * @param {Priorities} priorities - A map of item priorities.
 * @param {Set<number>} caches - A set representing the cache.
 */
export function handleCache(priorities: Priorities, caches: Set<number>): void {
  for (const [itemId, priority] of priorities) {
    if (priority <= 3) {
      caches.delete(itemId);
    }
    if (priority > 5) {
      caches.add(itemId);
    }
  }
}

/**
 * Decreases the priority of items not in the provided itemIds.
 *
 * @param {Iterable<number>} itemIds - An iterable of itemIds to retain priority.
 * @param {Priorities} priorities - A map of item priorities.
 */
export function decreasePriorityOfOthers(itemIds: Iterable<number>, priorities: Priorities): void {
  // const itemIdsArr = Array.from(itemIds);

  const itemIdsSet = new Set(itemIds);
  for (const [key, value] of priorities) {
    if (!itemIdsSet.has(key)) {
      const newValue = value > 0 ? value - 1 : 0;
      priorities.set(key, newValue);
    }
  }
}

/**
 * Increases the priority of the current item by a specified multiplier.
 *
 * @param {number} currentItemId - The itemId whose priority is to be increased.
 * @param {Priorities} priorities - A map of item priorities.
 * @param {number} [multiplier=1] - The multiplier to apply to the priority increase.
 */
export function increasePriorityOfCurrent(currentItemId: number, priorities: Priorities, multiplier: number = 1): void {
  const oldPriority = priorities.get(currentItemId) ?? 0;
  const newPriority = oldPriority + 2 * multiplier;
  priorities.set(currentItemId, newPriority);
}

/**
 * Increases the priority of items based on their occurrence map.
 *
 * @param {Map<number, number>} itemIdsOccuranceMap - A map of itemIds and their occurrences.
 * @param {Priorities} priorities - A map of item priorities.
 */
export function increasePriority(itemIdsOccuranceMap: Map<number, number>, priorities: Priorities): void {
  itemIdsOccuranceMap.forEach((occurances, itemId) => {
    increasePriorityOfCurrent(itemId, priorities, occurances);
  });
}
