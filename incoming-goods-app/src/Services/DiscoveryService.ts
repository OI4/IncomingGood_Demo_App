import { Buffer } from 'buffer';
import { BackendService } from './BackendService';

export class DiscoveryService {
    private constructor(
        protected readonly discoveryServiceClient: DiscoveryServiceClient) {
    }

    static create(backendService: BackendService): DiscoveryService {
    const discoveryServiceClient = new DiscoveryServiceClient(backendService);
    return new DiscoveryService(discoveryServiceClient);
    }
    
    async getAasIdFromDiscovery(searchAssetId: string): Promise<string[] | null> {
        try {
            if (!searchAssetId) {
                throw new Error();
            }
            const aasIds = (await this.discoveryServiceClient.getAasIdsByAssetId(searchAssetId.trim())).result;

            if (aasIds.length === 0) {
                throw new Error();
            }

            return aasIds;
        } catch (e) {
            console.warn('Could not be found in the discovery service, will continue to look in the AAS registry');
            return null;
        }
    }
}

export class DiscoveryServiceClient {
    private readonly backendService: BackendService;

    constructor(
        protected _backendService: BackendService) {
        this.backendService = _backendService;
    }

    async getAasIdsByAssetId(assetId: string) {
        return this.getAllAssetAdministrationShellIdsByAssetLink([
            {
                name: 'globalAssetId',
                value: assetId
            }
        ]);
    }

    async getAllAssetAdministrationShellIdsByAssetLink(
        assetIds: { name: string; value: string }[]
    ): Promise<{ paging_metadata: string; result: string[] }> {
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

        const url = new URL(`${this.backendService.currentBackend.discovery}/lookup/shells`);

        assetIds.forEach((obj) => {
            url.searchParams.append('assetIds', encodeBase64(JSON.stringify(obj)));
        });

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
