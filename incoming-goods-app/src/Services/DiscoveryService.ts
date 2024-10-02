import { Buffer } from 'buffer';

export class DiscoveryService {
    private constructor(
        protected readonly discoveryServiceClient: DiscoveryServiceClient) {
    }

    static create(_baseUrl: string = ''): DiscoveryService {
    const discoveryServiceClient = new DiscoveryServiceClient(_baseUrl);
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
    private readonly baseUrl: string;

    constructor(
        protected _baseUrl: string = '') {
        this.baseUrl = _baseUrl;
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
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const url = new URL(`${this.baseUrl}/lookup/shells`);

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
