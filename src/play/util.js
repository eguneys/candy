export const withDelay = (fn, delay, updateFn) => {
  let lastUpdate = delay;

  return (delta) => {
    lastUpdate += delta;
    if (lastUpdate >= delay) {
      fn();
      lastUpdate = 0;
    } else {
      if (updateFn)
        updateFn(lastUpdate / delay);
    }
  };
};
