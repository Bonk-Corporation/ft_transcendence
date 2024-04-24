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
		<div class="flex flex-col h-full items-center justify-self-center">
			<div class="w-screen max-w-[1000px] h-96 flex">
				<div class="w-1/2 rounded h-full bg-red-500 mx-4 hover:w-3/4 transition-all">

				</div>
				<div class="w-1/2 rounded h-full bg-blue-500 mx-4 hover:w-3/4 transition-all">

				</div>

			</div>
		</div>
	);
}
