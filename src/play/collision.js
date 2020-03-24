import Collision from '../collision';

export default function CandyCollision() {
  
  let collision = new Collision();

  collision.addRelation('candy', 'lollipop', (body, lollipop) => {
    console.log(body, 'x', lollipop);
  });

  this.candies = collision.candies;
  this.update = collision.update;

  this.addCandy = (candy, circle) => {
    collision.addCandy('candy', circle, candy);
  };

  this.addLollipop = (lollipop, circle) => {
    collision.addCandy('lollipop', circle, lollipop);
  };

}
