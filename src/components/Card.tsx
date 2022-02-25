/** @format */

import { Avatar, Title, createStyles } from "@mantine/core";

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
	imgSrc: string;
	alt: string;
	title: string;
	isFound: boolean;
};

export default function Card({ imgSrc, alt, title, isFound }: Props) {
	const { classes } = useStyles();
	return (
		<div
			className={classes.wrapper}
			style={{
				opacity: isFound ? 0.3 : 1,
				cursor: isFound ? "not-allowed" : "pointer"
			}}>
			<Avatar className={classes.child} radius='xs' size='xl' src={imgSrc} alt={alt} />
			<Title order={3}>{title}</Title>
		</div>
	);
}
