import Loop from 'loopz';
import Assets from './assets';
import Events from './events';
import Canvas from './canvas';

import makeLayers from './layers';
import makeFrames from './sprites';

import Play from './play';

export function app(element, options) {

  let assetsUrl = 'assets/images/';

  new Assets({
    'candy': 'candy.png'
  }, { assetsUrl }).start()
    .then(assets => {

      const canvas = new Canvas(element);

      const events = new Events(canvas);
      events.bindTouch();

      const frames = makeFrames(canvas.scene, assets);

      const context = {
        events,
        assets,
        canvas,
        frames,
        layers: makeLayers(canvas.scene)
      };

      let play = new Play(context);
      play.init({});

      new Loop(delta => {
        play.update(delta);
        play.render();
        canvas.scene.render();
      }).start();      
    });

}
