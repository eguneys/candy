import Pool from 'poolf';

import { sprite } from '../asprite';

import { withDelay } from './util';

import * as mu from 'mutilz';

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

  const maybeSpawn = withDelay(() => {
    spawn(mu.rand(32 * 2, width - 32 * 2));
  }, 1000);

  this.update = delta => {
    maybeSpawn(delta);
    pool.each(_ => _.update(delta));
  };


  this.render = () => {
    pool.each(_ => _.render());
  };
  
}

function LollipopBody(play, ctx, bs) {

  const { canvas, 
          events,
          layers: { scene, oneLayer }, 
          frames } = ctx;

  const { width, height } = bs;

  let dBg;
  dBg = sprite(frames['candy']);
  dBg.width = 32;
  dBg.height = 32;

  let path1 = new CandyPath({}),
      path2 = new CandyPath({}),
      path = new PathCombined();

  this.init = data => {
    let x = data.x;

    oneLayer.add(dBg);
    
    let edgeX = mu.arand([0, width]);

    path1.init(x, 0,
               x, height);
    path2.init(x, height,
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
