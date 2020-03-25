import ipol from '../../ipol';

import { Easings, Easings2 } from '../../ipol';

import { CandyPath, PathCombined } from '../../candypath';

import LolliGenelBody from './lolligenel';

export default function LolliBody1(play, ctx, bs) {

  const { canvas, 
          events,
          config: {
            SlowUpdateRate,
            FastUpdateRate
          },
          layers: { scene, oneLayer }, 
          frames } = ctx;

  const { width, height, candy: { width: candyWidth } } = bs;

  let path1 = new CandyPath({ easing: Easings.easeInOutQuad,
                              updateRate: SlowUpdateRate * 0.5 }),
      path2 = new CandyPath({ easing: Easings.easeInQuad,
                              updateRate: FastUpdateRate });

  let body = new LolliGenelBody(play, ctx, bs);

  this.init = data => {

    let x = data.x;

    let edgeX = x < width * 0.5 ? width : 0;

    path1.init(x, - candyWidth,
               x, height - candyWidth);
    path2.init(x, height - candyWidth,
               edgeX, 0, 0.1);

    body.init({ collision: data.collision,
                paths: [path1, path2] });
  };

  this.update = delta => {
    body.update(delta);
  };


  this.render = () => {
    body.render();
  };

}
