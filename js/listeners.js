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

// when window has loaded, the image is ready to be drawn on the canvas
window.addEventListener('load', event => {
  canvasContext.drawImage(image, 0, 0)
   
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
})
