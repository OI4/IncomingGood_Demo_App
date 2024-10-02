import React, { useState } from 'react';
import './App.css';
import { AasViewer } from './AasViewer';
import { Box, Button, CircularProgress, createTheme, TextField, ThemeProvider } from '@mui/material';
import { AssetAdministrationShell } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { DiscoveryService } from './Services/DiscoveryService';
import { AasRegistry } from './Services/AasRegistry';

import logo from './OI4Logo.png'
import { Footer } from './Footer';

function App() {
    const [assetId, setAssetId] = useState("")
    const [aas, setAas] = useState<AssetAdministrationShell>()
    const [isLoading, setIsLoading] = useState(false)

    async function loadAsset() {
        const discoveryService = DiscoveryService.create("https://oi4-sps24-mnestix-api.azurewebsites.net/discovery");
        const aasId = await discoveryService.getAasIdFromDiscovery(assetId);

        if (!aasId || aasId.length <= 0) {
            throw new Error("The AAS ID list from AAS Discovery is empty");
        }

        const aasRegistry = AasRegistry.create("https://mnestix-basyx-aas-registry-b36325a9.azurewebsites.net");
        const concernedAasId = aasId[0];
        const aasDescriptor = await aasRegistry.getAasDescriptorFromRegistry(concernedAasId);

        console.log("AAS Descriptor: " + JSON.stringify(aasDescriptor));


    }

    const theme = createTheme({
        palette: {
            primary: {
                main: '#76B82A',
            },
            secondary: {
                main: '#757B7F',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
        <div className="App">
            <Box sx={{ flexGrow: 1 }}>
                <img width="300px" src={logo}/>
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={5}>
                <h3>Search for your Asset</h3>
                <Box display="flex" flexDirection="row">
                    <Box mr={2}>
                        <TextField id="assetIdInput" label="Asset ID" variant="outlined"
                            onChange={(e) => setAssetId(e.target.value)} />
                    </Box>
                    <Button
                        className="button"
                        onClick={() => {
                            loadAsset()
                        }}
                        onKeyDown={(ev) => {
                            if (ev.key === 'Enter') {
                                loadAsset()
                            }}
                        }
                        variant="contained">Load</Button>
                </Box>
                <Box mt={5}>
                    {isLoading && <CircularProgress />}
                    {!isLoading && <AasViewer></AasViewer>}
                </Box>
            </Box>
            <Box mt={5}>
                <Footer/>
            </Box>
        </div>
        </ThemeProvider>
    );
}

export default App;
