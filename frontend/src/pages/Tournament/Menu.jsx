import React, { useEffect, useRef, useState } from 'react';
import { CTA } from '../../components/utils/CTA';
import { InvitationCard } from '../../components/Tournament/InvitationCard';
import { language } from '../../scripts/languages';
import { PopUp } from '../../components/utils/PopUp';
import { useLocation } from 'preact-iso';
import { Input } from '../../components/utils/Input';
import { Card } from '../../components/utils/Card';

export function Menu(props) {
  const [popUp, setPopUp] = useState(false);
  const [error, setError] = useState('');
  const [errorJoin, setErrorJoin] = useState('');
  const location = useLocation();
  
  const [nbPlayers, setNbPlayers] = useState(8);
  const [tournaments, setTournaments] = useState([]);

  const nameRef = useRef(null);

  function createTournament() {
    if (!nameRef.current.value.trim())
        return;
    
    fetch(`/api/tournament/new/${nameRef.current.value}/${nbPlayers}`, {
      method: "POST",
    }).then(res => {
      if (!res.ok) {
        return res.json().then(errData => {
          throw new Error(errData.error)})
      }
      location.route('/tournament/room');
    }).catch(err => {
      setError(err.message);
    })
  }

  useEffect(() => {
    fetch(`/api/tournament/get_all_tournaments`).then(res => res.json().then(data => {
      setTournaments(data.data);
    }));
    console.log(tournaments)
  }, [])

  return (
    <>
      <PopUp active={popUp} setActive={setPopUp} className='flex flex-col items-center'>
        <h1 className="text-xl font-semibold mb-4">Create a tournament</h1>
        <Input ref={nameRef} className="mb-2" placeholder="Name of the room"/>
        <h1>Numbers of players</h1>
        <div className="mb-4">
          <button onClick={() => setNbPlayers(2)} className={`mx-1 aspect-square px-2 rounded-full border-2 border-white font-semibold ${nbPlayers == 2 ? "bg-white text-black" : ""}`}>2</button>
          <button onClick={() => setNbPlayers(4)} className={`mx-1 aspect-square px-2 rounded-full border-2 border-white font-semibold ${nbPlayers == 4 ? "bg-white text-black" : ""}`}>4</button>
          <button onClick={() => setNbPlayers(8)} className={`mx-1 aspect-square px-2 rounded-full border-2 border-white font-semibold ${nbPlayers == 8 ? "bg-white text-black" : ""}`}>8</button>
        </div>
        <CTA onClick={createTournament} className='px-20'>Create</CTA>
        <p className="text-sm text-red-500">{error}</p>
      </PopUp>

      <div className="flex items-center">
        <div className="flex flex-col items-center mr-4">
          <h1 className="text-lg font-semibold">{language.create_room[props.lang]}</h1>
            <CTA onClick={() => setPopUp(true)} className="w-72 hover:w-96 h-96 px-2">
                <i className="text-6xl fa-solid fa-plus mb-2"></i>
                <h1 className="text-lg text-center font-semibold">{language.create_room[props.lang]}</h1>
            </CTA>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="px-2 text-lg font-semibold">{language.join_room[props.lang]}</h1>
          <p className="text-sm text-red-500">{errorJoin}</p>
          <div className="h-96 backdrop-blur-lg overflow-y-auto overflow-x-hidden pr-2 down-gradient">
            {
              tournaments.length ? tournaments.map((room) => (
                <InvitationCard lang={props.lang} room={room} setError={setErrorJoin} />
              )) :
              <Card className='py-4 w-72 flex items-center flex-col'>
                <h1 className="font-semibold text-md md:text-lg">{language.no_tournament[props.lang]}</h1>
              </Card>
            }
          </div>
        </div>
      </div>
    </>
  );
}
