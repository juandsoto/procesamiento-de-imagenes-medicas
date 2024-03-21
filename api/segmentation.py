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
    # Create the cluster centers
    ks = np.linspace(np.amin(image), np.amax(image), k)

    for i in range(5):
        ds = [np.abs(k - image) for k in ks]
        segmentation = np.argmin(ds, axis=0)

        for j in range(k):
            ks[j] = image[segmentation == j].mean()
        print(ks)

    # Exclude background from the segmentation
    background = image < 10
    segmentation[background] = -1

    # Calculate the percentage of the non-background image corresponding to each cluster
    percentage = [
        np.sum(segmentation == j) / np.sum(~background) * 100 for j in range(k)
    ]
    print("Percentage of Non-Background Image for Each Cluster:", percentage)

    return segmentation


def region_growing(image, seed, threshold):
    print(seed, threshold)
    data = image.get_fdata()
    # Check input dimensions
    if len(data.shape) != 3:
        raise ValueError("Input data must be a 3D array.")

    # Initialize segmentation output and visited voxels set
    segmentation = np.zeros_like(data, dtype=np.int32)
    visited = set()

    # Queue for breadth-first search
    queue = [seed]

    while queue:
        current_voxel = queue.pop(0)

        # Check if voxel is within image bounds and not visited
        if (
            0 <= current_voxel[0] < data.shape[0]
            and 0 <= current_voxel[1] < data.shape[1]
            and 0 <= current_voxel[2] < data.shape[2]
            and current_voxel not in visited
        ):

            # Check if voxel intensity is above threshold
            if data[current_voxel] >= threshold:
                # Mark voxel as belonging to the region
                segmentation[current_voxel] = 1
                visited.add(current_voxel)

                # Add neighboring voxels to the queue for exploration
                for neighbor in [
                    (1, 0, 0),
                    (-1, 0, 0),
                    (0, 1, 0),
                    (0, -1, 0),
                    (0, 0, 1),
                    (0, 0, -1),
                ]:
                    next_voxel = (
                        current_voxel[0] + neighbor[0],
                        current_voxel[1] + neighbor[1],
                        current_voxel[2] + neighbor[2],
                    )
                    queue.append(next_voxel)

    return segmentation
