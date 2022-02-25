/** @format */

import { Avatar, Title, Text, createStyles } from "@mantine/core";
import WaldoImg from "../images/avt_waldo.png";
import WizardImg from "../images/avt_wizard.png";

const useStyles = createStyles((theme, _params, getRef) => {
	const child = getRef("child");

	return {
		wrapper: {
			// subscribe to color scheme changes right in your styles
			backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
			display: "flex",
			alignItems: "center",
			justifyContent: "flex-start",
			gap: "16px",
			marginLeft: "auto",
			marginRight: "auto",
			marginBottom: "2rem",
			borderRadius: theme.radius.sm,
			"&:hover": {
				backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[3]
			},

			// Dynamic media queries, define breakpoints in theme, use anywhere
			[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
				// Type safe child reference in nested selectors via ref
				[`& .${child}`]: {
					fontSize: theme.fontSizes.xs
				}
			}
		},

		child: {
			// assign ref to element
			ref: child,
			backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
			boxShadow: theme.shadows.md,
			color: theme.colorScheme === "dark" ? theme.white : theme.black
		}
	};
});

type Props = {
	image?: boolean;
	alt: string;
	title: string;
	disabled: boolean;
	icon?: React.ReactNode;
};

export default function Card({ image, alt, title, disabled, icon }: Props) {
	const { classes } = useStyles();
	return (
		<div
			className={classes.wrapper}
			style={{
				opacity: disabled ? 0.3 : 1,
				cursor: disabled ? "not-allowed" : "pointer"
			}}>
			{image && (
				<Avatar
					className={classes.child}
					radius='xs'
					size='xl'
					src={title === "Waldo" ? WaldoImg : WizardImg}
					alt={alt}
				/>
			)}
			{icon && icon}
			<div>
				<Title order={3}>{title}</Title>
				<Text>{alt}</Text>
			</div>
		</div>
	);
}
