import { Box, Button, Card, TextField } from "@mui/material";
import React, { useState } from 'react';

export function AasViewer(props: {}) {
    const [color, setColor] = useState("")
    const [weight, setWeight] = useState(0)
    const [material, setMaterial] = useState("")

    function saveAas() {
        console.log("save")
    }
    
    return (
        <Card>
            <Box display="flex" padding={5}>
                <Box width="100px" height="100px" border="3px solid grey" mr={5}>Image</Box>
                <Box display="flex" flexDirection="column">
                    <p>Supplier XYZ</p>
                    <p>Asset 12sfavr2oifdj</p>
                    <Box display="flex" flexDirection="column">
                        <form onSubmit={() => {saveAas()}}>
                            <Box mb={2}>
                                <TextField label="Color" onChange={(e) => setColor(e.target.value)}></TextField>
                            </Box>
                            <Box mb={2}>
                                <TextField label="Weight" type="number" onChange={(e) => setWeight(Number(e.target.value))}></TextField>
                            </Box>
                            <Box mb={2}>
                                <TextField label="Material" onChange={(e) => setMaterial(e.target.value)}></TextField>
                            </Box>
                            <Button variant="contained" type="submit">Save</Button>
                        </form>
                    </Box>
                </Box>
            </Box>
        </Card>
    )
}