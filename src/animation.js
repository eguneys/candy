import ipol from './ipol';

export default function Animation(frames, { yoyo = true }) {

  let frame = frames[0];
  let iPol = new ipol(0, 1, { yoyo });

  this.settled = iPol.settled;

  this.update = delta => {

    iPol.update(delta);

    frame = frames[Math.floor(iPol.value() * (frames.length - 1))];
  };

  this.frame = () => frame;
}
