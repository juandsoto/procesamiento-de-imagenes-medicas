import { debounce } from "../utils";
import * as nifti from 'nifti-reader-js';

class NiftiReader {

	constructor(canvasId, sliderId) {
		this.canvas = document.getElementById(canvasId);
		this.slider = document.getElementById(sliderId);
		this.sliderText = document.getElementById(`${sliderId}-text`);

		this.readNIFTI = this.readNIFTI.bind(this);
	}

	makeSlice(file, start, length) {
		let fileType = (typeof File);

		if (fileType === 'undefined') {
			return function () { };
		}

		if (File.prototype.slice) {
			return file.slice(start, start + length);
		}

		if (File.prototype.mozSlice) {
			return file.mozSlice(start, length);
		}

		if (File.prototype.webkitSlice) {
			return file.webkitSlice(start, length);
		}

		return null;
	};

	readFile(file, blob) {
		let reader = new FileReader();

		reader.onloadend = (e) => {
			if (e.target.readyState === FileReader.DONE) {
				this.readNIFTI(file.name, e.target.result);
			}
		};

		reader.readAsArrayBuffer(blob);
	};

	readNIFTI(name, data) {

		let niftiHeader, niftiImage;

		// parse nifti
		if (nifti.isCompressed(data)) {
			data = nifti.decompress(data);
		}

		if (nifti.isNIFTI(data)) {
			niftiHeader = nifti.readHeader(data);
			niftiImage = nifti.readImage(niftiHeader, data);
		}

		// set up slider
		let slices = niftiHeader.dims[3];
		this.slider.max = slices - 1;
		this.slider.value = Math.round(slices / 2);
		this.sliderText.innerText = this.slider.value;
		this.slider.oninput = debounce(() => {
			this.sliderText.innerText = this.slider.value;
			this.drawCanvas(this.slider.value, niftiHeader, niftiImage);
		}, 10);
		this.drawCanvas(this.slider.value, niftiHeader, niftiImage);
	};

	drawCanvas(slice, niftiHeader, niftiImage) {
		// get nifti dimensions
		let cols = niftiHeader.dims[1];
		let rows = niftiHeader.dims[2];

		// set canvas dimensions to nifti slice dimensions
		this.canvas.width = cols;
		this.canvas.height = rows;

		// make canvas image data
		let ctx = this.canvas.getContext("2d");
		let canvasImageData = ctx.createImageData(cols, rows);

		// convert raw data to typed array based on nifti datatype
		let typedData;

		if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_UINT8) {
			typedData = new Uint8Array(niftiImage);
		} else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_INT16) {
			typedData = new Int16Array(niftiImage);
		} else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_INT32) {
			typedData = new Int32Array(niftiImage);
		} else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_FLOAT32) {
			typedData = new Float32Array(niftiImage);
		} else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_FLOAT64) {
			typedData = new Float64Array(niftiImage);
		} else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_INT8) {
			typedData = new Int8Array(niftiImage);
		} else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_UINT16) {
			typedData = new Uint16Array(niftiImage);
		} else if (niftiHeader.datatypeCode === nifti.NIFTI1.TYPE_UINT32) {
			typedData = new Uint32Array(niftiImage);
		} else {
			return;
		}

		// offset to specified slice
		let sliceSize = cols * rows;
		let sliceOffset = sliceSize * slice;
		// Define the range of voxel values you want to visualize
		// Find the minimum and maximum values in the typedData array
		let minValue = typedData[0];
		let maxValue = typedData[0];
		for (let i = 1; i < typedData.length; i++) {
			if (typedData[i] < minValue) {
				minValue = typedData[i];
			}
			if (typedData[i] > maxValue) {
				maxValue = typedData[i];
			}
		}

		// Normalize voxel values and map them to grayscale colors
		for (let row = 0; row < rows; row++) {
			let rowOffset = row * cols;

			for (let col = 0; col < cols; col++) {
				let offset = sliceOffset + rowOffset + col;
				let value = typedData[offset];

				// Normalize the voxel value to the range [0, 255]
				let normalizedValue = Math.round((value - minValue) * (255 / (maxValue - minValue)));

				// Set the RGBA color values based on the normalized voxel value
				canvasImageData.data[(rowOffset + col) * 4] = normalizedValue; // Red channel
				canvasImageData.data[(rowOffset + col) * 4 + 1] = normalizedValue; // Green channel
				canvasImageData.data[(rowOffset + col) * 4 + 2] = normalizedValue; // Blue channel
				canvasImageData.data[(rowOffset + col) * 4 + 3] = 255; // Alpha channel (fully opaque)
			}
		}

		ctx.putImageData(canvasImageData, 0, 0);

	};
}

export default NiftiReader;