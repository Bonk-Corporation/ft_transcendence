import React, { useRef, useState, useEffect, useContext } from "react";
import { useLocation } from "preact-iso";
import { CTA } from "../../components/utils/CTA";
import { PlayerCard } from "../../components/Tournament/PlayerCard";
import { PopUp } from "../../components/utils/PopUp";
import { Input } from "../../components/utils/Input";
import { language } from "../../scripts/languages";
import { ProfileContext, LangContext } from "../../Contexts";
import { Schema } from "../../components/Tournament/Schema";

export function Room(props) {
  const [active, setActive] = useState("");
  const [priv, setPriv] = useState(false);
  const [showSchema, setShowSchema] = useState(false);
  const inputRef = useRef(null);

  const profile = useContext(ProfileContext);
  const lang = useContext(LangContext);

  const [room, setRoom] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!profile) return;

    const id = setInterval(() => {
      fetch("/api/tournament/status").then((res) =>
        res.json().then((data) => {
          if (data.error) return location.route("/tournament");

          setRoom(data);
          setPriv(data.private);
          setIsHost(data.host == props.profile.name);
        }),
      );
    }, 1000);

    return () => {
      clearInterval(id);
      fetch("/api/tournament/leave_room");
    };
  }, [props.profile]);

  useEffect(() => {
    if (!document.getElementById("lottie")) {
      const scriptEl = document.createElement("script");
      scriptEl.id = "lottie";
      scriptEl.src =
        "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
      scriptEl.type = "module";

      document.body.appendChild(scriptEl);
    }

    const anchorPong = document.getElementById("pong");
    const anchorBonk = document.getElementById("bonk");

    const dotlottie = `<dotlottie-player class="
                relative 2xl:bottom-28 xl:bottom-0 lg:bottom-[-60px]
                opacity-0 group-hover:opacity-100
                transition-all ease-in-out
                h-[46rem] w-full
                "
              src="/assets/flame.json" background="transparent" speed="1" loop autoplay></dotlottie-player>`;

    const dotlottieBlue = `<dotlottie-player class="
                relative 2xl:bottom-28 xl:bottom-0 lg:bottom-[-60px]
                opacity-0 group-hover:opacity-100
                transition-all ease-in-out
                h-[46rem] w-full
                "
              src="/assets/blue_flame.json" background="transparent" speed="1" loop autoplay></dotlottie-player>`;

    anchorPong.innerHTML += dotlottie;
    anchorBonk.innerHTML += dotlottieBlue;
  }, []);

  const currPhase = 0;
  const toggleRoomPrivacy = () => {
    const privacy = priv ? "public" : "private";
    fetch(`/api/tournament/set_to_${privacy}`).then(() => {
      setPriv(!priv);
    });
  };

  return (
    <div className="w-full flex justify-center h-[40rem]">
      <div className="h-full w-2/3 flex flex-col items-center">
        {showSchema ? (
          <Schema room={room} />
        ) : (
          <div className="h-full w-full flex overflow-hidden">
            <div
              id="pong"
              onClick={() => setActive("Pong")}
              className={`${active == "Pong" ? "border-4 border-white" : ""} h-full w-1/2 hover:w-3/4 mr-2 rounded bg-red-500 transition-all ease-in-out flex flex-col items-center group`}
            >
              <p className="absolute mt-4 transition-all ease-in-out group-hover:text-9xl font-semibold">
                Pong
              </p>
            </div>
            <div
              id="bonk"
              onClick={() => setActive("Bonk")}
              className={`${active == "Bonk" ? "border-4 border-white" : ""} h-full w-1/2 hover:w-3/4 ml-2 rounded bg-blue-500 transition-all ease-in-out flex flex-col items-center group`}
            >
              <p className="absolute mt-4 transition-all ease-in-out group-hover:text-9xl font-semibold">
                Bonk
              </p>
            </div>
          </div>
        )}
        <div className="my-4 flex items-center justify-center">
          <button
            onClick={() => {
              setPriv(!priv);
            }}
            className={`mr-2 px-12 py-3 border-2 border-white 
            ${
              priv
                ? "bg-black text-white hover:bg-white hover:text-black"
                : "bg-white text-black hover:bg-gray-300 hover:border-gray-300"
            } 
            rounded-lg  transition-all ease-in-out`}
            disabled={!isHost}
            onClick={toggleRoomPrivacy}
          >
            <i
              className={`fa-solid ${priv ? "fa-lock" : "fa-unlock"} mr-2`}
            ></i>
            {priv ? language.private[lang] : language.public[lang]}
          </button>
          <CTA className="ml-2 px-12 py-3 border-2 border-white hover:border-gray-300">
            <i className="fa-solid fa-play mr-2"></i>
            {language.play[lang]}
          </CTA>
        </div>
      </div>

      <div className="ml-4 down-gradient overflow-auto h-full px-2 overflow-x-hidden">
        {room && room.phases[currPhase] ?
          room.phases[currPhase].map((user) => (
            <PlayerCard
              player={user}
              host={room.host}
              iAmAdmin={profile.username == room.host}
            />
          )) : null
        }
      </div>
    </div>
  );
}
