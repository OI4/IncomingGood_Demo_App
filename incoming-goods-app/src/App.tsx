import React, { useState } from 'react';
import './App.css';
import { AasViewer } from './AasViewer';
import { Box, Button, CircularProgress, createTheme, TextField, ThemeProvider } from '@mui/material';
import { DiscoveryService } from './Services/DiscoveryService';
import logo from './OI4Logo.png'
import { Footer } from './Footer';
import { AASAndSubmodels } from './interfaces';

function App() {
    const [assetId, setAssetId] = useState("")
    const [aas, setAas] = useState<AASAndSubmodels>()
    const [isLoading, setIsLoading] = useState(false)

    async function loadAsset() {
        const discoveryService = DiscoveryService.create("https://oi4-sps24-mnestix-api.azurewebsites.net/discovery");
        const aasId = await discoveryService.getAasIdFromDiscovery(assetId);
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
                                   onChange={(e) => setAssetId(e.target.value)}/>
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
