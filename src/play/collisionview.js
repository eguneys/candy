import { sprite } from '../asprite';

import Pool from 'poolf';

export default function CandyCollisionView(play, ctx, bs) {

  const { frames, layers: { oneLayer } } = ctx;


  let dCollisions = new Pool(() => {
    let res = sprite(frames['white']);
    return res;
  });

  let collision;

  this.init = data => {
    collision = data.collision;
  };

  const addCircle = (circle, frame) => {
    dCollisions.acquire(_ => {
      _.width = circle.radius * 2.0;
      _.height = circle.radius * 2.0;
      _.position.set(circle.x - circle.radius * 0.5, 
                     circle.y - circle.radius * 0.5);
      _.frame = frame;
      oneLayer.add(_);        
    });    
  };

  this.update = delta => {
  };


  this.render = () => {
    dCollisions.each(_ => _.remove());
    dCollisions.releaseAll();

    collision.candies('candy', (circle, item) => {
      addCircle(circle, frames['white']);
    });

    collision.candies('lollipop', (circle, item) => {
      addCircle(circle, frames['white']);
    });

    collision.candies('shoot', (circle, item) => {
      addCircle(circle, frames['white']);
    });
  };
  
}
