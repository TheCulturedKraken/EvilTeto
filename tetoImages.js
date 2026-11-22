const fs = require('fs')
const path = require('path')

const IMAGE_DIR = path.join(__dirname, 'teto_images')
const EXTENSIONS = new Set(['.jpg', '.jpeg'])

let lastPicked = null

/** Scans the folder every call, so new images work without restarting Teto. */
function listImages() {
    fs.mkdirSync(IMAGE_DIR, { recursive: true })
    return fs.readdirSync(IMAGE_DIR)
        .filter(file => EXTENSIONS.has(path.extname(file).toLowerCase()))
        .map(file => path.join(IMAGE_DIR, file))
}

/** Returns a random image path (avoiding an immediate repeat), or null if the folder is empty. */
function getRandomImage() {
    const images = listImages()
    if (images.length === 0) return null
    if (images.length === 1) return images[0]

    let pick
    do {
        pick = images[Math.floor(Math.random() * images.length)]
    } while (pick === lastPicked)

    lastPicked = pick
    return pick
}

module.exports = { getRandomImage, listImages }