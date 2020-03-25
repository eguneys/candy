import ipol from '../../ipol';

import { Easings, Easings2 } from '../../ipol';

import { CandyPath, PathCombined } from '../../candypath';

import LolliGenelBody from './lolligenel';

export default function LolliVert(play, ctx, bs) {

  const { canvas, 
          events,
          config: {
            SlowUpdateRate,
            FastUpdateRate
          },
          layers: { scene, oneLayer }, 
          frames } = ctx;

  const { width, height, candy: { width: candyWidth } } = bs;

  let path1 = new CandyPath({ easing: Easings.linear,
                              updateRate: SlowUpdateRate });

  let body = new LolliGenelBody(play, ctx, bs);

  this.init = data => {
    let x = data.x;

    let edgeX = x < width * 0.5 ? width : 0,
        counterEdgeX = x < width * 0.5 ? 0 : width;

    path1.init(x, - candyWidth,
               x, height - candyWidth * 4);

    body.init({ collision: data.collision, 
                paths: [path1] });
  };

  this.update = delta => {
    body.update(delta);
  };


  this.render = () => {
    body.render();
  };
  
}
