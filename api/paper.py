import os
import numpy as np
from scipy.sparse import diags, lil_matrix, csr_matrix, linalg
from PIL import Image
from weights import setup_graph_weights


def labels_assignment(values, img):
    xB, xF = [1, 0]
    return np.where(values >= (xB + xF) / 2, xB, img)


def laplacian_coordinates(filename, seeds, labels):
    current_working_directory = os.getcwd()
    with Image.open(
        os.path.join(current_working_directory, "uploads", filename)
    ) as img:
        data = np.array(img.convert("L"))

    result = segmentation(data, seeds, labels)
    image = Image.fromarray(labels_assignment(result, data))
    image.save(f"uploads/result.png")
    return f"uploads/result.png"


def segmentation(img, seeds, labels):
    height, width = img.shape
    P = np.arange(height * width).reshape(height, width)

    W = setup_graph_weights(img)
    D = np.sum(W, axis=1)

    L = diags(D) - W
    L_squared = L.dot(L)
    Is = lil_matrix((height * width, height * width))

    b = np.zeros(height * width)
    xB, xF = [1, 0]

    for idx, label in enumerate(labels):
        i, j = seeds[idx]
        label = labels[idx]
        Is[P[i, j], P[i, j]] = 1
        if label == "B":
            b[P[i, j]] = xB
        else:
            b[P[i, j]] = xF

    A = Is + L_squared
    solve = linalg.factorized(csr_matrix(A))

    return solve(b).reshape((height, width))
