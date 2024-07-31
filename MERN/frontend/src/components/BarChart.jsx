import React, { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { fetchBarChart } from '../api';

// Register all necessary components
Chart.register(...registerables);

const BarChart = ({ month }) => {
  const chartRef = useRef(null);

  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Number of Items',
        data: [],
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    fetchBarChart(month).then((res) => {
      setData({
        labels: res.data.ranges,
        datasets: [
          {
            label: 'Number of Items',
            data: res.data.counts,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
          },
        ],
      });
    });
  }, [month]);

  return <Bar ref={chartRef} data={data} />;
};

export default BarChart;
