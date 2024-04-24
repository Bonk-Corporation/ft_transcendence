import 'vite/modulepreload-polyfill';
import { render } from 'preact';
import { LocationProvider, Router, Route, useLocation } from 'preact-iso';

import { Navbar } from './components/Navbar.jsx';
import { Play } from './pages/Play/index.jsx';
import { Tournament } from './pages/Tournament/index.jsx';
import { Shop } from './pages/Shop/index.jsx';
import { Login } from './pages/Auth/Login.jsx';
import { NotFound } from './pages/_404.jsx';
import { BVAmbient } from './scripts/bvambient.js';
import './index.css';
import { Profile } from './pages/Profile/index.jsx';

export function App() {
	document.addEventListener("DOMContentLoaded", function() {
		var demo1 = new BVAmbient({
			  selector: "#ambient",
			  fps: '60',
			  max_transition_speed: 20000,
			  min_transition_speed: 10000,
			  particle_number: '100',
			  particle_maxwidth: '30',
			  particle_minwidth: '10',
			  particle_radius: '50',
			  particle_opacity: true,
			  particle_colision_change: false,
			  particle_background: "#331e4b",
		});
	});

	const profile = {
		name: "DinoMalin",
		email: "dinomalin@gmail.com",
		level: 18,
		levelPercentage: 78,
		avatar: "https://i.pinimg.com/236x/9d/58/d1/9d58d1fba36aa76996b5de3f3d233d22.jpg",
		friends: [
			{
				name: "FeuilleMorte",
				avatar: "https://i.ytimg.com/vi/lX7ofuGJl6Y/hqdefault.jpg",
				level: 21
			},
			{
				name: "Feur",
				avatar: "https://www.itadori-shop.com/cdn/shop/articles/Satoru-Hollow-Purple-e1615636661895_1200x1200.jpg?v=1634757049",
				level: 42
			},
			{
				name: "FeuilleMorte",
				avatar: "https://i.ytimg.com/vi/lX7ofuGJl6Y/hqdefault.jpg",
				level: 21
			},
			{
				name: "FeuilleMorte",
				avatar: "https://i.ytimg.com/vi/lX7ofuGJl6Y/hqdefault.jpg",
				level: 21
			},
			{
				name: "FeuilleMorte",
				avatar: "https://i.ytimg.com/vi/lX7ofuGJl6Y/hqdefault.jpg",
				level: 21
			}
		],
		gameHistory: [
			{
				game: 'Pong',
				score: [4, 1],
				win: true,
			},
			{
				game: 'Bonk',
				score: [1, 4],
				win: false,
			},
			{
				game: 'Bonk',
				score: [1, 4],
				win: true,
			},
			{
				game: 'Pong',
				score: [1, 4],
				win: false,
			},
			{
				game: 'Pong',
				score: [4, 1],
				win: true,
			},
			{
				game: 'Bonk',
				score: [1, 4],
				win: false,
			},
			{
				game: 'Bonk',
				score: [1, 4],
				win: true,
			},
			{
				game: 'Pong',
				score: [1, 4],
				win: false,
			},
		]
	}

	return (
		<div id="ambient" className="w-screen h-full min-h-screen bg-gradient-to-br from-[#0D011D] to-black p-8 background-animate flex flex-col items-center overflow-hidden">
			<LocationProvider>
				<Navbar profile={profile} />
				<main className="w-screen z-50 flex-1 flex flex-col justify-center items-center px-10">
					<Router>
						<Route path="/" component={Play} />
						<Route path="/login" component={Login} />
						<Route path="/tournament" component={Tournament} />
						<Route path="/play" component={Play} />
						<Route path="/shop" component={Shop} />
						<Route path="/profile" component={() => <Profile profile={profile} />} />
						{/*<Route path="/signup" component={Signup} />*/}
						<Route default component={NotFound} />
					</Router>
				</main>
			</LocationProvider>
		</div>
	);
}

render(<App />, document.getElementById('app'));
