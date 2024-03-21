import React from 'react';
import useStore from '../../store';

function Draw() {
	const { drawing, setDrawingColor, toggleDrawing } = useStore();

	return (
		<div className='flex items-stretch gap-2 ml-auto w-fit'>
			{ drawing.isActive && (
				<div className='flex items-center gap-3'>
					<button
						type="button"
						onClick={ () => setDrawingColor('green') }
						className={ [
							"w-4 aspect-square bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 rounded-full dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
							drawing.color === 'green' ? 'ring-4 ring-green-800 ' : ''
						].join(' ') }
					/>
					<button
						type="button"
						onClick={ () => setDrawingColor('red') }
						className={ [
							"w-4 aspect-square bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-full dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800",
							drawing.color === 'red' ? 'ring-4 ring-red-800 ' : ''
						].join(' ') }
					/>
				</div>
			) }
			<button
				className="flex items-center justify-between w-40 text-white px-4 py-2 bg-secondary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium text-sm dark:bg-secondary dark:hover:bg-gray-700 dark:focus:ring-gray-700 border dark:border-gray-700"
				onClick={ () => toggleDrawing() }
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 aspect-square icon icon-tabler icons-tabler-outline icon-tabler-pencil">
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
					<path d="M13.5 6.5l4 4" />
				</svg>
				<span className=''>{ drawing.isActive ? 'Disable drawing' : 'Enable drawing' }</span>
			</button>
		</div>
	);
}

export default Draw;