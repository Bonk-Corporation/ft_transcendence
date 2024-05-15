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
		<div className="flex flex-col h-full items-center justify-self-center">
			<div className="w-screen max-w-[1000px] h-96 flex">
				<a href="/pong" className="w-1/2 flex justify-center py-4 rounded h-full bg-red-500 mx-4 hover:w-3/4 transition-all">
					Pong
				</a>
				<a href="/bonk" className="w-1/2 flex justify-center py-4 rounded h-full bg-blue-500 mx-4 hover:w-3/4 transition-all">
					Bonk
				</a>
			</div>
		</div>
	);
}
