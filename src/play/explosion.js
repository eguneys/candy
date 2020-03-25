import Pool from 'poolf';

import { sprite } from '../asprite';

import Animation from '../animation';

import { Delayer } from './util';

export default function Explosion(play, ctx, bs) {

  const { canvas, 
          events,
          layers: { scene, zeroLayer }, 
          frames } = ctx;

  let { candy: { width: candyWidth } } = bs;

  let pool = new Pool(() => new Spark(this, ctx, bs));

  let delayer = new Delayer();

  this.explosion = (x, y) => {
    let offX = candyWidth * 0.6;
    delayer.add(() => spawn(x, y), 0);
    delayer.add(() => spawn(x + offX, y + offX, 16), 100);
    delayer.add(() => spawn(x - offX, y + offX, 16), 200);
    delayer.add(() => spawn(x + offX, y - offX, 16), 200);
    delayer.add(() => spawn(x - offX, y - offX, 16), 400);
  };

  const spawn = (x, y, w = 32) => {
    pool.acquire(_ => _.init({
      x,
      y,
      w
    }));
  };

  this.release = (spark) => {
    pool.release(spark);
  };


  this.init = data => {
  };

  this.update = delta => {
    pool.each(_ => _.update(delta));
    delayer.update(delta);
  };


  this.render = () => {
    pool.each(_ => _.render());
  };
  
}

function Spark(play, ctx, bs) {
    const { canvas, 
          events,
          layers: { scene, twoLayer }, 
          frames } = ctx;

  let animation = new Animation(frames['explosion'], {yoyo: false});

  let dBg;

  dBg = sprite(frames['shoot']);


  this.init = data => {
    let x = data.x,
        y = data.y,
        w = data.w;

    let sparkWidth = w;

    dBg.width = sparkWidth;
    dBg.height = sparkWidth;
    dBg.position.set(x, y);

    twoLayer.add(dBg);

  };

  const release = () => {
    dBg.remove();
    play.release(this);
  };

  this.update = delta => {

    if (animation.settled()) {
      release();
    }

    animation.update(delta * 0.001 * 4);
  };

  this.render = () => {
    dBg.frame = animation.frame();
  };
  
}
