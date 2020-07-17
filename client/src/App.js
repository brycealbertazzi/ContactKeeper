import React, {Fragment} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Register } from './components/auth/Register';
import { Login } from './components/auth/Login';
import { Alerts } from './components/layout/Alerts';
import { PrivateRoute } from './components/routing/PrivateRoute';

import './App.css';

import { Navbar } from './components/layout/Navbar';
import { Home } from './components/pages/Home';
import { About } from './components/pages/About';
import { ContactState } from './context/contact/ContactState';
import { AuthState } from './context/auth/AuthState';
import { AlertState } from './context/alert/AlertState';
import { setAuthToken } from './Utils/setAuthToken';

if (localStorage.token !== null) {
  setAuthToken(localStorage.token);
}

const App = () => {
  return (
    <AuthState>
      <ContactState>
        <AlertState>
          <Router>
            <Fragment>
              <Navbar></Navbar>
              <div className="container">
                <Alerts></Alerts>
                <Switch>
                  <PrivateRoute exact path='/' component={Home}></PrivateRoute>
                  <Route exact path='/about' component={About}></Route>
                  <Route exact path='/register' component={Register}></Route>
                  <Route exact path='/login' component={Login}></Route>
                </Switch>
              </div>
            </Fragment>
          </Router>
        </AlertState>
      </ContactState>
    </AuthState>
  );
}

export default App;
