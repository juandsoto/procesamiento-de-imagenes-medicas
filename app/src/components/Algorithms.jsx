import useStore from "../store";
import GlowingButton from './GlowingButton';

function Algorithms() {

	const { isProcessing, originalImage, selectedAlgorithm, setSelectedAlgorithm } = useStore();

	const mustBeDisabled = isProcessing || !originalImage;

	return (
		<div className='flex flex-col gap-1'>
			<GlowingButton
				disabled={ mustBeDisabled }
				className={ selectedAlgorithm !== 'thresholding' ? 'opacity-50' : '' }
				color="cyan"
				text='Thresholding'
				onClick={ () => setSelectedAlgorithm('thresholding') }
			/>
			<GlowingButton
				disabled={ mustBeDisabled }
				className={ selectedAlgorithm !== 'isodata' ? 'opacity-50' : '' }
				color="teal"
				text='Isodata'
				onClick={ () => setSelectedAlgorithm('isodata') }
			/>
			<GlowingButton
				disabled={ mustBeDisabled }
				className={ selectedAlgorithm !== 'kmeans' ? 'opacity-50' : '' }
				color="purple"
				text='K-means'
				onClick={ () => setSelectedAlgorithm('kmeans') }
			/>
			<GlowingButton
				disabled={ mustBeDisabled }
				className={ selectedAlgorithm !== 'region_growing' ? 'opacity-50' : '' }
				color="green"
				text='Region growing'
				onClick={ () => setSelectedAlgorithm('region_growing') }
			/>
		</div>
	);
}

export default Algorithms;