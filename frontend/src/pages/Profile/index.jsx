import React from 'react';
import { ProfileCard } from '../../components/ProfileCard';
import { FriendCard } from '../../components/FriendCard';

export function Profile({profile}) {
  return (
    <div className="flex ">
      <ProfileCard profile={profile} />
      <div className="ml-4 max-h-96 px-2 overflow-auto backdrop-blur-lg down-gradient">
        {
          profile.friends.map((friend) => (
            <FriendCard profile={friend}></FriendCard>
          ))
        }
      </div>
    </div>
  );
}