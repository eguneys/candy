function jsonLoader(source, { assetsUrl }) {
  return fetch(assetsUrl + source)
    .then(response => {
      return response.json();
    });
}

function imageLoader(source, { assetsUrl }) {
  return new Promise(resolve => {
    let img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.src = assetsUrl + source;
  });
};

export const defaultLoaders = [{
  test: 'png|jpg',
  loader: imageLoader,
}, {
  test: 'json',
  loader: jsonLoader
}];
