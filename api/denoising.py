from scipy.ndimage import uniform_filter, median_filter as scipy_median_filter


def mean_filter(image, size):
    # Load image data
    image_data = image.get_fdata()

    # Apply mean filter.
    filtered = uniform_filter(image_data, size=size)

    return filtered


def median_filter(image, size):
    # Assign image
    image_data = image.get_fdata()

    # Apply median filter
    filtered = scipy_median_filter(image_data, size=size)

    return filtered
