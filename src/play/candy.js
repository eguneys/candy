import { throttle } from '../util';
import { sprite } from '../asprite';

import Graphics from '../graphics';

import { line } from '../dquad/geometry';

import ipol from '../ipol';
import { Easings } from '../ipol';

import Animation from '../animation';

import CandyShoot from './shoot';
import Lollipop from './lollipop';
import Sky from './sky';

export default function Candy(play, ctx, bs) {

  const { canvas, 
          events,
          layers: { scene, zeroLayer }, 
          frames } = ctx;

  let body = new CandyBody(this, ctx, bs);
  let shoot = new CandyShoot(this, ctx, bs);
  let lollipop = new Lollipop(this, ctx, bs);
  let sky = new Sky(this, ctx, bs);

  this.currentPoint = body.currentPoint;

  this.init = data => {
    body.init({});
    shoot.init({});
    lollipop.init({});
    sky.init({});
    scene.background(0.1, 0.2, 0.2);
  };

  this.update = delta => {
    body.update(delta);
    shoot.update(delta);
    lollipop.update(delta);
    sky.update(delta);
  };


  this.render = () => {
    body.render();
    shoot.render();
    lollipop.render();
    sky.render();
  };
  
}

function CandyBody(play, ctx, bs) {

  const { canvas, 
          events,
          layers: { scene, oneLayer }, 
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
  dBg = sprite(frames['candy']);
  dBg.width = 32;
  dBg.height = 32;

  this.init = data => {

    oneLayer.add(dBg);

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

  this.currentPoint = currentPoint;

  const moveTo = x => {
    moving = true;
    movingPath(x);
  };

  const safeMoveTo = throttle(x => moveTo(x), 250);

  const handleMouse = () => {
    const { current } = events.data;

    if (current) {
      let { tapping, epos, ending } = current;

      if (tapping) {
        safeMoveTo(epos[0] - candyWidth * 0.5);
      }

      if (ending) {
        let { swipe } = ending;
        console.log(swipe);
      }
    }
  };

  const updateMove = () => {
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

    handleMouse(delta);

    updateMove();

    updateAnimation(delta);

  };


  this.render = () => {

    let point = currentPoint();

    dBg.position.set(point[0], point[1]);

  };
  
}