import React from 'react';
import './App.css';
import Room from './components/Room'
import Home from './components/Home';
import Navbar from './components/Navbar'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className='App vh-100'>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/room/:id' component={Room} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
