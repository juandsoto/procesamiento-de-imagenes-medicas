import React from 'react';

function Slider({ id, ...props }) {
	return (
		<input
			id={ id }
			className={ ["slider w-full", props?.className].join(' ') }
			type="range"
			min="1"
			{ ...props }
		/>
	);
}

export default Slider;