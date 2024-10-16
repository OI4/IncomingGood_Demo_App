import {
    Alert,
    Box,
    Button,
    Card, Divider,
    FormControl, Grid2,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from "@mui/material";
import React, { useState } from 'react';
import { AASAndSubmodels } from './interfaces';
import { BackendService } from "./Services/BackendService";
import { RepositoryServiceClient } from './Services/RepositorySerivice';

export function AasViewer(props: { aasData: AASAndSubmodels, backendService: BackendService} ): JSX.Element {
    const technicalDataShortId = 'TechnicalProperties';

    const [location, setLocation] = useState(getTechnicalProperty("location"))
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    const repositoryClient = new RepositoryServiceClient(props.backendService);

    const technicalDataEndpoint = props?.aasData?.technicalData?.url ?? '';
    
    function getTechnicalProperty(name: string) {
        const sme = props.aasData.technicalData?.submodel?.submodelElements;
        const technicalData = sme?.find( (x: any) => x.idShort.trim().toLowerCase() === technicalDataShortId.toLowerCase()) as any;
        const x = technicalData?.value.find((x: any) => x.idShort === name)?.value as string ?? ''
        return x;
    }

    function getNameplateProperty(name: string) {
        const nameplateData = (props.aasData.nameplate?.submodel?.submodelElements as any)
        const mlp = nameplateData?.find((x: any) => x.idShort === name)?.value
        return mlp?.[0].text;
    }
    
    async function saveAas(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        let hasError = false;

        try {
            await repositoryClient.updateSubmodelElement(technicalDataEndpoint, technicalDataShortId + '.location', location);
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not save the location");
            hasError = true;
        }
        if (!hasError) {
            setSuccessMessage("Successfully saved the properties");
        }
    }

    const locations = ["Location 1", "Location 2", "Location 3", "Location 4", "Location 5"]

    return (
        <Card>
            <Box display="flex" padding={5}>
                <Box width="250px" height="100px" mr={5}>
                    {props.aasData.assetAdministrationShell?.thumbnail && <img className="thumbnail" src={props.aasData.assetAdministrationShell?.thumbnail}/>}
                </Box>
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Box mb={2} display="flex" flexDirection="row" justifyContent="flex-start">
                        <Typography variant="h4" >{getNameplateProperty('ManufacturerProductDesignation')}</Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" width="100%">
                        <Divider sx={{mb: 2, mt: 2}}/>
                        <Typography sx={{mt: 1, mb: 1}} fontWeight="bold">Nameplate Data</Typography>
                        <Box mb={2} display="flex" flexDirection="row" justifyContent="flex-start">
                            <Typography width={150} textAlign="start">Manufacturer</Typography>
                            <Typography>{getNameplateProperty('ManufacturerName')}</Typography>
                        </Box>

                        <Divider sx={{mb: 2, mt: 2}}/>
                        <Typography sx={{mt: 1, mb: 1}} fontWeight="bold">Technical Data</Typography>
                        <Box mb={2} display="flex" flexDirection="row" justifyContent="flex-start">
                            <Typography width={150} textAlign="start">Weight</Typography>
                            <Typography>{Number(getTechnicalProperty("weight"))} kg</Typography>
                        </Box>
                        <Box mb={2} display="flex" flexDirection="row">
                            <Typography width={150} textAlign="start">Material</Typography>
                            <Typography>{getTechnicalProperty("material")}</Typography>
                        </Box>
                        <Box mb={2} display="flex" flexDirection="row">
                            <Typography width={150} textAlign="start">Color</Typography>
                            <Typography>{getTechnicalProperty("color")}</Typography>
                        </Box>
                        
                        <form onSubmit={(event) => {
                            saveAas(event)
                        }}>
                            <Divider sx={{mb: 2, mt: 2}}/>
                            <Typography sx={{mt: 1, mb: 1}} fontWeight="bold">Set new Location:</Typography>
                            <Box mb={2} minWidth="250px">
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Location</InputLabel>
                                    <Select
                                        id="demo-simple-select"
                                        value={location}
                                        label="Location"
                                        onChange={(e) => setLocation(e.target.value)}
                                    >
                                        {locations.map(location => {
                                            return <MenuItem value={location} key={location}>{location}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box mt={4} display="flex" justifyContent="flex-end">
                                <Button variant="contained" type="submit" className="button">Save</Button>
                            </Box>
                            {errorMessage && <Box mt={5}>
                                <Alert severity="warning">{errorMessage}</Alert>
                            </Box>}
                            {successMessage && <Box mt={5}>
                                <Alert severity="success">{successMessage}</Alert>
                            </Box>}
                        </form>
                    </Box>
                </Box>
            </Box>
        </Card>
    )
}