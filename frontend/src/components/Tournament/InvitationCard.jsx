import React, { useContext } from 'react';
import { Card } from '../utils/Card';
import { language } from '../../scripts/languages';
import { LangContext } from '../../Contexts';

export function InvitationCard({ invitation }) {
	const lang = useContext(LangContext);
  return (
      <Card className='py-2 px-4 mb-2 w-72 overflow-hidden hover:from-white/40 hover:to-white/10 cursor-pointer'>
          <a href="/tournament/room" className="flex items-center">
            <div className={`bg-[url(${invitation.author.avatar})] bg-center bg-cover w-8 h-8 rounded-full mr-2`}/>
            <div className="w-full overflow-hidden">
                <h1 className="text-lg overflow-hidden text-ellipsis whitespace-nowrap">{invitation.author.username}'s game</h1>
                <h1 className="text-sm">{invitation.nb_players} {language.players[lang]}</h1>
            </div>
          </a>
      </Card>
  );
}
