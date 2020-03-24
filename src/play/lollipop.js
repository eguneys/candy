import Pool from 'poolf';

import { sprite } from '../asprite';

import { withDelay } from './util';

import * as mu from 'mutilz';

import { Easings } from '../ipol';

import { CandyPath, PathCombined } from '../candypath';

export default function Lollipop(play, ctx, bs) {

  const { width } = bs;

  let pool = new Pool(() => new LollipopGang(this, ctx, bs));

  this.init = data => {
  };

  this.release = (gang) => {
    pool.release(gang);
  };

  const spawn = () => {
    let x = mu.rand(0, width - 32);
    pool.acquire(_ => _.init({x}));
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


  this.init = data => {
    spawnCount = 0;
    x = data.x;
  };

  const spawn = (x) => {    
    pool.acquire(_ => _.init({x}));
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

  const { width, height } = bs;

  let dBg;
  dBg = sprite(frames['candy']);
  dBg.width = 32;
  dBg.height = 32;

  let path1 = new CandyPath({ easing: Easings.easeOutQuad,
                              updateRate: SlowUpdateRate }),
      path2 = new CandyPath({ easing: Easings.easeInQuad,
                              updateRate: FastUpdateRate }),
      path = new PathCombined();

  this.init = data => {
    let x = data.x;

    oneLayer.add(dBg);

    let edgeX = x < width * 0.5 ? width : 0;

    path1.init(x, - 32,
               x, height - 32);
    path2.init(x, height - 32,
               edgeX, 0);
    path.init([path1, path2]);
  };

  const release = () => {
    dBg.remove();
    play.release(this);
  };

  this.update = delta => {
    path.update(delta);
    if (path2.settled()) {
      release(); 
    }
  };


  this.render = () => {
    let point = path.currentPoint();
    dBg.position.set(point[0], point[1]);
  };
}
