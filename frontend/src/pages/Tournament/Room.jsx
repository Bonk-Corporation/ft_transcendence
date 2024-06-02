import React, { useRef, useState, useEffect } from 'react';
import { CTA } from '../../components/utils/CTA';
import { PlayerCard } from '../../components/Tournament/PlayerCard';
import { PopUp } from '../../components/utils/PopUp';
import { Input } from '../../components/utils/Input';
import { language } from '../../scripts/languages';

export function Room(props) {
  const [active, setActive] = useState("");
  const [priv, setPriv] = useState(false);
  const inputRef = useRef(null);
  const room = {
    players: [
      {
        name: "jcario",
        avatar: "https://i.pinimg.com/236x/9d/58/d1/9d58d1fba36aa76996b5de3f3d233d22.jpg",
        level: 18
      },
      {
        name: "FeuilleMorte",
        avatar: "https://i.ytimg.com/vi/lX7ofuGJl6Y/hqdefault.jpg",
        level: 4
      },
      {
        name: "Feur",
        avatar: "https://www.itadori-shop.com/cdn/shop/articles/Satoru-Hollow-Purple-e1615636661895_1200x1200.jpg?v=1634757049",
        level: 42
      },
      {
        name: "Bolvic",
        avatar: "https://user-images.githubusercontent.com/8974888/231858967-7c37bf1e-335b-4f5a-9760-da97be9f54bb.png",
        level: 21
      },
      {
        name: "MaxMaxicoMax",
        avatar: "https://s2.coinmarketcap.com/static/img/coins/200x200/23095.png",
        level: 21
      },
      {
        name: "ndavenne",
        avatar: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Noah_mosaic.JPG",
        level: 666
      },
      {
        name: "ndavenne",
        avatar: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Noah_mosaic.JPG",
        level: 666
      },
      {
        name: "ndavenne",
        avatar: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Noah_mosaic.JPG",
        level: 666
      },
    ]
  }
  const admin = "jcario";



  useEffect(() => {
		if (!document.getElementById("lottie")) {
      const scriptEl = document.createElement('script');
			scriptEl.id = "lottie";
			scriptEl.src = "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
			scriptEl.type = "module";
      
			document.body.appendChild(scriptEl);
      
		}

    const anchorPong = document.getElementById('pong');
    const anchorBonk = document.getElementById('bonk');

    const dotlottie =`<dotlottie-player class="
                relative 2xl:bottom-28 xl:bottom-0 lg:bottom-[-60px]
                opacity-0 group-hover:opacity-100
                transition-all ease-in-out
                h-[46rem] w-full
                "
              src="/media/images/flame.json" background="transparent" speed="1" loop autoplay></dotlottie-player>`;
    
    const dotlottieBlue =`<dotlottie-player class="
                relative 2xl:bottom-28 xl:bottom-0 lg:bottom-[-60px]
                opacity-0 group-hover:opacity-100
                transition-all ease-in-out
                h-[46rem] w-full
                "
              src="/media/images/blue_flame.json" background="transparent" speed="1" loop autoplay></dotlottie-player>`;
    
    anchorPong.innerHTML += dotlottie;
    anchorBonk.innerHTML += dotlottieBlue;
	}, [])

  console.log(props.profile)
  return (
    <div className="w-full flex justify-center h-[40rem]">
      <div className="h-full w-2/3 flex flex-col items-center">
        <div className="h-full w-full flex overflow-hidden">
          <div id="pong" onClick={() => setActive("Pong")} className={`${active == "Pong" ? "border-4 border-white" : ""} h-full w-1/2 hover:w-3/4 mr-2 rounded bg-red-500 transition-all ease-in-out flex flex-col items-center group`}>
            <p className="absolute mt-4 transition-all ease-in-out group-hover:text-9xl font-semibold">Pong</p>
          </div>
          <div id="bonk" onClick={() => setActive("Bonk")} className={`${active == "Bonk" ? "border-4 border-white" : ""} h-full w-1/2 hover:w-3/4 ml-2 rounded bg-blue-500 transition-all ease-in-out flex flex-col items-center group`}>
            <p className="absolute mt-4 transition-all ease-in-out group-hover:text-9xl font-semibold">Bonk</p>
          </div>
        </div>
        <div className="my-4 flex items-center justify-center">
          <button onClick={() => {setPriv(!priv)}} className='mr-2 px-12 py-3 bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all ease-in-out'><i className={`fa-solid ${priv ? "fa-lock" : "fa-unlock"} mr-2`}></i>{priv ? language.private[props.lang] : language.public[props.lang]}</button>
          <CTA className='ml-2 px-12 py-3 border-2 border-white hover:border-gray-300'><i className="fa-solid fa-play mr-2"></i>{language.play[props.lang]}</CTA>
        </div>
      </div>

      <div className="ml-4 down-gradient overflow-auto h-full px-2 overflow-x-hidden">
        {
          props.profile ?
            room.players.map((player) => <PlayerCard lang={props.lang} profile={player} userIsAdmin={player.name == admin} iAmAdmin={admin == props.profile.name}/>)
            : null
        }
      </div>
    </div>
  );
}
