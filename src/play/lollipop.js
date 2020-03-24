import Pool from 'poolf';

import { sprite } from '../asprite';

import { withDelay } from './util';

import { line } from '../dquad/geometry';
import Graphics from '../graphics';
import ipol from '../ipol';
import { Easings } from '../ipol';

export default function Lollipop(play, ctx, bs) {

  let pool = new Pool(() => new LollipopBody(this, ctx, bs));

  this.init = data => {
  };

  const spawn = (x, y) => {
    
    pool.acquire(_ => _.init({
      x,
      y
    }));
  };


  this.release = (bullet) => {
    pool.release(bullet);
  };

  const maybeSpawn = withDelay(() => {
    spawn(0, 0);
  }, 2000);

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

  const { width } = bs;

  const pathUpdateRate = 0.001;
  
  let dBg;
  dBg = sprite(frames['candy']);
  dBg.width = 32;
  dBg.height = 32;

  let path = new Graphics(),
      points,
      iPath = new ipol(0, 0, { yoyo: true });

  this.init = data => {
    oneLayer.add(dBg);
    
    spawnPath(0, 0,
              width, 0);
  };

  const spawnPath = (x, y, x2, y2) => {
    path.clear();
    path.bent(line([x, y],
                   [x2, y2]), 0.01);

    points = path.points();
    iPath.both(0, 1);
  };

  const currentPoint = () => {
    let iPoints = Math.floor(iPath.easing(Easings.easeInOutQuad) * 
                             (points.length - 1));
    let point = points[iPoints];
    return point;
  };

  this.update = delta => {
    iPath.update(delta * pathUpdateRate);
  };


  this.render = () => {
    let point = currentPoint();
    dBg.position.set(point[0], point[1]);   
  };
}
