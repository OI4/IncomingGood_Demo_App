import { Buffer } from 'buffer';
import { SubmodelDescriptor } from '../interfaces';
import { BackendService } from './BackendService';

export class SubmodelRegistry {
    private constructor(
        protected readonly smRegistryClient: SubmodelRegistryClient) {
    }

    static create(backendService: BackendService): SubmodelRegistry {
    const smRegistryClient = new SubmodelRegistryClient(backendService);
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
    private readonly backendService: BackendService;

    constructor(
        protected _backendService: BackendService) {
        this.backendService = _backendService;
    }

    async getSmDescriptorByAasId(smId: string) {
        return this.getSubmodelDescriptorsBySmId(smId);
    }

    async getSubmodelDescriptorsBySmId(
        smId: string
    ): Promise<SubmodelDescriptor> {

        const url = new URL(`${this.backendService.currentBackend.smRegistry}/submodel-descriptors/${encodeBase64(smId)}`);

        let headers;
        if (this.backendService.currentBackend.apiKey) {
            headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Apikey': this.backendService.currentBackend.apiKey
            };
        } else {
            headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            };
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers
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
