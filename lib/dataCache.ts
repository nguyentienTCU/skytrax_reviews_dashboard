const cache: Record<string, any> = {};

export function getFromCache(key: string) {
  return cache[key];
}

export function saveToCache(key: string, data: any) {
  cache[key] = data;
}