import React, { useEffect, useRef, useState } from 'react';
import useStore from '../../store';

function Image({ image, canvas = false }) {
	const [dummy, setDummy] = useState(false);
	const imageRef = useRef(null);

	useEffect(() => {
		if (!!imageRef.current) setDummy(!dummy);
	}, [imageRef.current]);

	return (
		<div className="relative mx-auto w-fit outline outline-1 outline-offset-2">
			<img ref={ imageRef } src={ URL.createObjectURL(image) } alt="image" />
			{ (canvas && !!imageRef.current) && <DrawAboveImage width={ imageRef.current.width } height={ imageRef.current.height } /> }
		</div>
	);
}

function DrawAboveImage({ width, height }) {
	const canvasRef = useRef();
	const isDrawing = useRef(false);
	const seedsRef = useRef([]);
	const labelsRef = useRef([]);
	const { setLaplacian, drawing, regularImage } = useStore();

	const startDrawing = (e) => {
		isDrawing.current = true;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		ctx.beginPath();
		draw(e);
	};

	const stopDrawing = () => {
		isDrawing.current = false;

		setLaplacian('seeds', seedsRef.current);
		setLaplacian('labels', labelsRef.current);

		seedsRef.current = [];
		labelsRef.current = [];

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		ctx.closePath();
	};

	const draw = (e) => {
		if (!isDrawing.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		ctx.strokeStyle = drawing.color;
		ctx.lineWidth = 1;
		ctx.lineCap = "round";

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		seedsRef.current.push([Math.floor(y), Math.floor(x)]);
		if (drawing.color === 'green') {
			labelsRef.current.push("F");
		} else {
			labelsRef.current.push("B");
		}
		ctx.lineTo(x, y);
		ctx.stroke();

		// Start a new path for the next segment
		ctx.beginPath();
		ctx.moveTo(x, y);
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		canvas.addEventListener('mousedown', startDrawing);
		canvas.addEventListener('mouseup', stopDrawing);
		canvas.addEventListener('mousemove', draw);
		canvas.addEventListener('mouseout', stopDrawing);

		return () => {
			canvas.removeEventListener('mousedown', startDrawing);
			canvas.removeEventListener('mouseup', stopDrawing);
			canvas.removeEventListener('mousemove', draw);
			canvas.removeEventListener('mouseout', stopDrawing);
		};
	}, [drawing.color, regularImage]);

	return (
		<canvas id="laplacianDrawingCanvas" ref={ canvasRef } className='absolute top-0 left-0 w-full h-full' width={ width } height={ height } />
	);
}

export default Image;