import { rect } from '../dquad/rect';

import CandyView from './candy';

export default function Play(ctx) {

  const { canvas, 
          layers: { scene, zeroLayer }, 
          frames } = ctx;

  const bs = (() => {
    const { width, height } = canvas;

    let candy = rect(
      0, 0,
      32,
      32
    );

    return {
      width,
      height,
      bulletWidth: 32,
      candy
    };
  })();


  let dCandy = new CandyView(this, ctx, bs);

  this.init = data => {
    dCandy.init({});
  };

  this.update = delta => {
    dCandy.update(delta);
  };


  this.render = () => {
    dCandy.render();
  };
  
}
