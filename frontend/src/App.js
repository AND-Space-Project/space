import React from 'react';
import Login from './pages/Login.js';
import Calendar from './pages/Calendar.js';
import Nav from './pages/Nav.js';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch />
          <Route exact path="/" component={Login}/>
          <Route path="/calendar" component={Calendar}/>
        <Switch/>
      </div>
    </Router>
  );
}

export default App;
