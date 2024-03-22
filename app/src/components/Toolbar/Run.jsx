import React from 'react';
import NiftiReader from "../../classes/NiftiReader";
import useStore from '../../store';
import { wait } from "../../utils";

function Run() {
	const { isProcessing, setIsProcessing, originalImage, setResultImage, selectedAlgorithm, algorithms } = useStore();

	const handleSubmit = async () => {
		setIsProcessing(true);
		try {
			const formData = new FormData();
			const file = originalImage;
			formData.append('file', file);

			let payload = { algorithm: selectedAlgorithm, slice: parseInt(document.getElementById('myRange-text').innerText) };
			switch (selectedAlgorithm) {
				case 'thresholding':
					payload.tau = parseInt(algorithms['thresholding']);
					break;
				case 'isodata':
					payload.tau = parseInt(algorithms['isodata']);
					break;
				case 'kmeans':
					payload.k = parseInt(algorithms['kmeans']);
					break;
				case 'region_growing':
					payload.points = algorithms['region_growing'].points;
					payload.threshold = parseInt(algorithms['region_growing'].threshold);
					break;
			}
			formData.append('data', JSON.stringify(payload));

			const response = await fetch('http://localhost:5000/upload', {
				method: 'POST',
				body: formData,
				headers: {
					'Accept': '*/*'
				}
			});

			const blob = await response.blob();

			setResultImage(blob);
			setIsProcessing(false);

			await wait(500);

			const niftiReader = new NiftiReader('myCanvasResult', 'myRangeResult', parseInt(document.getElementById('myRange-text').innerText));

			niftiReader.readFile(file, blob);
		} catch (error) {
			console.error('Error al subir el archivo:', error);
		}
	};

	return (
		<button
			disabled={ isProcessing }
			type="button"
			className="w-32 ml-auto py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-green-600 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-600 dark:bg-secondary dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-white/5 flex items-center justify-center gap-2 disabled:hover"
			onClick={ handleSubmit }
		>
			{ isProcessing ? (
				<>
					<svg aria-hidden="true" role="status" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
						<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
					</svg>
					Loading...
				</>
			) : (
				<>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-green-600 icon icon-tabler icons-tabler-outline icon-tabler-flame">
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M12 12c2 -2.96 0 -7 -1 -8c0 3.038 -1.773 4.741 -3 6c-1.226 1.26 -2 3.24 -2 5a6 6 0 1 0 12 0c0 -1.532 -1.056 -3.94 -2 -5c-1.786 3 -2.791 3 -4 2z" />
					</svg>
					<span className='uppercase tracking-wider text-green-600'>run</span>
				</>
			) }
		</button>
	);
}

export default Run;