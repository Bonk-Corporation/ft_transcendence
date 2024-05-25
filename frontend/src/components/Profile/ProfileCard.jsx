import React, { useRef, useState } from 'react';
import { Card } from '../utils/Card';
import { Input } from '../utils/Input';
import { CTA } from '../utils/CTA';
import { Level } from './Level';


export function ProfileCard({ profile, setProfile, setTriedLog }) {
  const citation = useRef(null);
  const password = useRef(null);
  const confirmPassword = useRef(null);
  const [error, setError] = useState("");

  function logOut() {
    setProfile(null);
    setTriedLog(false);
    fetch("/auth/logout", {
      method: "POST",
    }).then(res => res.json().then(data => {
      if (data.success)
        window.location.pathname = "/login";
    }));
  }

  function updateProfile() {
    let data = {}

    if (password.current.value != confirmPassword.current.value) {
      setError("Password mismatch !");
      return;
    }
    if (citation.current.value.trim())
      data["citation"] = citation.current.value;
    if (password.current.value)
      data["password"] = password.current.value;
    if (!('citation' in data) && !('password' in data))
      return ;

    fetch("/api/update_profile", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(data),
		}).then(res => {
			if (!res.ok) {
				return res.json().then(errData => {
					throw new Error(errData.error)})
			}
		}).then(data => {
      setError("");
      citation.current.value = "";
			password.current.value = "";
			confirmPassword.current.value = "";
		}).catch(err => {
			setError(err.message);
			password.current.value = "";
			confirmPassword.current.value = "";
		});
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
            <Input ref={citation} className="my-2" placeholder={`${profile ? "Something you want to say..." : ''}`} maxlength="256" />
          </div>
        </div>
        <div className="mt-4 mb-2 flex flex-col w-full items-center">
          <Input ref={password} className="w-full mb-2" placeholder="New password" type="password" />
          <Input ref={confirmPassword} className="w-full mt-2" placeholder="Confirm password" type="password" />
					<p className="mt-1 text-sm text-red-500">{error}</p>
        </div>
        <div className="flex mb-4">
          <CTA onClick={updateProfile} className='mr-4'>Update</CTA>
          <CTA onClick={logOut} className='ml-4 border-red-500 border-2 text-red-500 hover:bg-red-500 hover:text-white' transparent={true}>Log out</CTA>
        </div>
        <Level level={profile ? profile.level : null} levelPercentage={profile ? profile.levelPercentage : null} />
      </Card>
    </>
  );
}
