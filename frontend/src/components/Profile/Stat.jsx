import React, { useEffect, useRef } from 'react';
import { Card } from '../utils/Card';
// import Chart from 'chart.js/auto';
import Chart from "react-apexcharts";


export function Stat({label, firstLabel, secondLabel, firstData, secondData, firstColor, secondColor}) {
  const stat = useRef(null);

  const data = {
          
	series: [firstData * 100 / (firstData + secondData)],
	options: {
	  plotOptions: {
		radialBar: {
		  hollow: {
			size: '70%',
			background: 'white',
		  },
		  track: {
			background: secondColor,
			strokeWidth: '100%',
			dropShadow: {
				enabled: true,
				top: 4,
				left: 4,
				blur: 8,
				opacity: 0.5
			}
		  },
		  dataLabels: {
			name: {
			  show: true
			},
			value: {
			  offsetY: 6,
			  fontSize: '16px',
			  color: '#2d2d2d',
			}
		  }
		}
	  },
	  colors: [firstColor],
	  labels: [firstLabel],
	  stroke: {
		  lineCap: "round",
	  },
	},
  };

  return (
    <Card className="flex items-center justify-center p-2 aspect-square max-h-60">
		<Chart options={data.options} series={data.series} type="radialBar" height={200} />
    </Card>
  );
}
