import React, { useEffect, useRef } from 'react';
import { Card } from '../utils/Card';
// import Chart from 'chart.js/auto';
import Chart from "react-apexcharts";


export function Stat({labels, data, colors}) {
  const stat = useRef(null);

  const opt = {
	series: [data[0] * 100 / (data[0] + data[1])],
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

  return (
    <Card className="flex items-center justify-center p-2 aspect-square max-h-60">
		<Chart options={opt.options} series={opt.series} type="radialBar" height={200} />
    </Card>
  );
}
