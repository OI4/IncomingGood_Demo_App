import { Box } from '@mui/material'
import endress from './assets/EH_Logo-d9672165.svg'
import iese from './assets/iese_rgb-1024x291.gif'
import metalevel from './assets/ml-logo-dark.svg'
import murr from './assets/Murrelektronik.svg'
import xitaso from './assets/XitasoLogoBlack.svg'
import { BackendService } from './Services/BackendService'
export function Footer (props: {backendService: BackendService }) {
        return (
        <Box display="flex" justifyContent="space-between" ml={10} mr={10} gap={3}>
            <img src={murr} width="150px" alt="murr-logo"/>
            <img src={metalevel} width="200px" onClick={() => props.backendService.setCurrentBackend('metalevel')} alt="ml-logo"/>
            <img src={xitaso} width="200px" onClick={() => props.backendService.setCurrentBackend('xitaso')} alt="xitaso-Logo"/>
            <img src={endress} width="200px" alt="eh-logo"/>
            <img src={iese} width="200px" alt="ieseLogo"/>
        </Box>)
}