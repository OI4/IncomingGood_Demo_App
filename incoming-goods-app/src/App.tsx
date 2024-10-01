import React from 'react';
import './App.css';
import { AasViewer } from './AasViewer';
import { Box, Button, TextField } from '@mui/material';

function App() {
    
    function loadAsset() {
        // TODO load from Discovery, Registry, Repos
        return undefined;
    }

    return (
    <div className="App">
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <h3>Search for your Asset</h3>
            <Box display="flex" flexDirection="row">
                <TextField id="assetIdInput" label="Asset ID" variant="outlined" />
                <Button variant="contained">Contained</Button>
            </Box>
            <Box>
                <AasViewer></AasViewer>
            </Box>
        </Box>
    </div>
  );
}

export default App;
