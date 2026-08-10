(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.iikoUtils = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function debounce(callback, wait = 150) {
    let timeoutId = null;
    return function debounced(...args) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        timeoutId = null;
        callback.apply(this, args);
      }, wait);
    };
  }

  function defer(callback) {
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      return window.requestAnimationFrame(callback);
    }
    if (typeof requestAnimationFrame === 'function') {
      return requestAnimationFrame(callback);
    }
    if (typeof setTimeout === 'function') {
      return setTimeout(callback, 0);
    }
    callback();
  }

  function memoize(fn) {
    const cache = new Map();
    return function memoized(...args) {
      const key = args.map(arg => {
        if (typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean') {
          return String(arg);
        }
        if (arg === null || arg === undefined) {
          return 'null';
        }
        try {
          return JSON.stringify(arg);
        } catch (error) {
          return String(arg);
        }
      }).join('::');

      if (cache.has(key)) {
        return cache.get(key);
      }

      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  }

  return { debounce, defer, memoize };
});
