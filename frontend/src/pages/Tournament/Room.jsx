import React, { useRef, useState } from 'react';
import { CTA } from '../../components/utils/CTA';
import { PlayerCard } from '../../components/Tournament/PlayerCard';
import { PopUp } from '../../components/utils/PopUp';
import { Input } from '../../components/utils/Input';
import { language } from '../../scripts/languages';

export function Room(props) {
  const [active, setActive] = useState("");
  const inputRef = useRef(null);
  const admin = "DinoMalin";

  const players = [
    {
      name: "DinoMalin",
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
    {
      name: "ndavenne",
      avatar: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Noah_mosaic.JPG",
      level: 666
    },
    {
      name: "ndavenne",
      avatar: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Noah_mosaic.JPG",
      level: 666
    }
  ]

  const [popUp, setPopUp] = useState(false);

  function clear() {
    inputRef.current.value = "";
  }

  function handleClick() {
    setPopUp(false);
    inputRef.current.value = "";
  }

  function enter(e) {
    if (e.key == 'Enter')
      handleClick();
  }

  return (
    <div className="w-full flex justify-center h-[40rem]">
      <PopUp onKeyPress={enter} clear={clear} active={popUp} setActive={setPopUp} className="flex flex-col items-center">
        <h1 className="font-semibold text-xl">{language.add_user[props.lang]}</h1>
        <Input ref={inputRef} className="rounded-full bg-[#4f4f4f] mb-4 mt-2" placeholder={language.search_someone[props.lang]} />
        <CTA onClick={handleClick}>{language.invite[props.lang]}</CTA>
      </PopUp>
      <div className="h-full w-4/6 flex flex-col items-center">
        <div className="h-full w-full flex overflow-hidden rounded">
          <div onClick={() => setActive("Pong")} className={`${active == "Pong" ? "border-4 border-white" : ""} h-full w-1/3 hover:w-1/2 bg-red-500 transition-all ease-in-out flex justify-center py-4 text-xl`}>Pong</div>
          <div onClick={() => setActive("Ponk")} className={`${active == "Ponk" ? "border-4 border-white" : ""} h-full w-1/3 hover:w-1/2 bg-blue-500 transition-all ease-in-out flex justify-center py-4 text-xl`}>Ponk</div>
          <div onClick={() => setActive("Bonk")} className={`${active == "Bonk" ? "border-4 border-white" : ""} h-full w-1/3 hover:w-1/2 bg-green-500 transition-all ease-in-out flex justify-center py-4 text-xl`}>Bonk</div>
        </div>
        <div className="my-4 flex items-center justify-center">
          <button onClick={() => {setPopUp(true)}} className='mr-2 px-12 py-3 bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all ease-in-out'><i className="fa-solid fa-link mr-2"></i>{language.invite[props.lang]}</button>
          <CTA className='ml-2 px-12 py-3 border-2 border-white hover:border-gray-300'><i className="fa-solid fa-play mr-2"></i>{language.play[props.lang]}</CTA>
        </div>
      </div>

      <div className="ml-4 down-gradient overflow-auto h-full px-2 overflow-x-hidden">
        {players.map((player) => <PlayerCard lang={props.lang} profile={player} admin={player.name == admin}/>)}
      </div>
    </div>
  );
}
