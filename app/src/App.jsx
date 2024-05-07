import { useState } from "react";
import DropZone from "./components/DropZone";
import Toolbar from "./components/Toolbar/Toolbar";
import ImageViewer from "./components/ImageViewer";
import useStore from "./store";
import Image from "./components/Laplacian/Image";

function App() {
	const [isMobile, setIsMobile] = useState(true);
	const { originalImage, isProcessing, resultImage, regularImage, regularImageResult, laplacian } = useStore();

	return (
		<div className="min-h-screen flex items-stretch gap-8 max-w-screen-3xl mx-auto">
			<div className="fixed w-full lg:app-width lg:app-max-width flex-1 space-y-8 mt-4 px-4 lg:mx-auto">
				<div className="flex items-center justify-center gap-2">
					<img src="/logo.png" alt="logo" width={ 64 } />
					<h1 className="text-2xl capitalize">Medical image processing</h1>
				</div>
				{ !isMobile && (
					<button className="lg:hidden w-8 absolute -top-4 right-4" onClick={ () => setIsMobile(true) }>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-layout-sidebar-right-expand">
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
							<path d="M15 4v16" />
							<path d="M10 10l-2 2l2 2" />
						</svg>
					</button>
				) }
				{ originalImage
					? <ImageViewer canvasId="myCanvas" sliderId="myRange" />
					: regularImage ? (
						<Image canvas image={ regularImage } />
					) : <DropZone />
				}
				{ isProcessing ? (
					<div role="status" className="mx-auto w-fit">
						<svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-secondary fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
						</svg>
						<span className="sr-only">Loading...</span>
					</div>
				) : resultImage ? (
					<ImageViewer canvasId="myCanvasResult" sliderId="myRangeResult" />
				) : regularImageResult && (
					<Image image={ regularImageResult } />
				) }
			</div>
			{ isMobile && <Toolbar className="lg:hidden absolute top-0 right-0 bottom-0 shadow-md shadow-secondary" onClose={ () => setIsMobile(false) } /> }
			<Toolbar className="hidden lg:flex ml-auto w-96" />
		</div>
	);
}

export default App;
