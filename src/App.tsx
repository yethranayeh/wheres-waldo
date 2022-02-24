/** @format */

import { useEffect, useState } from "react";
import {
	ColorSchemeProvider,
	MantineProvider,
	AppShell,
	Burger,
	Header,
	MediaQuery,
	Navbar,
	Paper,
	ScrollArea,
	Text,
	Title
} from "@mantine/core";
import { useLocalStorageValue } from "@mantine/hooks";
import { db, auth } from "./FirebaseConfig";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import ThemeButton from "./components/ThemeButton";
import Image from "./components/Image";

// onAuthStateChanged(auth, (user) => {
// 	console.log("state change is being watched");
// 	if (user) {
// 		// User is signed in, see docs for a list of available properties
// 		// https://firebase.google.com/docs/reference/js/firebase.User
// 		const uid = user.uid;
// 		console.info("User:", user);
// 		console.info("User ID:", uid);
// 		// ...
// 	} else {
// 		// User is signed out
// 		// ...
// 		console.log("User is signed out");
// 	}
// });

function App() {
	const [colorScheme, setColorScheme] = useLocalStorageValue({
		key: "mantine-color-scheme",
		defaultValue: "dark"
	});
	const toggleColorScheme = (value: any) => setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
	const [opened, setOpened] = useState(false);
	const [user, setUser] = useState(null as null | string);

	useEffect(() => {
		let isSubscribed = true;
		async function signIn() {
			try {
				const { user } = await signInAnonymously(auth);
				if (isSubscribed) {
					setUser(user.uid);
				}
			} catch (error) {
				console.error(error);
			}
		}
		signIn();
		return () => {
			isSubscribed = false;
		};
	}, []);

	return (
		<ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
			<MantineProvider theme={{ colorScheme }}>
				<Paper>
					<AppShell
						// navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
						navbarOffsetBreakpoint='sm'
						// fixed prop on AppShell will be automatically added to Header and Navbar
						fixed
						navbar={
							<Navbar
								// navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
								padding='md'
								// Breakpoint at which navbar will be hidden if hidden prop is true
								hiddenBreakpoint='sm'
								// Hides navbar when viewport size is less than value specified in hiddenBreakpoint
								hidden={!opened}
								// when viewport size is less than theme.breakpoints.sm navbar width is 100%
								// viewport size > theme.breakpoints.sm – width is 300px
								// viewport size > theme.breakpoints.lg – width is 400px
								width={{ sm: 300, lg: 400 }}>
								<Navbar.Section>
									<Title order={2}>What to Find:</Title>
								</Navbar.Section>
								<Navbar.Section grow mt={"lg"}>
									<Text>Images</Text>
									<Text></Text>
								</Navbar.Section>
								<Navbar.Section>
									{user && (
										<Text
											color='dimmed'
											style={{
												display: "flex",
												justifyContent: "center",
												alignItems: "baseline",
												gap: "5px",
												fontSize: "0.8rem"
											}}>
											Guest: {user}
										</Text>
									)}
									<Text
										mt='sm'
										style={{
											display: "flex",
											justifyContent: "center",
											alignItems: "baseline",
											gap: "5px"
										}}>
										<Text inherit component='span' align='center'>
											Made with ❤ for
										</Text>{" "}
										<Text
											inherit
											component='a'
											href='https://www.theodinproject.com'
											align='center'
											variant='gradient'
											gradient={{ from: "yellow", to: "orange", deg: 70 }}
											size='xl'
											weight={700}
											style={{ fontFamily: "Greycliff CF, sans-serif" }}>
											The Odin Project
										</Text>
									</Text>
								</Navbar.Section>
							</Navbar>
						}
						header={
							<Header className='App__Header' height={70} padding='md'>
								{/* Handle other responsive styles with MediaQuery component or createStyles function */}
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
									<MediaQuery largerThan='sm' styles={{ display: "none" }}>
										<Burger opened={opened} onClick={() => setOpened((o) => !o)} size='sm' />
									</MediaQuery>

									<Title
										order={1}
										sx={{
											"@media (max-width: 768px)": {
												fontSize: "1.8rem"
											},
											"@media (max-width: 350px)": {
												fontSize: "1.5rem"
											}
										}}>
										Where's{" "}
										<Text
											inherit
											component='span'
											align='center'
											variant='gradient'
											gradient={{ from: "red", to: "grape", deg: 45 }}
											size='xl'
											weight={700}
											style={{ fontFamily: "Greycliff CF, sans-serif" }}>
											Waldo?
										</Text>
									</Title>
									<ThemeButton />
								</div>
							</Header>
						}>
						<ScrollArea type='always' offsetScrollbars scrollbarSize={24}>
							<div
								className='App'
								style={{
									width: "1920px"
								}}>
								<Image />
							</div>
						</ScrollArea>
					</AppShell>
				</Paper>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}

export default App;
