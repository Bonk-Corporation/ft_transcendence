import { useEffect, useState } from "preact/hooks";

export function Play() {
	const [citation, setCitation] = useState(null);

	useEffect(() => {
		fetch("/api/citation").then(res => res.json().then(data => {
			if (!data.error)
				setCitation(data)
		}));
	}, [])
	return (
		<div className="flex flex-col h-full items-center justify-self-center">
			{citation ? <h1 className="text-lg mb-4 text-center max-w-[1000px]">❝{citation.citation}❞ - {citation.username}</h1> : null}
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
