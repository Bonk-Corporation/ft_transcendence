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
		<div>
			<h1>Play</h1>
			{ me ? <h1>{me.username} le goat</h1>
				 : <h1>Please log in!!!!!</h1>}
		</div>
	);
}
