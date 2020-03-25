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

export function Delayer() {
  
  let items = [];

  this.add = (fn, delay = 0) => {
    items.push({
      fn,
      delay
    });
  };


  this.update = (delta) => {
    let res = [];
    items.forEach((item) => {
      item.delay -= delta;
      if (item.delay < 0) {
        item.fn();
      } else {
        res.push(item);
      }
    });
    items = res;
  };
}
