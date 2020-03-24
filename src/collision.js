import { objForeach } from './util2';

export default function Collision() {

  const makeId = (() => {
    let n = 1;
    return () => {
      return n++;
    };
  })();

  let candies = {};

  let relations = {};

  this.addCandy = (key, circle, item) => {
    if (!candies[key]) {
      candies[key] = {};
    }

    let id = makeId();

    candies[key][id] = { id, circle, item };
    return id;
  };

  this.removeCandy = (key, id) => {
    delete candies[key][id];
  };

  this.addRelation = (key1, key2, onCrush) => {
    if (!relations[key1]) {
      relations[key1] = {};
    }
    relations[key1][key2] = onCrush;
  };

  this.candies = (key, fn) => {
    if (!candies[key]) {
      return;
    }
    objForeach(candies[key], (_, { circle, item }) => {
      fn(circle, item);
    });
  };

  this.update = delta => {

    objForeach(relations, (key1, relation) => {
      objForeach(relation, (key2, onCrush) => {
        let checkCandies1 = candies[key1],
            checkCandies2 = candies[key2];

        if (!checkCandies1 || !checkCandies2) {
          return;
        }
        
        objForeach(checkCandies1, (_, { circle: c1, item: item1 }) => {
          objForeach(checkCandies2, (_, { circle: c2, item: item2 }) => {

            if (c1.intersectsCircle(c2)) {
              onCrush(item1, item2);
            }

          });
        });        
      });
    });

  };
  

}
