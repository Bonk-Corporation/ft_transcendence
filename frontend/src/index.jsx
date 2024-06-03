import 'vite/modulepreload-polyfill';
import './style.css';
import { render } from 'preact';
import { LocationProvider, Router, Route, useLocation } from 'preact-iso';

import { Navbar } from './components/Navbar/Navbar.jsx';
import { Play } from './pages/Play/index.jsx';
import { Room } from './pages/Tournament/Room.jsx';
import { Menu } from './pages/Tournament/Menu.jsx';
import { Shop } from './pages/Shop/index.jsx';
import { Login } from './pages/Auth/Login.jsx';
import { NotFound } from './pages/_404.jsx';
import { BVAmbient } from './scripts/bvambient.js';
import { Profile } from './pages/Profile/index.jsx';
import { Signup } from './pages/Auth/Signup';
import { Pong } from './pages/Games/Pong';
import { Bonk } from './pages/Games/Bonk';
import { useEffect, useState } from 'preact/hooks';
import { LegalNotice } from './pages/LegalNotice/LegalNotice';
import { ProfileContext, LangContext } from './Contexts';

export function App() {
	const [profile, setProfile] = useState(null);
	const [triedLog, setTriedLog] = useState(false);
	const [lang, setLang] = useState('en');

	function fetchProfile() {
		fetch("/api/me").then(res => res.json().then(data => {
			setProfile(data);
			setTriedLog(true);
		}));
	}
		
	useEffect(() => {
		if (profile == null) {
			fetchProfile();
		}

		var particles = new BVAmbient({
			selector: "#ambient",
			fps: 60,
			max_transition_speed: 20000,
			min_transition_speed: 10000,
			particle_number: 100,
			particle_maxwidth: 30,
			particle_minwidth: 10,
			particle_radius: 50,
			particle_opacity: true,
			particle_colision_change: false,
			particle_background: "#331e4b",
			refresh_onfocus: false,
		});

		fetch("/api/ping");
		const intervalId = setInterval(() => {
			fetch("/api/ping");
		}, 5000);
		return () => clearInterval(intervalId);
	}, []);


	return (
		<div id="ambient" className="w-screen min-h-screen bg-gradient-to-br from-[#0D011D] to-black p-8 background-animate flex flex-col items-center overflow-hidden">
			<LocationProvider>
				<ProfileContext.Provider value={profile}>
					<LangContext.Provider value={lang}>
						<Navbar setLang={setLang} triedLog={triedLog} />
						<main className="w-screen h-full z-50 flex-1 flex flex-col justify-center items-center px-10">
							<Router>
								<Route path="/" component={() => <Login setTriedLog={setTriedLog} />} />
								<Route path="/signup" component={() => <Signup setTriedLog={setTriedLog} />} />
								<Route path="/play" component={Play} />
								<Route path="/tournament" component={() => <Menu />} />
								<Route path="/tournament/room" component={() => <Room />} />
								<Route path="/shop" component={() => <Shop fetchProfile={fetchProfile} />} />
								<Route path="/profile" component={() => <Profile fetchProfile={fetchProfile} setProfile={setProfile} setTriedLog={setTriedLog} />} />
								<Route path="/pong" component={() => <Pong />} />
								<Route path="/bonk" component={() => <Bonk />} />
								<Route path="/legal-notice" component={LegalNotice} />
								<Route default component={() => <NotFound />} />
							</Router>
						</main>
					</LangContext.Provider>
				</ProfileContext.Provider>
			</LocationProvider>
		</div>
	);
}

render(<App />, document.getElementById('app'));
