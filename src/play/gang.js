import Pool from 'poolf';

import { withDelay } from './util';

export default function LollipopGang(play, ctx, bs, Maker) {

  let pool = new Pool(() => new Maker(this, ctx, bs));
  
  let spawnCount;

  let x;

  let collision;

  this.init = data => {
    collision = data.collision;
    spawnCount = 0;
    x = data.x;
  };

  const spawn = (x) => {    
    pool.acquire(_ => _.init({
      x,
      collision
    }));
  };


  this.release = (bullet) => {
    pool.release(bullet);
  };

  const maybeSpawn = withDelay(() => {
    if (spawnCount++ < 5) {
      spawn(x);
    }
  }, 200);

  const maybeRelease = () => {
    if (spawnCount > 0 && pool.alives() === 0) {
      play.release(this);
    }
  };

  this.update = delta => {
    maybeSpawn(delta);
    maybeRelease();
    pool.each(_ => _.update(delta));
  };


  this.render = () => {
    pool.each(_ => _.render());    
  };  
}
