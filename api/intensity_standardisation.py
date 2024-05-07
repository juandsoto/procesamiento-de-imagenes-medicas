import numpy as np
from scipy import ndimage, interpolate


def intensity_rescaling(image):
    image_data = image.get_fdata()
    # Verificar el rango y tipo de datos inicial
    print("Valor mínimo:", np.min(image_data))
    print("Valor máximo:", np.max(image_data))
    print("Tipo de datos:", image_data.dtype)

    # Escalar al intervalo [0, 1]
    min_val = np.min(image_data)
    max_val = np.max(image_data)

    min_range = 0
    max_range = 4

    result = (image_data - min_val) / (max_val - min_val) * (
        max_range - min_range
    ) + min_range

    # Verificar el rango y tipo de datos después del escalado
    print("Valor mínimo después del escalado:", np.min(result))
    print("Valor máximo después del escalado:", np.max(result))

    return result


def z_score(image):
    image_data = image.get_fdata()
    # Estandarización Z-score
    mean_intensity = np.mean(image_data)
    std_intensity = np.std(image_data)

    result = (image_data - mean_intensity) / std_intensity

    return result


def white_stripe(image):
    image_data = image.get_fdata()

    hist, _ = np.histogram(image_data, bins=256, range=(0, 255))

    rightmost_mode = np.argmax(hist[::-1])

    normalized_image = np.array(image_data, dtype=np.float32) / rightmost_mode

    return normalized_image


def histogram_matching(reference, transform, k=3):
    reference_img = reference.get_fdata()
    transform_img = transform.get_fdata()

    ref_flat = reference_img.flatten()
    trans_flat = transform_img.flatten()

    ref_percentiles = np.percentile(ref_flat, np.linspace(0, 100, k))
    trans_percentiles = np.percentile(trans_flat, np.linspace(0, 100, k))

    f = interpolate.interp1d(
        trans_percentiles, ref_percentiles, kind="linear", fill_value="extrapolate"
    )

    matched_flat = f(trans_flat).reshape(transform_img.shape)

    return matched_flat
