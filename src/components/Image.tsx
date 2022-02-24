/** @format */

import { Image as MantineImage } from "@mantine/core";
export default function Image() {
	return (
		<MantineImage
			src='/src/images/waldo.webp'
			alt="Where's Waldo Image"
			withPlaceholder
			style={{
				marginBottom: "24px"
			}}
		/>
	);
}
