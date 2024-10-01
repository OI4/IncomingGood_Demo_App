import React, { useState } from 'react';
import './App.css';
import { AasViewer } from './AasViewer';
import { Box, Button, TextField } from '@mui/material';
import { AssetAdministrationShell } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { DiscoveryService } from './Services/DiscoveryService';


function App() {
    const [assetId, setAssetId] = useState("")
    const [aas, setAas] = useState<AssetAdministrationShell>()


    async function loadAsset() {
        const discoveryService = DiscoveryService.create("https://oi4-sps24-mnestix-api.azurewebsites.net/discovery");
        const aasId = await discoveryService.getAasIdFromDiscovery(assetId);
    }

    return (
        <div className="App">
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={5}>
                <h3>Search for your Asset</h3>
                <Box display="flex" flexDirection="row">
                    <Box mr={2}>
                        <TextField id="assetIdInput" label="Asset ID" variant="outlined"
                                   onChange={(e) => setAssetId(e.target.value)}/>
                    </Box>
                    <Button onClick={() => {
                        loadAsset()
                    }} variant="contained">Contained</Button>
                </Box>
                <Box mt={5}>
                    <AasViewer></AasViewer>
                </Box>
            </Box>
        </div>
    );
}

export default App;
