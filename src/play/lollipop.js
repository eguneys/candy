import Pool from 'poolf';

import { withDelay } from './util';

import * as mu from 'mutilz';

import Licker from './licker';

export default function Lollipop(play, ctx, bs) {

  const { width } = bs;

  let licker = new Licker(this, ctx, bs);

  let pool = new Pool(licker.lick);

  let collision;

  this.play = play;

  this.init = data => {
    collision = data.collision;

    licker.init({});

  };

  this.release = (gang) => {
    // pool.release(gang);
  };

  const spawn = () => {
    let x = mu.rand(0, width - 32);
    pool.acquire(_ => _.init({
      x,
      collision
    }));
  };

  const maybeSpawn = withDelay(() => {
    spawn();
  }, 5000);

  this.update = delta => {
    maybeSpawn(delta);
    pool.each(_ => _.update(delta));
  };


  this.render = () => {
    pool.each(_ => _.render());
  };
  
}
