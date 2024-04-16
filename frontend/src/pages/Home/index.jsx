import '../../index.css';
import { useState, useEffect } from 'preact/hooks';

export function Home() {
	const [me, setMe] = useState(null);

	useEffect(() => {
		if (me == null)
			fetch("/api/me").then(res => res.json().then(data => {
				setMe(data);
			}));
	});

	return (
		<div class="home">
			{ me ? <h1 class="font-bold">{me.username} le goat</h1>
				 : <h1>Please log in!!!!!</h1>}
		</div>
	);
}
