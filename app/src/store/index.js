import { create } from "zustand";
import NiftiReader from "../classes/NiftiReader";

const useStore = create((set) => ({
	originalImage: null,
	setOriginalImage: (image) => set((_) => ({ originalImage: image, selectedAlgorithm: 'thresholding' })),
	resultImage: null,
	setResultImage: (image) => set((_) => ({ resultImage: image })),
	isProcessing: false,
	setIsProcessing: (value) => set((_) => ({ isProcessing: value })),
	selectedAlgorithm: null,
	setSelectedAlgorithm: (algorithm) => set((_) => ({ selectedAlgorithm: algorithm })),
	originalReader: null,
	setOriginalReader: (niftiReader) => set((_) => ({ originalReader: niftiReader })),
	drawing: {
		points: [],
		pointsToRemove: [],
		color: 'green'
	},
	setDrawing: (props) => set((state) => ({ drawing: { ...state.drawing, ...props } })),
	addPointsToDrawing: (type, pointsToAdd) => set((state) => ({
		drawing: {
			...state.drawing,
			[type]: [...state.drawing[type], ...pointsToAdd]
		}
	})),
	clearDrawing: () => {
		const niftiReader = new NiftiReader('myCanvas', 'myRange');
		const file = useStore.getState().originalImage;
		useStore.getState().setOriginalReader(niftiReader);

		let blob = niftiReader.makeSlice(file, 0, file.size);
		niftiReader.readFile(file, blob);

		useStore.getState().setDrawing({ points: [], pointsToRemove: [] });
	},
	reset: () => set((_) => ({
		originalImage: null,
		resultImage: null,
		isProcessing: false,
		selectedAlgorithm: null,
		drawing: { points: [], pointsToRemove: [], color: 'green' },
		originalReader: null
	})),
	algorithms: {
		'thresholding': 150,
		'kmeans': 5,
		'region_growing': 20,
	},
	setAlgorithmValue: (algorithm, value) => set((state) => ({
		algorithms: { ...state.algorithms, [algorithm]: value }
	})),
}));

export default useStore;