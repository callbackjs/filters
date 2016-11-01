// OK HTTP response status code
var STATUS_OK = 200;

// base image to filter
const image = document.getElementsByTagName('img')[0]

// canvas context for drawing
const imageCanvas = document.getElementById('image-canvas')
const canvasContext = imageCanvas.getContext('2d')

// DOM filter buttons
const grayscale = document.getElementById('grayscale')
const brighten = document.getElementById('brighten')
const threshold = document.getElementById('threshold')
const reset = document.getElementById('reset')

/* Set which Flickr photo to apply filters to.
 *
 * Arguments:
 * src -- the URL of the Flickr photo
 */
function setFlickrPhotoSrc(src) {
  image.src = '/proxy?url=' + encodeURIComponent(src)

  image.addEventListener('load', () => {
    imageCanvas.width = image.width
    imageCanvas.height = image.height
    imageCanvas.style.display = 'block'

    canvasContext.drawImage(image, 0, 0)
    addClickEventListeners()
  })
}

/* Returns the image data associated with the canvas. */
function getImageData() {
  return canvasContext.getImageData(
    0, 0, imageCanvas.width, imageCanvas.height)
}

/* Applies the given filter to the canvas. Updates the canvas' image data
 * accordingly.
 *
 * Arguments:
 * filter -- function that takes in an array of pixel values and returns
 *  new, filtered values
 */
function applyFilter(filter) {
  const imageData = getImageData()
  imageData.data = filter(imageData.data)
  canvasContext.putImageData(imageData, 0, 0)
}

/* Add click event listeners on the various filter buttons. */
function addClickEventListeners() {
  // apply appropriate filters based off which buttons were clicked
  grayscale.addEventListener('click', event => {
    event.preventDefault()
    applyFilter(filterGrayscale)
  })

  brighten.addEventListener('click', event => {
    event.preventDefault()
    applyFilter(filterBrighten)
  })

  threshold.addEventListener('click', event => {
    event.preventDefault()
    applyFilter(filterThreshold)
  })

  reset.addEventListener('click', event => {
    event.preventDefault()
    canvasContext.drawImage(image, 0, 0)
  })
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
