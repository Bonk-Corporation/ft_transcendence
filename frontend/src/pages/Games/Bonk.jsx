import React, { useState, useContext, useEffect } from 'react';
import { Card } from '../../components/utils/Card';
import { CTA } from '../../components/utils/CTA';
import { Chat } from '../../components/Chat/Chat';
import { language } from '../../scripts/languages';

import { ProfileContext, LangContext } from '../../Contexts';
import './bonk.css';
  
  export function Bonk() {
      const [popUp, setPopUp] = useState(true);
      const [mode, setMode] = useState("bot");
      const [htmlContent, setHtmlContent] = useState('');
      const [playClicked, setPlayClicked] = useState(false);
      const profile = useContext(ProfileContext);
      const lang = useContext(LangContext);
      const [error, setError] = useState('');
      

    useEffect(async () => {
        if (!document.getElementById("pakoScript")) {
            let pakoScript = document.createElement('script');
            pakoScript.id = "pakoScript";
            pakoScript.src = "/static/pako_inflate.min.js";
            document.body.appendChild(pakoScript);
            await new Promise(r => setTimeout(r, 100));
        }

	    function handleClick() {
            fetch(`/api/bonk/join`)
              .then(res => res.json().then(data => {
                  if (data.error)
                    setError(data.error);
                  else
                    setPopUp(false);
            }));
        }

        if (!document.getElementById("bonkScript")) {
            let bonkScript = document.createElement('script');
            bonkScript.id = "bonkScript";
            bonkScript.src = "/static/bonk-client.js";
            document.body.appendChild(bonkScript);
            await new Promise(r => setTimeout(r, 100));
        }

        if (!document.getElementById("bonkStatusScript")) {
            let bonkStatusScript = document.createElement('script');
            bonkStatusScript.id = "bonkStatusScript";
            bonkStatusScript.src = "/static/status.js";
            document.body.appendChild(bonkStatusScript);
        }

        document.getElementById("status").innerHTML =
            `<div id="status-progress" style="display: none;" oncontextmenu="event.preventDefault();">
				<div id ="status-progress-inner"></div>
			</div>
			<div id="status-indeterminate" style="display: none;" oncontextmenu="event.preventDefault();">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<div id="status-notice" class="godot" style="display: none;"></div>`
    }, []);

    const handlePlayClick = () => {
        setPopUp(false);
        setPlayClicked(true);
    };

    return (
        <>
            {popUp ? (
                <Card className="absolute z-50 p-4 px-16 flex flex-col items-center">
                    <h1 className="font-semibold text-4xl mb-4">BONK</h1>
                    <CTA onClick={handlePlayClick}>{language.play[lang]}</CTA>
                </Card>
            ) : null}
            <canvas id="canvas" style={{ display: playClicked ? 'block' : 'none' }}>
                HTML5 canvas appears to be unsupported in the current browser.
                Please try updating or use a different browser.
            </canvas>
            <div id="status"></div>
            <Chat />
        </>
    );
}
