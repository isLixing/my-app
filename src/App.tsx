import React from 'react';
import logo from './logo.svg';
import './App.css';
import TableTest from './pages/index';

interface DataType {
  key: React.Key;
  name: string;
  time: [string, string] | null;
  note: string;
}
function App() {
  const dataSource: DataType[] = [{
    key: '1',
    name: 'banci1',
    time: ['08:00', '09:00'],
    note: 'string'
  }];
  
 
  return (
    <div className="App">
        <TableTest></TableTest>
    </div>
  );
}

export default App;
