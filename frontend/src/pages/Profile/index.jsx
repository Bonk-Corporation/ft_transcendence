import React from 'react';
import { ProfileCard } from '../../components/ProfileCard';
import { FriendCard } from '../../components/FriendCard';
import { GameCard } from '../../components/GameCard';
import '../../style.css'

export function Profile({profile}) {
  return (
    <div className="flex flex-wrap items-center justify-center">
      <ProfileCard profile={profile} />
      <div className="ml-4 max-h-96 px-2 overflow-auto backdrop-blur-lg down-gradient">
        {
          profile.friends.map((friend) => (
            <FriendCard profile={friend}></FriendCard>
          ))
        }
      </div>
      <div className="ml-4 max-h-96 px-2 overflow-auto backdrop-blur-lg down-gradient">
        {
          profile.gameHistory.map((game) => (
            <GameCard game={game}></GameCard>
          ))
        }
      </div>
    </div>
  );
}