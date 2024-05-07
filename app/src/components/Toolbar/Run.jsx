import React, { useState, useRef } from 'react';
import NiftiReader from "../../classes/NiftiReader";
import useStore from '../../store';
import { wait } from "../../utils";

function Run() {
	const { isProcessing, setIsProcessing, originalReader, originalImage, setResultImage, selectedAlgorithm, algorithms, laplacian, regularImage, setRegularImageResult } = useStore();
	const [error, setError] = useState(null);
	const secondFileInputRef = useRef(null);
	const secondFileRef = useRef(null);

	const handleSecondFileSelect = async (e) => {
		let file = e.target.files[0];
		if (!file) return;
		secondFileRef.current = file;
		handleSubmit();
	};

	const handleSubmit = async () => {
		setIsProcessing(true);
		try {
			const formData = new FormData();
			let file;
			let payload;
			if (selectedAlgorithm === 'laplacian_coordinates') {
				file = regularImage;
				payload = { algorithm: selectedAlgorithm };
			} else {
				file = originalImage;
				payload = { algorithm: selectedAlgorithm, slice: parseInt(document.getElementById('myRange-text').innerText) };
			}
			formData.append('file', file);

			switch (selectedAlgorithm) {
				case 'thresholding':
					payload.tau = parseInt(algorithms['thresholding']);
					break;
				case 'kmeans':
					payload.k = parseInt(algorithms['kmeans']);
					break;
				case 'region_growing':
					payload.points = originalReader.selectedArea.map(pos => [pos[0], pos[1]]);
					payload.pointsToRemove = originalReader.unselectedArea.map(pos => [pos[0], pos[1]]);;
					if (!payload.points.length) {
						setError('You must draw (at least with green color) on the image for the region growing algorithm to work. Use the drawing tool');
						setIsProcessing(false);
						setTimeout(() => {
							setError(null);
						}, 6000);
						return;
					}
					payload.threshold = parseInt(algorithms['region_growing']);
					break;
				case 'denoising_mean':
					payload.size = parseInt(algorithms['denoising']);
					break;
				case 'denoising_median':
					payload.size = parseInt(algorithms['denoising']);
					break;
				case 'histogram_matching':
					payload.k = parseInt(algorithms['histogram_matching']);
					formData.append('file2', secondFileRef.current);
					break;
				case 'image_registration':
					formData.append('file2', secondFileRef.current);
					break;
				case 'laplacian_coordinates':
					payload.seeds = laplacian.seeds;
					payload.labels = laplacian.labels;
					break;
				default:
					break;
			}
			formData.append('data', JSON.stringify(payload));

			const isDeployed = window.location.hostname.includes("vercel.app");

			const URL = isDeployed ? 'https://jdsotoc06.pythonanywhere.com/upload' : 'http://localhost:5000/upload';

			const response = await fetch(URL, {
				method: 'POST',
				body: formData,
				headers: {
					'Accept': '*/*'
				}
			});

			if (selectedAlgorithm === 'laplacian_coordinates') {
				const blob = await response.blob();
				setRegularImageResult(new Blob([blob]));
				setIsProcessing(false);
				return;
			}

			const blob = await response.blob();
			setResultImage(new Blob([blob]));
			setIsProcessing(false);

			await wait(500);

			const niftiReader = new NiftiReader('myCanvasResult', 'myRangeResult', parseInt(document.getElementById('myRange-text').innerText));

			niftiReader.readFile(file, blob);
		} catch (error) {
			console.error('Error al subir el archivo:', error);
		}
	};

	return (
		<div className="flex flex-col items-end gap-2 text-end">

			<button
				disabled={ isProcessing }
				type="button"
				className="w-32 py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-green-600 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-600 dark:bg-secondary dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-white/5 flex items-center justify-center gap-2 disabled:hover"
				onClick={ () => {
					if (['histogram_matching', 'image_registration'].includes(selectedAlgorithm)) {
						secondFileInputRef.current.value = '';
						secondFileInputRef.current.click();
						return;
					}
					handleSubmit();
				} }
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
			{ error && <span className='text-sm text-red-700'>{ error }</span> }
			<input ref={ secondFileInputRef } id="dropzone-file" type="file" className="hidden" onChange={ handleSecondFileSelect } />
		</div>
	);
}

export default Run;