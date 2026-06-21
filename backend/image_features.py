import numpy as np
from PIL import Image


IMAGE_SIZE = (64, 64)
HISTOGRAM_BINS = 16
HOG_CELL_SIZE = 8
HOG_BINS = 9


def extract_image_features(image):
    """Return compact numeric color, shape, and texture features for a plant leaf image."""
    resized = image.convert("RGB").resize(IMAGE_SIZE)
    pixels = np.asarray(resized, dtype=np.float32) / 255.0

    thumbnail = resized.resize((32, 32))
    flattened = np.asarray(thumbnail, dtype=np.float32).reshape(-1) / 255.0
    rgb_histograms = [
        np.histogram(pixels[:, :, channel], bins=HISTOGRAM_BINS, range=(0.0, 1.0), density=True)[0]
        for channel in range(3)
    ]
    hsv_histograms = _hsv_histograms(pixels)
    mean_rgb = pixels.mean(axis=(0, 1))
    std_rgb = pixels.std(axis=(0, 1))
    hog = _hog_features(pixels)
    edge_density = _edge_density(pixels)

    return np.concatenate(
        [flattened, *rgb_histograms, *hsv_histograms, mean_rgb, std_rgb, hog, edge_density]
    ).astype(np.float32)


def extract_batch_features(images):
    return np.vstack([extract_image_features(image) for image in images])


def _hsv_histograms(pixels):
    r = pixels[:, :, 0]
    g = pixels[:, :, 1]
    b = pixels[:, :, 2]
    maxc = pixels.max(axis=2)
    minc = pixels.min(axis=2)
    delta = maxc - minc

    hue = np.zeros_like(maxc)
    mask = delta > 1e-6
    red = mask & (maxc == r)
    green = mask & (maxc == g)
    blue = mask & (maxc == b)
    hue[red] = ((g[red] - b[red]) / delta[red]) % 6
    hue[green] = ((b[green] - r[green]) / delta[green]) + 2
    hue[blue] = ((r[blue] - g[blue]) / delta[blue]) + 4
    hue = hue / 6.0

    saturation = np.divide(delta, maxc, out=np.zeros_like(delta), where=maxc > 1e-6)
    value = maxc

    return [
        np.histogram(channel, bins=HISTOGRAM_BINS, range=(0.0, 1.0), density=True)[0]
        for channel in (hue, saturation, value)
    ]


def _hog_features(pixels):
    gray = (
        0.299 * pixels[:, :, 0]
        + 0.587 * pixels[:, :, 1]
        + 0.114 * pixels[:, :, 2]
    )
    gy, gx = np.gradient(gray)
    magnitude = np.sqrt(gx * gx + gy * gy)
    angle = (np.degrees(np.arctan2(gy, gx)) + 180.0) % 180.0
    bins = np.floor(angle / (180.0 / HOG_BINS)).astype(np.int32)
    bins = np.clip(bins, 0, HOG_BINS - 1)

    rows, cols = gray.shape
    features = []
    for row in range(0, rows, HOG_CELL_SIZE):
        for col in range(0, cols, HOG_CELL_SIZE):
            cell_bins = bins[row : row + HOG_CELL_SIZE, col : col + HOG_CELL_SIZE]
            cell_mag = magnitude[row : row + HOG_CELL_SIZE, col : col + HOG_CELL_SIZE]
            hist = np.bincount(cell_bins.reshape(-1), weights=cell_mag.reshape(-1), minlength=HOG_BINS)
            norm = np.linalg.norm(hist) + 1e-6
            features.append(hist / norm)
    return np.concatenate(features)


def _edge_density(pixels):
    gray = (
        0.299 * pixels[:, :, 0]
        + 0.587 * pixels[:, :, 1]
        + 0.114 * pixels[:, :, 2]
    )
    gy, gx = np.gradient(gray)
    magnitude = np.sqrt(gx * gx + gy * gy)
    return np.asarray(
        [
            magnitude.mean(),
            magnitude.std(),
            np.percentile(magnitude, 75),
            np.mean(magnitude > 0.12),
        ],
        dtype=np.float32,
    )
