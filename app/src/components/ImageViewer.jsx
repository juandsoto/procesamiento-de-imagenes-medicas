import React from 'react';
import Slider from './Slider';

function ImageViewer({ canvasId, sliderId }) {
	return (
		<div className='flex flex-col justify-stretch w-64 gap-2 mx-auto'>
			<canvas id={ canvasId } width="100" height="100" />
			<div className='relative'>
				<Slider id={ sliderId } />
				<span id={ `${sliderId}-text` } className='hidden absolute -top-8 left-1/2 -translate-x-1/2' />
			</div>
		</div>
	);
}

export default ImageViewer;