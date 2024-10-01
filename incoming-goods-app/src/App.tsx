import React from 'react';
import './App.css';
import { AasViewer } from './AasViewer';

function App() {
    
    function loadAsset() {
        // TODO load from Discovery, Registry, Repos
        return undefined;
    }

    return (
    <div className="App">
      <h3>Search for your Asset</h3>
      <p>Asset Id:</p>
      <input id="assetIdInput"/>
      <button onClick={loadAsset()}>Search</button>
        <div>
            <AasViewer></AasViewer>
        </div>
    </div>
  );
}

export default App;
