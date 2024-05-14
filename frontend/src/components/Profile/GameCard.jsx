import React from 'react';
import { Card } from '../utils/Card';


export function GameCard({game}) {
    return (
        <Card color={`${game.win ? "[#00FF00]" : "[#FF0000]"}`} className='mb-3'>
            <div className="flex p-4 items-center justify-between w-80">
                <div className="flex items-center w-full justify-between">
                    <h1 className="text-xl">{game.game}</h1>
                    <h1 className="bg-white rounded-full font-semibold text-black px-2">{game.score[0]} | {game.score[1]}</h1>
                </div>
            </div>
        </Card>
    );
}
