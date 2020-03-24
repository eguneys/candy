import { line } from './dquad/geometry';
import Graphics from './graphics';
import ipol from './ipol';
import { Easings } from './ipol';

export function CandyPath({yoyo, 
                           easing = Easings.easeInOutQuad,
                           updateRate = 0.001 * 0.4}) {

  const pathUpdateRate = updateRate;
  
  let path = new Graphics(),
      points,
      iPath = new ipol(0, 0, { yoyo });

  this.init = (x, y, x2, y2, bent = 0.01) => {
    path.clear();
    path.bent(line([x, y],
                   [x2, y2]), bent);

    points = path.points();
    iPath.both(0, 1);
  };

  this.settled = () => iPath.settled();

  const currentPoint = this.currentPoint = (offset = 0) => {
    let iPoints = Math.floor(iPath.easing(easing) *
                             (points.length - 1));

    iPoints += offset;
    iPoints = Math.min(iPoints, points.length - 1);
    iPoints = Math.max(iPoints, 0);

    let point = points[iPoints];
    return point;
  };

  this.update = (delta) => {
    iPath.update(delta * pathUpdateRate);
  };

}

export function PathCombined() {

  let paths,
      current;

  this.init = (data) => {
    paths = data;
    current = 0;
  };

  const currentPath = () => paths[current];

  const nextPath = () => {
    if (current < paths.length - 1) {
      current++;
    }
  };

  this.currentPoint = (n) => {
    return currentPath().currentPoint(n);
  };

  this.update = delta => {
    let path = currentPath();
    path.update(delta);
    if (path.settled()) {
      nextPath();
    }
  };

}
