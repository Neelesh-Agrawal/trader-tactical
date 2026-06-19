/** Slug (beginner) -> backend numeric level id; populated when course levels load. */
let slugToBackendId: Record<string, number> = {};

export function setLevelIdMap(levels: Array<{ id: string; backendId: number }>) {
  slugToBackendId = Object.fromEntries(levels.map((l) => [l.id, l.backendId]));
}

export function getBackendLevelId(levelSlug: string): number {
  if (slugToBackendId[levelSlug]) {
    return slugToBackendId[levelSlug];
  }
  const parsed = parseInt(levelSlug, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}
