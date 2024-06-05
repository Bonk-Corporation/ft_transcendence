import React, { useRef, useState, useEffect, useContext } from "react";
import { FriendCard } from "./FriendCard";
import { PopUp } from "../utils/PopUp";
import { Input } from "../utils/Input";
import { CTA } from "../utils/CTA";
import { Card } from "../utils/Card";
import { language } from "../../scripts/languages";
import { LangContext } from "../../Contexts";

export function FriendList({ fetchProfile, friends, friendsRequests }) {
  const lang = useContext(LangContext);

  const [popUp, setPopUp] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  function handleClick() {
    if (inputRef.current.value.trim().length) {
      fetch(`/api/friends/send/${inputRef.current.value}`, {
        method: "POST",
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((errData) => {
              throw new Error(errData.error);
            });
          }
          fetchProfile();
        })
        .then((data) => {
          setPopUp(false);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
    inputRef.current.value = "";
  }

  function clear() {
    inputRef.current.value = "";
    setError("");
  }

  function enter(e) {
    if (e.key == "Enter") handleClick();
  }

  return (
    <div className="md:mt-0 mt-2 flex-1 ml-4 mr-4">
      <PopUp
        onKeyPress={enter}
        clear={clear}
        active={popUp}
        setActive={setPopUp}
        className="flex flex-col items-center"
      >
        <h1 className="font-semibold text-xl">{language.add_friend[lang]}</h1>
        <Input
          ref={inputRef}
          className="rounded-full bg-[#4f4f4f] mt-2"
          placeholder={language.search_someone[lang]}
        />
        <p className="mb-2 text-sm text-red-500">{error}</p>
        <CTA className="" onClick={handleClick}>
          {language.invite[lang]}
        </CTA>
      </PopUp>

      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl">
          {language.friends[lang]}
        </h1>
        <i
          onClick={() => {
            setPopUp(true);
          }}
          className="fa-solid fa-circle-plus mr-2 hover:text-gray-300 cursor-pointer"
        ></i>
      </div>
      <div
        className={`overflow-auto ${friends.length && friendsRequests.length ? "down-gradient" : ""}  max-h-96 pr-2 backdrop-blur-lg ${loaded ? "opacity-100" : "opacity-0"} transition-all duration-500`}
      >
        {friendsRequests.map((friend) => (
          <FriendCard
            fetchProfile={fetchProfile}
            profile={friend}
            request={true}
          ></FriendCard>
        ))}
        {friends.map((friend) => (
          <FriendCard fetchProfile={fetchProfile} profile={friend}></FriendCard>
        ))}
        {!friends.length && !friendsRequests.length ? (
          <Card className="p-4 flex items-center flex-col">
            <h1 className="font-semibold text-md md:text-lg">
              {language.no_friends[lang]}
            </h1>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
