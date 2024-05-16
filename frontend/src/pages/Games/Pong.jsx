import React, { useState, useEffect } from 'react';
import { Card } from '../../components/utils/Card';
import { CTA } from '../../components/utils/CTA';
import { Chat } from '../../components/Chat/Chat';
import { language } from '../../scripts/languages';
import {start} from 'http://localhost:5173/static/pong-client/pkg';

export function Pong({ profile, lang }) {
	const [popUp, setPopUp] = useState(true);
	const [mode, setMode] = useState("bot");

	/*
	parameters de jeu : jouer contre ennemi ou bot
	*/
	useEffect(() => {
		import ('../../../pong-client/pkg').catch(console.error);
	}, [])

  return (
		<>
		{
			popUp ? 
			<Card className="absolute z-50 p-4 px-16 flex flex-col items-center">
				<h1 className="font-semibold text-4xl mb-4">PONG</h1>
				<p className="mb-2">{language.play_against[lang]}</p>
				<div className="flex mb-4">
					<div onClick={() => setMode("bot")} className={`${mode == "bot" ? "bg-white text-black font-semibold" : ""} mr-2 rounded px-4 py-2 border-2 border-white transition-all cursor-pointer`}>{language.bot[lang]}</div>
					<div onClick={() => setMode("player")} className={`${mode == "player" ? "bg-white text-black font-semibold" : ""} ml-2 rounded px-4 py-2 border-2 border-white transition-all cursor-pointer`}>{language.player[lang]}</div>
				</div>
				<CTA id="play-button" name={mode}>{language.play[lang]}!</CTA>
			</Card> : null
		}
			<canvas className="w-screen h-screen absolute">
				<h1>Pong</h1>
			</canvas>
			<Chat profile={profile} lang={lang} />
		</>
  );
}
