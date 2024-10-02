import React, { useState } from 'react';
import './App.css';
import { AasViewer } from './AasViewer';
import { Alert, Box, Button, CircularProgress, createTheme, TextField, ThemeProvider } from '@mui/material';
import { DiscoveryService } from './Services/DiscoveryService';
import { AasRegistry } from './Services/AasRegistry';

import logo from './OI4Logo.png'
import { Footer } from './Footer';
import { AASAndSubmodels } from './interfaces';
import { RepositoryService } from './Services/RepositorySerivice';

function App() {
    const [assetId, setAssetId] = useState("")
    const [aas, setAas] = useState<AASAndSubmodels>()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    
    async function loadAsset() {
        setErrorMessage("")
        setIsLoading(true)
        try {
            const discoveryService = DiscoveryService.create("https://oi4-sps24-mnestix-api.azurewebsites.net/discovery");
            const aasId = await discoveryService.getAasIdFromDiscovery(assetId);

            if (!aasId || aasId.length <= 0) {
                throw new Error("The AAS ID list from AAS Discovery is empty");
            }

            const aasRegistry = AasRegistry.create("https://mnestix-basyx-aas-registry-b36325a9.azurewebsites.net");
            const concernedAasId = aasId[0];
            const aasDescriptor = await aasRegistry.getAasDescriptorFromRegistry(concernedAasId);


            if (!aasDescriptor) {
                throw new Error("AAS descriptor was not found");
            }

            const repositoryService = RepositoryService.create()
            const aasAndShells = await repositoryService.getAasandSubomdelsFromRepository(aasDescriptor)
            if(aasAndShells) {
                setAas(aasAndShells)
                setIsLoading(false)
            }
        } catch (error) {
            console.log("Error while loading the AAS " + error)
            setErrorMessage("Error while loading the AAS")
            setIsLoading(false)
        }
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
            <Box sx={{ flexGrow: 1 }} mt={5}>
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
                    {errorMessage && <Alert severity="warning">{errorMessage}</Alert>}
                    {isLoading && <CircularProgress />}
                    {(!isLoading && aas) && <AasViewer aasData={ aas}></AasViewer>}
                </Box>
            </Box>
            <Box mt={5} position="absolute" bottom="50px" width="100%">
                <Footer/>
            </Box>
        </div>
        </ThemeProvider>
    );
}

export default App;
