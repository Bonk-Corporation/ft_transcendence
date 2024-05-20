import React, { useState } from 'react';
import { GameCard } from './GameCard';
import { Card } from '../utils/Card';

export function GameHistory({gameHistory}) {
  const [displayGame, setDisplayGame] = useState('all');

  return (
    <div className="min-w-80">
        <h1 className="font-semibold text-lg md:text-xl">Game history</h1>
        <div className={`overflow-y-auto overflow-x-hidden ${gameHistory.length ? "down-gradient" : ""} max-h-96 pr-2 backdrop-blur-lg`}>
        {
          gameHistory.map((game) => (
          <GameCard game={game} display={displayGame} setDisplay={setDisplayGame}></GameCard>
          ))
        }
        {
          !gameHistory.length ?
          <Card className='p-4 flex items-center flex-col'>
            <h1 className="font-semibold text-md md:text-lg">No games yet.</h1>
          </Card> : null
        }
        </div>
    </div>
  );
}
