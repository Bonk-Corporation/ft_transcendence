import React from 'react';
import { Card } from './Card';

export function FriendCard({profile}) {
  return (
    <Card className='mb-4'>
        <div className="flex p-4 items-center justify-between">
            <div className="flex items-center">

                <div className={`bg-[url(${profile.avatar})] bg-cover bg-center bg-no-repeat rounded-full w-20 aspect-square `} />
                <div className="ml-4 mr-16 flex flex-col">
                    <h1 className="my-1">{profile.name}</h1>
                    <h1 className="my-1">Level {profile.level}</h1>
                </div>
            </div>
            <div>
                <i className="fa-solid fa-user-minus text-2xl text-red-500 hover:text-red-600 cursor-pointer" ></i>
            </div>
        </div>
    </Card>
  );
}
