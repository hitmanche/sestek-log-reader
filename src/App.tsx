import React, { useEffect } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import LogFile from './page/logFile';
import LogDetail from './page/logDetail';

declare global {
  interface Window {
    electron: unknown;
  }
}

export default function App() {
  useEffect(() => {}, []);
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LogFile} />
        <Route exact path="/logDetail" component={LogDetail} />
      </Switch>
    </Router>
  );
}
