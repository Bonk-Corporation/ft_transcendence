import React, { useState } from 'react';
import { FriendCard } from './FriendCard';
import { PopUp } from '../utils/PopUp';
import { Input } from '../utils/Input';
import { CTA } from '../utils/CTA';

export function FriendList({friends, friendsRequests}) {
  const [popUp, setPopUp] = useState(false);

  return (
    <div className="md:mt-0 mt-2 flex-1 ml-4 mr-4">

        <PopUp active={popUp} setActive={setPopUp} className="flex flex-col items-center">
          <h1 className="font-semibold text-xl">Add a friend</h1>
          <Input className="rounded-full bg-[#4f4f4f] mb-4 mt-2" placeholder="Search someone..." />
          <CTA onClick={() => {setPopUp(false)}}>Invite</CTA>
        </PopUp>

        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-lg md:text-xl">Friends</h1>
          <i onClick={() => {setPopUp(true)}} className="fa-solid fa-circle-plus mr-2 hover:text-gray-300 cursor-pointer"></i>
        </div>
        <div className="overflow-auto down-gradient max-h-96 pr-2 backdrop-blur-lg">
          {
              friendsRequests.map((friend) => (
              <FriendCard profile={friend} request={true}></FriendCard>
              ))
          }
          {
              friends.map((friend) => (
              <FriendCard profile={friend}></FriendCard>
              ))
          }
        </div>
    </div>
  );
}
