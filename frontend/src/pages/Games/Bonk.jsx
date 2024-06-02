import React, { useState, useContext } from 'react';
import { Card } from '../../components/utils/Card';
import { CTA } from '../../components/utils/CTA';
import { Chat } from '../../components/Chat/Chat';
import { language } from '../../scripts/languages';
import { ProfileContext, LangContext } from '../../Contexts';

export function Bonk() {
	const [popUp, setPopUp] = useState(true);
	const [mode, setMode] = useState("bot");
  const [error, setError] = useState("");

	const profile = useContext(ProfileContext);
	const lang = useContext(LangContext);

	function handleClick() {
    fetch(`/api/bonk/join`)
      .then(res => res.json().then(data => {
          if (data.error)
            setError(data.error);
          else
            setPopUp(false);
    }));
  }

  return (
		<>
		{
			popUp ? 
			<Card className="absolute z-50 p-4 px-16 flex flex-col items-center">
				<h1 className="font-semibold text-4xl mb-4">BONK</h1>
				<CTA onClick={handleClick}>{language.play[lang]}</CTA>
        <p className="text-sm text-red-500">{error}</p>
			</Card> : null
		}
			<canvas className="w-screen h-screen absolute bg-[#111111]">
				<h1>Bonk</h1>
			</canvas>
			<Chat/>
		</>
  );
}
