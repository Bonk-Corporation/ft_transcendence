import React, { useState } from 'react';
import { Card } from '../../components/utils/Card';
import { CTA } from '../../components/utils/CTA';

export function Pong() {
	const [popUp, setPopUp] = useState(true);
	const [mode, setMode] = useState("bot");

	/*
	parametres de jeu : jouer contre ennemi ou bot
	*/

  return (
		<>
		{
			popUp ? 
			<Card className="absolute z-50 p-4 px-16 flex flex-col items-center">
				<h1 className="font-semibold text-4xl mb-4">PONG</h1>
				<p className="mb-2">Play against</p>
				<div className="flex mb-4">
					<div onClick={() => setMode("bot")} className={`${mode == "bot" ? "bg-white text-black font-semibold" : ""} mr-2 rounded px-4 py-2 border-2 border-white transition-all cursor-pointer`}>Bot</div>
					<div onClick={() => setMode("player")} className={`${mode == "player" ? "bg-white text-black font-semibold" : ""} ml-2 rounded px-4 py-2 border-2 border-white transition-all cursor-pointer`}>Player</div>
				</div>
				<CTA>Play!</CTA>
			</Card> : null
		}
		<canvas className="w-screen h-screen absolute bg-[#111111]">
			<h1>Pong</h1>
		</canvas>
		</>
  );
}
