import React, { useContext } from "react";
import { Card } from "../utils/Card";
import { language } from "../../scripts/languages";
import { useState } from "preact/hooks";
import { LangContext } from "../../Contexts";

export function PlayerCard({ player, host, iAmAdmin }) {
  const lang = useContext(LangContext);
  const userIsAdmin = player === host;
  const [kicked, setKicked] = useState(false);

  const kickPlayer = (player) => {
    if (kicked) return;

    fetch(`/api/tournament/kick_user/${player.username}`).then((res) =>
      res.json().then(({ success }) => {
        if (success) setKicked(true);
      }),
    );
  };

  return (
    !kicked && (
    <Card className="flex items-center px-4 py-2 mb-4 w-80">
      <div className="w-full flex items-center">
        <div
          className={`bg-[url(${player.avatar})] bg-cover bg-center rounded-full border-2 border-white h-16 aspect-square mr-4`}
        ></div>
        <div className="overflow-hidden">
          <h1 className="font font-semibold text-lg w-full overflow-hidden text-ellipsis">
            {player.name}
          </h1>
          <h1 className="w-full">
            {language.level[lang]} {player.level}
          </h1>
          </div>
        </div>
        {userIsAdmin ? (
          <div className="bg-white aspect-square rounded-full px-2 py-1 flex items-center shadow">
            <i className="fa-solid fa-crown text-black"></i>
          </div>
        ) : (
          iAmAdmin && (
            <div
              className="aspect-square flex items-center shadow"
              onClick={() => kickPlayer(player)}
            >
              <i className="fa-solid text-2xl fa-user-minus text-red-500 hover:text-red-600 cursor-pointer"></i>
            </div>
          )
        )}
      </Card>
    )
  );
}
