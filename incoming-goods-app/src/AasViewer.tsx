import { Alert, Box, Button, Card, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useState } from 'react';
import { AASAndSubmodels } from './interfaces';
import { BackendService } from "./Services/BackendService";
import { RepositoryServiceClient } from './Services/RepositorySerivice';

export function AasViewer(props: { aasData: AASAndSubmodels, backendService: BackendService} ): JSX.Element {
    const technicalDataShortId = 'TechnicalProperties';

    const [color, setColor] = useState(getTechnicalProperty("color"))
    const [weight, setWeight] = useState(Number(getTechnicalProperty("weight")))
    const [material, setMaterial] = useState(getTechnicalProperty("material"))
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
            await repositoryClient.updateSubmodelElement(technicalDataEndpoint, technicalDataShortId + '.color', color);
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not save the color");
            hasError = true;
        }
        try {
            await repositoryClient.updateSubmodelElement(technicalDataEndpoint, technicalDataShortId + '.weight', weight);
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not save the weight");
            hasError = true;
        }
        try {
            await repositoryClient.updateSubmodelElement(technicalDataEndpoint, technicalDataShortId + '.material', material);
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not save the material");
            hasError = true;
        }
        if (!hasError) {
            setSuccessMessage("Successfully saved the properties");
        }
    }

    const colors = ["Black", "Blue", "Green", "Red", "White"]

    return (
        <Card>
            <Box display="flex" padding={5}>
                <Box width="250px" height="100px" mr={5}>
                    {props.aasData.assetAdministrationShell?.thumbnail && <img className="thumbnail" src={props.aasData.assetAdministrationShell?.thumbnail}/>}
                <Box display="flex" flexDirection="column">
                    {props.aasData.assetAdministrationShell?.shell?.assetInformation?.specificAssetIds && <p>Specific Asset IDs</p>}
                    {props.aasData.assetAdministrationShell?.shell?.assetInformation?.specificAssetIds?.map(id => {
                        return <h4>{id.name} : {id.value}</h4>
                    })}
                </Box>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <h4>Supplier: {getNameplateProperty('ManufacturerName')}</h4>
                    <h4>Asset: {getNameplateProperty('ManufacturerProductDesignation')}</h4>
                    <Box display="flex" flexDirection="column">
                        <form onSubmit={(event) => {
                            saveAas(event)
                        }}>
                            <Box mb={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Color</InputLabel>
                                    <Select
                                        id="demo-simple-select"
                                        value={color}
                                        label="Color"
                                        onChange={(e) => setColor(e.target.value)}
                                    >
                                        {colors.map(color => {
                                            return <MenuItem value={color}>{color}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box mb={2}>
                                <TextField label="Weight" type="number" value={weight}
                                    onChange={(e) => setWeight(Number(e.target.value))}></TextField>
                            </Box>
                            <Box mb={2}>
                                <TextField label="Material" value={material} onChange={(e) => setMaterial(e.target.value)}></TextField>
                            </Box>
                            <Button variant="contained" type="submit" className="button">Save</Button>
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