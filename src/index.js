import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';
import MediaLinks from './Components/MediaLinks';

firebase.initializeApp({
  apiKey: 'AIzaSyApsviFwF969aK9HzM5K69JAykoOHKFhy0',
  authDomain: 'eutrc-runs-app.firebaseapp.com',
  projectId: 'eutrc-runs-app'
});




ReactDOM.render(
  <React.Fragment>
      <App />
    <MediaLinks />
  </React.Fragment>,

  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
