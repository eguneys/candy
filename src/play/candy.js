import { throttle } from '../util';
import { sprite } from '../asprite';

import { circle } from '../dquad/geometry';

import * as v from '../vec2';
import { CandyPath } from '../candypath';

import CandyCollision from './collision';
import CandyCollisionView from './collisionview';

import Animation from '../animation';

import CandyShoot from './shoot';
import Lollipop from './lollipop';
import Sky from './sky';
import Explosion from './explosion';

export default function Candy(play, ctx, bs) {

  const { canvas, 
          events,
          layers: { scene, zeroLayer }, 
          frames } = ctx;

  let body = new CandyBody(this, ctx, bs);
  let shoot = new CandyShoot(this, ctx, bs);
  let lollipop = new Lollipop(this, ctx, bs);
  let sky = new Sky(this, ctx, bs);

  let dCollisionView = new CandyCollisionView(this, ctx, bs);
  let collision = new CandyCollision();

  this.body = body;
  this.currentPoint = body.currentPoint;

  this.init = data => {

    dCollisionView.init({ collision });

    body.init({collision: {
      add: collision.addCandy,
      remove: collision.removeCandy
    }});
    shoot.init({collision: {
      add: collision.addShoot,
      remove: collision.removeShoot
    } });

    lollipop.init({collision: {
      add: collision.addLollipop,
      remove: collision.removeLollipop
    }});
    sky.init({});

    scene.background(0.1, 0.2, 0.2);
  };

  this.update = delta => {
    body.update(delta);
    shoot.update(delta);
    lollipop.update(delta);
    sky.update(delta);

    collision.update(delta);
    dCollisionView.update(delta);
  };


  this.render = () => {
    body.render();
    shoot.render();
    lollipop.render();
    sky.render();

    // dCollisionView.render();
  };
  
}

function CandyBody(play, ctx, bs) {

  const { canvas, 
          events,
          config: {
            candy: {
              SlowUpdateRate,
              FastUpdateRate
            }
          },
          layers: { scene, twoLayer }, 
          frames } = ctx;

  let { width, height, candy: { width: candyWidth } } = bs;

  let aBounce = new Animation(frames['bounce'], {});

  let standingPath = new CandyPath({ yoyo: true, 
                                     updateRate: SlowUpdateRate });

  let movingPath = new CandyPath({ yoyo: false,
                                   updateRate: FastUpdateRate * 2.0 });
  let dashingPath = new CandyPath({ yoyo: false,
                                    updateRate: FastUpdateRate });

  let currentPath;

  let BackY = height - candyWidth,
      DashY = height - candyWidth * 10;

  let dBg;
  dBg = sprite(frames['candy']);
  dBg.width = 32;
  dBg.height = 32;

  let bodyCollisionCircle;

  this.init = data => {

    let x = width * 0.5,
        y = BackY;

    stand([x, y]);

    bodyCollisionCircle = circle(x, y, candyWidth * 0.5);
    data.collision.add(this, bodyCollisionCircle);

    twoLayer.add(dBg);

  };

  const stand = (from = this.currentPoint()) => {

    standingPath.init(from[0], from[1],
                      from[0] + candyWidth * 0.5, from[1],
                     -0.1); 
    currentPath = standingPath;
  };

  const move = (x) => {
    let from = this.currentPoint();

    let bentSign = Math.sign(from[0] - x);

    movingPath.init(from[0], from[1],
                    x, from[1], bentSign * 0.1);
    currentPath = movingPath;
  };

  const dash = (y) => {
    let from = this.currentPoint();

    dashingPath.init(from[0], from[1],
                     from[0], y, 0.1);
    currentPath = dashingPath;
  };

  this.currentPoint = () => currentPath.currentPoint();

  this.dashing = () => currentPath === dashingPath;

  const handleMouse = () => {
    const { current } = events.data;

    if (current) {
      let { epos, ending } = current;

      if (ending) {
        let { swipe: { swiped, up, down } } = ending;

        if (!swiped) {

          move(epos[0]);

        } else if (up) {
          dash(DashY);
        } else if (down) {
          dash(BackY);
        }
      }
    }
  };

  const updateMove = () => {
    if (currentPath === movingPath && currentPath.settled()) {
      stand();
    }
    if (currentPath === dashingPath && currentPath.settled()) {
      stand();
    }
  };

  const updateCollision = () => {
    let p = this.currentPoint();
    bodyCollisionCircle.move(p[0] + candyWidth * 0.25, 
                             p[1] + candyWidth * 0.25);
  };

  const updateAnimation = delta => {

  };

  this.update = delta => {
    currentPath.update(delta);

    handleMouse(delta);

    updateCollision();

    updateMove();

    updateAnimation(delta);

  };


  this.render = () => {
    let point = currentPath.currentPoint();

    dBg.position.set(point[0], point[1]);

  };
  
}
