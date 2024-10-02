import xitaso from './assets/XitasoLogoBlack.svg'
import metalevel from './assets/ml-logo-dark.svg'
import endress from './assets/EH_Logo-d9672165.svg'
import iese from './assets/iese_rgb-1024x291.gif'
import murr from './assets/Murrelektronik.svg'
import { Box } from '@mui/material';
export function Footer () {
    return (
        <Box display="flex" justifyContent="space-between" ml={10} mr={10} gap={3}>
            <img src={murr} width="150px"/>
            <img src={metalevel} width="200px"/>
            <img src={xitaso} width="200px"/>
            <img src={endress} width="200px"/>
            <img src={iese} width="200px"/>
        </Box>)
}