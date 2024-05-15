import React from 'react';
import { Card } from '../utils/Card';


export function GameCard({game}) {
    return (
        <Card color={`${game.win ? "[#00ff38]" : "[#FF0000]"}`} className='mb-3'>
            <div className="flex p-4 items-center justify-between">
                <div className="flex items-center">
                    <h1 className="text-xl">{game.game}</h1>
                    <h1 className="pl-52 font-semibold">{game.score[0]} | {game.score[1]}</h1>
                </div>
            </div>
        </Card>
    );
}
