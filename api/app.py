import os
import json
from flask import Flask, jsonify, request, send_file, make_response
from flask_cors import CORS
import nibabel as nib
import numpy as np
from segmentation import umbralizacion, isodata, kmeans, region_growing

app = Flask(__name__)
CORS(app)

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

    # If the user submits an empty part without a file, ignore it
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        upload_path = app.config["UPLOAD_FOLDER"] + "/" + file.filename
        file.save(upload_path)

        nii_image = nib.load(upload_path)

        # Obtener las dimensiones de la imagen original
        original_shape = nii_image.shape

        # Crear una imagen vacía con las mismas dimensiones que la original
        segmented_image = np.zeros(original_shape)

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
            download_name="segmentation_result.nii",
        )

        return response

    except Exception as e:
        print("error", e)
        return jsonify({"error": f"Error processing the NIfTI file: {str(e)}"}), 500

    finally:
        if os.path.exists(upload_path):
            os.remove(upload_path)
