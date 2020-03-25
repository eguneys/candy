import Pool from 'poolf';

import { sprite } from '../asprite';

import Animation from '../animation';

export default function Explosion(play, ctx, bs) {

  const { canvas, 
          events,
          layers: { scene, zeroLayer }, 
          frames } = ctx;

  let { candy: { width: candyWidth } } = bs;

  let pool = new Pool(() => new Spark(this, ctx, bs));


  this.explosion = (x, y) => spawn(x, y);

  const spawn = (x, y) => {
    pool.acquire(_ => _.init({
      x,
      y
    }));
  };

  this.release = (spark) => {
    pool.release(spark);
  };


  this.init = data => {
  };

  this.update = delta => {
    pool.each(_ => _.update(delta));
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

  let animation = new Animation(frames['explosion'], {});

  let dBg;

  dBg = sprite(frames['shoot']);


  this.init = data => {
    let x = data.x,
        y = data.y;

    let sparkWidth = 32;

    dBg.width = sparkWidth;
    dBg.height = sparkWidth;
    dBg.position.set(x, y);
  };

  const release = () => {
    dBg.remove();
    play.release(this);
  };

  this.update = delta => {
    animation.update(delta);
  };

  this.render = () => {
    dBg.frame = animation.frame();
  };
  
}
