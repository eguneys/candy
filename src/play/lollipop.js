import Pool from 'poolf';

import { withDelay } from './util';

import * as mu from 'mutilz';

import LollipopGang from './gang';

export default function Lollipop(play, ctx, bs) {

  const { width } = bs;

  let pool = new Pool(() => new LollipopGang(this, ctx, bs));

  let collision;

  this.init = data => {
    collision = data.collision;
  };

  this.release = (gang) => {
    pool.release(gang);
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
  }, 10000);

  this.update = delta => {
    maybeSpawn(delta);
    pool.each(_ => _.update(delta));
  };


  this.render = () => {
    pool.each(_ => _.render());
  };
  
}
