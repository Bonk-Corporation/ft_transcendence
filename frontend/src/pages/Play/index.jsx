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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD:frontend/src/pages/Home/index.jsx
		<div class="home">
			{ me ? <h1 class="font-bold">{me.username} le goat</h1>
=======
		<div>
			<h1>Play</h1>
			{ me ? <h1>{me.username} le goat</h1>
>>>>>>> 47e8e36 (~ | Modify some paths):frontend/src/pages/Play/index.jsx
				 : <h1>Please log in!!!!!</h1>}
=======
		<div class="flex flex-col h-full items-center justify-self-center py-40">
			<div class="w-screen max-w-[1000px] h-full flex">
=======
		<div class="flex flex-col h-full items-center justify-self-center">
			<div class="w-screen max-w-[1000px] h-96 flex">
>>>>>>> 188b980 (+ | Add shop!!!)
				<div class="w-1/2 rounded h-full bg-red-500 mx-4 hover:w-3/4 transition-all">

				</div>
				<div class="w-1/2 rounded h-full bg-blue-500 mx-4 hover:w-3/4 transition-all">

				</div>
=======
		<div className="flex flex-col h-full items-center justify-self-center">
			<div className="w-screen max-w-[1000px] h-96 flex">
				<a href="/pong" className="w-1/2 flex justify-center py-4 rounded h-full bg-red-500 mx-4 hover:w-3/4 transition-all">
					Pong
				</a>
				<a href="/bonk" className="w-1/2 flex justify-center py-4 rounded h-full bg-blue-500 mx-4 hover:w-3/4 transition-all">
					Bonk
				</a>
>>>>>>> 3627c31 (+ | Add access to games)

			</div>
>>>>>>> 9f34f5d (+ | Add a play menu without games)
		</div>
	);
}
