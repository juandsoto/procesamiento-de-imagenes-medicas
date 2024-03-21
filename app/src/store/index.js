import { create } from "zustand";

const useStore = create((set) => ({
	originalImage: null,
	setOriginalImage: (image) => set((_) => ({ originalImage: image, selectedAlgorithm: 'thresholding' })),
	resultImage: null,
	setResultImage: (image) => set((_) => ({ resultImage: image })),
	isProcessing: false,
	setIsProcessing: (value) => set((_) => ({ isProcessing: value })),
	selectedAlgorithm: null,
	setSelectedAlgorithm: (algorithm) => set((_) => ({ selectedAlgorithm: algorithm })),
	drawing: {
		isActive: false,
		color: 'green'
	},
	setDrawingColor: (color) => set((state) => ({ drawing: { ...state.drawing, color } })),
	toggleDrawing: () => set((state) => ({ drawing: { ...state.drawing, isActive: !state.drawing.isActive } })),
	reset: () => set((_) => ({
		originalImage: null,
		resultImage: null,
		isProcessing: false,
		selectedAlgorithm: null,
	})),
	algorithms: {
		'thresholding': 150,
		'isodata': 100,
		'kmeans': 5,
		'region_growing': 100,
	},
	setAlgorithmValue: (algorithm, value) => set((state) => ({
		algorithms: { ...state.algorithms, [algorithm]: value }
	}))
}));

export default useStore;