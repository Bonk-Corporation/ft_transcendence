import React from 'react';
import { Card } from '../utils/Card';

export function FriendCard({profile}) {
  return (
    <Card className='mb-4'>
        <div className="flex p-3 items-center justify-between overflow-hidden">
            <div className="flex items-center">
                <div className={`bg-[url(${profile.avatar})] border-2 bg-cover bg-center bg-no-repeat rounded-full w-16 aspect-square`} />
                <div className="ml-4 mr-16 flex flex-col leading-tight w-36 overflow-hidden">
                    <h1 className="font-semibold text-lg overflow-hidden text-ellipsis">{profile.name}</h1>
                    <h1>Level {profile.level}</h1>
                </div>
            </div>
            <button>
                <i className="fa-solid fa-user-minus text-2xl text-red-500 hover:text-red-600 cursor-pointer" ></i>
            </button>
        </div>
    </Card>
  );
}
