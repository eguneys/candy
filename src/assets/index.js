import { objMap } from './util2';
import { defaultLoaders } from './loaders';

export default function Assets(assets, opts) {

  opts = { assetsUrl: '',
           ...opts };

  let { assetsUrl } = opts;

  let loaders = [...defaultLoaders];

  const loaderContext = { 
    assetsUrl
  };

  const cache = {};
  const total = Object.keys(assets).length;

  let progress = 0;

  this.progress = () => progress;

  this.get = (key) => cache[key];

  this.start = () => {
    return Promise.all(Object.values(
      objMap(assets, (key, source) => {
        let Loader = matchLoader(source);
        return Loader(source, loaderContext).then(asset => {
          cache[key] = asset;
          progress++;
        });
      })))
      .then(_ => cache);
  };

  const matchLoader = source => {
    let [_, extension] = source.split('.');

    let loader = loaders.find(({ test }) => extension.match(test));

    if (!loader) {
      console.warn(`Couldn't find loader for ${source}, ignoring.`);
      return () => Promise.resolve();
    }

    return loader.loader;
  };
}
