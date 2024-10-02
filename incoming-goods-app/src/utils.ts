import { AssetAdministrationShellDescriptor, SubmodelDescriptor } from "./interfaces";


export function loadShell( shell_descriptor: AssetAdministrationShellDescriptor) {
    const headers: Record<string, string> = {}
    const method = 'GET'
    const endpoints = shell_descriptor.endpoints
    if(endpoints && endpoints.length) {
        const href = endpoints[0].protocolInformation.href
        const url = href.startsWith('http')?href:('https://'+href)
        return fetch(url, {method, headers})
    }
}


    
export function loadSubmodel( submodel_descriptor: SubmodelDescriptor) {
    const headers: Record<string, string> = {}
    const method = 'GET'
    const endpoints = submodel_descriptor.endpoints
    if(endpoints && endpoints.length) {
        const href = endpoints[0].protocolInformation.href
        const url = href.startsWith('http')?href:('https://'+href)
        return fetch(url, {method, headers})
    }
}