import React from 'react';
import Slider from './Slider';
import DrawingCanvas from './DrawingCanvas';

function ImageViewer({ canvasId, sliderId }) {
	return (
		<div className='flex flex-col justify-stretch items-center w-auto gap-2 mx-auto'>
			<div className="relative flex justify-stretch items-stretch w-auto outline outline-1 outline-offset-2">
				<canvas id={ canvasId } className='w-full' width={ 176 } height={ 192 } />
				{ canvasId === 'myCanvas' && <DrawingCanvas /> }
			</div>
			<div className='relative'>
				<Slider id={ sliderId } />
				<span id={ `${sliderId}-text` } className='hidden absolute -top-8 left-1/2 -translate-x-1/2' />
			</div>
		</div>
	);
}

export default ImageViewer;