import {
  cacheContents,
  calcMultipliers,
  handleCache,
  decreasePriorityOfOthers,
  increasePriorityOfCurrent,
  increasePriority,
} from './priority_cache';

describe('cacheContents', () => {
  it('should return the correct cache contents', () => {
    const callLogs = [
      [6, 0],
      [2, 0],
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 2],
      [5, 2],
      [6, 2],
    ];
    const result = cacheContents(callLogs);
    expect(result).toEqual([2]);
  });

  it('should return -1 when cache is empty', () => {
    const callLogs = [
      [2, 0],
      [2, 0],
    ];
    const result = cacheContents(callLogs);
    expect(result).toEqual([-1]);
  });
});

describe('calcMultipliers', () => {
  it('should correctly calculate multipliers', () => {
    const callLogs = [
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 2],
      [5, 2],
      [6, 2],
    ];
    const result = calcMultipliers(callLogs);
    const expected = new Map([
      [1, new Map([[1, 1]])],
      [2, new Map([[1, 1]])],
      [3, new Map([[1, 1]])],
      [4, new Map([[2, 1]])],
      [5, new Map([[2, 1]])],
      [6, new Map([[2, 1]])],
    ]);
    expect(result).toEqual(expected);
  });
});

describe('handleCache', () => {
  it('should correctly handle cache based on priorities', () => {
    const priorities = new Map([
      [1, 2],
      [2, 6],
      [3, 4],
    ]);
    const caches = new Set([1, 2, 3]);
    handleCache(priorities, caches);
    expect(caches).toEqual(new Set([2, 3]));
  });
});

describe('decreasePriorityOfOthers', () => {
  it('should correctly decrease priorities of others', () => {
    const priorities = new Map([
      [1, 3],
      [2, 5],
      [3, 4],
    ]);
    const itemIds = [2];
    decreasePriorityOfOthers(itemIds, priorities);
    expect(priorities).toEqual(
      new Map([
        [1, 2],
        [2, 5],
        [3, 3],
      ]),
    );
  });

  it('should not decrease priorities because of zero', () => {
    const priorities = new Map([
      [1, 0],
      [2, 5],
      [3, 4],
    ]);
    const itemIds = [2];
    decreasePriorityOfOthers(itemIds, priorities);
    expect(priorities).toEqual(
      new Map([
        [1, 0],
        [2, 5],
        [3, 3],
      ]),
    );
  });
});

describe('increasePriorityOfCurrent', () => {
  it('should correctly increase priority of current item by 2*2', () => {
    const priorities = new Map([
      [1, 3],
      [2, 5],
    ]);
    increasePriorityOfCurrent(1, priorities, 2);
    expect(priorities).toEqual(
      new Map([
        [1, 7],
        [2, 5],
      ]),
    );
  });

  it('should correctly increase priority of current item by 1', () => {
    const priorities = new Map([
      [1, 3],
      [2, 5],
    ]);
    increasePriorityOfCurrent(1, priorities);
    expect(priorities).toEqual(
      new Map([
        [1, 5],
        [2, 5],
      ]),
    );
  });
});

describe('increasePriority', () => {
  it('should correctly increase priorities', () => {
    const priorities = new Map([
      [1, 3],
      [2, 5],
    ]);
    const itemIdsOccuranceMap = new Map([
      [1, 2],
      [2, 1],
    ]);
    increasePriority(itemIdsOccuranceMap, priorities);
    expect(priorities).toEqual(
      new Map([
        [1, 7],
        [2, 7],
      ]),
    );
  });
});
