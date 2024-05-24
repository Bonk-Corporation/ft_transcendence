import React, { useEffect, useRef, useState } from 'react';
import { Card } from '../utils/Card';
// import Chart from 'chart.js/auto';
import Chart from "react-apexcharts";


export function Stat({labels, data, colors}) {
  const [size, setSize] = useState(window.screen.width < 768 ? 150 : 200);

  const percentage = Math.floor((data[0] * 100 / (data[0] + data[1])));
  const opt = {
	series: [isNaN(percentage) ? 50 : percentage],
	options: {
	  plotOptions: {
		radialBar: {
		  hollow: {
			size: '70%',
			background: '#2e2e2e',
		  },
		  track: {
			background: colors[1],
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
			  color: 'white',
			}
		  }
		}
	  },
	  colors: [colors[0]],
	  labels: [labels[0]],
	  stroke: {
		  lineCap: "round",
	  },
	},
  };

  useEffect(() => {
	window.addEventListener('resize', () => {setSize(window.screen.width < 768 ? 150 : 200)})
    return () => {window.removeEventListener('resize', () => {setSize(window.screen.width < 768 ? 150 : 200)})}
  }, [])

  return (
    <Card className="flex items-center justify-center h-32 md:h-52">
		<Chart options={opt.options} series={opt.series} type="radialBar" height={size} />
    </Card>
  );
}
