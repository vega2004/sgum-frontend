const defaultTtlMs = 24 * 60 * 60 * 1000;
const draftVersion = 1;

export type DraftRecord<T> = {
  data: T;
  updatedAt: string;
  expiresAt: string;
  version: number;
};

export type DraftInfo = {
  updatedAt: string;
  expiresAt: string;
  version: number;
};

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function parseDraft<T>(key: string): DraftRecord<T> | null {
  if (!canUseLocalStorage()) return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as DraftRecord<T>;
    if (!parsed || typeof parsed !== 'object' || !parsed.expiresAt || !parsed.updatedAt || typeof parsed.version !== 'number') {
      window.localStorage.removeItem(key);
      return null;
    }
    if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
      window.localStorage.removeItem(key);
      return null;
    }
    return parsed;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
}

export function saveDraft<T>(key: string, data: T, ttlMs = defaultTtlMs) {
  if (!canUseLocalStorage()) return false;
  const now = new Date();
  const record: DraftRecord<T> = {
    data,
    updatedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + ttlMs).toISOString(),
    version: draftVersion,
  };

  try {
    window.localStorage.setItem(key, JSON.stringify(record));
    return true;
  } catch {
    return false;
  }
}

export function loadDraft<T>(key: string) {
  return parseDraft<T>(key)?.data ?? null;
}

export function removeDraft(key: string) {
  if (!canUseLocalStorage()) return;
  window.localStorage.removeItem(key);
}

export function hasDraft(key: string) {
  return Boolean(parseDraft<unknown>(key));
}

export function getDraftInfo(key: string): DraftInfo | null {
  const draft = parseDraft<unknown>(key);
  if (!draft) return null;
  return { updatedAt: draft.updatedAt, expiresAt: draft.expiresAt, version: draft.version };
}
