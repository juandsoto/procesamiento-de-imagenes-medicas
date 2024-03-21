import React from 'react';
import useStore from '../../store';
import Slider from '../Slider';

function Attributes() {
	const { selectedAlgorithm } = useStore();

	switch (selectedAlgorithm) {
		case 'thresholding':
			return <ThresholdingAttributes />;
		case 'isodata':
			return <IsodataAttributes />;
		case 'kmeans':
			return <KmeansAttributes />;
		case 'region_growing':
			return <RegionGrowingAttributes />;
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

function IsodataAttributes() {
	const { setAlgorithmValue, algorithms } = useStore();

	return (
		<div>
			<label htmlFor="isodata-attribute">Threshold { algorithms['isodata'] }</label>
			<Slider
				id="isodata-attribute"
				min={ 1 }
				max={ 300 }
				value={ algorithms['isodata'] }
				onChange={ (e) => setAlgorithmValue('isodata', e.target.value) }
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

export default Attributes;