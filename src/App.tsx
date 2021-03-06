/** @format */

import { useEffect, useState, useRef } from "react";
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
	Title,
	Code,
	Menu,
	Avatar,
	Button,
	ActionIcon
} from "@mantine/core";
import { useLocalStorageValue, useMouse } from "@mantine/hooks";
import { NotificationsProvider, useNotifications } from "@mantine/notifications";
import { db, auth } from "./FirebaseConfig";
import { signInAnonymously } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { VscError } from "react-icons/vsc";
import { TiTick } from "react-icons/ti";
import { GiPartyPopper } from "react-icons/gi";
import { BsGithub } from "react-icons/bs";
import WaldoImg from "./images/avt_waldo.png";
import WizardImg from "./images/avt_wizard.png";
import ThemeButton from "./components/ThemeButton";
import Image from "./components/Image";
import Card from "./components/Card";

type Bounds = {
	xStart: number;
	xEnd: number;
	yStart: number;
	yEnd: number;
};

export default function App() {
	const [colorScheme, setColorScheme] = useLocalStorageValue({
		key: "mantine-color-scheme",
		defaultValue: "dark"
	});
	const toggleColorScheme = (value: any) => setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

	return (
		<ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
			<MantineProvider theme={{ colorScheme }}>
				<NotificationsProvider autoClose={3000} limit={2}>
					<MyApp />
				</NotificationsProvider>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}

function MyApp() {
	const notifications = useNotifications();
	const [user, setUser] = useState(null as null | string);
	const [gameStarted, setGameStarted] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [navbarOpened, setNavbarOpened] = useState(false);
	const [menuOpened, setMenuOpened] = useState(false);
	const [foundWaldo, setFoundWaldo] = useState(false);
	const [foundWizard, setFoundWizard] = useState(false);
	const [timer, setTimer] = useState(0);

	// Track mouse movement
	const { ref: mouseRef, x: mouseX, y: mouseY } = useMouse();
	const mouseLocRef = useRef({ x: 0, y: 0 });

	async function handleMenuClick(character: string) {
		const mX = mouseLocRef.current.x;
		const mY = mouseLocRef.current.y;
		try {
			// Capitalize the first letter of character
			const charName = character[0].toUpperCase() + character.slice(1);
			const bounds = await getCharacterBounds(character);
			const withinBounds = isWithinBounds(mX, mY, bounds);
			if (withinBounds) {
				if (character === "waldo") {
					setFoundWaldo(true);
				} else {
					setFoundWizard(true);
				}
				notifications.showNotification({
					title: "Congratulations!",
					message: `You found ${charName}!`,
					color: "green",
					icon: <TiTick />
				});
			} else {
				notifications.showNotification({
					title: "Oops!",
					message: `You missed ${charName}!`,
					color: "red",
					icon: <VscError />
				});
			}
		} catch (error) {
			throw new Error(error as any);
		}
	}

	async function getCharacterBounds(character: string) {
		try {
			const characterRef = doc(db, "locations", character);
			const docSnap = await getDoc(characterRef);
			const data = docSnap.data() as Bounds;
			return { xStart: data.xStart, xEnd: data.xEnd, yStart: data.yStart, yEnd: data.yEnd };
		} catch (error) {
			throw new Error(error as any);
		}
	}

	function isWithinBounds(x: number, y: number, bounds: Bounds) {
		return x >= bounds.xStart && x <= bounds.xEnd && y >= bounds.yStart && y <= bounds.yEnd;
	}

	useEffect(() => {
		let isSubscribed = true;
		async function signIn() {
			try {
				const { user } = await signInAnonymously(auth);
				if (isSubscribed) {
					setUser(user.uid);
				}
			} catch (error) {
				console.error(error, "\nYou may be offline. Please check your internet connection.");
			}
		}
		signIn();
		return () => {
			isSubscribed = false;
		};
	}, []);

	useEffect(() => {
		if (foundWaldo && foundWizard) {
			setTimeout(() => {
				setGameOver(true);
			}, 5000);
			notifications.showNotification({
				title: "Congratulations!",
				message: `You found all the characters in ${timer} seconds!`,
				color: "teal",
				autoClose: 5000,
				icon: <GiPartyPopper />
			});
		}
	}, [foundWaldo, foundWizard]);

	return (
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
						hidden={!navbarOpened}
						// when viewport size is less than theme.breakpoints.sm navbar width is 100%
						// viewport size > theme.breakpoints.sm ??? width is 300px
						// viewport size > theme.breakpoints.lg ??? width is 400px
						width={{ sm: 300, lg: 400 }}>
						<Navbar.Section>
							<Title order={2}>Who to Find:</Title>
						</Navbar.Section>
						{(!foundWaldo || !foundWizard) && (
							<Navbar.Section grow mt={"lg"}>
								<Card title='Waldo' alt='Waldo' image={true} disabled={foundWaldo} />
								<Card title='Wizard Whitebeard' alt='Wizard Whitebeard' image={true} disabled={foundWizard} />
							</Navbar.Section>
						)}
						{foundWaldo && foundWizard && (
							<Navbar.Section grow mt={"lg"}>
								<Card
									title='Congratulations!'
									alt='You have found all the characters!'
									icon={
										<TiTick
											style={{
												fontSize: "2rem",
												color: "green",
												border: "1px solid green",
												borderRadius: "10px",
												margin: "5px"
											}}
										/>
									}
									disabled={false}
								/>
							</Navbar.Section>
						)}
						<Navbar.Section>
							<Text
								size='xl'
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "baseline",
									gap: "5px",
									margin: "16px"
								}}>
								Time: {gameStarted ? timer : "00:00:00"}
							</Text>

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
									Made with ??? for
								</Text>{" "}
								<Text
									inherit
									component='a'
									href='https://www.theodinproject.com'
									align='center'
									variant='gradient'
									gradient={{ from: "yellow", to: "orange", deg: 70 }}
									size='xl'
									weight={700}>
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
								<Burger opened={navbarOpened} onClick={() => setNavbarOpened((o) => !o)} size='sm' />
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
									weight={700}>
									Waldo?
								</Text>
							</Title>
							<div
								style={{
									display: "flex",
									gap: "10px"
								}}>
								<ActionIcon component='a' href='https://github.com/yethranayeh/' target='_blank' variant='outline'>
									<BsGithub />
								</ActionIcon>
								<ThemeButton />
							</div>
						</div>
					</Header>
				}>
				{!gameStarted && (
					<div
						style={{
							width: "100%",
							display: "flex",
							justifyContent: "center",
							alignItems: "center"
						}}>
						<Button
							size='lg'
							uppercase
							variant='gradient'
							gradient={{ from: "teal", to: "lime", deg: 105 }}
							onClick={() => {
								setGameStarted(true);
							}}>
							Start
						</Button>
					</div>
				)}
				{!gameOver ? (
					<ScrollArea type='always' offsetScrollbars scrollbarSize={24}>
						<div
							ref={mouseRef}
							className='App'
							style={{
								width: "1920px",
								pointerEvents: gameStarted ? "auto" : "none"
							}}
							onClick={(e) => {
								setMenuOpened(!menuOpened);
								if (!menuOpened) {
									// Only changes the mouse position if the menu is closed to prevent the mouse position from jumping to menu element location after clicking on the menu
									mouseLocRef.current = { x: mouseX, y: mouseY };
								}
							}}>
							<Menu
								control={
									gameStarted ? (
										<div
											style={{
												boxSizing: "border-box",
												opacity: menuOpened ? "0" : "1",
												position: "absolute",
												top: `${mouseY - 35}px`,
												left: `${mouseX - 35}px`,
												zIndex: "99",
												width: "60px",
												height: "60px",
												background: "transparent",
												border: "5px solid #fefefe",
												borderRadius: "10px",
												boxShadow: "0 0 5px 2px #333, 0 0 5px 1px #333 inset",
												transition: "opacity 250ms ease-out"
											}}></div>
									) : (
										<div></div>
									)
								}
								placement='center'
								opened={menuOpened}
								onOpen={() => setMenuOpened(true)}
								onClose={() => setMenuOpened(false)}
								transition='scale'
								transitionDuration={250}
								transitionTimingFunction='ease-out'>
								<Menu.Item icon={<Avatar src={WaldoImg} />} onClick={() => handleMenuClick("waldo")}>
									<Title order={4}>Waldo</Title>
								</Menu.Item>
								<Menu.Item icon={<Avatar src={WizardImg} />} onClick={() => handleMenuClick("wizard")}>
									<Title order={4}>Wizard Whitebeard</Title>
								</Menu.Item>
							</Menu>
							<Image />
						</div>
					</ScrollArea>
				) : (
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "100vh",
							overflow: "hidden"
						}}>
						<Button
							variant='gradient'
							gradient={{ from: "teal", to: "blue", deg: 60 }}
							size='xl'
							uppercase
							onClick={() => {
								location.reload();
							}}>
							Restart
						</Button>
					</div>
				)}
			</AppShell>
		</Paper>
	);
}
