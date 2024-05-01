import 'vite/modulepreload-polyfill';
import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import { ChatApp } from './pages/Chat/ChatApp.jsx';
import { Login } from './pages/Auth/Login.jsx';
import { NotFound } from './pages/_404.jsx';
import './style.css';

export function App() {
	return (
		<LocationProvider>
			<Header />
			<main>
				<Router>
					<Route path="/" component={Home} />
					<Route path="/login" component={Login} />
					<Route path="/ws/chat/" component={ChatApp} />
					{/*<Route path="/signup" component={Signup} />*/}
					<Route default component={NotFound} />
				</Router>
			</main>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
