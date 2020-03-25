import LollipopGang from './gang';

import { LolliVert, LolliBody1, LolliBody2 } from './lolli';

export default function Licker(play, ctx, bs) {

  const one = () => new LollipopGang(play, ctx, bs, LolliBody1);
  const two = () => new LollipopGang(play, ctx, bs, LolliBody2);
  const three = () => new LolliVert(play, ctx, bs);

  let level1 = [
    one,
    one,
    two,
    two,
    three,
    three
  ];

  let level;
  let current;

  this.init = (data) => {
    current = 0;
    level = level1;
  };

  this.lick = () => {
    current %= level.length;
    return level[current++]();
  };

}
