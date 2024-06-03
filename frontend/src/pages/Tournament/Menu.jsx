import React, { useContext } from 'react';
import { CTA } from '../../components/utils/CTA';
import { InvitationCard } from '../../components/Tournament/InvitationCard';
import { language } from '../../scripts/languages';
import { LangContext } from '../../Contexts';

export function Menu(props) {
  const lang = useContext(LangContext);

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
    {
      "author": {
        "username": "Bolvic",
        "avatar": "https://user-images.githubusercontent.com/8974888/231858967-7c37bf1e-335b-4f5a-9760-da97be9f54bb.png",
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
    {
      "author": {
        "username": "Bolvic",
        "avatar": "https://user-images.githubusercontent.com/8974888/231858967-7c37bf1e-335b-4f5a-9760-da97be9f54bb.png",
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
    {
      "author": {
        "username": "Bolvic",
        "avatar": "https://user-images.githubusercontent.com/8974888/231858967-7c37bf1e-335b-4f5a-9760-da97be9f54bb.png",
      },
      "nb_players": 8
    },
    
  ]
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center mr-4">
        <h1 className="text-lg font-semibold">{language.create_room[lang]}</h1>
        <a href="/tournament/room" className="w-full h-full">
          <CTA className="w-72 hover:w-96 h-96 px-2">
              <i className="text-6xl fa-solid fa-plus mb-2"></i>
              <h1 className="text-lg text-center font-semibold">{language.create_room[lang]}</h1>
          </CTA>
        </a>
      </div>
      <div className="flex flex-col items-center">
        <h1 className="px-2 text-lg font-semibold">{language.join_room[lang]}</h1>
        <div className="h-96 backdrop-blur-lg overflow-y-auto overflow-x-hidden pr-2 down-gradient">
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
