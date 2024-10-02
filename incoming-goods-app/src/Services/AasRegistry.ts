import { Buffer } from 'buffer';
import { AssetAdministrationShellDescriptor } from '../interfaces';

export class AasRegistry {
    private constructor(
        protected readonly aasRegistryClient: AasRegistryClient) {
    }

    static create(_baseUrl: string = ''): AasRegistry {
    const aasRegistryClient = new AasRegistryClient(_baseUrl);
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
    private readonly baseUrl: string;

    constructor(
        protected _baseUrl: string = '') {
        this.baseUrl = _baseUrl;
    }

    async getAasDescriptorByAasId(aasId: string) {
        return this.getAssetAdministrationShellDescriptorsByAasId(aasId);
    }

    async getAssetAdministrationShellDescriptorsByAasId(
        aasId: string
    ): Promise<AssetAdministrationShellDescriptor> {

        const url = new URL(`${this.baseUrl}/shell-descriptors/${encodeBase64(aasId)}`);

        const response = await fetch(url.toString(), {
            method: 'GET'
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
