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


def white_stripe(image, k=1):
    image_data = image.get_fdata()

    smoothed_image = ndimage.median_filter(image_data, size=k)

    diff_img = image_data - smoothed_image

    result = image_data + diff_img

    return result


def histogram_matching(reference, transform, k=3):
    reference_img = reference.get_fdata()
    transform_img = transform.get_fdata()
    # Flatten the images
    ref_flat = reference_img.flatten()
    trans_flat = transform_img.flatten()

    # Compute percentiles as landmarks
    ref_percentiles = np.percentile(ref_flat, np.linspace(0, 100, k))
    trans_percentiles = np.percentile(trans_flat, np.linspace(0, 100, k))

    # Generate piece-wise function using linear interpolation
    f = interpolate.interp1d(
        trans_percentiles, ref_percentiles, kind="linear", fill_value="extrapolate"
    )

    # Map intensities according to the piece-wise function
    matched_flat = f(trans_flat).reshape(transform_img.shape)

    return matched_flat
