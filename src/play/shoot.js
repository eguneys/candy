import Pool from 'poolf';

import { sprite } from '../asprite';

import Graphics from '../graphics';

import { line } from '../dquad/geometry';

import ipol from '../ipol';
import { Easings } from '../ipol';

import { withDelay } from './util';

export default function CandyShoot(play, ctx, bs) {

  const { canvas, 
          events,
          layers: { scene, zeroLayer }, 
          frames } = ctx;

  let { candy: { width: candyWidth } } = bs;

  let pool = new Pool(() => new Bullet(this, ctx, bs));

  this.init = data => {
  };

  const spawn = (x, y, bent) => {
    
    pool.acquire(_ => _.init({
      x,
      y,
      bent
    }));
  };

  this.release = (bullet) => {
    pool.release(bullet);
  };

  const maybeSpawn = withDelay(() => {
    let p = play.currentPoint();

    spawn(p[0], p[1], -2);
    spawn(p[0] + candyWidth - 16, p[1], 2);
  }, 200);

  this.update = delta => {
    maybeSpawn(delta);
    pool.each(_ => _.update(delta));
  };


  this.render = () => {
    pool.each(_ => _.render());
  };
  
}

function Bullet(play, ctx, bs) {

  const { canvas, 
          events,
          layers: { scene, oneLayer }, 
          frames } = ctx;

  const shootUpdateRate = 0.001 * 2;

  let dBg;

  dBg = sprite(frames['candy']);
  dBg.width = 16;
  dBg.height = 16;

  let path = new Graphics(),
      points,
      iPath = new ipol(0, 0, {});

  this.init = data => {
    let x = data.x,
        y = data.y,
        bent = data.bent;

    oneLayer.add(dBg);
    
    shootPath(x, y, bent);
  };

  const currentPoint = () => {
    let iPoints = Math.floor(iPath.easing(Easings.easeInOutQuad) * (points.length - 1));
    let point = points[iPoints];
    return point;
  };
  
  const shootPath = (x, y, bent) => {
    path.clear();
    path.bent(line([x, y],
                   [x, y - bs.height * 0.8]), bent * 0.01);

    points = path.points();
    iPath.both(0, 1);
  };

  const release = () => {
    dBg.remove();
    play.release(this);
  };

  this.update = delta => {
    iPath.update(delta * shootUpdateRate);

    if (iPath.settled()) {
      release();
    }
  };


  this.render = () => {
    let point = currentPoint();
    dBg.position.set(point[0], point[1]);
  };
  
}
