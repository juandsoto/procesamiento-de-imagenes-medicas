import useStore from "../../store";
import GlowingButton from '../GlowingButton';

function Algorithms() {

	const { isProcessing, originalImage, selectedAlgorithm, setSelectedAlgorithm } = useStore();

	const mustBeDisabled = isProcessing || !originalImage;

	return (
		<div className='flex flex-col gap-1'>
			<GlowingButton
				disabled={ mustBeDisabled }
				className={ selectedAlgorithm !== 'thresholding' ? 'opacity-50' : '' }
				color="cyan"
				onClick={ () => setSelectedAlgorithm('thresholding') }
			>
				Thresholding
			</GlowingButton>
			<GlowingButton
				disabled={ mustBeDisabled }
				className={ selectedAlgorithm !== 'isodata' ? 'opacity-50' : '' }
				color="teal"
				onClick={ () => setSelectedAlgorithm('isodata') }
			>
				Isodata
			</GlowingButton>
			<GlowingButton
				disabled={ mustBeDisabled }
				className={ selectedAlgorithm !== 'kmeans' ? 'opacity-50' : '' }
				color="purple"
				onClick={ () => setSelectedAlgorithm('kmeans') }
			>
				K-means
			</GlowingButton>
			<GlowingButton
				disabled={ mustBeDisabled }
				className={ selectedAlgorithm !== 'region_growing' ? 'opacity-50' : '' }
				color="green"
				onClick={ () => setSelectedAlgorithm('region_growing') }
			>
				Region growing
			</GlowingButton>
		</div>
	);
}

export default Algorithms;