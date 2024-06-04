import { useEffect, useState } from "preact/hooks";

export function Play() {
	const [citation, setCitation] = useState(null);

	useEffect(() => {
		fetch("/api/citation").then(res => res.json().then(data => {
			if (!data.error)
				setCitation(data)
		}));

		if (!document.getElementById("lottie")) {
			const scriptEl = document.createElement('script');

			scriptEl.id = "lottie";
			scriptEl.src = "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
			scriptEl.type = "module";

			document.body.appendChild(scriptEl);
		}

		const anchorPong = document.getElementById('anchor-pong');
		const anchorBonk = document.getElementById('anchor-bonk');
		
		const dotlottie =`<dotlottie-player class="
								relative bottom-28
								opacity-0 group-hover:opacity-100
								transition-all ease-in-out
								h-[35rem] w-full"
							src="/assets/flame.json" background="transparent" speed="1" loop autoplay></dotlottie-player>`;
		
		const dotlottieBlue =`<dotlottie-player class="
							relative bottom-28
							opacity-0 group-hover:opacity-100
							transition-all ease-in-out
							h-[35rem] w-full"
						src="/assets/blue_flame.json" background="transparent" speed="1" loop autoplay></dotlottie-player>`;
		anchorPong.innerHTML += dotlottie;
		anchorBonk.innerHTML += dotlottieBlue;
	}, [])
	
	return (
		<div className="flex flex-col h-full items-center justify-self-center">
			{citation ? <h1 className="text-lg mb-4 text-center max-w-[1000px]">❝{citation.citation}❞ - {citation.username}</h1> : null}
			<div className="w-screen max-w-[1000px] h-96 flex">
				<a id="anchor-pong" href="/pong" className="w-1/2 flex flex-col items-center rounded h-full bg-red-500 mx-4 hover:w-3/4 transition-all overflow-hidden group">
					<p className="absolute mt-4 transition-all ease-in-out group-hover:text-9xl font-semibold">Pong</p>
				</a>
				<a id="anchor-bonk" href="/bonk" className="w-1/2 flex flex-col items-center rounded h-full bg-blue-500 mx-4 hover:w-3/4 transition-all overflow-hidden group">
					<p className="absolute mt-4 transition-all ease-in-out group-hover:text-9xl font-semibold">Bonk</p>

				</a>
			</div>
		</div>
	);
}
