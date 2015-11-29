// OK HTTP response status code
var STATUS_OK = 200;

// base image to filter
var image = document.getElementsByTagName('img')[0];

// canvas context for drawing
var imageCanvas = document.getElementById('image-canvas');
var canvasContext = imageCanvas.getContext('2d');

// DOM filter buttons
var grayscale = document.getElementById('grayscale');
var brighten = document.getElementById('brighten');
var threshold = document.getElementById('threshold');
var reset = document.getElementById('reset');

/* Set which Flickr photo to apply filters to.
 *
 * Arguments:
 * src -- the URL of the Flickr photo
 */
function setFlickrPhotoSrc(src) {
  image.src = '/proxy?url=' + encodeURIComponent(src);

  image.addEventListener('load', function() {
    imageCanvas.width = image.width;
    imageCanvas.height = image.height;
    imageCanvas.style.display = 'block';

    canvasContext.drawImage(image, 0, 0);
    addClickEventListeners();
  });
}

/* Returns the image data associated with the canvas. */
function getImageData() {
  return canvasContext.getImageData(0, 0, imageCanvas.width,
    imageCanvas.height);
}

/* Applies the given filter to the canvas. Updates the canvas' image data
 * accordingly.
 *
 * Arguments:
 * filter -- function that takes in an array of pixel values and returns
 *  new, filtered values
 */
function applyFilter(filter) {
  var data = getImageData();
  data.data = filter(data.data);
  canvasContext.putImageData(data, 0, 0);
}

/* Add click event listeners on the various filter buttons. */
function addClickEventListeners() {
  // apply appropriate filters based off which buttons were clicked
  grayscale.addEventListener('click', function(event) {
    applyFilter(filterGrayscale);
    event.preventDefault();
  });

  brighten.addEventListener('click', function(event) {
    applyFilter(filterBrighten);
    event.preventDefault();
  });

  threshold.addEventListener('click', function(event) {
    applyFilter(filterThreshold);
    event.preventDefault();
  });

  reset.addEventListener('click', function(event) {
    canvasContext.drawImage(image, 0, 0);
    event.preventDefault();
  });
}

var imageRequest = new XMLHttpRequest();

imageRequest.addEventListener('load', function() {
  if (imageRequest.status === STATUS_OK) {
    // pick a random landscape image and use it
    var photos = JSON.parse(imageRequest.responseText); 
    var randomIndex = Math.floor(Math.random() * photos.length);

    setFlickrPhotoSrc(photos[randomIndex]);
  }
});

// fetch landscape images
imageRequest.open('GET', '/search?term=yosemite');
imageRequest.send();
