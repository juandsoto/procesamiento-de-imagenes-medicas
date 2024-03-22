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


def region_growing(image_data, threshold, slice, points):
    image3d = image_data.get_fdata()
    # Get image dimensions
    height_x, width_y, depth_z = image3d.shape

    # Create a mask to keep track of visited pixels
    visited_3dmask = np.zeros_like(image3d, dtype=bool)

    # Initialize segmented image
    segmented_3dimage = np.zeros_like(image3d)

    # Define 3d 6-connectivity neighbors
    # center is (0,0,0)
    neighbors6 = [(1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)]
    starting_tuples = [(x, y) for x, y in points]
    starting_triples = []

    visited_tuples = []
    visited_triples = []

    # Set visited pixels to True in the mask depending on the slice and the viewing angle
    # and setting the selection plane depending on how it was shown to the user
    visited_triples = [(x, y, slice) for x, y in visited_tuples]
    starting_triples = [(x, y, slice) for x, y in starting_tuples]
    for x, y, z in visited_triples:
        visited_3dmask[x, y, z] = True

    # Perform region growing
    stack = starting_triples
    count = 0
    seed_value = 0
    while stack:
        x, y, z = stack.pop()
        segmented_3dimage[x, y, z] = 255  # Mark pixel as part of the segmented region
        visited_3dmask[x, y, z] = True  # Mark pixel as visited

        # Update seed value and count for dynamic mean calculation
        count += 1
        seed_value += (image3d[x, y, z] - seed_value) / count

        # Check 3d 6-connectivity neighbors
        for dx, dy, dz in neighbors6:
            nx, ny, nz = x + dx, y + dy, z + dz
            # Check if neighbor is within image bounds and not visited
            if (
                0 <= ny < width_y
                and 0 <= nx < height_x
                and 0 <= nz < depth_z
                and not visited_3dmask[nx, ny, nz]
            ):
                # Check intensity difference
                if abs(int(image3d[nx, ny, nz]) - int(seed_value)) < threshold:
                    stack.append((nx, ny, nz))

    # GrownRegion image
    #  grownRegion_fig = plt.figure(facecolor='black')
    #  grownRegion_image_plot = grownRegion_fig.add_subplot(111)
    #  plt.xticks([])
    #  plt.yticks([])
    #  time.sleep(0.0016)

    #  rotated_image = np.rot90(segmented_3dimage[:, :, slice])

    #  grownRegion_image_plot.imshow(rotated_image, cmap='gray')
    #  plt.savefig("temp/plot.png", format='png', dpi=120, bbox_inches='tight', pad_inches=0)
    # plt.close()

    return segmented_3dimage


def ____region_growing(image, seed, threshold):
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
