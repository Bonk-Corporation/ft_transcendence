import React from 'react';
import { Card } from '../utils/Card';
import { Input } from '../utils/Input';
import { CTA } from '../utils/CTA';
import { Level } from './Level';


export function ProfileCard({ profile, setProfile, setTriedLog }) {

  function logOut() {
    setProfile(null);
    setTriedLog(false);
	fetch("/auth/logout", {
	method: "POST",
	}).then(res => res.json()
	.then(data => {
		if (data.success)
			window.location.pathname = "/login";
	}));
  }

  return (
    <>
      <Card className='flex flex-col items-center justify-center p-6 h-full'>
        <div className="flex items-center">
          <div className={`relative rounded-full md:block hidden w-32 mr-4 aspect-square border-4 bg-[url(${profile ? profile.avatar : null})] bg-center bg-cover`}>
            <div className="absolute inset-0 z-50 hover:opacity-60 opacity-0 w-full h-full bg-black rounded-full transition-all flex items-center justify-center">
              <input
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                type="file"
                accept="image/*, jpg, png"
              />
              <i className="fa-solid fa-camera text-white text-lg"></i>
            </div>
          </div>
          <div className="flex flex-col">
            <Input disabled={true} className="my-2" placeholder={`${profile ? profile.name : ''}`} />
            <Input className="my-2" placeholder={`${profile ? "Something you want to say..." : ''}`} />
          </div>
        </div>
        <div className="my-4 flex flex-col w-full">
          <Input className="w-full mb-2" placeholder="New password" />
          <Input className="w-full mt-2" placeholder="Confirm password" />
        </div>
        <div className="flex mb-4">
          <CTA className='mr-4'>Update</CTA>
          <CTA onClick={logOut} className='ml-4 border-red-500 border-2 text-red-500 hover:bg-red-500 hover:text-white' transparent={true}>Log out</CTA>
        </div>
        <Level level={profile ? profile.level : null} levelPercentage={profile ? profile.levelPercentage : null} />
      </Card>
    </>
  );
}
