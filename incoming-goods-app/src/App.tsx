import { Alert, Box, Button, CircularProgress, createTheme, TextField, ThemeProvider } from '@mui/material';
import { useState } from 'react';
import { AasViewer } from './AasViewer';
import './App.css';
import { AasRegistry } from './Services/AasRegistry';
import { DiscoveryService } from './Services/DiscoveryService';
import { getUrlFromEndpoints, RepositoryService } from './Services/RepositorySerivice';

import { Footer } from './Footer';
import { AASAndSubmodels, SubmodelDescriptor } from './interfaces';
import logo from './OI4Logo.png';
import { BackendService } from './Services/BackendService';
import { SubmodelRegistry } from './Services/SubmodelRegistry';

function App(props: {backendService: BackendService}) {
    const [assetId, setAssetId] = useState("")
    const [aas, setAas] = useState<AASAndSubmodels>()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")


    async function loadAsset() {
        setErrorMessage("")
        setIsLoading(true)
        setAas(undefined)
        try {
            const discoveryService = DiscoveryService.create(props.backendService);
            const aasId = await discoveryService.getAasIdFromDiscovery(assetId);

            if (!aasId || aasId.length <= 0) {
                throw new Error("The AAS ID list from AAS Discovery is empty");
            }

            const aasRegistry = AasRegistry.create(props.backendService);
            const concernedAasId = aasId[0];
            const aasDescriptor = await aasRegistry.getAasDescriptorFromRegistry(concernedAasId);

            if (!aasDescriptor) {
                throw new Error("AAS descriptor was not found");
            }

            const repositoryService = RepositoryService.create(props.backendService)

            const url = getUrlFromEndpoints(aasDescriptor.endpoints);

            console.log("URL: " + url);

            const smRefs = await repositoryService.getSubmodelRefsByAasUrl(url);

            console.log("smRefs: " + smRefs);

            const smIds = smRefs?.map(ref=>ref.keys[0].value)

            if (!smIds?.length) {
                throw new Error("no SM was not found for the AAS");
            }

            const smRegistry = SubmodelRegistry.create(props.backendService);

            const smDescriptors = (await Promise.all(smIds?.map(smId => {
                const smDescriptor = smRegistry.getSmDescriptorFromRegistry(smId)

                if (!smDescriptor) {
                    throw new Error("SM descriptor was not found");
                }
                return smDescriptor;
            }))) as Array<SubmodelDescriptor>

            console.log("SM Descriptors: " + JSON.stringify(smDescriptors));


            const aasAndShells = await repositoryService.getAasandSubomdelsFromRepository(aasDescriptor, smDescriptors)
            if (aasAndShells) {
                console.log('aasAndShells')
                console.log(aasAndShells)
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
                main: '#76B82A'
            },
            secondary: {
                main: '#757B7F'
            }
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <Box mt={5} >
                    <img width="300px" src={logo} alt='oi40-logo'/>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={5}>
                    <h3>Search for your Asset</h3>
                    <Box display="flex" flexDirection="row" minWidth="600px">
                        <Box mr={2} width="100%">
                            <TextField id="assetIdInput" label="Asset ID" variant="outlined" className="searchInput"
                                fullWidth={true}
                                onChange={(e) => setAssetId(e.target.value)}
                                onKeyDown={(ev) => {
                                    if (ev.key === 'Enter') {
                                        loadAsset()
                                    }
                                }
                            }/>
                        </Box>
                        <Button
                            className="button"
                            onClick={() => {
                                loadAsset()
                            }}
                            disabled={!assetId}
                            variant="contained">Load</Button>
                    </Box>
                    <Box mt={5} minHeight="200px">
                        {errorMessage && <Alert severity="warning">{errorMessage}</Alert>}
                        {isLoading && <CircularProgress/>}
                        {(!isLoading && aas) && <AasViewer aasData={aas} backendService={props.backendService}></AasViewer>}
                    </Box>
                </Box>
                <Box mt={5} mb={5}>
                    <Footer backendService={props.backendService}/>
                </Box>
            </div>
        </ThemeProvider>
    );
}

export default App;
