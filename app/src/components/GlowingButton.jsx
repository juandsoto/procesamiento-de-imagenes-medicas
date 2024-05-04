import React from 'react';

const colorClasses = {
	cyan: 'text-white from-cyan-400 via-cyan-500 to-cyan-600 focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-cyan-500/50 dark:shadow-cyan-800/80',
	teal: 'text-white from-teal-400 via-teal-500 to-teal-600 focus:ring-teal-300 dark:focus:ring-teal-800 shadow-teal-500/50 dark:shadow-teal-800/80',
	blue: 'text-white from-blue-400 via-blue-500 to-blue-600 focus:ring-blue-300 dark:focus:ring-blue-800 shadow-blue-500/50 dark:shadow-blue-800/80',
	green: 'text-white from-green-400 via-green-500 to-green-600 focus:ring-green-300 dark:focus:ring-green-800 shadow-green-500/50 dark:shadow-green-800/80',
	red: 'text-white from-red-400 via-red-500 to-red-600 focus:ring-red-300 dark:focus:ring-red-800 shadow-red-500/50 dark:shadow-red-800/80',
	fuchsia: 'text-white from-fuchsia-400 via-fuchsia-500 to-fuchsia-600 focus:ring-fuchsia-300 dark:focus:ring-fuchsia-800 shadow-fuchsia-500/50 dark:shadow-fuchsia-800/80',
	amber: 'text-white from-amber-400 via-amber-500 to-amber-600 focus:ring-amber-300 dark:focus:ring-amber-800 shadow-amber-500/50 dark:shadow-amber-800/80',
	light: 'text-black from-neutral-100 via-neutral-300 to-neutral-500 focus:ring-neutral-300 dark:focus:ring-neutral-700 shadow-neutral-300/50 dark:shadow-neutral-700/80'
};

function GlowingButton({ className = '', color, children, disabled, onClick }) {
	const colorClass = colorClasses[color] || '';
	return (
		<button
			disabled={ disabled }
			onClick={ onClick }
			type="button"
			className={ [
				'disabled:opacity-40 bg-gradient-to-r hover:bg-gradient-to-br focus:ring-4 focus:outline-none shadow-lg dark:shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2',
				colorClass,
				className
			].join(' ') }>
			{ children }
		</button>
	);
}

export default GlowingButton;