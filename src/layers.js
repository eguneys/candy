export default function makeLayers(scene) {
  return {
    twoLayer: scene.layer(2),
    oneLayer: scene.layer(1),
    zeroLayer: scene.layer(0),
    scene,
  };
};
