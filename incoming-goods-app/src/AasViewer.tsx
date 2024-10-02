import { Box, Button, Card, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useState } from 'react';
import { AASAndSubmodels } from './interfaces';
import { RepositoryServiceClient } from './Services/RepositorySerivice';

export function AasViewer(props: { aasData: AASAndSubmodels }): JSX.Element {
    const [color, setColor] = useState("")
    const [weight, setWeight] = useState(0)
    const [material, setMaterial] = useState("")
    const repositoryClient = new RepositoryServiceClient();

    const repositoryEndpoint = props?.aasData?.assetAdministrationShell?.url ?? '';
    const technicalDataShortId = 'TechnicalProperties';
    const nameplateDataShortId = 'NameplateProperties';
    
    function getTechnicalProperty(name: string) {
        const technicalData = (props.aasData.technicalData?.submodel?.submodelElements?.find( (x: any) => x.idShort === technicalDataShortId) as any)?.[0]
        return technicalData.find((x: any) => x.idShort === name)?.value as string ?? ''
    }

    function getNameplateProperty(name: string) {
        const nameplateData = (props.aasData.nameplate?.submodel?.submodelElements as any)
        return nameplateData?.find((x: any) => x.idShort === name)?.value as string ?? ''
    }
    
     setColor(getTechnicalProperty("color"))
     setWeight(Number(getTechnicalProperty("weight")))
     setMaterial(getTechnicalProperty("material"))

    async function saveAas(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await repositoryClient.updateSubmodelElement(repositoryEndpoint, technicalDataShortId + '.color', color);
        await repositoryClient.updateSubmodelElement(repositoryEndpoint, technicalDataShortId + '.weight', weight);
        await repositoryClient.updateSubmodelElement(repositoryEndpoint, technicalDataShortId + '.material', material);

        console.log("save")
    }

    const colors = ["Red", "Black", "White", "Green", "Blue"]

    return (
        <Card>
            <Box display="flex" padding={5}>
                <Box width="100px" height="100px" border="3px solid grey" mr={5}>Image</Box>
                <Box display="flex" flexDirection="column">
                    <p>Supplier: {getNameplateProperty('ManufacturerName')}</p>
                    <p>Asset : {getNameplateProperty('ManufacturerProductDesignation')}</p>
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
                        </form>
                    </Box>
                </Box>
            </Box>
        </Card>
    )
}