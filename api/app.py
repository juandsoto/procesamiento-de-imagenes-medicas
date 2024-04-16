import os
import json
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import nibabel as nib
import numpy as np
from segmentation import umbralizacion, isodata, kmeans, region_growing
from denoising import mean_filter, median_filter
from intensity_standardisation import (
    intensity_rescaling,
    z_score,
    white_stripe,
    histogram_matching,
)

app = Flask(__name__)
CORS(app)
CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:5173",
                "https://medical-image-processing.vercel.app",
            ]
        }
    },
)


UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/upload", methods=["POST"])
def upload_file():
    """Function to upload .nii files"""
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    data = request.form.get("data")
    data = json.loads(data)
    algorithm = data["algorithm"]
    upload_path = "/no_path"
    upload_path2 = "/no_path"

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        nii_image, segmented_image, upload_path = process_file(file)

        if algorithm == "thresholding":
            segmentation_result = umbralizacion(nii_image, data["tau"])
        elif algorithm == "isodata":
            segmentation_result = isodata(nii_image, 1)
        elif algorithm == "kmeans":
            segmentation_result = kmeans(nii_image, data["k"])
        elif algorithm == "region_growing":
            segmentation_result = region_growing(
                nii_image,
                data["threshold"],
                data["slice"],
                data["points"],
                data["pointsToRemove"],
            )
        elif algorithm == "denoising_mean":
            segmentation_result = mean_filter(nii_image, data["size"])
        elif algorithm == "denoising_median":
            segmentation_result = median_filter(nii_image, data["size"])
        elif algorithm == "intensity_rescaling":
            segmentation_result = intensity_rescaling(nii_image)
        elif algorithm == "z_score":
            segmentation_result = z_score(nii_image)
        elif algorithm == "white_stripe":
            segmentation_result = white_stripe(nii_image, data["k"])
        elif algorithm == "histogram_matching":
            file2 = request.files["file2"]
            if file2.filename == "":
                return jsonify({"error": "No selected file"}), 400

            nii_image2, segmented_image2, upload_path2 = process_file(file2)

            segmentation_result = histogram_matching(nii_image, nii_image2, data["k"])

        segmented_image = segmentation_result
        new_nii_image = nib.Nifti1Image(
            (segmented_image * 255).astype(np.uint8),
            nii_image.affine,
            nii_image.header,
        )

        new_file = app.config["UPLOAD_FOLDER"] + "/new_image.nii"

        nib.save(new_nii_image, new_file)

        response = send_file(
            new_file,
            as_attachment=True,
            download_name=file.filename + "_result.nii",
        )

        return response

    except Exception as e:
        print("error", e)
        return jsonify({"error": f"Error processing the NIfTI file: {str(e)}"}), 500

    finally:
        if os.path.exists(upload_path):
            os.remove(upload_path)
        if os.path.exists(upload_path2):
            os.remove(upload_path2)


def process_file(file):
    upload_path = app.config["UPLOAD_FOLDER"] + "/" + file.filename
    file.save(upload_path)
    nii_image = nib.load(upload_path)

    # Obtener las dimensiones de la imagen original
    original_shape = nii_image.shape

    # Crear una imagen vacía con las mismas dimensiones que la original
    segmented_image = np.zeros(original_shape)

    return (nii_image, segmented_image, upload_path)


if __name__ == "__main__":
    app.run()
