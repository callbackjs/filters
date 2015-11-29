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

// when window has loaded, the image is ready to be drawn on the canvas
window.addEventListener('load', function(event) {
  canvasContext.drawImage(image, 0, 0);
   
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
});
