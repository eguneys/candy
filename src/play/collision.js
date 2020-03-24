import Collision from '../collision';

export default function CandyCollision() {
  
  let collision = new Collision();

  collision.addRelation('candy', 'lollipop', (body, lollipop) => {
    //console.log(body, 'x', lollipop);
  });

  collision.addRelation('shoot', 'lollipop', (shoot, lollipop) => {
    console.log('shoot lollipop');
  });

  this.candies = collision.candies;
  this.update = collision.update;

  this.addCandy = (candy, circle) => {
    collision.addCandy('candy', circle, candy);
  };

  this.addLollipop = (lollipop, circle) => {
    collision.addCandy('lollipop', circle, lollipop);
  };

  this.addShoot = (shoot, circle) => {
    collision.addCandy('shoot', circle, shoot);
  };

}
