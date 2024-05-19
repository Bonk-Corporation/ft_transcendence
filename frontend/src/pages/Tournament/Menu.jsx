import React from 'react';
import { CTA } from '../../components/utils/CTA';
import { InvitationCard } from '../../components/Tournament/InvitationCard';

export function Menu() {
  const invitations = [
    {
      "author": {
        "username": "MaxMaxicoMaxoMaxMaxicoMaxoMaxMaxicoMax",
        "avatar": "https://s2.coinmarketcap.com/static/img/coins/200x200/23095.png"
      },
      "nb_players": 8
    },
    {
      "author": {
        "username": "Bolvic",
        "avatar": "https://user-images.githubusercontent.com/8974888/231858967-7c37bf1e-335b-4f5a-9760-da97be9f54bb.png",
      },
      "nb_players": 8
    },
  ]
  return (
    <div className="flex items-center h-96">
      <div className="h-full">
        <h1 className="px-2 text-lg font-semibold">Create a room</h1>
        <CTA className="w-72 hover:w-96 h-full">
          <a href="/tournament/room">
            <i className="text-6xl fa-solid fa-plus mb-2"></i>
            <h1 className="text-lg text-center font-semibold">Create a room</h1>
          </a>
        </CTA>
      </div>
      <div className="h-full">
        <h1 className="px-2 text-lg font-semibold">Join a room</h1>
        <div className="overflow-auto overflow-x-hidden px-2 down-gradient">
          {
            invitations.map((invitation) => (
              <InvitationCard invitation={invitation} />
            ))
          }
        </div>
      </div>
    </div>
  );
}
