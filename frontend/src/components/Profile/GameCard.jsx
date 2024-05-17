import React from 'react';
import { Card } from '../utils/Card';


export function GameCard({game, display, setDisplay}) {
    return (
            display == 'all' || display == game.game ?
            <Card className='mb-3'>
                <div className="flex px-4 py-3 items-center justify-between w-80 overflow-x-hidden">
                    <div className="flex items-center w-full justify-between">
                        <h1 className="font-semibold hover:underline cursor-pointer"
                            onClick={() => {display == game.game ? setDisplay('all') : setDisplay(game.game)}}>
                            {game.game}
                        </h1>
                        <h1 className={`rounded-full font-semibold text-black justify-center px-2 border-2 flex items-center ${game.win ? "bg-[#32CD32]" : "bg-[#FF6961]"}`}>
                            + {game.xp}
                            <p className="font- text-sm">xp</p></h1>
                        <h1 className={`bg-white rounded-full font-semibold text-black px-2 border-2 border-[${game.win ? "#32CD32" : "#FF6961"}]`}>{game.score[0]} | {game.score[1]}</h1>
                    </div>
                </div>
            </Card> : null
    );
}
