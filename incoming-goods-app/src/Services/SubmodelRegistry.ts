import { Buffer } from 'buffer';
import { SubmodelDescriptor } from '../interfaces';

export class SubmodelRegistry {
    private constructor(
        protected readonly smRegistryClient: SubmodelRegistryClient) {
    }

    static create(_baseUrl: string = ''): SubmodelRegistry {
    const smRegistryClient = new SubmodelRegistryClient(_baseUrl);
    return new SubmodelRegistry(smRegistryClient);
    }
    
    async getSmDescriptorFromRegistry(smId: string): Promise<SubmodelDescriptor | null> {
        try {
            if (!smId) {
                throw new Error();
            }

            const smDescriptor = (await this.smRegistryClient.getSmDescriptorByAasId(smId));

            return smDescriptor;
        } catch (e) {
            console.error('Error: Could not be found in the Submodel registry');
            return null;
        }
    }
}

export class SubmodelRegistryClient {
    private readonly baseUrl: string;

    constructor(
        protected _baseUrl: string = '') {
        this.baseUrl = _baseUrl;
    }

    async getSmDescriptorByAasId(smId: string) {
        return this.getSubmodelDescriptorsBySmId(smId);
    }

    async getSubmodelDescriptorsBySmId(
        smId: string
    ): Promise<SubmodelDescriptor> {

        const url = new URL(`${this.baseUrl}/submodel-descriptors/${encodeBase64(smId)}`);

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
