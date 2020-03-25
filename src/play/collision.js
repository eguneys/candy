import Collision from '../collision';

export default function CandyCollision() {
  
  let collision = new Collision();

  collision.addRelation('candy', 'lollipop', (body, lollipop) => {
    //console.log(body, 'x', lollipop);
  });

  collision.addRelation('shoot', 'lollipop', (shoot, lollipop) => {
    lollipop.damage(shoot);
    shoot.damage();
  });

  this.candies = collision.candies;
  this.update = collision.update;

  this.addCandy = (candy, circle) => {
    return collision.addCandy('candy', circle, candy);
  };

  this.removeCandy = (id) => collision.removeCandy('candy', id);

  this.addLollipop = (lollipop, circle) => {
    return collision.addCandy('lollipop', circle, lollipop);
  };

  this.removeLollipop = (id) => collision.removeCandy('lollipop', id);

  this.addShoot = (shoot, circle) => {
    return collision.addCandy('shoot', circle, shoot);
  };

  this.removeShoot = (id) => collision.removeCandy('shoot', id);

}
