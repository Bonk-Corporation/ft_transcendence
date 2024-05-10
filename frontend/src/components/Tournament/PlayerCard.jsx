import React from 'react';
import { Card } from '../utils/Card';

export function PlayerCard({profile, admin}) {
  return (
    <Card className='flex items-center px-4 py-2 mb-4 w-80'>
      <div className="w-full flex items-center">
        <div className={`bg-[url(${profile.avatar})] bg-cover bg-center rounded-full border-2 border-white h-16 aspect-square mr-4`}></div>
        <div>
          <h1 className="font font-semibold text-lg w-full">{profile.name}</h1>
          <h1 className="w-full">Level {profile.level}</h1>
        </div>
      </div>
      {admin ? 
      <div className="bg-white aspect-square rounded-full ml-10 px-2 py-1 flex items-center shadow">
        <i className="fa-solid fa-crown text-black"></i>
      </div>
        : null}
    </Card>
  );
}
