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
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-xl">Friends</h1>
          <i onClick={() => {setPopUp(true)}} className="fa-solid fa-circle-plus hover:text-gray-300 cursor-pointer"></i>
        </div>
	  	  {
          profile.friends.map((friend) => (
            <FriendCard profile={friend}></FriendCard>
          ))
        }
      </div>
      <div className="ml-4 max-h-96 px-2 overflow-auto backdrop-blur-lg down-gradient">
        <h1 className="font-semibold text-xl">Game history</h1>
	  	{
          profile.gameHistory.map((game) => (
            <GameCard game={game}></GameCard>
          ))
        }
      </div>
    </div>
    <div className="flex mt-8 items-center justify-center">
      <div className="ml-4">
	  	<h1 className="font-semibold text-xl">Win ratio - Pong</h1>
      	<Stat label="Win ratio - Pong" firstLabel="Win" secondLabel="Lose"
            firstData={profile.gameHistory.reduce((accumulator, game) => game.win && game.game == "Pong" ? accumulator + 1 : accumulator, 0)}
            secondData={profile.gameHistory.reduce((accumulator, game) => !game.win && game.game == "Pong" ? accumulator + 1 : accumulator, 0)}
            firstColor="#32CD32" secondColor="#FF6961"
      	/>
	  </div>
	  <div className="ml-4">
        <h1 className="font-semibold text-xl">Score ratio - Pong</h1>
		<Stat label="Score ratio - Pong" firstLabel="Scored" secondLabel="Ceded"
            firstData={profile.gameHistory.reduce((accumulator, game) => game.game == "Pong" ? accumulator + game.score[0] : accumulator, 0)}
            secondData={profile.gameHistory.reduce((accumulator, game) => game.game == "Pong" ? accumulator + game.score[1] : accumulator, 0)}
            firstColor="#79D2E6" secondColor="#FF964F"
      	/>
	  </div>
	  <div className="ml-4">
        <h1 className="font-semibold text-xl">Win ratio - Bonk</h1>
      	<Stat label="Win ratio - Bonk" firstLabel="Win" secondLabel="Lose"
            firstData={profile.gameHistory.reduce((accumulator, game) => game.win && game.game == "Bonk" ? accumulator + 1 : accumulator, 0)}
            secondData={profile.gameHistory.reduce((accumulator, game) => !game.win && game.game == "Bonk" ? accumulator + 1 : accumulator, 0)}
            firstColor="#32CD32" secondColor="#FF6961"
      	/>
	  </div>
	  <div className="ml-4">
        <h1 className="font-semibold text-xl">Score ratio - Bonk</h1>
      	<Stat label="Score ratio - Bonk" firstLabel="Kills" secondLabel="Deaths"
            firstData={profile.gameHistory.reduce((accumulator, game) => game.game == "Bonk" ? accumulator + game.score[0] : accumulator, 0)}
            secondData={profile.gameHistory.reduce((accumulator, game) => game.game == "Bonk" ? accumulator + game.score[1] : accumulator, 0)}
            firstColor="#79D2E6" secondColor="#FF964F"
      	/>
      </div>
    </div>
  </div>
  );
}
