// rgb shift for brightness filter; increase to add more brightness
const BRIGHTNESS_SHIFT = 40

// distance threshold from black for threshold filter
const THRESHOLD_DISTANCE = 100

/* Filters the given pixels to grayscale.
 *
 * Arguments:
 * pixels -- an array of pixel values
 */
function filterGrayscale(pixels) {
  for (let i = 0; i < pixels.length; i += 4) {
    // use average as grayscale value
    const grayscale = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3

    // when all rgb components are the same, the color is grayscale
    pixels[i] = grayscale
    pixels[i + 1] = grayscale
    pixels[i + 2] = grayscale
  }
}

/* Brightens the given pixels.
 *
 * Arguments:
 * pixels -- an array of pixel values
 */
function filterBrighten(pixels) {
  for (let i = 0; i < pixels.length; i += 4) {
    // add constant adjustment value to all components to increase brightness
    pixels[i] += BRIGHTNESS_SHIFT
    pixels[i + 1] += BRIGHTNESS_SHIFT
    pixels[i + 2] += BRIGHTNESS_SHIFT
  }
}

/* Applies a threshold filter to the given pixels. Makes all pixels above
 * the threshold black and all pixels below the threshold white.
 *
 * Arguments:
 * pixels -- an array of pixel values
 */
function filterThreshold(pixels) {
  for (let i = 0; i < pixels.length; i += 4) {
    const red = pixels[i]
    const green = pixels[i + 1]
    const blue = pixels[i + 2]

    // get cartesian distance from black at (0, 0, 0)
    const distance = Math.sqrt(red * red + green * green + blue * blue)

    if (distance < THRESHOLD_DISTANCE) {
      // pixel meets threshold and is close to black; set it to black
      pixels[i] = 0
      pixels[i + 1] = 0
      pixels[i + 2] = 0
    } else {
      // pixel exceeds threshold; set it to white
      pixels[i] = 255
      pixels[i + 1] = 255
      pixels[i + 2] = 255
    }
  }
}
