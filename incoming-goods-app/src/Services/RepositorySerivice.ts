import {
    AssetAdministrationShell,
    Reference,
    Submodel,
} from "@aas-core-works/aas-core3.0-typescript/types";
import {
    AASAndSubmodels,
    AssetAdministrationShellDescriptor,
    Endpoint,
    SubmodelDescriptor,
} from "../interfaces";
import { BackendService } from "./BackendService";

export class RepositoryService {
    private readonly backendService: BackendService;

    constructor(
        protected readonly repositoryServiceClient: RepositoryServiceClient,
        protected _backendService: BackendService,
    ) {
        this.backendService = _backendService;
    }

    static create(backendService: BackendService): RepositoryService {
        const repositoryServiceClient = new RepositoryServiceClient(backendService);
        return new RepositoryService(repositoryServiceClient, backendService);
    }

    async getAasandSubomdelsFromRepository(
        assetAdministrationShellDescriptor: AssetAdministrationShellDescriptor | null,
        submodelDescriptors: Array<SubmodelDescriptor> | null
    ): Promise<AASAndSubmodels | null | undefined> {
        try {
            if (!assetAdministrationShellDescriptor) {
                throw new Error();
            }

            const aasUrl: string | null =
                getUrlFromEndpoints(
                    assetAdministrationShellDescriptor.endpoints
                );
            if (!aasUrl) {
                throw new Error(
                    "AssetAdministratoinShell descriptor contains no endpoints"
                );
            }

            const aas: AssetAdministrationShell | null =
                await this.repositoryServiceClient.getAasByUrl(aasUrl);
            if (!aas) {
                throw new Error(
                    "AssetAdministratoinShell not found at the endpoint specified by its descriptor"
                );
            }

            const thumbailUrl: string | null =
                await this.repositoryServiceClient.getAasThumbnailByAasUrl(aasUrl);

            const nameplateDescriptor: SubmodelDescriptor | null =
                submodelDescriptors?.find(
                    (smd) => smd.idShort === "Nameplate"
                ) || null;
            if (!nameplateDescriptor) {
                console.warn("No Nameplate Data")

            }
            const nameplateUrl: string | null =
                getUrlFromEndpoints(
                    nameplateDescriptor?.endpoints
                );
            const nameplate: Submodel | null =
                await this.repositoryServiceClient.getSmByUrl(nameplateUrl);
            if (!nameplate) {
                console.warn("No Nameplate Data")
            }

            const technicalDataDescriptor: SubmodelDescriptor | null =
                submodelDescriptors?.find(
                    (smd) => smd.idShort === "TechnicalData"
                ) || null;
            if (!technicalDataDescriptor) {
                console.warn("No Technical Data")
            }
            const technicalDataUrl: string | null =
                getUrlFromEndpoints(
                    technicalDataDescriptor?.endpoints
                );
            const technicalData: Submodel | null =
                await this.repositoryServiceClient.getSmByUrl(technicalDataUrl);
            if (!technicalData) {
                console.warn("No Technical Data")
            }

            return {
                assetAdministrationShell: {
                    shell: aas,
                    thumbnail: thumbailUrl,
                    url: aasUrl,
                },
                nameplate: {
                    submodel: nameplate,
                    url: nameplateUrl,
                },
                technicalData: {
                    submodel: technicalData,
                    url: technicalDataUrl,
                },
            };
        } catch (e) {
            console.warn(e);
            //throw(e);
        }
    }

    async getSubmodelRefsByAasUrl(url: string | null): Promise<Array<Reference> | null> {
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
        const method = 'GET'

        const submodelRefUrl = new URL(`${url}/submodel-refs`);

        if (url) {
            const response = await fetch(submodelRefUrl, { method, headers })
            if (response.ok) {
                const paginatedResponse = await response.json()
                const smRefs = paginatedResponse.result;
                return smRefs as Array<Reference>;
            } else {
                return Promise.resolve(null)
            }
        } else {
            return Promise.resolve(null)
        }
    }
}

export class RepositoryServiceClient {
    private readonly backendService: BackendService;

    constructor(
        protected _backendService: BackendService) {
        this.backendService = _backendService;
    }

    async getAasByUrl(
        url: string | null
    ): Promise<AssetAdministrationShell | null> {
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
        const method = "GET";
        try {
            if (url) {
                const response = await fetch(url, { method, headers });
                if (response.ok) {
                    const shell = await response.json();
                    return shell as AssetAdministrationShell;
                } else {
                    return Promise.resolve(null);
                }
            } else {
                return Promise.resolve(null);
            }
        } catch (e) {
            console.warn("Failed to fetch asset administration shell" + e);
        }
        return Promise.resolve(null);
    }

    async getAasThumbnailByAasUrl(aasUrl: string): Promise<string | null> {
        let headers;
        if (this.backendService.currentBackend.apiKey) {
            headers = {
                Accept: '*/*',
                'Content-Type': 'application/json',
                'Apikey': this.backendService.currentBackend.apiKey
            };
        } else {
            headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            };
        }
        const method = "GET";
        try {
            if (aasUrl) {
                const url =
                    (aasUrl.endsWith("/") ? aasUrl : aasUrl + "/") +
                    "asset-information/thumbnail";
                const response = await fetch(url, { method, headers });
                if (response.ok) {
                    const thumbailData = await response.blob();
                    const thumbailObjectUrl = URL.createObjectURL(thumbailData);
                    return thumbailObjectUrl;
                } else {
                    return Promise.resolve(null);
                }
            } else {
                return Promise.resolve(null);
            }
        } catch (e) {
            console.warn("Failed to fetch thumbnail" + e);
        }
        return Promise.resolve(null);
    }

    async getSmByUrl(url: string | null): Promise<Submodel | null> {
        let headers;
        if (this.backendService.currentBackend.apiKey) {
            headers = {
                Accept: '*/*',
                'Content-Type': 'application/json',
                'Apikey': this.backendService.currentBackend.apiKey
            };
        } else {
            headers = {
                Accept: '*/*',
                'Content-Type': 'application/json'
            };
        }
        const method = "GET";
        try {
            if (url) {
                const response = await fetch(url, { method, headers });
                if (response.ok) {
                    const shell = await response.json();
                    return shell as Submodel;
                } else {
                    return Promise.resolve(null);
                }
            } else {
                return Promise.resolve(null);
            }
        } catch (e) {
            console.warn("failed to catch submodel " + e);
            return Promise.resolve(null);
        }
    }

    async updateSubmodelElement(repositoryEndpoint: string, idShortPath: string, inputValue: string | number): Promise<Response> {
        let headers;
        if (this.backendService.currentBackend.apiKey) {
            headers = {
                Accept: '*/*',
                'Content-Type': 'application/json',
                'Apikey': this.backendService.currentBackend.apiKey
            };
        } else {
            headers = {
                Accept: '*/*',
                'Content-Type': 'application/json'
            };
        }
        const method = 'PATCH'

        return fetch(repositoryEndpoint + '/submodel-elements/' + idShortPath + '/$value', {
        method,
        headers,
        body: JSON.stringify(String(inputValue))
        })
    }
}

export function getUrlFromEndpoints(endpoints: Array<Endpoint> | undefined): string | null {
    if (endpoints?.length) {
        const href = endpoints[0].protocolInformation.href;
        if (href) {
        const url = href.startsWith("http") ? href : "https://" + href;
        return url;
        }
    }
    console.warn("No endpoints found");
    return null;
}
