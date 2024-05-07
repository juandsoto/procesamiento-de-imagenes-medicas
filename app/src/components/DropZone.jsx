import React from 'react';
import NiftiReader from '../classes/NiftiReader';
import useStore from '../store';
import { wait } from '../utils';

function DropZone() {
	const { setOriginalImage, setOriginalReader, setRegularImage } = useStore();

	const handleDrop = (event) => {
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		if (file.type.includes('image')) return setRegularImage(file);
		setFile(file);
	};

	const handleFileSelect = async (e) => {
		let file = e.target.files[0];
		if (file.type.includes('image')) return setRegularImage(file);
		setFile(file);
	};

	const setFile = async (file) => {
		if (!file) return;
		setOriginalImage(file);

		await wait(300);

		const niftiReader = new NiftiReader('myCanvas', 'myRange');
		setOriginalReader(niftiReader);

		await wait(300);

		let blob = niftiReader.makeSlice(file, 0, file.size);
		niftiReader.readFile(file, blob);
	};

	return (
		<div
			className="flex items-center justify-center"
			onDrop={ handleDrop }
			onDragOver={ (event) => event.preventDefault() }
		>
			<label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-primary hover:bg-gray-100 dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/5">
				<div className="flex flex-col items-center justify-center pt-5 pb-6">
					<svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
						<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
					</svg>
					<p className="mb-2 text-sm text-gray-300 dadrk:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
					<p className="text-xs text-gray-500 dark:text-gray-400">.NII or .NII.GZ files. Also regular images for laplacian coordinates</p>
				</div>
				<input id="dropzone-file" type="file" className="hidden" onChange={ handleFileSelect } />
			</label>
		</div>
	);
}

export default DropZone;