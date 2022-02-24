/** @format */

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { BsSunFill, BsMoonStars } from "react-icons/bs";

export default function ThemeButton() {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const dark = colorScheme === "dark";

	return (
		<ActionIcon
			variant='outline'
			color={dark ? "yellow" : "blue"}
			onClick={() => toggleColorScheme()}
			title='Toggle color scheme'>
			{dark ? <BsSunFill style={{ width: 18, height: 18 }} /> : <BsMoonStars style={{ width: 18, height: 18 }} />}
		</ActionIcon>
	);
}
