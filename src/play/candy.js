import { sprite } from '../asprite';

import Graphics from '../graphics';

import { line } from '../dquad/geometry';

import ipol from '../ipol';

import { Easings } from '../ipol';

import Animation from '../animation';

export default function Candy(play, ctx, bs) {

  const { canvas, 
          layers: { scene, zeroLayer }, 
          frames } = ctx;

  let { width, height, candy: { width: candyWidth } } = bs;

  let aBounce = new Animation(frames['bounce'], {});

  let path = new Graphics(),
      points,
      iPath = new ipol(0, 0, { yoyo: true });

  const SlowUpdateRate = 0.001,
        FastUpdateRate = SlowUpdateRate * 2;

  let moving;

  let dBg;

  this.init = data => {
    dBg = sprite(frames['candy']);
    dBg.width = 32;
    dBg.height = 32;
    zeroLayer.add(dBg);


    moving = false;
    standingPath(10);
  };

  let i = 0; 

  const standingPath = (x) => {
    path.clear();
    path.bent(line([x, height - candyWidth],
                   [x + candyWidth, height - candyWidth]), - 0.1);

    points = path.points();
    iPath.both(0, 1);
  };

  const movingPath = (to) => {
    let from = currentPoint();

    path.clear();
    path.bent(line(from,
                   [to, height - candyWidth]), 
              Math.sign(from[0] - to) * 
              0.1);

    points = path.points();
    iPath.both(0, 1);
  };

  const currentPoint = () => {
    let iPoints = Math.floor(iPath.easing(Easings.easeInOutQuad) * (points.length - 1));
    let point = points[iPoints];
    return point;
  };

  const moveTo = x => {
    moving = true;
    movingPath(x);
  };

  const maybeMove = () => {
    if (!moving && Math.random() < 0.05) {
      let i = Math.random() * (width - candyWidth);
      moveTo(i);
    }
    if (moving && iPath.settled()) {
      moving = false;
      standingPath(currentPoint()[0]);
    }
  };

  const updateAnimation = delta => {
    if (moving) {
      aBounce.update(delta * FastUpdateRate);
      dBg.frame = aBounce.frame();
    } else {
      dBg.frame = frames['candy'];
    }
  };

  this.update = delta => {

    let iPathUpdateRate = moving ? FastUpdateRate: SlowUpdateRate;

    iPath.update(delta * iPathUpdateRate);

    maybeMove();

    updateAnimation(delta);

  };


  this.render = () => {

    let point = currentPoint();

    dBg.position.set(point[0], point[1]);

  };
  
}
