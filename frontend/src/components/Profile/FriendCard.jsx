import React, { useContext, useState } from 'react';
import { Card } from '../utils/Card';
import { language } from '../../scripts/languages';
import { LangContext } from '../../Contexts';

export function FriendCard({fetchProfile, profile, request = false}) {
  const lang = useContext(LangContext);
  const [deleted, setDeleted] = useState(false);

  function handleClick(call) {
    fetch(`/api/friends/${call}/${profile.name}`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        fetchProfile();
      })
      .catch((err) => {});
  }

  const time = new Date();
  const isOnline =
    time.getTime() - new Date(profile.last_online).getTime() < 60000;

  return (
    <>
      {deleted ? null : (
        <Card className="mb-4">
          <div className="flex p-3 items-center justify-between overflow-hidden">
            <div className="flex items-center">
              <div
                className={`bg-[url(${profile.avatar})] border-2 ${isOnline ? "border-green-500" : "border-white"} bg-cover bg-center bg-no-repeat rounded-full w-14 aspect-square`}
              />
              <div className="ml-4 mr-16 flex flex-col leading-tight w-36 overflow-hidden">
                <h1 className="font-semibold text-lg overflow-hidden text-ellipsis">
                  {profile.name}
                </h1>
                <h1>
                  {language.level[lang]} {profile.level}
                </h1>
              </div>
            </div>
            {request ? (
              <div className="flex">
                <button
                  onClick={() => handleClick("accept")}
                  className="aspect-square w-7 h-7 flex items-center justify-center rounded-full border hover:border-green-600 border-green-500"
                >
                  <i className="fa-solid fa-check text-lg text-green-500 hover:text-green-600 cursor-pointer"></i>
                </button>
                <button
                  onClick={() => handleClick("deny")}
                  className="aspect-square w-7 h-7 flex items-center justify-center rounded-full border hover:border-red-600 border-red-500 ml-2"
                >
                  <i className="fa-solid fa-xmark text-lg text-red-500 hover:text-red-600 cursor-pointer"></i>
                </button>
              </div>
            ) : (
              <button onClick={() => handleClick("remove")}>
                <i className="fa-solid fa-user-minus text-2xl text-red-500 hover:text-red-600 cursor-pointer"></i>
              </button>
            )}
          </div>
        </Card>
      )}
    </>
  );
}
