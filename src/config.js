export default function Config() {

  let SlowUpdateRate = 0.001 * 0.2,
      FastUpdateRate = SlowUpdateRate * 2.0;
  
  return {
    candy: {
      SlowUpdateRate: SlowUpdateRate * 2,
      FastUpdateRate: SlowUpdateRate * 4
    },
    FastUpdateRate,
    SlowUpdateRate
  };
} 
