import Pool from 'poolf';

import { sprite } from '../asprite';

import { circle } from '../dquad/geometry';

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

  let { bulletWidth, candy: { width: candyWidth } } = bs;

  let pool = new Pool(() => new Bullet(this, ctx, bs));

  let collision;

  this.init = data => {
    collision = data.collision;
  };

  const spawn = (x, y, bent) => {
    
    pool.acquire(_ => _.init({
      x,
      y,
      bent,
      collision
    }));
  };

  this.release = (bullet) => {
    pool.release(bullet);
  };

  const maybeSpawn = withDelay(() => {
    let p = play.currentPoint();

    spawn(p[0] - bulletWidth * 0.25, p[1], -2);
    spawn(p[0] + candyWidth - bulletWidth * 0.75, p[1], 2);
  }, 100);

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

  const { bulletWidth } = bs;

  let dBg;

  dBg = sprite(frames['shoot']);
  dBg.width = bulletWidth;
  dBg.height = bulletWidth;

  let path = new Graphics(),
      points,
      iPath = new ipol(0, 0, {});

  let collisionId,
      dataCollision;
  let bodyCollisionCircle;

  this.init = data => {
    let x = data.x,
        y = data.y,
        bent = data.bent;

    oneLayer.add(dBg);
    
    shootPath(x, y, bent);

    bodyCollisionCircle = circle(0, 0, bulletWidth * 0.5);
    collisionId = data.collision.add(this, bodyCollisionCircle);
    dataCollision = data.collision;
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

  this.damage = () => {
    release();
  };

  const release = () => {
    dBg.remove();
    play.release(this);
    dataCollision.remove(collisionId);
  };

  const updateCollision = () => {
    let p = currentPoint();
    bodyCollisionCircle.move(p[0] + bulletWidth * 0.25, 
                             p[1] + bulletWidth * 0.25);    
  };

  this.update = delta => {
    iPath.update(delta * shootUpdateRate);

    if (iPath.settled()) {
      release();
    }

    updateCollision();
  };


  this.render = () => {
    let point = currentPoint();
    dBg.position.set(point[0], point[1]);

    let alpha = 1.0 - 0.8 * iPath.progress() * iPath.progress();
    dBg.alpha = alpha;
  };
  
}
