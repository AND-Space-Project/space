import React from 'react';
import Login from './pages/Login.js';
import Calendar from './pages/Calendar.js';
import Nav from './pages/Nav.js';

function App() {

  return (
    <div className="App">
      <Nav />
      <Login />
      {/* <Calendar /> */}
    </div>
  );
}

export default App;
