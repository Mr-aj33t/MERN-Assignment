import React, { useEffect, useRef, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { fetchPieChart } from '../api';

// Register all necessary components
Chart.register(...registerables);

const PieChart = ({ month }) => {
  const chartRef = useRef(null);

  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  });

  useEffect(() => {
    fetchPieChart(month).then((res) => {
      setData({
        labels: res.data.categories,
        datasets: [
          {
            data: res.data.counts,
            backgroundColor: res.data.colors,
          },
        ],
      });
    });
  }, [month]);

  return <Pie ref={chartRef} data={data} />;
};

export default PieChart;
