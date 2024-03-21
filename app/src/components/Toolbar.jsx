import React from 'react';
import useStore from '../store';
import Algorithms from './Algorithms';
import Attributes from './Attributes';
import Run from './Run';

function Toolbar({ className = '', onClose }) {
	const { originalImage, selectedAlgorithm, reset } = useStore();

	return (
		<div className={ ["flex flex-col bg-secondary w-96 p-4 space-y-4", className].join(' ') }	>
			<div className='flex-1 space-y-8'>
				<div className="flex items-center justify-between gap-4">
					<h3 className="text-xl">Tools</h3>
					<button className="xl:hidden w-8" onClick={ onClose ?? (() => { }) }>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x">
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M18 6l-12 12" />
							<path d="M6 6l12 12" />
						</svg>
					</button>
				</div>
				<Algorithms />
				<Attributes />
				{ selectedAlgorithm && <Run /> }
			</div>
			{ originalImage && (
				<button
					className="relative w-full inline-flex items-center justify-center p-[1.5px] mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
					onClick={ reset }>
					<span className="relative w-full tracking-wider px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-primary rounded-md group-hover:bg-opacity-0">
						Reset
					</span>
				</button>
			) }
		</div>
	);
}

export default Toolbar;