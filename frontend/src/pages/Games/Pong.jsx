import React, { useState, useEffect } from 'react';
import { useLocation } from 'preact-iso';
import { Card } from '../../components/utils/Card';
import { CTA } from '../../components/utils/CTA';
import { Chat } from '../../components/Chat/Chat';
import { language } from '../../scripts/languages';
import init, { start } from 'pong-client';

export function Pong({ profile, lang }) {
	const [mode, setMode] = useState("bot");
	const loc = useLocation();

	useEffect(() =>
		init().then(start), [])

  return (
		<div className="bg-black flex flex-col w-screen h-screen justify-center items-center absolute overflow-hidden">
			<h1 id="current-score" className="z-50 hidden absolute top-4 text-6xl font-semibold">4 - 1</h1>
			<Card id="popUpPlay" className="absolute z-50 p-4 px-16 flex flex-col items-center">
				<h1 className="font-semibold text-4xl mb-4">PONG</h1>
				<p className="mb-2">{language.play_against[lang]}</p>
				<div className="flex mb-4">
					<div onClick={() => setMode("bot")} className={`${mode == "bot" ? "bg-white text-black font-semibold" : ""} mr-2 rounded px-4 py-2 border-2 border-white transition-all cursor-pointer`}>{language.bot[lang]}</div>
					<div onClick={() => setMode("player")} className={`${mode == "player" ? "bg-white text-black font-semibold" : ""} ml-2 rounded px-4 py-2 border-2 border-white transition-all cursor-pointer`}>{language.player[lang]}</div>
				</div>
				<CTA id="play-button" name={mode}>Play!</CTA>
			</Card>
			<h1 id="popup-start-play" className="z-50 hidden absolute top-10 text-6xl font-semibold">Right Side</h1>
			<Card id="popUpScore" className="absolute z-50 p-4 px-8 hidden flex-col items-center">
				<h1 id="winner" className="font-semibold text-4xl">BOLVIC WIN</h1>
				<hr className="w-4/5 my-2" />
				<p id="final-score" className="mb-2 font-semibold text-2xl">4 - 1</p>
				<div className="flex">
					<CTA id="replay-button" name={mode}>Play again</CTA>
					<a className='ml-2' href="/play"><CTA>Home</CTA></a>
				</div>
			</Card>
			<canvas id="canvas" width="1920px" height="1440px" className="h-screen flex items-center justify-center">
				<h1>Pong</h1>
			</canvas>
			<Chat profile={profile} />
		</div>
  );
}
