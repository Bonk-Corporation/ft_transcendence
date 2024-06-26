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

  const profile = useContext(ProfileContext);
  const lang = useContext(LangContext);

  const [room, setRoom] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const location = useLocation();
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!profile) return;

    fetch("/api/tournament/status").then((res) =>
      res.json().then((data) => {
        if (data.error) return location.route("/tournament");

        setRoom(data);
        setPriv(data.private);
        setPlaying(data.playing);
        setActive(data.selected_game);
        setIsHost(data.host == profile.name);
        if (data.phases.length > 1 || data.playing) setShowSchema(true);
        if (isFinished()) setFinished(true);
      }),
    );
    const id = setInterval(() => {
      fetch("/api/tournament/status").then((res) =>
        res.json().then((data) => {
          if (data.error) return location.route("/tournament");

          setRoom(data);
          setPriv(data.private);
          if (data.playing != playing) setPlaying(data.playing);
          setActive(data.selected_game);
          setIsHost(data.host == profile.name);
          if (data.phases.length > 1 || data.playing) setShowSchema(true);
          if (isFinished()) setFinished(true);
        }),
      );
    }, 1000);

    return () => {
      clearInterval(id);
      const pathname = window.location.href.split("/").pop();
      if (pathname !== "pong" && pathname !== "bonk") {
        fetch("/api/tournament/leave_room");
      }
    };
  }, [profile]);

  useEffect(() => {
    if (playing) {
      if (isHost) playButton();
      else playNotHost();
    }
  }, [playing]);

  function isInRoom() {
    return room.phases[room.phases.length - 1].some(
      (el) => el.username == profile.name,
    );
  }

  function isFinished() {
    return (
      (room?.size == 8 && room.phases.length == 4) ||
      (room?.size == 4 && room.phases.length == 3) ||
      (room?.size == 2 && room.phases.length == 2)
    );
  }

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
    console.log("called");
    const privacy = priv ? "public" : "private";
    fetch(`/api/tournament/set_to_${privacy}`).then(() => {
      setPriv(!priv);
    });
  };

  const switchActiveGame = (game) => {
    if (active == game) return;

    fetch(`/api/tournament/set_to_${game}`).then(() => {
      if (isHost) setActive(game);
    });
  };

  const playNotHost = async () => {
    if (room.selected_game == "bonk" && playing) {
      window.location.pathname = "/bonk";
      fetch("/api/tournament/play_non_host").then((res) =>
        res.json().then(async (data) => {
          if (data.error) window.location.pathname = "/tournament/room";
        }),
      );
    } else {
      fetch("/api/tournament/play_non_host").then((res) =>
        res.json().then(async (data) => {
          if (data.error) return;
          await new Promise((r) => setTimeout(r, 5000));
          if (playing && isInRoom()) location.route("/pong");
        }),
      );
    }
  };

  const playButton = () => {
    if (room.selected_game == "bonk" && playing) {
      window.location.pathname = "/bonk";
      fetch("/api/tournament/play").then((res) =>
        res.json().then(async (data) => {
          if (data.error) window.location.pathname = "/tournament/room";
        }),
      );
    } else {
      fetch("/api/tournament/set_play").then((res) =>
        res.json().then(async (data) => {
          if (data.error) return;
          await new Promise((r) => setTimeout(r, 5000));
          fetch("/api/tournament/play").then((res) =>
            res.json().then((data) => {
              if (!data.error && isInRoom()) return location.route("/pong");
            }),
          );
        }),
      );
    }
  };

  return (
    <div className="w-full flex justify-center h-[40rem]">
      <div className="h-full w-2/3 flex flex-col items-center">
        {showSchema && room.selected_game != "bonk" ? (
          <Schema room={room} />
        ) : (
          <div className="h-full w-full flex overflow-hidden">
            <div
              id="pong"
              onClick={() => switchActiveGame("pong")}
              className={`${active == "pong" ? "border-4 border-white" : ""} h-full w-1/2 hover:w-3/4 mr-2 rounded bg-red-500 transition-all ease-in-out flex flex-col items-center group`}
            >
              <p className="absolute mt-4 transition-all ease-in-out group-hover:text-9xl font-semibold">
                Pong
              </p>
            </div>
            <div
              id="bonk"
              onClick={() => switchActiveGame("bonk")}
              className={`${active == "bonk" ? "border-4 border-white" : ""} h-full w-1/2 hover:w-3/4 ml-2 rounded bg-blue-500 transition-all ease-in-out flex flex-col items-center group`}
            >
              <p className="absolute mt-4 transition-all ease-in-out group-hover:text-9xl font-semibold">
                Bonk
              </p>
            </div>
          </div>
        )}
        <div className="my-4 flex items-center justify-center">
          <button
            onClick={() => toggleRoomPrivacy()}
            className={`mr-2 px-12 py-3 border-2
            ${
              isHost && priv && !playing && !finished
                ? "bg-black text-white hover:bg-white hover:text-black border-white"
                : isHost && !playing
                  ? "bg-white text-black hover:bg-gray-300 hover:border-gray-300 border-2 border-white"
                  : "bg-gray-500 border-gray-500 text-black cursor-not-allowed hover:bg-gray-500 hover:border-gray-500"
            }
            rounded transition-all ease-in-out`}
            disabled={!isHost || playing || finished}
          >
            <i
              className={`fa-solid ${priv ? "fa-lock" : "fa-unlock"} mr-2`}
            ></i>
            {priv ? language.private[lang] : language.public[lang]}
          </button>
          <button
            onClick={playButton}
            className={`ml-2 px-12 py-3 border-2 text-black rounded
              ${
                isHost && !playing && !finished
                  ? "cursor-pointer border-white bg-white hover:bg-gray-300 hover:border-gray-300"
                  : "bg-gray-500 border-gray-500 cursor-not-allowed hover:bg-gray-500 hover:border-gray-500"
              }
            `}
            disabled={!isHost || playing || finished}
          >
            <i className="fa-solid fa-play mr-2"></i>
            {language.play[lang]}
          </button>
        </div>
      </div>

      <div className="ml-4 down-gradient overflow-auto h-full px-2 overflow-x-hidden">
        {room && room.phases[currPhase]
          ? room.phases[currPhase].map((user) => (
              <PlayerCard
                player={user}
                host={room.host}
                iAmAdmin={profile.name == room.host}
              />
            ))
          : null}
      </div>
    </div>
  );
}
