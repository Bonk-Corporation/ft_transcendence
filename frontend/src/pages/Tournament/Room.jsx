import React, { useRef, useState, useEffect, useContext } from "react";
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

  const room = {
    size: 8,
    phases: [
      [
        {
          name: "jcario",
          avatar:
            "https://i.pinimg.com/236x/9d/58/d1/9d58d1fba36aa76996b5de3f3d233d22.jpg",
          level: 18,
        },
        {
          name: "FeuilleMorte",
          avatar: "https://i.ytimg.com/vi/lX7ofuGJl6Y/hqdefault.jpg",
          level: 4,
        },
        {
          name: "Feur",
          avatar:
            "https://www.itadori-shop.com/cdn/shop/articles/Satoru-Hollow-Purple-e1615636661895_1200x1200.jpg?v=1634757049",
          level: 42,
        },
        {
          name: "Bolvic",
          avatar:
            "https://user-images.githubusercontent.com/8974888/231858967-7c37bf1e-335b-4f5a-9760-da97be9f54bb.png",
          level: 21,
        },
        {
          name: "MaxMaxicoMax",
          avatar:
            "https://s2.coinmarketcap.com/static/img/coins/200x200/23095.png",
          level: 21,
        },
        {
          name: "ndavenne",
          avatar:
            "https://upload.wikimedia.org/wikipedia/commons/3/3d/Noah_mosaic.JPG",
          level: 666,
        },
        {
          name: "Babobi",
          avatar:
            "https://medias.cerveauetpsycho.fr/api/v1/images/view/653792ad2c3b8f5ebd5db10b/wide_1300/image.jpg",
          level: 666,
        },
        {
          name: "Bebaba",
          avatar:
            "https://yt3.googleusercontent.com/ytc/AIdro_lm527KArC3sZW1H1zY8wzAk_kY8QQWz5ywt6KFkmryuy8=s900-c-k-c0x00ffffff-no-rj",
          level: 666,
        },
      ],
      [
        {
          name: "jcario",
          avatar:
            "https://i.pinimg.com/236x/9d/58/d1/9d58d1fba36aa76996b5de3f3d233d22.jpg",
          level: 18,
        },
        {
          name: "Bolvic",
          avatar:
            "https://user-images.githubusercontent.com/8974888/231858967-7c37bf1e-335b-4f5a-9760-da97be9f54bb.png",
          level: 21,
        },
        {
          name: "MaxMaxicoMax",
          avatar:
            "https://s2.coinmarketcap.com/static/img/coins/200x200/23095.png",
          level: 21,
        },
        {
          name: "Bebaba",
          avatar:
            "https://yt3.googleusercontent.com/ytc/AIdro_lm527KArC3sZW1H1zY8wzAk_kY8QQWz5ywt6KFkmryuy8=s900-c-k-c0x00ffffff-no-rj",
          level: 666,
        },
      ],
      [
        {
          name: "jcario",
          avatar:
            "https://i.pinimg.com/236x/9d/58/d1/9d58d1fba36aa76996b5de3f3d233d22.jpg",
          level: 18,
        },
        {
          name: "MaxMaxicoMax",
          avatar:
            "https://s2.coinmarketcap.com/static/img/coins/200x200/23095.png",
          level: 21,
        },
      ],
      [
        {
          name: "jcario",
          avatar:
            "https://i.pinimg.com/236x/9d/58/d1/9d58d1fba36aa76996b5de3f3d233d22.jpg",
          level: 18,
        },
      ],
    ],
  };
  const admin = "jcario";

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
        {profile
          ? room.phases[currPhase].map((player) => (
              <PlayerCard
                user={player}
                userIsAdmin={player.name == admin}
                iAmAdmin={admin == profile.name}
              />
            ))
          : null}
      </div>
    </div>
  );
}
