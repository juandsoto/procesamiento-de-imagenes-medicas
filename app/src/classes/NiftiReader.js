import { debounce } from "../utils";
import * as nifti from 'nifti-reader-js';

class NiftiReader {

	constructor(canvasId, sliderId, slice) {
		this.canvas = document.getElementById(canvasId);
		this.drawingCanvas = document.getElementById('drawingCanvas');
		this.slider = document.getElementById(sliderId);
		this.sliderText = document.getElementById(`${sliderId}-text`);
		this.selectedArea = [[102, 76, 96]];
		this.unselectedArea = [];

		this.defaultSlice = slice;

		this.readNIFTI = this.readNIFTI.bind(this);
		this.updateCanvas = this.updateCanvas.bind(this);
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

	getTypedData(niftiHeader, niftiImage) {
		let typedData;

		switch (niftiHeader.datatypeCode) {
			case nifti.NIFTI1.TYPE_UINT8:
				typedData = new Uint8Array(niftiImage);
				break;
			case nifti.NIFTI1.TYPE_INT16:
				typedData = new Int16Array(niftiImage);
				break;
			case nifti.NIFTI1.TYPE_INT32:
				typedData = new Int32Array(niftiImage);
				break;
			case nifti.NIFTI1.TYPE_FLOAT32:
				typedData = new Float32Array(niftiImage);
				break;
			case nifti.NIFTI1.TYPE_FLOAT64:
				typedData = new Float64Array(niftiImage);
				break;
			case nifti.NIFTI1.TYPE_INT8:
				typedData = new Int8Array(niftiImage);
				break;
			case nifti.NIFTI1.TYPE_UINT16:
				typedData = new Uint16Array(niftiImage);
				break;
			case nifti.NIFTI1.TYPE_UINT32:
				typedData = new Uint32Array(niftiImage);
				break;
			default:
				break;

		}

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

		this.minValue = minValue;
		this.maxValue = maxValue;

		return typedData;
	}

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
		this.slider.value = this.defaultSlice ?? Math.round(slices / 2);
		this.sliderText.innerText = this.slider.value;
		this.slider.oninput = debounce(() => {
			this.sliderText.innerText = this.slider.value;
			this.drawCanvas(parseInt(this.slider.value), niftiHeader, niftiImage);
		}, 10);
		this.drawCanvas(parseInt(this.slider.value), niftiHeader, niftiImage);
	};

	drawCanvas(slice, niftiHeader, niftiImage) {
		// get nifti dimensions
		this.cols = niftiHeader.dims[1];
		this.rows = niftiHeader.dims[2];

		// set canvas dimensions to nifti slice dimensions
		this.canvas.width = this.cols;
		this.canvas.height = this.rows;
		if (this.drawingCanvas.width !== this.canvas.width && this.drawingCanvas.height !== this.canvas.height) {
			this.drawingCanvas.width = this.canvas.width;
			this.drawingCanvas.height = this.canvas.height;
		}

		// make canvas image data
		this.ctx = this.canvas.getContext("2d");
		this.canvasImageData = this.ctx.createImageData(this.cols, this.rows);

		let typedData = this.getTypedData(niftiHeader, niftiImage);

		// offset to specified slice
		let sliceSize = this.cols * this.rows;
		let sliceOffset = sliceSize * slice;

		// Normalize voxel values and map them to grayscale colors
		for (let row = 0; row < this.rows; row++) {
			let rowOffset = row * this.cols;
			for (let col = 0; col < this.cols; col++) {
				let offset = sliceOffset + rowOffset + col;
				let value = typedData[offset];

				// Normalize the voxel value to the range [0, 255]
				const isSelected = this.selectedArea.some((p) => p[0] === col && p[1] === row && p[2] === slice);
				const isUnselected = this.unselectedArea.some((p) => p[0] === col && p[1] === row && p[2] === slice);
				let normalizedValue = Math.round((value - this.minValue) * (255 / (this.maxValue - this.minValue)));

				const red = isUnselected ? 255 : isSelected ? 0 : normalizedValue;
				const green = isUnselected ? 0 : isSelected ? 255 : normalizedValue;
				const blue = isUnselected ? 0 : isSelected ? 0 : normalizedValue;

				// Set the RGBA color values based on the normalized voxel value
				this.canvasImageData.data[(rowOffset + col) * 4] = red; // Red channel
				this.canvasImageData.data[(rowOffset + col) * 4 + 1] = green; // Green channel
				this.canvasImageData.data[(rowOffset + col) * 4 + 2] = blue; // Blue channel
				this.canvasImageData.data[(rowOffset + col) * 4 + 3] = 255; // Alpha channel (fully opaque)
			}
		}

		this.ctx.putImageData(this.canvasImageData, 0, 0);

	};

	updateCanvas(props) {
		console.log(props);
		if (props.color === 'green') {
			this.selectedArea.push([props.x, props.y, props.slice]);
		} else {
			this.unselectedArea.push([props.x, props.y, props.slice]);
		}

		let rowOffset = props.y * this.cols;
		this.canvasImageData.data[(rowOffset + props.x) * 4] = props.color === 'red' ? 255 : 0; // Red channel
		this.canvasImageData.data[(rowOffset + props.x) * 4 + 1] = props.color === 'green' ? 255 : 0; // Green channel
		this.canvasImageData.data[(rowOffset + props.x) * 4 + 2] = 0; // Blue channel
		this.canvasImageData.data[(rowOffset + props.x) * 4 + 3] = 255;

		this.ctx.putImageData(this.canvasImageData, 0, 0);

	}

	drawCoronalSlice(slice, niftiHeader, niftiImage) {
		// Get NIfTI dimensions
		let cols = niftiHeader.dims[1];
		let rows = niftiHeader.dims[2];
		let slices = niftiHeader.dims[3];

		// Set canvas dimensions
		this.canvas.width = cols;
		this.canvas.height = slices;
		if (this.drawingCanvas.width !== this.canvas.width && this.drawingCanvas.height !== this.canvas.height) {
			this.drawingCanvas.width = this.canvas.width;
			this.drawingCanvas.height = this.canvas.height;
		}

		// Make canvas image data
		let ctx = this.canvas.getContext("2d");
		let canvasImageData = ctx.createImageData(cols, slices);

		// Convert raw data to typed array based on NIfTI datatype
		let typedData = this.getTypedData(niftiHeader, niftiImage);

		let sliceSize = cols * rows;

		// Fill canvas image data with voxel values from the specified slice
		for (let sliceIndex = 0; sliceIndex < slices; sliceIndex++) {
			for (let colIndex = 0; colIndex < cols; colIndex++) {
				let offset = sliceIndex * sliceSize + slice * cols + colIndex;
				let value = typedData[offset];

				// Normalize voxel value to the range [0, 255]
				let normalizedValue = Math.round((value - this.minValue) * (255 / (this.maxValue - this.minValue)));

				// Set RGBA color values based on normalized voxel value
				let pixelIndex = (sliceIndex * cols + colIndex) * 4;
				canvasImageData.data[pixelIndex] = normalizedValue; // Red channel
				canvasImageData.data[pixelIndex + 1] = normalizedValue; // Green channel
				canvasImageData.data[pixelIndex + 2] = normalizedValue; // Blue channel
				canvasImageData.data[pixelIndex + 3] = 255; // Alpha channel (fully opaque)
			}
		}

		// Render the image on canvas
		ctx.putImageData(canvasImageData, 0, 0);
	}

	drawSagittalSlice(slice, niftiHeader, niftiImage) {
		// Get NIfTI dimensions
		let cols = niftiHeader.dims[1];
		let rows = niftiHeader.dims[2];
		let slices = niftiHeader.dims[3];

		// Set canvas dimensions
		this.canvas.width = slices;
		this.canvas.height = rows;
		if (this.drawingCanvas.width !== this.canvas.width && this.drawingCanvas.height !== this.canvas.height) {
			this.drawingCanvas.width = this.canvas.width;
			this.drawingCanvas.height = this.canvas.height;
		}

		// Make canvas image data
		let ctx = this.canvas.getContext("2d");
		let canvasImageData = ctx.createImageData(slices, rows);

		// Convert raw data to typed array based on NIfTI datatype
		let typedData = this.getTypedData(niftiHeader, niftiImage);

		let sliceSize = cols * rows;

		// Fill canvas image data with voxel values from the specified slice
		for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
			for (let sliceIndex = 0; sliceIndex < slices; sliceIndex++) {
				let offset = slice * sliceSize + rowIndex * cols + sliceIndex;
				let value = typedData[offset];

				// Normalize voxel value to the range [0, 255]
				let normalizedValue = Math.round((value - this.minValue) * (255 / (this.maxValue - this.minValue)));

				// Set RGBA color values based on normalized voxel value
				let pixelIndex = (rowIndex * slices + sliceIndex) * 4;
				canvasImageData.data[pixelIndex] = normalizedValue; // Red channel
				canvasImageData.data[pixelIndex + 1] = normalizedValue; // Green channel
				canvasImageData.data[pixelIndex + 2] = normalizedValue; // Blue channel
				canvasImageData.data[pixelIndex + 3] = 255; // Alpha channel (fully opaque)
			}
		}

		// Render the image on canvas
		ctx.putImageData(canvasImageData, 0, 0);
	}

}

export default NiftiReader;