/** @format */

import { Image as MantineImage } from "@mantine/core";
import { useEffect, useState } from "react";
import GameImage from "../images/waldo.webp";

export default function Image() {
	return (
		<MantineImage
			src={GameImage}
			alt="Where's Waldo Image"
			style={{
				marginBottom: "24px"
			}}
		/>
	);
}
