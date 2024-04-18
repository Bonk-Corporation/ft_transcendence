import '../../index.css';
import { useState, useEffect } from 'preact/hooks';

export function Play() {
	const [me, setMe] = useState(null);

	useEffect(() => {
		if (me == null)
			fetch("/api/me").then(res => res.json().then(data => {
				setMe(data);
			}));
	});

	return (
<<<<<<< HEAD:frontend/src/pages/Home/index.jsx
		<div class="home">
			{ me ? <h1 class="font-bold">{me.username} le goat</h1>
=======
		<div>
			<h1>Play</h1>
			{ me ? <h1>{me.username} le goat</h1>
>>>>>>> 47e8e36 (~ | Modify some paths):frontend/src/pages/Play/index.jsx
				 : <h1>Please log in!!!!!</h1>}
		</div>
	);
}
