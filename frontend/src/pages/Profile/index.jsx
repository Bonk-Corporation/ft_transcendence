import React, { useEffect, useRef } from 'react';
import { ProfileCard } from '../../components/ProfileCard';
import { FriendCard } from '../../components/FriendCard';
import { GameCard } from '../../components/GameCard';
import { Card } from '../../components/Card';
import Chart from 'chart.js/auto';


export function Profile({profile}) {
  const winRatioPongRef = useRef(null);
  const winRatioBonkRef = useRef(null);
  const goalsRatioRef = useRef(null);
  const kdRatioRef = useRef(null);

  useEffect(() => {
    if (winRatioPongRef.current) {
      const winRatioPong = {
        labels: [
          'Win',
          'Lose',
        ],
        datasets: [{
          label: 'Win ratio - Pong',
          data: [
            profile.gameHistory.reduce((accumulator, game) => game.win && game.game == "Pong" ? accumulator + 1 : accumulator, 0),
            profile.gameHistory.reduce((accumulator, game) => !game.win && game.game == "Pong" ? accumulator + 1 : accumulator, 0)
          ],
          backgroundColor: [
            '#32CD32',
            '#FF6961',
          ],
          hoverOffset: 4
        }]
      };
      const winRatioBonk = {
        labels: [
          'Win',
          'Lose',
        ],
        datasets: [{
          label: 'Win ratio - Bonk',
          data: [
            profile.gameHistory.reduce((accumulator, game) => game.win && game.game == "Bonk" ? accumulator + 1 : accumulator, 0),
            profile.gameHistory.reduce((accumulator, game) => !game.win && game.game == "Bonk" ? accumulator + 1 : accumulator, 0)
          ],
          backgroundColor: [
            '#32CD32',
            '#FF6961',
          ],
          hoverOffset: 4
        }]
      };
      const goalsRatio = {
        labels: [
          'Scored',
          'Ceded',
        ],
        datasets: [{
          label: 'Score ratio - Pong',
          data: [
            profile.gameHistory.reduce((accumulator, game) => game.game == "Pong" ? accumulator + game.score[0] : accumulator, 0),
            profile.gameHistory.reduce((accumulator, game) => game.game == "Pong" ? accumulator + game.score[1] : accumulator, 0)
          ],
          backgroundColor: [
            '#79D2E6',
            '#FF964F',
          ],
          hoverOffset: 4
        }]
      };
      const kdRatio = {
        labels: [
          'Kills',
          'Deaths',
        ],
        datasets: [{
          label: 'Score ratio - Bonk',
          data: [
            profile.gameHistory.reduce((accumulator, game) => game.game == "Bonk" ? accumulator + game.score[0] : accumulator, 0),
            profile.gameHistory.reduce((accumulator, game) => game.game == "Bonk" ? accumulator + game.score[1] : accumulator, 0)
          ],
          backgroundColor: [
            '#79D2E6',
            '#FF964F',
          ],
          hoverOffset: 4
        }]
      };
  
      new Chart(
        winRatioPongRef.current,
        {
          type: 'doughnut',
          data: winRatioPong,
          options: {
            layout: {
                padding: 5
            }
          }
        });
      
      new Chart(
        winRatioBonkRef.current,
        {
          type: 'doughnut',
          data: winRatioBonk,
          options: {
            layout: {
                padding: 5
            }
          }
        });
      new Chart(
        goalsRatioRef.current,
        {
          type: 'doughnut',
          data: goalsRatio,
          options: {
            layout: {
                padding: 5
            }
          }
        });
      new Chart(
        kdRatioRef.current,
        {
          type: 'doughnut',
          data: kdRatio,
          options: {
            layout: {
                padding: 5
            }
          }
        });
    }
  }, [])
  return (
  <div className="flex flex-col">
    <div className="flex flex-wrap items-center justify-center">
      <ProfileCard profile={profile} />
      <div className="ml-4 max-h-96 px-2 overflow-auto backdrop-blur-lg down-gradient">
        {
          profile.friends.map((friend) => (
            <FriendCard profile={friend}></FriendCard>
          ))
        }
      </div>
      <div className="ml-4 max-h-96 px-2 overflow-auto backdrop-blur-lg down-gradient">
        {
          profile.gameHistory.map((game) => (
            <GameCard game={game}></GameCard>
          ))
        }
      </div>
    </div>
    <div className="flex mt-8 items-center justify-center">
      <Card className="mr-4 flex items-center justify-center h-60 p-4 aspect-square">
        <canvas ref={winRatioPongRef} ></canvas>
      </Card>
      <Card className="mx-4 flex items-center justify-center h-60 p-4 aspect-square">
        <canvas ref={goalsRatioRef} ></canvas>
      </Card>
      <Card className="mx-4 flex items-center justify-center h-60 p-4 aspect-square">
        <canvas ref={winRatioBonkRef} ></canvas>
      </Card>
      <Card className="ml-4 flex items-center justify-center h-60 p-4 aspect-square">
        <canvas ref={kdRatioRef} ></canvas>
      </Card>
    </div>
  </div>
  );
}