import os
import numpy as np


def compute_sigma(img, height, width):
    sigma = 0
    for i in range(height):
        for j in range(width):
            if i > 0:
                sigma = max(sigma, np.abs(img[i, j] - img[i - 1, j]))
            if i < height - 1:
                sigma = max(sigma, np.abs(img[i, j] - img[i + 1, j]))
            if j > 0:
                sigma = max(sigma, np.abs(img[i, j] - img[i, j - 1]))
            if j < width - 1:
                sigma = max(sigma, np.abs(img[i, j] - img[i, j + 1]))

    return sigma if sigma != 0 else 1


def compute_weight(pixel1, pixel2, sigma):
    return np.exp(-1 * (np.sqrt(np.abs(pixel1 - pixel2) ** 2) / sigma))


def setup_graph_weights(img):
    height, width = img.shape
    P = np.arange(height * width).reshape(height, width)
    W = np.zeros((height * width, height * width))

    sigma = compute_sigma(img, height, width)

    for i in range(height):
        for j in range(width):
            if i > 0:
                W[P[i, j], P[i - 1, j]] = compute_weight(
                    img[i, j], img[i - 1, j], sigma
                )
            if j > 0:
                W[P[i, j], P[i, j - 1]] = compute_weight(
                    img[i, j], img[i, j - 1], sigma
                )
            if i < height - 1:
                W[P[i, j], P[i + 1, j]] = compute_weight(
                    img[i, j], img[i + 1, j], sigma
                )
            if j < width - 1:
                W[P[i, j], P[i, j + 1]] = compute_weight(
                    img[i, j], img[i, j + 1], sigma
                )

    return W
