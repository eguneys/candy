import { sprite } from '../../asprite';

import { circle } from '../../dquad/geometry';

import ipol from '../../ipol';

import { PathCombined } from '../../candypath';

import Explosion from '../explosion';

export default function LolliGenelBody(play, ctx, bs) {

  const { canvas, 
          events,
          config: {
            SlowUpdateRate,
            FastUpdateRate
          },
          layers: { scene, oneLayer }, 
          frames } = ctx;

  const { width, height, candy: { width: candyWidth } } = bs;

  let explosion = new Explosion(play, ctx, bs);

  let dBg;
  dBg = sprite(frames['candy']);
  dBg.width = candyWidth;
  dBg.height = candyWidth;

  let path = new PathCombined();

  let dataCollision;
  let collisionId;
  let bodyCollisionCircle;


  let iDamageKickbackY = new ipol(0, 0, {});

  const damageShrinkFactor = candyWidth * 0.2;

  let maxDamageResist,
      damageResistFrames;

  this.init = data => {
    let paths = data.paths;

    maxDamageResist = 10;
    damageResistFrames = maxDamageResist;

    iDamageKickbackY.both(0, 0);

    oneLayer.add(dBg);

    path.init(paths);

    bodyCollisionCircle = circle(0, 0, candyWidth * 0.5);
    collisionId = data.collision.add(this, bodyCollisionCircle);
    dataCollision = data.collision;

    explosion.init({});
  };

  const damageScale = () => {
    return damageResistFrames / maxDamageResist;
  };

  const release = () => {
    dBg.remove();
    play.release(this);
    dataCollision.remove(collisionId);
  };

  const damage = () => {
    damageResistFrames--;
    damageResistFrames = Math.max(damageResistFrames, 0);

    let dValue = iDamageKickbackY.value();
    iDamageKickbackY.both(0, dValue - 1);

    dBg.tint = 0xfffffd;
  };

  this.damage = shoot => {

    damage();
  };

  let exploding;

  const explode = () => {
    if (exploding) {
      return;
    }
    exploding = true;
    let point = path.currentPoint();
    explosion.explosion(...point);
  };

  const updateDamage = () => {
    if (iDamageKickbackY.settled()) {
      dBg.tint = 0xcccccc;
    }
    if (damageScale() < 0.1) {
      explode();
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
    if (path.settled()) {
      release(); 
    }

    explosion.update(delta);
  };


  this.render = () => {
    let damageY = iDamageKickbackY.value();
    let point = path.currentPoint();
    dBg.position.set(point[0], point[1] + damageY * -4);

    let damageWidth = candyWidth - (1 - damageScale()) * damageShrinkFactor;
    dBg.width = damageWidth;
    dBg.height = damageWidth;

    explosion.render();
  };
}
