import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import icon from '../assets/icon.svg';
import './App.global.css';
import { readTextFile } from './common';
const fs = require('fs');

const Hello = () => {

  const onClickTest = () => {
    window.electron.dialog.showOpenDialog(window.electron.remote.getCurrentWindow(), {
      properties: ["openDirectory"]
  }).then(result => {
      if (result.canceled === false) {
          if(Array.isArray(result.filePaths) && result.filePaths.length > 0){
            const baseFile=result.filePaths[0];
            fs.readdirSync(baseFile).forEach(file => {
              readTextFile(baseFile+'/'+file);
            });
          }
          else{

          }
      }
  }).catch(err => {
     
  })
  }

  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
          <button type="button" onClick={onClickTest}>
            <span role="img" aria-label="books">
              🙏
            </span>
            test
          </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
