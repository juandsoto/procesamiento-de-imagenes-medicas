import React from 'react';

const colorClasses = {
	cyan: 'from-cyan-400 via-cyan-500 to-cyan-600 focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-cyan-500/50 dark:shadow-cyan-800/80',
	teal: 'from-teal-400 via-teal-500 to-teal-600 focus:ring-teal-300 dark:focus:ring-teal-800 shadow-teal-500/50 dark:shadow-teal-800/80',
	purple: 'from-purple-400 via-purple-500 to-purple-600 focus:ring-purple-300 dark:focus:ring-purple-800 shadow-purple-500/50 dark:shadow-purple-800/80',
	green: 'from-green-400 via-green-500 to-green-600 focus:ring-green-300 dark:focus:ring-green-800 shadow-green-500/50 dark:shadow-green-800/80',
	red: 'from-red-400 via-red-500 to-red-600 focus:ring-red-300 dark:focus:ring-red-800 shadow-red-500/50 dark:shadow-red-800/80'
	// Add more colors as needed
};

function GlowingButton({ className = '', color, children, disabled, onClick }) {
	const colorClass = colorClasses[color] || '';
	return (
		<button
			disabled={ disabled }
			onClick={ onClick }
			type="button"
			className={ [
				'text-white disabled:opacity-40 bg-gradient-to-r hover:bg-gradient-to-br focus:ring-4 focus:outline-none shadow-lg dark:shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2',
				colorClass,
				className
			].join(' ') }>
			{ children }
		</button>
	);
}

export default GlowingButton;