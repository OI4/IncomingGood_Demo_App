import { Buffer } from 'buffer';
import { AssetAdministrationShellDescriptor } from '../interfaces';
import { BackendService } from './BackendService';

export class AasRegistry {
    private constructor(
        protected readonly aasRegistryClient: AasRegistryClient) {
    }

    static create(backendService: BackendService): AasRegistry {
    const aasRegistryClient = new AasRegistryClient(backendService);
    return new AasRegistry(aasRegistryClient);
    }
    
    async getAasDescriptorFromRegistry(aasId: string): Promise<AssetAdministrationShellDescriptor | null> {
        try {
            if (!aasId) {
                throw new Error();
            }

            const aasDescriptor = (await this.aasRegistryClient.getAasDescriptorByAasId(aasId));

            return aasDescriptor;
        } catch (e) {
            console.error('Error: Could not be found in the AAS registry');
            return null;
        }
    }
}

export class AasRegistryClient {
    private readonly backendService: BackendService;

    constructor(
        protected _backendService: BackendService) {
        this.backendService = _backendService;
    }

    async getAasDescriptorByAasId(aasId: string) {
        return this.getAssetAdministrationShellDescriptorsByAasId(aasId);
    }

    async getAssetAdministrationShellDescriptorsByAasId(
        aasId: string
    ): Promise<AssetAdministrationShellDescriptor> {

        const url = new URL(`${this.backendService.currentBackend.aasRegistry}/shell-descriptors/${encodeBase64(aasId)}`);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Apikey': this.backendService.currentBackend.apiKey ?? ''
            }
        });

        if (response.ok) {
            return response.json();
        } else {
            throw response;
        }
    }
}

export function encodeBase64(str: string): string {
    return Base64EncodeUrl(Buffer.from(str).toString('base64'));
}

function Base64EncodeUrl(str: string) {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
