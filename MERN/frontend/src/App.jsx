import React, { useState } from 'react';
import './App.css';
import Dropdown from './components/Dropdown';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

function App() {
  const [month, setMonth] = useState(3); // Default to March

  return (
    <div className="App">
      <header className="App-header">
        <h1>Transactions Dashboard</h1>
        <Dropdown selectedMonth={month} onChange={setMonth} />
      </header>
      <main>
        <TransactionsTable month={month} />
        <Statistics month={month} />
        <BarChart month={month} />
        <PieChart month={month} />
      </main>
    </div>
  );
}

export default App;
