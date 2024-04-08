import React from 'react';
import useStore from '../../store';
import Slider from '../Slider';

function Attributes() {
	const { selectedAlgorithm } = useStore();

	switch (selectedAlgorithm) {
		case 'thresholding':
			return <ThresholdingAttributes />;
		case 'kmeans':
			return <KmeansAttributes />;
		case 'region_growing':
			return <RegionGrowingAttributes />;
		case 'denoising_mean':
			return <DenoisingAttributes />;
		case 'denoising_median':
			return <DenoisingAttributes />;
		case 'intensity_rescaling':
			return <IntensityStandardisationAttributes />;
		case 'z_score':
			return <IntensityStandardisationAttributes />;
		default:
			return null;
	}
}

function ThresholdingAttributes() {
	const { setAlgorithmValue, algorithms } = useStore();

	return (
		<div>
			<label htmlFor="thresholding-attribute">Threshold { algorithms['thresholding'] }</label>
			<Slider
				id="thresholding-attribute"
				min={ 1 }
				max={ 300 }
				value={ algorithms['thresholding'] }
				onChange={ (e) => setAlgorithmValue('thresholding', e.target.value) }
			/>
		</div>
	);
}

function KmeansAttributes() {
	const { setAlgorithmValue, algorithms } = useStore();

	return (
		<div>
			<label htmlFor="kmeans-attribute">K { algorithms['kmeans'] }</label>
			<Slider
				id="kmeans-attribute"
				min={ 1 }
				max={ 50 }
				value={ algorithms['kmeans'] }
				onChange={ (e) => setAlgorithmValue('kmeans', e.target.value) }
			/>
		</div>
	);
}

function RegionGrowingAttributes() {
	const { setAlgorithmValue, algorithms } = useStore();

	return (
		<div>
			<label htmlFor="region_growing-attribute">Threshold { algorithms['region_growing'] }</label>
			<Slider
				id="region_growing-attribute"
				min={ 1 }
				max={ 300 }
				value={ algorithms['region_growing'] }
				onChange={ (e) => setAlgorithmValue('region_growing', e.target.value) }
			/>
		</div>
	);
}

function DenoisingAttributes() {
	const { setAlgorithmValue, algorithms, setSelectedAlgorithm } = useStore();

	const handleChange = (e) => setSelectedAlgorithm(e.target.value);

	return (
		<div className='space-y-4'>
			<select
				className='bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-primary dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
				name="denoising_method"
				id="denoising_method"
				onChange={ handleChange }
			>
				<option value="denoising_mean">Mean Filter</option>
				<option value="denoising_median">Median Filter</option>
			</select>
			<div>
				<label htmlFor="denoising-attribute">Size { algorithms['denoising'] }</label>
				<Slider
					id="denoising-attribute"
					min={ 1 }
					max={ 10 }
					value={ algorithms['denoising'] }
					onChange={ (e) => setAlgorithmValue('denoising', e.target.value) }
				/>
			</div>
		</div>
	);
}

function IntensityStandardisationAttributes() {
	const { setSelectedAlgorithm } = useStore();

	const handleChange = (e) => setSelectedAlgorithm(e.target.value);

	return (
		<div>
			<select
				className='bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-primary dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
				name="intensity_standardisation_method"
				id="intensity_standardisation_method"
				onChange={ handleChange }
			>
				<option value="intensity_rescaling">Intensity rescaling</option>
				<option value="z_score">Z-score</option>
			</select>
		</div>
	);
}

export default Attributes;