import numpy as np


def umbralizacion(image_data, tau):
    image = image_data.get_fdata()
    segmentation = image >= tau
    return segmentation


def isodata(image_data, tau):
    image = image_data.get_fdata()

    tol = 1
    tau = 150
    while True:
        print(tau)

        segmentation = image >= tau
        mBG = image[np.multiply(image > 10, segmentation == 0)].mean()
        mFG = image[np.multiply(image > 10, segmentation == 1)].mean()

        tau_post = 0.5 * (mBG + mFG)

        if np.abs(tau - tau_post) < tol:
            break
        else:
            tau = tau_post

    return segmentation


def kmeans(image_data, k):
    image = image_data.get_fdata()

    ks = np.linspace(np.amin(image), np.amax(image), k)

    for i in range(5):
        ds = [np.abs(k - image) for k in ks]
        segmentation = np.argmin(ds, axis=0)

        for j in range(k):
            ks[j] = image[segmentation == j].mean()
        print(ks)

    background = image < 10
    segmentation[background] = -1

    percentage = [
        np.sum(segmentation == j) / np.sum(~background) * 100 for j in range(k)
    ]
    print("Percentage of Non-Background Image for Each Cluster:", percentage)

    return segmentation


def region_growing(image_data, threshold, slice, points, points_to_remove):
    image = image_data.get_fdata()
    image_x, image_y, image_z = image.shape

    visited = np.zeros_like(image, dtype=bool)

    segmentation = np.zeros_like(image)

    neighbors6 = [(1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)]

    starting_tuples = [(x, y) for x, y in points]
    starting_triples = []

    ignore_tuples = [(x, y) for x, y in points_to_remove]
    ignore_triples = []

    visited_tuples = []
    visited_triples = []

    visited_triples = [(x, y, slice) for x, y in visited_tuples]
    starting_triples = [(x, y, slice) for x, y in starting_tuples]
    ignore_triples = [(x, y, slice) for x, y in ignore_tuples]

    for x, y, z in visited_triples:
        visited[x, y, z] = True

    # Perform region growing
    stack = starting_triples
    ignored_stack = ignore_triples
    count = 0
    seed = 0
    while stack:
        x, y, z = stack.pop()

        ignore = (x, y, z) in ignored_stack
        if ignore:
            continue

        segmentation[x, y, z] = 0 if ignore else 255
        visited[x, y, z] = True

        count += 1
        seed += (image[x, y, z] - seed) / count

        for dx, dy, dz in neighbors6:
            nx, ny, nz = x + dx, y + dy, z + dz
            if (
                0 <= ny < image_y
                and 0 <= nx < image_x
                and 0 <= nz < image_z
                and not visited[nx, ny, nz]
            ):
                if abs(int(image[nx, ny, nz]) - int(seed)) < threshold:
                    stack.append((nx, ny, nz))

    return segmentation
