import React, { useEffect } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Dialog, Remote } from 'electron';
import './App.global.css';
import LogFile from './page/logFile';
import LogDetail from './page/logDetail';

declare global {
  interface ElectronType {
    dialog: Dialog;
    remote: Remote;
  }
  interface Window {
    electron: ElectronType;
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
