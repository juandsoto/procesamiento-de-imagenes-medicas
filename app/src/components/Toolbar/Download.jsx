import React, { useEffect, useRef } from 'react';

function Download({ filename, file, text }) {
	const anchorRef = useRef(null);

	useEffect(() => {
		if (file) {
			const blobUrl = URL.createObjectURL(file);
			anchorRef.current.href = blobUrl;
			anchorRef.current.download = filename;
		}
	}, [file]);

	return (
		<a
			ref={ anchorRef }
			className='w-full flex items-center justify-center gap-2 text-white bg-secondary hover:bg-gray-700 border border-gray-700 focus:outline-none font-medium rounded-md text-sm px-5 py-2.5 text-center me-2 mb-2'
			download
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 aspect-square icon icon-tabler icons-tabler-outline icon-tabler-download">
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" />
				<path d="M12 4l0 12" />
			</svg>
			<span className='capitalize'>{ text }</span>
		</a>
	);
}


export default Download;