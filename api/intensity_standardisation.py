import numpy as np


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
