import { create } from "zustand";
import NiftiReader from "../classes/NiftiReader";

const useStore = create((set) => ({
	originalImage: null,
	setOriginalImage: (image) => set((_) => ({ originalImage: image, selectedAlgorithm: 'thresholding' })),
	resultImage: null,
	setResultImage: (image) => set((_) => ({ resultImage: image })),
	regularImage: null,
	setRegularImage: (image) => set((_) => ({ regularImage: image, selectedAlgorithm: 'laplacian_coordinates' })),
	regularImageResult: null,
	setRegularImageResult: (image) => set((_) => ({ regularImageResult: image })),
	isProcessing: false,
	setIsProcessing: (value) => set((_) => ({ isProcessing: value })),
	selectedAlgorithm: null,
	setSelectedAlgorithm: (algorithm) => set((_) => ({ selectedAlgorithm: algorithm })),
	originalReader: null,
	setOriginalReader: (niftiReader) => set((_) => ({ originalReader: niftiReader })),
	drawing: {
		color: 'green'
	},
	laplacian: {
		seeds: [],
		labels: [],
	},
	setLaplacian: (key, values) => set(state => ({ laplacian: { ...state.laplacian, [key]: [...state.laplacian[key], ...values] } })),
	setDrawing: (props) => set((state) => ({ drawing: { ...state.drawing, ...props } })),
	clearLaplacian: () => set(state => ({ laplacian: { seeds: [], labels: [] } })),
	clearDrawing: () => {
		const niftiReader = new NiftiReader('myCanvas', 'myRange');
		const file = useStore.getState().originalImage;
		useStore.getState().setOriginalReader(niftiReader);

		let blob = niftiReader.makeSlice(file, 0, file.size);
		niftiReader.readFile(file, blob);
	},
	reset: () => set((_) => ({
		originalImage: null,
		resultImage: null,
		regularImage: null,
		regularImageResult: null,
		isProcessing: false,
		selectedAlgorithm: null,
		drawing: { color: 'green' },
		originalReader: null,
		laplacian: {
			seeds: [],
			labels: [],
		}
	})),
	algorithms: {
		'thresholding': 150,
		'kmeans': 5,
		'region_growing': 20,
		'denoising': 3,
		// 'white_stripe': 1,
		'histogram_matching': 3,
	},
	setAlgorithmValue: (algorithm, value) => set((state) => ({
		algorithms: { ...state.algorithms, [algorithm]: value }
	})),
}));

export default useStore;