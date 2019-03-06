const resizeImage = (base64image, width, height) => {
	return new Promise(resolve => {
		let img = new Image();
		img.src = base64image;

		img.onload = () => {
			if (img.height > img.width) {
				width = Math.floor(height * (img.width / img.height));
			} else {
				height = Math.floor(width * (img.height / img.width));
			}

			let resizingCanvas = document.createElement('canvas');
			let resizingCanvasContext = resizingCanvas.getContext('2d');

			resizingCanvas.width = img.width;
			resizingCanvas.height = img.height;

			resizingCanvasContext.drawImage(
				img,
				0,
				0,
				resizingCanvas.width,
				resizingCanvas.height
			);

			let curImageDimensions = {
				width: Math.floor(img.width),
				height: Math.floor(img.height)
			};

			let halfImageDimensions = {
				width: null,
				height: null
			};

			while (curImageDimensions.width * 0.5 > width) {
				halfImageDimensions.width = Math.floor(
					curImageDimensions.width * 0.5
				);
				halfImageDimensions.height = Math.floor(
					curImageDimensions.height * 0.5
				);

				resizingCanvasContext.drawImage(
					resizingCanvas,
					0,
					0,
					curImageDimensions.width,
					curImageDimensions.height,
					0,
					0,
					halfImageDimensions.width,
					halfImageDimensions.height
				);

				curImageDimensions.width = halfImageDimensions.width;
				curImageDimensions.height = halfImageDimensions.height;
			}

			let outputCanvas = document.createElement('canvas');
			let outputCanvasContext = outputCanvas.getContext('2d');

			outputCanvas.width = width;
			outputCanvas.height = height;

			outputCanvasContext.drawImage(
				resizingCanvas,
				0,
				0,
				curImageDimensions.width,
				curImageDimensions.height,
				0,
				0,
				width,
				height
			);

			const base64ResizedImage = outputCanvas.toDataURL('image/jpeg', 0.85);

			resolve(base64ResizedImage);
		};
	});
}

export default resizeImage;