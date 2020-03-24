import Renderer from './132d/renderer';

export default function Canvas(element) {

  const displayWidth = this.width = element.clientWidth,
        displayHeight = this.height = element.clientHeight;

  const canvas = document.createElement('canvas');

  element.appendChild(canvas);

  canvas.width = displayWidth;
  canvas.height = displayHeight;

  this.bounds = element.getBoundingClientRect();

  const scene = Renderer(canvas);

  this.scene = scene;

}
