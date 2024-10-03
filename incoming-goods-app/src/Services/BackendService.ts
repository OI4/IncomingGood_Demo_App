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
            discovery: 'https://designer.aas-suite.de/api',
            aasRegistry: 'https://designer.aas-suite.de/api',
            smRegistry: 'https://designer.aas-suite.de/api',
            apiKey: '9b8e3e05-a22a-4130-a60a-c4cc146495cc'
        }
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