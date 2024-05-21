import React, { useRef, useState } from 'react';
import { FriendCard } from './FriendCard';
import { PopUp } from '../utils/PopUp';
import { Input } from '../utils/Input';
import { CTA } from '../utils/CTA';
import { Card } from '../utils/Card';

export function FriendList({fetchProfile, friends, friendsRequests}) {
  const [popUp, setPopUp] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  function handleClick() {
    if (inputRef.current.value.trim().length) {
      fetch(`/api/friends/send/${inputRef.current.value}`, {
        method: "POST",
      }).then(res => {
        if (!res.ok) {
          return res.json().then(errData => {
            throw new Error(errData.error)})
        }
        fetchProfile();
      }).then(data => {
        setPopUp(false);
      }).catch(err => {
        setError(err.message);
      })
    }
    inputRef.current.value = "";
  }

  function clear() {
    inputRef.current.value = "";
    setError("");
  }

  return (
    <div className="md:mt-0 mt-2 flex-1 ml-4 mr-4">
        <PopUp clear={clear} active={popUp} setActive={setPopUp} className="flex flex-col items-center">
          <h1 className="font-semibold text-xl">Add a friend</h1>
          {/* @ts-ignore */}
          <Input ref={inputRef} className="rounded-full bg-[#4f4f4f] mt-2" placeholder="Search someone..." />
          <p className="mb-2 text-sm text-red-500">{error}</p>
          <CTA className='' onClick={handleClick}>Invite</CTA>
        </PopUp>

        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-lg md:text-xl">Friends</h1>
          <i onClick={() => {setPopUp(true)}} className="fa-solid fa-circle-plus mr-2 hover:text-gray-300 cursor-pointer"></i>
        </div>
        <div className={`overflow-auto ${friends.length && friendsRequests.length ? "down-gradient" : ""}  max-h-96 pr-2 backdrop-blur-lg`}>
          {
            friendsRequests.map((friend) => (
            <FriendCard fetchProfile={fetchProfile} profile={friend} request={true}></FriendCard>
            ))
          }
          {
            friends.map((friend) => (
            <FriendCard fetchProfile={fetchProfile} profile={friend}></FriendCard>
            ))
          }
          {
            !friends.length && !friendsRequests.length ?
            <Card className='p-4 flex items-center flex-col'>
              <h1 className="font-semibold text-md md:text-lg">No friends yet. Click on + to add a friend.</h1>
            </Card> : null
          }
        </div>
    </div>
  );
}
