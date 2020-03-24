export default function Config() {

  let SlowUpdateRate = 0.001 * 0.2,
      FastUpdateRate = SlowUpdateRate * 2.0;
  
  return {
    FastUpdateRate,
    SlowUpdateRate
  };
} 
