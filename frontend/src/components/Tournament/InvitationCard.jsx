import React, { useContext } from "react";
import { Card } from "../utils/Card";
import { language } from "../../scripts/languages";
import { LangContext } from "../../Contexts";
import { useLocation } from "preact-iso";

export function InvitationCard({ room, setError }) {
  const location = useLocation();
  const lang = useContext(LangContext);

  function joinTournament() {
    fetch(`/api/tournament/join_room/${room.host_name}`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errData) => {
            throw new Error(errData.error);
          });
        }
        location.route("/tournament/room");
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  return (
    <Card className="py-2 px-4 mb-2 w-72 overflow-hidden hover:from-white/40 hover:to-white/10 cursor-pointer">
      <div
        onClick={joinTournament}
        href="/tournament/room"
        className="flex items-center"
      >
        <div
          className={`bg-[url(${room.host_avatar})] bg-center bg-cover w-8 h-8 rounded-full mr-2`}
        />
        <div className="w-full overflow-hidden">
          <h1 className="text-lg overflow-hidden text-ellipsis whitespace-nowrap">
            {room.room_name}
          </h1>
          <h1 className="text-sm">
            {room.players_number}/{room.size} {language.players[lang]}
          </h1>
        </div>
      </div>
    </Card>
  );
}
