const cache = {
  data: {},
  timestamps: {}
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export const cacheService = {
  get: (key) => {
    const timestamp = cache.timestamps[key];
    if (timestamp && Date.now() - timestamp < CACHE_TTL) {
      return cache.data[key];
    }
    return null;
  },
  
  set: (key, data) => {
    cache.data[key] = data;
    cache.timestamps[key] = Date.now();
  },
  
  invalidate: (key) => {
    delete cache.data[key];
    delete cache.timestamps[key];
  },
  
  invalidateAll: () => {
    cache.data = {};
    cache.timestamps = {};
  }
};