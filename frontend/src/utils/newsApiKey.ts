const STORAGE_KEY = 'socialpulse_news_api_key';
export const NEWS_API_KEY_UPDATED_EVENT = 'newsApiKeyUpdated';

export function getNewsApiKey(): string {
  return localStorage.getItem(STORAGE_KEY)?.trim() || '';
}

export function setNewsApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key.trim());
  window.dispatchEvent(new Event(NEWS_API_KEY_UPDATED_EVENT));
}

export function clearNewsApiKey(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(NEWS_API_KEY_UPDATED_EVENT));
}

export function hasNewsApiKey(): boolean {
  return getNewsApiKey().length > 0;
}

export function buildApiHeaders(): HeadersInit {
  const headers: Record<string, string> = {};
  const apiKey = getNewsApiKey();

  if (apiKey) {
    headers['X-News-Api-Key'] = apiKey;
  }

  return headers;
}
