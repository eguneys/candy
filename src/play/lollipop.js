import Pool from 'poolf';

import { sprite } from '../asprite';

import { circle } from '../dquad/geometry';

import { withDelay } from './util';

import * as mu from 'mutilz';

import ipol from '../ipol';

import { Easings } from '../ipol';

import { CandyPath, PathCombined } from '../candypath';

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

function LollipopGang(play, ctx, bs) {

  const { width } = bs;

  let pool = new Pool(() => new LollipopBody(this, ctx, bs));

  let spawnCount;

  let x;

  let collision;

  this.init = data => {
    collision = data.collision;
    spawnCount = 0;
    x = data.x;
  };

  const spawn = (x) => {    
    pool.acquire(_ => _.init({
      x,
      collision
    }));
  };


  this.release = (bullet) => {
    pool.release(bullet);
  };

  const maybeSpawn = withDelay(() => {
    if (spawnCount++ < 5) {
      spawn(x);
    }
  }, 200);

  const maybeRelease = () => {
    if (spawnCount > 0 && pool.alives() === 0) {
      play.release(this);
    }
  };

  this.update = delta => {
    maybeSpawn(delta);
    maybeRelease();
    pool.each(_ => _.update(delta));
  };


  this.render = () => {
    pool.each(_ => _.render());    
  };  
}



function LollipopBody(play, ctx, bs) {

  const { canvas, 
          events,
          config: {
            SlowUpdateRate,
            FastUpdateRate
          },
          layers: { scene, oneLayer }, 
          frames } = ctx;

  const { width, height, candy: { width: candyWidth } } = bs;

  let dBg;
  dBg = sprite(frames['candy']);
  dBg.width = candyWidth;
  dBg.height = candyWidth;

  let path1 = new CandyPath({ easing: Easings.easeOutQuad,
                              updateRate: SlowUpdateRate }),
      path2 = new CandyPath({ easing: Easings.easeInQuad,
                              updateRate: FastUpdateRate }),
      path = new PathCombined();

  let dataCollision;
  let collisionId;
  let bodyCollisionCircle;


  let iDamageKickbackY = new ipol(0, 0, {});

  const damageShrinkFactor = candyWidth * 0.2;

  let maxDamageResist,
      damageResistFrames;

  this.init = data => {

    let x = data.x;

    maxDamageResist = 20;
    damageResistFrames = maxDamageResist;

    iDamageKickbackY.both(0, 0);

    oneLayer.add(dBg);

    let edgeX = x < width * 0.5 ? width : 0;

    path1.init(x, - candyWidth,
               x, height - candyWidth);
    path2.init(x, height - candyWidth,
               edgeX, 0);
    path.init([path1, path2]);

    bodyCollisionCircle = circle(0, 0, candyWidth * 0.5);
    collisionId = data.collision.add(this, bodyCollisionCircle);
    dataCollision = data.collision;
  };

  const damageScale = () => {
    return damageResistFrames / maxDamageResist;
  };

  const release = () => {
    dBg.remove();
    play.release(this);
    dataCollision.remove(collisionId);
  };

  this.damage = shoot => {

    damageResistFrames--;
    damageResistFrames = Math.max(damageResistFrames, 0);

    let dValue = iDamageKickbackY.value();
    iDamageKickbackY.both(0, dValue - 1);

    dBg.tint = 0xffffab;

  };

  const updateDamage = () => {
    if (iDamageKickbackY.settled()) {
      dBg.tint = 0xffffff;
    }
    if (damageScale() < 0.1) {
      release();
    }
  };

  const updateCollision = () => {
    let p = path.currentPoint();
    bodyCollisionCircle.move(p[0] + candyWidth * 0.25, 
                             p[1] + candyWidth * 0.25);
  };

  this.update = delta => {

    iDamageKickbackY.update(delta * 0.01);
    updateDamage();
    updateCollision();

    path.update(delta);
    if (path2.settled()) {
      release(); 
    }
  };


  this.render = () => {
    let damageY = iDamageKickbackY.value();
    let point = path.currentPoint();
    dBg.position.set(point[0], point[1] + damageY * -4);

    let damageWidth = candyWidth - (1 - damageScale()) * damageShrinkFactor;
    dBg.width = damageWidth;
    dBg.height = damageWidth;
  };
}
