import { point } from './asprite';

const wholeFrame = (scene, image, w, h = w) =>
      scene.texture(image)
      .frame(point(), point(w, h));

const makeFrame = atlas => (x, y, w, h = w) => 
      atlas.frame(point(x, y),
                  point(w, h));

const animation = (fM, x, y, w, n) => {
  let res = [];
  for (let i = 0; i < n; i++) {
    res.push(fM(x + i * w, y, w, w));
  }
  return res;
};

export default function makeSprites(scene, assets) {

  const candyAtlas = scene.texture(assets['candy']);

  const candyFrame = makeFrame(candyAtlas);

  return {
    white: scene.texture(bgTexture('white')),
    shoot: wholeFrame(scene, assets['shoot'], 32),
    explosion: animation(candyFrame, 0, 32, 32, 8),
    candy: candyFrame(0, 0, 32),
    bounce: animation(candyFrame, 0, 0, 32, 6)
  };
}


const bgTexture = (color) => {
  return withCanvasTexture(256, 256, (w, h, canvas, ctx) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    return canvas;
  });
};

function withCanvasTexture(width, height, f) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  f(width, height, canvas, canvas.getContext('2d'));

  let texture = canvas;
  return texture;
}
