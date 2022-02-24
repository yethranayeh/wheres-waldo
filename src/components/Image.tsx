/** @format */

import { Image as MantineImage } from "@mantine/core";
import { useEffect, useState } from "react";

export default function Image() {
	const [imgSrc, setImgSrc] = useState(null as null | string);

	useEffect(() => {
		let subscribed = true;
		async function fetchImage() {
			try {
				const response = await fetch("/src/images/waldo.webp");
				if (subscribed && response.ok) {
					console.log("response:", response);
					setImgSrc(response.url);
				} else {
					throw new Error("Failed to fetch image");
				}
			} catch (error) {
				setImgSrc(null);
			}
		}
		fetchImage();

		return () => {
			subscribed = false;
		};
	}, []);

	if (!imgSrc) {
		return null;
	}

	return (
		<MantineImage
			src={imgSrc}
			alt="Where's Waldo Image"
			style={{
				marginBottom: "24px"
			}}
		/>
	);
}
