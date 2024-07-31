// /src/components/Statistics.js
import React, { useEffect, useState } from 'react';
import { fetchStatistics } from '../api';

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchStatistics(month).then(res => setStatistics(res.data));
  }, [month]);

  return (
    <div>
      <p>Total Sales: {statistics.totalSales}</p>
      <p>Total Sold Items: {statistics.soldItems}</p>
      <p>Total Not Sold Items: {statistics.notSoldItems}</p>
    </div>
  );
};

export default Statistics;