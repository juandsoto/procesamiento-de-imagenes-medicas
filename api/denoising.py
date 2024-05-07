from scipy.ndimage import uniform_filter, median_filter as scipy_median_filter
import numpy as np


def mean_filter(image, size):
    image_data = image.get_fdata()

    filtered_data = np.zeros_like(image_data)
    padding = size // 2

    for i in range(padding, image_data.shape[0] - padding):
        for j in range(padding, image_data.shape[1] - padding):
            for k in range(padding, image_data.shape[2] - padding):
                neighborhood = image_data[
                    i - padding : i + padding + 1,
                    j - padding : j + padding + 1,
                    k - padding : k + padding + 1,
                ]
                filtered_data[i, j, k] = np.mean(neighborhood)

    return filtered_data


def median_filter(image, size):
    image_data = image.get_fdata()
    filtered_data = np.zeros_like(image_data)
    padding = size // 2

    for i in range(padding, image_data.shape[0] - padding):
        for j in range(padding, image_data.shape[1] - padding):
            for k in range(padding, image_data.shape[2] - padding):
                # Extract the neighborhood
                neighborhood = image_data[
                    i - padding : i + padding + 1,
                    j - padding : j + padding + 1,
                    k - padding : k + padding + 1,
                ]
                # Apply median filter
                filtered_data[i, j, k] = np.median(neighborhood)

    return filtered_data


def _mean_filter_with_scipy(image, size):
    image_data = image.get_fdata()

    filtered = uniform_filter(image_data, size=size)

    return filtered


def _median_filter_with_scipy(image, size):
    # Assign image
    image_data = image.get_fdata()

    # Apply median filter
    filtered = scipy_median_filter(image_data, size=size)

    return filtered
