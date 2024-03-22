import React, { useEffect, useRef } from 'react';
import useStore from '../store';

function DrawingCanvas() {
	const canvasRef = useRef(null);
	const ctxRef = useRef(null);
	const isDrawing = useRef(false);
	const { drawing, setRegionGrowing } = useStore();
	const pointsRef = useRef([]);

	const startDrawing = (e) => {
		isDrawing.current = true;
		ctxRef.current.beginPath();
		draw(e);  // To start drawing immediately at the click position
	};

	const stopDrawing = () => {
		// setIsDrawing(false);
		isDrawing.current = false;
		setRegionGrowing({ points: pointsRef.current });
		ctxRef.current.closePath();  // Reset the drawing path
	};

	const draw = (e) => {
		if (!isDrawing.current) return;

		const canvas = canvasRef.current;
		const ctx = ctxRef.current;

		ctx.strokeStyle = drawing.color;
		ctx.lineWidth = 4;
		ctx.lineCap = "round";

		// Draw a line to the current mouse position
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		pointsRef.current.push([Math.floor(x), Math.floor(y)]);
		console.log(pointsRef.current);
		ctx.lineTo(x, y);
		ctx.stroke();

		// Start a new path for the next segment
		ctx.beginPath();
		ctx.moveTo(x, y);
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		ctxRef.current = ctx;

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
	}, []);

	return (
		<canvas id="drawingCanvas" ref={ canvasRef } className='absolute top-0 left-0 w-full h-full' width={ 100 } height={ 100 } />
	);
}


export default DrawingCanvas;