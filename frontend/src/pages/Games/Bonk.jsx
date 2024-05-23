import React, { useState } from 'react';
import { Card } from '../../components/utils/Card';
import { CTA } from '../../components/utils/CTA';
import { Chat } from '../../components/Chat/Chat';

export function Bonk({ profile }) {
	const [popUp, setPopUp] = useState(true);
	const [mode, setMode] = useState("bot");

	/*
	parameters de jeu : jouer contre ennemi ou bot
	*/

  return (
		<>
		{
			popUp ? 
			<Card className="absolute z-50 p-4 px-16 flex flex-col items-center">
				<h1 className="font-semibold text-4xl mb-4">BONK</h1>
				<CTA>Play!</CTA>
			</Card> : null
		}
			<canvas className="w-screen h-screen absolute bg-[#111111]">
				<h1>Bonk</h1>
			</canvas>
			<Chat profile={profile} />
		</>
  );
}
