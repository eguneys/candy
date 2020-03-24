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
    candy: candyFrame(0, 0, 32),
    bounce: animation(candyFrame, 0, 0, 32, 6)
  };
}
