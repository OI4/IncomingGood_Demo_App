import {
    AASAndSubmodels,
    AssetAdministrationShellDescriptor,
    Endpoint,
    SubmodelDescriptor,
} from "../interfaces";
import {
    AssetAdministrationShell,
    Submodel,
    Reference,
} from "@aas-core-works/aas-core3.0-typescript/types";

export class RepositoryService {
    private constructor(
        protected readonly repositoryServiceClient: RepositoryServiceClient
    ) { }

    static create(): RepositoryService {
        const repositoryServiceClient = new RepositoryServiceClient();
        return new RepositoryService(repositoryServiceClient);
    }

    async getAasandSubomdelsFromRepository(
        assetAdministrationShellDescriptor: AssetAdministrationShellDescriptor | null
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
                assetAdministrationShellDescriptor.submodelDescriptors?.find(
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
                assetAdministrationShellDescriptor.submodelDescriptors?.find(
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
        const headers: Record<string, string> = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
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
    async getAasByUrl(
        url: string | null
    ): Promise<AssetAdministrationShell | null> {
        const headers: Record<string, string> = {
            Accept: "application/json",
        };
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
        const headers: Record<string, string> = {
            Accept: "*/*",
            "Content-Type": "application/json",
        };
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
        const headers: Record<string, string> = {
            Accept: "application/json",
        };
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

  async updateSubmodelElement(repositoryEndpoint: string, idShortPath: string, inputValue: string | number) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'ApiKey': 'A5Z2w$@S%>0M',
      'Accept': '*/*'
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
    if (endpoints && endpoints.length) {
      const href = endpoints[0].protocolInformation.href;
      if (href) {
        const url = href.startsWith("http") ? href : "https://" + href;
        return url;
      }
    }
    console.warn("No endpoints found");
    return null;
  }
