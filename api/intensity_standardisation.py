import numpy as np


def intensity_rescaling(image):
    image_data = image.get_fdata()
    # Escalar al intervalo [0, 1]
    result = (image_data - np.min(image_data)) / (
        np.max(image_data) - np.min(image_data)
    )

    return result


def z_score(image):
    image_data = image.get_fdata()
    # Estandarización Z-score
    mean_intensity = np.mean(image_data)
    std_intensity = np.std(image_data)

    result = (image_data - mean_intensity) / std_intensity

    return result
