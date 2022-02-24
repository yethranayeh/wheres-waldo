/** @format */

import { useState } from "react";
import {
	ColorSchemeProvider,
	MantineProvider,
	AppShell,
	Burger,
	Header,
	MediaQuery,
	Navbar,
	Paper,
	Text,
	Title
} from "@mantine/core";
import { useLocalStorageValue } from "@mantine/hooks";
import ThemeButton from "./components/ThemeButton";

function App() {
	const [colorScheme, setColorScheme] = useLocalStorageValue({
		key: "mantine-color-scheme",
		defaultValue: "dark"
	});
	const toggleColorScheme = (value: any) => setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
	const [opened, setOpened] = useState(false);
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
								</Navbar.Section>
								<Navbar.Section>
									<Text
										style={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center"
										}}>
										Made with ❤ for The Odin Project
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
						<div className='App'>
							<h2>App</h2>
						</div>
					</AppShell>
				</Paper>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}

export default App;
