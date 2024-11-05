export class BackendService {
    private availableBackends: AvailableBackend[] = [
        {
            name: 'xitaso', 
            discovery: 'https://oi4-sps24-mnestix-api.azurewebsites.net/discovery', 
            aasRegistry: 'https://mnestix-basyx-aas-registry-b36325a9.azurewebsites.net',
            smRegistry: 'https://mnestix-basyx-submodel-registry-b36325a9.azurewebsites.net',
            apiKey: 'A5Z2w$@S%>0M'
        },
        {
            name: 'metalevel',
            discovery: 'https://designer-demo.meta-level.de/aas-proxy/discovery',
            aasRegistry: 'https://designer-demo.meta-level.de/aas-proxy/aas-registry',
            smRegistry: 'https://designer-demo.meta-level.de/aas-proxy/sm-registry',
            apiKey: '30fe2781-3f2c-4e45-a2aa-0d7720f35909'
        },
    ]
    currentBackend = this.availableBackends[0];
    
    setCurrentBackend(name: string) {
        console.log('Setting backend to:', name);
        const foundBackend = this.availableBackends.find(backend => backend.name === name);
        if (foundBackend) {
            this.currentBackend = foundBackend;
        }
    }
}

export interface AvailableBackend {
    name: string,
    discovery: string,
    aasRegistry: string,
    smRegistry: string,
    apiKey: string | null
}