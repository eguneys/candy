import Pool from 'poolf';

import { sprite } from '../asprite';

import { withDelay } from './util';

import * as mu from 'mutilz';

import { Easings } from '../ipol';

import { CandyPath, PathCombined } from '../candypath';

export default function Lollipop(play, ctx, bs) {

  const { width } = bs;

  let pool = new Pool(() => new LollipopBody(this, ctx, bs));

  this.init = data => {
  };

  const spawn = (x) => {    
    pool.acquire(_ => _.init({x}));
  };


  this.release = (bullet) => {
    pool.release(bullet);
  };

  const maybeSpawnNone = withDelay(() => {
  }, 10000);

  let spawnFunctionCustomData;

  let spawnFunctionResetCounter;
  let spawnFunction = maybeSpawnNone;

  const maybeSpawnOne = withDelay(() => {
    spawnFunctionResetCounter--;
    spawn(spawnFunctionCustomData);
    if (spawnFunctionResetCounter < 0) {
      spawnFunction = maybeSpawnNone;
    }
  }, 500);

  const maybeSpawn = withDelay(() => {
    spawnFunctionResetCounter = 5;
    spawnFunctionCustomData = mu.rand(32 * 2, width - 32 * 2);
    spawnFunction = maybeSpawnOne;
  }, 10000);

  this.update = delta => {
    maybeSpawn(delta);
    spawnFunction(delta);

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

  let dBg2;
  dBg2 = sprite(frames['candy']);
  dBg2.width = 32;
  dBg2.height = 32;

  let path1 = new CandyPath({ easing: Easings.easeOutQuad,
                              updateRate: SlowUpdateRate }),
      path2 = new CandyPath({ updateRate: FastUpdateRate }),
      path = new PathCombined();

  this.init = data => {
    let x = data.x;

    oneLayer.add(dBg);
    oneLayer.add(dBg2);

    let edgeX = x < width * 0.5 ? 0 : width;

    path1.init(x, - 32,
               x, height - 32);
    path2.init(x, height - 32,
               edgeX, 0);
    path.init([path1, path2]);
  };

  this.update = delta => {
    path.update(delta);
  };


  this.render = () => {
    let point = path.currentPoint();
    dBg.position.set(point[0], point[1]);
  };
}
