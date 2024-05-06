import React, { useEffect, useRef } from 'react';
import { Card } from '../utils/Card';
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
					hoverOffset: 4,
					borderWidth: 0,
					spacing: 3,
					borderRadius: 42
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
						},
						cutout: 75
					}
				}
				);
			}
		}, []);

  return (
    <Card className="flex items-center justify-center h-60 p-4 aspect-square">
        <canvas ref={stat} ></canvas>
    </Card>
  );
}
