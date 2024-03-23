import React, { useEffect, useRef } from 'react';
import useStore from '../store';

function DrawingCanvas() {
	const canvasRef = useRef(null);
	const ctxRef = useRef(null);
	const isDrawing = useRef(false);
	const pointsRef = useRef([]);
	const pointsToRemoveRef = useRef([]);
	const { drawing, addPointsToDrawing } = useStore();

	const startDrawing = (e) => {
		isDrawing.current = true;
		ctxRef.current.beginPath();
		draw(e);
	};

	const stopDrawing = () => {
		isDrawing.current = false;
		if (drawing.color === 'green') {
			addPointsToDrawing('points', pointsRef.current);
			pointsRef.current = [];
		} else {
			addPointsToDrawing('pointsToRemove', pointsToRemoveRef.current);
			pointsToRemoveRef.current = [];
		}
		ctxRef.current.closePath();
	};

	const draw = (e) => {
		if (!isDrawing.current) return;

		const canvas = canvasRef.current;
		const ctx = ctxRef.current;

		ctx.strokeStyle = drawing.color;
		ctx.lineWidth = 4;
		ctx.lineCap = "round";

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		if (drawing.color === 'green') {
			pointsRef.current.push([Math.floor(x), Math.floor(y)]);
		} else {
			pointsToRemoveRef.current.push([Math.floor(x), Math.floor(y)]);
		}

		ctx.lineTo(x, y);
		ctx.stroke();

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
	}, [drawing.color]);

	return (
		<canvas id="drawingCanvas" ref={ canvasRef } className='absolute top-0 left-0 w-full h-full' width={ 100 } height={ 100 } />
	);
}


export default DrawingCanvas;