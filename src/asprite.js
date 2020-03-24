import Renderer from './132d/renderer';

const { Point, Sprite } = Renderer;

export function sprite(frame) {
  return new Sprite(frame);
}

export function point(x = 0, y = x) {
  return new Point(x, y);
}
