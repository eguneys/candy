import Pool from 'poolf';

import { sprite } from '../asprite';

import { withDelay } from './util';

import { line } from '../dquad/geometry';
import Graphics from '../graphics';

import ipol from '../ipol';
import { Easings } from '../ipol';

import * as mu from 'mutilz';

import Animation from '../animation';

export default function Sky(play, ctx, bs) {

  const { width } = bs;

  let pool = new Pool(() => new Clouds(this, ctx, bs));

  this.init = data => {
  };

  const spawn = (x) => {
    pool.acquire(_ => _.init({x}));
  };

  this.dashing = () => play.body.dashing();

  this.release = (bullet) => {
    pool.release(bullet);
  };

  const maybeSpawn = withDelay(() => {
    spawn(mu.rand(0, width));
  }, 500);

  this.update = delta => {
    maybeSpawn(delta);
    pool.each(_ => _.update(delta));  
  };


  this.render = () => {
    pool.each(_ => _.render());
  };
  
}

function Clouds(play, ctx, bs) {

  const { canvas, 
          events,
          layers: { scene, zeroLayer }, 
          frames } = ctx;

  const { height, width } = bs;

  const PathUpdateRate = 0.001 * 0.2;

  let aBounce = new Animation(frames['bounce'], {});
  
  let dBg;
  dBg = sprite(frames['candy']);
  dBg.width = 16;
  dBg.height = 16;
  dBg.alpha = 0.1;

  let dashBoost;

  let path = new Graphics(),
      points,
      iPath = new ipol(0, 0, {});

  let x;

  this.init = data => {
    x = data.x;

    zeroLayer.add(dBg);

    spawnPath();
  };

  const spawnPath = () => {
    path.clear();
    path.bent(line([x, -8],
                   [x, height]), 0.01);

    points = path.points();
    iPath.both(0, 1);
  };

  const currentPoint = () => {
    let iPoints = Math.floor(iPath.easing(Easings.easeInQuad) * 
                             (points.length - 1));
    let point = points[iPoints];
    return point;
  };

  const updateAnimation = delta => {
    aBounce.update(delta * PathUpdateRate * 10);
    dBg.frame = aBounce.frame();
  };

  this.update = delta => {
    let dashBoost = play.dashing() ? 2.0: 1.0;

    iPath.update(delta * PathUpdateRate * dashBoost);

    updateAnimation(delta);

    if (iPath.settled()) {
      play.release(this);
    }
  };


  this.render = () => {
    let point = currentPoint();
    dBg.position.set(point[0], point[1]);
  };
  
}
