import React, { useEffect, useRef } from 'react';
import { Card } from './Card';
import Chart from 'chart.js/auto';


export function Stat({label, firstLabel, secondLabel, firstData, secondData, firstColor, secondColor}) {
  const stat = useRef(null);

	
	useEffect(() => {
		if (stat) {
			const data = {
				labels: [firstLabel, secondLabel],
				datasets: [{
					label: label,
					data: [firstData, secondData],
					backgroundColor: [firstColor, secondColor],
					hoverOffset: 4
				}]
			};
		
			new Chart(
				stat.current,
				{
					type: 'doughnut',
					data: data,
					options: {
						layout: {
							padding: 5
						}
					}
				}
				);
			}
		}, []);

  return (
    <Card className="ml-4 flex items-center justify-center h-60 p-4 aspect-square">
        <canvas ref={stat} ></canvas>
    </Card>
  );
}
