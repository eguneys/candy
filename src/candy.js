import ipol from '../ipol';

import Graphics from './graphics';

import { line } from '../dquad/geometry';

export default function Candy() {

  let moving;

  let path = new Graphics(),
      points;

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
  
};
