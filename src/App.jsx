import React from 'react';
// import style from './App.module.css';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Joinin from './pages/Join';
import Dashboard from './pages/Dashboard';
import EditGame from './pages/EditGame';
import EditQuestion from './pages/EditQuestion';
import AdminGameResult from './pages/AdminGameResult';
import Playgame from './pages/Playgame';
import ShowAnswer from './pages/ShowAnswer';
import ShowResult from './pages/ShowResult';

export default function App () {
  return <>
    <Router>
      <div>
        <Switch>
          <Route path="/" exact>
            <Login />
          </Route>
          <Route path="/register" exact>
            <Register />
          </Route>
          <Route path="/join" exact>
            <Joinin />
          </Route>
          <Route path="/showans/:playerId" exact>
            <ShowAnswer />
          </Route>
          <Route path="/results" exact>
            <ShowResult />
          </Route>
          <Route path="/playgame/:playerId" exact>
            <Playgame />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route exact path="/details/:id">
            <EditGame />
          </Route>
          <Route exact path="/adminGameResult/:sessionId">
            <AdminGameResult />
          </Route>
          <Route exact path="/details/:gameId/:questionId">
            <EditQuestion />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  </>;
}
