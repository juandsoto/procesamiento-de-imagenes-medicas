import React, { useEffect, useRef } from 'react';
import useStore from '../store';

function DrawingCanvas() {
	const canvasRef = useRef(null);
	const isDrawing = useRef(false);
	const pointsRef = useRef([]);
	const pointsToRemoveRef = useRef([]);
	const { drawing, addPointsToDrawing, originalReader } = useStore();

	const startDrawing = (e) => {
		isDrawing.current = true;
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
	};

	const draw = (e) => {
		if (!isDrawing.current) return;

		const canvas = canvasRef.current;

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		if (drawing.color === 'green') {
			pointsRef.current.push([Math.floor(x), Math.floor(y)]);
			originalReader.updateCanvas({
				x: Math.floor(x),
				y: Math.floor(y),
				slice: parseInt(document.getElementById('myRange-text').innerText),
				color: 'green'
			});
		} else {
			pointsToRemoveRef.current.push([Math.floor(x), Math.floor(y)]);
			originalReader.updateCanvas({
				x: Math.floor(x),
				y: Math.floor(y),
				slice: parseInt(document.getElementById('myRange-text').innerText),
				color: 'red'
			});
		}
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		// ctxRef.current = ctx;

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
	}, [drawing.color, originalReader]);

	return (
		<canvas id="drawingCanvas" ref={ canvasRef } className='absolute top-0 left-0 w-full h-full' width={ 100 } height={ 100 } />
	);
}


export default DrawingCanvas;