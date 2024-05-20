import React, { useState } from 'react';
import { GameCard } from './GameCard';

export function GameHistory({gameHistory}) {
  const [displayGame, setDisplayGame] = useState('all');

  return (
    <div>
        <h1 className="font-semibold text-lg md:text-xl">Game history</h1>
        <div className="overflow-y-auto overflow-x-hidden down-gradient max-h-96 pr-2 backdrop-blur-lg">
        {
            gameHistory.map((game) => (
            <GameCard game={game} display={displayGame} setDisplay={setDisplayGame}></GameCard>
            ))
        }
        </div>
    </div>
  );
}
