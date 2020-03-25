import ipol from '../../ipol';

import { Easings, Easings2 } from '../../ipol';

import { CandyPath, PathCombined } from '../../candypath';

import LolliGenelBody from './lolligenel';

export default function LolliBody2(play, ctx, bs) {

  const { canvas, 
          events,
          config: {
            SlowUpdateRate,
            FastUpdateRate
          },
          layers: { scene, oneLayer }, 
          frames } = ctx;

  const { width, height, candy: { width: candyWidth } } = bs;

  let path1 = new CandyPath({ easing: Easings.easeInQuad,
                              updateRate: SlowUpdateRate }),
      path2 = new CandyPath({ easing: Easings.linear,
                              updateRate: FastUpdateRate }),
      path3 = new CandyPath({ easing: Easings.easeOutQuad,
                              updateRate: FastUpdateRate });

  let body = new LolliGenelBody(play, ctx, bs);

  this.init = data => {
    let x = data.x;

    let edgeX = x < width * 0.5 ? width : 0,
        counterEdgeX = x < width * 0.5 ? 0 : width;

    path1.init(x, - candyWidth,
               x, height - candyWidth * 4);
    path2.init(x, height - candyWidth * 4,
               edgeX - candyWidth * 2, height * 0.5, 0.4);

    path3.init(edgeX - candyWidth * 2, height * 0.5,
               counterEdgeX, height * 0.5, 0.4);

    body.init({ collision: data.collision, 
                paths: [path1, path2, path3] });
  };

  this.update = delta => {
    body.update(delta);
  };


  this.render = () => {
    body.render();
  };
  
}
