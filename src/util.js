export const throttle = (fn, delay = 50) => {
  let called = false;
  return (...args) => {
    if (!called) {
      called = true;
      fn(...args);
      setTimeout(() => called = false, delay);
    }
  };
};
