import 'vite/modulepreload-polyfill';
import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Play } from './pages/Play/index.jsx';
import { Tournament } from './pages/Tournament/index.jsx';
import { Shop } from './pages/Shop/index.jsx';
import { Login } from './pages/Auth/Login.jsx';
import { NotFound } from './pages/_404.jsx';
import { BVAmbient } from './scripts/bvambient.js';
import './index.css';

export function App() {
	document.addEventListener("DOMContentLoaded", function() {
		var demo1 = new BVAmbient({
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
		});
	});
	return (
		<div id="ambient" class="w-screen h-screen bg-gradient-to-br from-[#0D011D] to-black p-8 background-animate flex flex-col items-center">
			<LocationProvider>
				<Header />
				<main class="z-50">
					<Router>
						<Route path="/" component={Play} />
						<Route path="/login" component={Login} />
						<Route path="/tournament" component={Tournament} />
						<Route path="/play" component={Play} />
						<Route path="/shop" component={Shop} />
						{/*<Route path="/signup" component={Signup} />*/}
						<Route default component={NotFound} />
					</Router>
				</main>
			</LocationProvider>
		</div>
	);
}

render(<App />, document.getElementById('app'));
