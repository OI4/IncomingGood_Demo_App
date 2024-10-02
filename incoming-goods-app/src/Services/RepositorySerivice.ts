import { AASAndSubmodels, AssetAdministrationShellDescriptor, Endpoint, SubmodelDescriptor } from '../interfaces';
import { AssetAdministrationShell, Submodel, Reference } from '@aas-core-works/aas-core3.0-typescript/types';

export class RepositoryService {
    private constructor(
        protected readonly repositoryServiceClient: RepositoryServiceClient) {
    }

    static create(): RepositoryService {
    const repositoryServiceClient = new RepositoryServiceClient();
    return new RepositoryService(repositoryServiceClient);
    }
    
    async getAasandSubomdelsFromRepository(assetAdministrationShellDescriptor: AssetAdministrationShellDescriptor | null): Promise<AASAndSubmodels| null> {
        try {
            if (!assetAdministrationShellDescriptor) {
                throw new Error();
            }

            const aasUrl: string|null = getUrlFromEndpoints(assetAdministrationShellDescriptor.endpoints)
            const aas: AssetAdministrationShell | null = (await this.repositoryServiceClient.getAasByUrl(aasUrl));
            if (!aas) {
                throw new Error('AssetAdministratoinShell not found at the endpoint specified by its descriptor');
            }

            const nameplateDescriptor: SubmodelDescriptor | null = assetAdministrationShellDescriptor.submodelDescriptors?.find(smd=>smd.idShort === 'Nameplate') || null
            if (!nameplateDescriptor) {
                throw new Error('AssetAdministratoinShellDescriptor contained no SubmodelDescriptor for Nameplate')
            }
            const nameplateUrl: string|null = getUrlFromEndpoints(nameplateDescriptor.endpoints)
            const nameplate: Submodel | null = (await  this.repositoryServiceClient.getSmByUrl(nameplateUrl))
            if (!nameplate) {
                throw new Error('Nameplate not found at the endpoint specified by its descriptor');
            }

            const technicalDataDescriptor: SubmodelDescriptor | null = assetAdministrationShellDescriptor.submodelDescriptors?.find(smd=>smd.idShort === 'TechnicalData') || null
            if (!technicalDataDescriptor) {
                throw new Error('AssetAdministratoinShellDescriptor contained no SubmodelDescriptor for Technical Data')
            }
            const technicalDataUrl: string|null = getUrlFromEndpoints(technicalDataDescriptor.endpoints)
            const technicalData: Submodel | null = (await  this.repositoryServiceClient.getSmByUrl(technicalDataUrl))
            if (!technicalData) {
                throw new Error('Technical Data not found at the endpoint specified by its descriptor');
            }


            return {
                assetAdministrationShell: {
                    shell: aas,
                    url: aasUrl
                },
                nameplate: {
                    submodel: nameplate,
                    url: nameplateUrl
                },
                technicalData: {
                    submodel: technicalData,
                    url: technicalDataUrl
                }
            }
        } catch (e) {
            console.warn(e);
            return null;
        }
    }

    async getSubmodelRefsByAasUrl( url: string | null): Promise<Array<Reference> | null> {
        const headers: Record<string, string> = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
        const method = 'GET'

        const submodelRefUrl = new URL(`${url}/submodel-refs`);
        
        if(url) {
            const response = await fetch(url, {method, headers})
            if (response.ok) {
                const paginatedResponse =  await response.json()
                const smRefs = paginatedResponse.result;
                return smRefs as Array<Reference>;
            } else {
                return Promise.resolve(null)}
        } else {
            return Promise.resolve(null)
        }
    }
}

export class RepositoryServiceClient {

    async getAasByUrl( url: string | null): Promise<AssetAdministrationShell | null> {
        const headers: Record<string, string> = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
        const method = 'GET'
        if(url) {
            const response = await fetch(url, {method, headers})
            if (response.ok) {
                const shell =  await response.json()
                return shell as AssetAdministrationShell
            } else {
                return Promise.resolve(null)}
        } else {
            return Promise.resolve(null)
        }
    }
    
    
        
    async getSmByUrl( url: string | null): Promise<Submodel | null> {
        const headers: Record<string, string> = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
        const method = 'GET'
        if(url) {
            const response = await fetch(url, {method, headers})
            if (response.ok) {
                const shell =  await response.json()
                return shell as Submodel
            } else {
                return Promise.resolve(null)}
        } else {
            return Promise.resolve(null)
        }
    }

}

export function getUrlFromEndpoints(endpoints: Array<Endpoint> | undefined): string | null{
    
    if(endpoints && endpoints.length) {
        const href = endpoints[0].protocolInformation.href
        if(href){
            const url = href.startsWith('http')?href:('https://'+href)
            return url
        }
    } 
    throw new Error('No endpoints found')
}
