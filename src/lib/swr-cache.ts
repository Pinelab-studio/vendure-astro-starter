/**
 * Stale while revalidate cache.
 * Returns data immediately (even if stale), revalidates in background with deduplication.
 * 
 */
type Entry<T> = {
  value: T;
  expiresAt: number;
  ttlMs?: number;
};

export class SwrCache<V = unknown> {
  private entries = new Map<string, Entry<V>>();
  private inFlight = new Map<string, Promise<void>>();

  /**
   * Set a value in the cache.
   */
  private set(key: string, value: V, ttlMs?: number): void {
    const expiresAt = ttlMs != null ? Date.now() + ttlMs : Infinity;
    this.entries.set(key, { value, expiresAt, ttlMs });
  }

  /**
   * Returns cached value (possibly stale). If no entry exists, awaits fetch and returns the value.
   * If entry exists but is stale, return stale value immediately and revalidates in background (deduplicated).
   * `ttlMs` controls the lifetime of the cached value when it is (re)fetched.
   */
  async get(key: string, fetcher: () => Promise<V>, ttlMs: number): Promise<V> {
    const entry = this.entries.get(key);
    const now = Date.now();
    const shouldRevalidate = !entry || entry.expiresAt < now;

    if (!entry) {
      // If no entry exists, await fetch and set the value in the cache and return it
      await this.revalidate(key, fetcher, ttlMs);
      return this.entries.get(key)!.value;
    }

    // If entry exists but is stale, revalidate in background
    if (shouldRevalidate) {
      const effectiveTtl = ttlMs ?? entry.ttlMs;
      this.revalidate(key, fetcher, effectiveTtl);
    }

    return entry.value;
  }

  private revalidate(key: string, fetcher: () => Promise<V>, ttlMs: number): Promise<void> {
    let p = this.inFlight.get(key);
    if (!p) {
      p = fetcher()
        .then((value) => {
          this.set(key, value, ttlMs);
        })
        .finally(() => {
          this.inFlight.delete(key);
        });
      this.inFlight.set(key, p);
    }
    return p;
  }

  isStale(key: string): boolean {
    const entry = this.entries.get(key);
    return entry != null && entry.expiresAt < Date.now();
  }

  delete(key: string): boolean {
    return this.entries.delete(key);
  }
}
