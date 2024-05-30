import { useState } from 'react';
import { ProfileCard } from '../../components/Profile/ProfileCard';
import { Stat } from '../../components/Profile/Stat';
import { FriendList } from '../../components/Profile/FriendList';
import { GameHistory } from '../../components/Profile/GameHistory';
import { language } from '../../scripts/languages'


export function Profile({lang, fetchProfile, profile, setProfile, setTriedLog}) {
  const [stats, setStats] = useState([
    {
      title: "Win ratio - Pong",
      labels: ["Win", "Lose"],
      colors: ["#32CD32", "#FF6961"],
      data: [
        profile ? profile.gameHistory.length ? profile.gameHistory.reduce((accumulator, game) => game.win && game.game == "Pong" ? accumulator + 1 : accumulator, 0) : 1 : 1,
        profile ? profile.gameHistory.length ? profile.gameHistory.reduce((accumulator, game) => !game.win && game.game == "Pong" ? accumulator + 1 : accumulator, 0) : 1 : 1
      ],
    },
    {
      title: "Score ratio - Pong",
      colors: ["#79D2E6", "#FF964F"],
      labels: ["Scored", "Ceded"],
      data: [
        profile ? profile.gameHistory.length ? profile.gameHistory.reduce((accumulator, game) => game.game == "Pong" ? accumulator + game.score[0] : accumulator, 0) : 1 : 1,
        profile ? profile.gameHistory.length ? profile.gameHistory.reduce((accumulator, game) => game.game == "Pong" ? accumulator + game.score[1] : accumulator, 0) : 1 : 1
      ],
    },
    {
      title: "Win ratio - Bonk",
      colors: ["#32CD32", "#FF6961"],
      labels: ["Win", "Lose"],
      data: [
        profile ? profile.gameHistory.length ? profile.gameHistory.reduce((accumulator, game) => game.win && game.game == "Bonk" ? accumulator + 1 : accumulator, 0) : 1 : 1,
        profile ? profile.gameHistory.length ? profile.gameHistory.reduce((accumulator, game) => !game.win && game.game == "Bonk" ? accumulator + 1 : accumulator, 0) : 1 : 1
      ],
    },
    {
      title: "Score ratio - Bonk",
      colors: ["#79D2E6", "#FF964F"],
      labels: ["Kills", "Deaths"],
      data: [
        profile ? profile.gameHistory.length ? profile.gameHistory.reduce((accumulator, game) => game.game == "Bonk" ? accumulator + game.score[0] : accumulator, 0) : 1 : 1,
        profile ? profile.gameHistory.length ? profile.gameHistory.reduce((accumulator, game) => game.game == "Bonk" ? accumulator + game.score[1] : accumulator, 0) : 1 : 1
      ],
    },
  ]);

  return (
  <div className="flex flex-col">
    <div className="flex flex-wrap justify-center w-full">
      <div className="pl-2 h-full">
          <h1 className="font-semibold text-lg md:text-xl">{language.profile[lang]}</h1>
            <ProfileCard lang={lang} profile={profile} setProfile={setProfile} setTriedLog={setTriedLog} fetchProfile={fetchProfile} />
      </div>

      {
        profile ?
        <>
          <FriendList lang={lang} fetchProfile={fetchProfile} friends={profile.friends} friendsRequests={profile.friendsRequests} />
          <GameHistory lang={lang} gameHistory={profile.gameHistory.reverse()}/>
        </>
        : null
      }

    </div>

    <div className="flex flex-wrap mt-8 items-center justify-center w-full">
      {
        stats.map((stat) => (
          <div className="flex flex-col items-center ml-2 mr-2">
            <h1 className="font-semibold text-lg md:text-xl">{stat.title}</h1>
            <Stat labels={stat.labels} data={stat.data} colors={stat.colors}/>
          </div>
        ))
      }
    </div>
  </div>
  );
}
