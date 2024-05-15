import React, { useEffect, useRef, useState } from 'react';
import { ProfileCard } from '../../components/Profile/ProfileCard';
import { FriendCard } from '../../components/Profile/FriendCard';
import { GameCard } from '../../components/Profile/GameCard';
import { Card } from '../../components/utils/Card';
import { Stat } from '../../components/Profile/Stat';
import { PopUp } from '../../components/utils/PopUp';
import { Input } from '../../components/utils/Input';
import { CTA } from '../../components/utils/CTA';


export function Profile({profile}) {
  const [popUp, setPopUp] = useState(false);
  const [stats, setStats] = useState([
    {
      title: "Win ratio - Pong",
      labels: ["Win", "Lose"],
      colors: ["#32CD32", "#FF6961"],
      data: [
        profile ? profile.gameHistory.reduce((accumulator, game) => game.win && game.game == "Pong" ? accumulator + 1 : accumulator, 0) : 1,
        profile ? profile.gameHistory.reduce((accumulator, game) => !game.win && game.game == "Pong" ? accumulator + 1 : accumulator, 0) : 1
      ],
    },
    {
      title: "Sore ratio - Pong",
      colors: ["#79D2E6", "#FF964F"],
      labels: ["Scored", "Ceded"],
      data: [
        profile ? profile.gameHistory.reduce((accumulator, game) => game.game == "Pong" ? accumulator + game.score[0] : accumulator, 0) : 1,
        profile ? profile.gameHistory.reduce((accumulator, game) => game.game == "Pong" ? accumulator + game.score[1] : accumulator, 0) : 1
      ],
    },
    {
      title: "Win ratio - Bonk",
      colors: ["#32CD32", "#FF6961"],
      labels: ["Win", "Lose"],
      data: [
        profile ? profile.gameHistory.reduce((accumulator, game) => game.win && game.game == "Bonk" ? accumulator + 1 : accumulator, 0) : 1,
        profile ? profile.gameHistory.reduce((accumulator, game) => !game.win && game.game == "Bonk" ? accumulator + 1 : accumulator, 0) : 1
      ],
    },
    {
      title: "Sore ratio - Bonk",
      colors: ["#79D2E6", "#FF964F"],
      labels: ["Kills", "Deaths"],
      data: [
        profile ? profile.gameHistory.reduce((accumulator, game) => game.game == "Bonk" ? accumulator + game.score[0] : accumulator, 0) : 1,
        profile ? profile.gameHistory.reduce((accumulator, game) => game.game == "Bonk" ? accumulator + game.score[1] : accumulator, 0) : 1
      ],
    },
  ]);

  return (
  <div className="flex flex-col">
    <div className="flex flex-wrap items-center justify-center">
	  <div className="max-h-96">
	  	  <h1 className="font-semibold text-xl">Profile</h1>
      	  <ProfileCard profile={profile} />
    </div>

    <PopUp active={popUp} setActive={setPopUp} className="flex flex-col items-center">
      <h1 className="font-semibold text-xl">Add a friend</h1>
      <Input className="rounded-full bg-[#4f4f4f] mb-4 mt-2" placeholder="Search someone..." />
      <CTA onClick={() => {setPopUp(false)}}>Invite</CTA>
    </PopUp>

	  <div className="ml-4 max-h-96 px-2 overflow-auto backdrop-blur-lg down-gradient">
        <div className="flex items-center justify-between sticky top-0 z-50 backdrop-blur-lg">
          <h1 className="font-semibold text-xl">Friends</h1>
          <i onClick={() => {setPopUp(true)}} className="fa-solid fa-circle-plus hover:text-gray-300 cursor-pointer"></i>
        </div>

	  	  {
          profile ? profile.friends.map((friend) => (
            <FriendCard profile={friend}></FriendCard>
          )) : null
        }

    </div>
      <div className="ml-4 max-h-96 px-2 overflow-auto backdrop-blur-lg down-gradient">
        <h1 className="font-semibold text-xl sticky top-0 z-50 backdrop-blur-lg">Game history</h1>
	  	  {
          profile ? profile.gameHistory.map((game) => (
            <GameCard game={game}></GameCard>
          )) : null
        }
      </div>
    </div>

    <div className="flex mt-8 items-center justify-center">
      {
        stats.map((stat) => (
          <div className="ml-4 flex flex-col items-center">
            <h1 className="font-semibold text-xl">{stat.title}</h1>
            <Stat labels={stat.labels} data={stat.data} colors={stat.colors}/>
          </div>
        ))
      }
    </div>
  </div>
  );
}
