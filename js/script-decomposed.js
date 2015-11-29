// rgb shift for brightness filter; increase to add more brightness
var BRIGHTNESS_SHIFT = 40;

// distance threshold from black for threshold filter
var THRESHOLD_DISTANCE = 100;


/* For each pixel in the array of pixels, calls modifyFn(red, green, blue),
 * where red, green, and blue are the RGB components. modifyFn should return
 * an array with three values: the new red, green, and blue components of the
 * pixel, in that order. Returns the updated array of pixels.
 *
 * Arguments:
 * pixels -- an array of pixel values
 * modifyFn -- a callback function that takes in the RGB values of a single
 *   pixel and returns new RGB values
 */
function modifyEachPixel(pixels, modifyFn) {
  for (var i = 0; i < pixels.length; i += 4) {
    // unpack components
    var red = pixels[i];
    var green = pixels[i + 1];
    var blue = pixels[i + 2];

    // get new components and update them
    var newPixel = modifyFn(red, green, blue);
    pixels[i] = newPixel[0];
    pixels[i + 1] = newPixel[1];
    pixels[i + 2] = newPixel[2];
  }

  return pixels;
}

/* Filters the given pixels to grayscale.
 *
 * Arguments:
 * pixels -- an array of pixel values
 */
function filterGrayscale(pixels) {
  return modifyEachPixel(pixels, function(red, green, blue) {
    var average = (red + green + blue) / 3;
    return [average, average, average];
  });
}

/* Brightens the given pixels.
 *
 * Arguments:
 * pixels -- an array of pixel values
 */
function filterBrighten(pixels) {
  return modifyEachPixel(pixels, function(red, green, blue) {
    return [red + BRIGHTNESS_SHIFT,
            green + BRIGHTNESS_SHIFT,
            blue + BRIGHTNESS_SHIFT];
  });
}

/* Applies a threshold filter to the given pixels. Makes all pixels above
 * the threshold black and all pixels below the threshold white.
 *
 * Arguments:
 * pixels -- an array of pixel values
 */
function filterThreshold(pixels) {
  return modifyEachPixel(pixels, function(red, green, blue) {
    // get cartesian distance from black at (0, 0, 0)
    var distance = Math.sqrt(red * red + green * green + blue * blue);

    if (distance < THRESHOLD_DISTANCE) {
      // pixel meets threshold and is close to black; set it to black
      return [0, 0, 0];
    } else {
      // pixel exceeds threshold; set it to white
      return [255, 255, 255];
    }
  });
}
