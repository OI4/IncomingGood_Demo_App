import { AdministrativeInformation, AssetKind, SpecificAssetId, Reference, AssetAdministrationShell, Submodel} from "@aas-core-works/aas-core3.0-typescript/types";

export interface AssetAdministrationShellDescriptor {
    administration?: AdministrativeInformation;
    assetKind?: AssetKind;
    assetType?: string | null;
    endpoints?: Array<Endpoint>;
    globalAssetId?: string | null;
    idShort?: string | null;
    id: string;
    specificAssetId?: Array<SpecificAssetId>;
    submodelDescriptors?: Array<SubmodelDescriptor>;
}

export interface SubmodelDescriptor {
    administration?: AdministrativeInformation;
    endpoints?: Array<Endpoint>;
    idShort?: string | null;
    id: string;
    semanticId?: Reference;
    supplementalSemanticIds: Array<Reference>;
}



export interface Endpoint {
    protocolInformation: ProtocolInformation;
    interface: string | null;
}


interface ProtocolInformation {
    href: string;
    endpointProtocol?: string | null;
    endpointProtocolVersions?: Array<string | null>;
    subProtocol?: string | null;
    subProtocolBody?: string | null;
    subProtocolBodyEncoding?: string | null;
    securityAttributes: SecurityAttributeObject;
}


interface SecurityAttributeObject {
    type: SecurtiyTypeEnum;
    key: string;
    value: string;
}

enum SecurtiyTypeEnum {
    NONE = 'NONE',
    RFC_TLSA = 'RFC_TLSA',
    W3C_DID = 'W3C_DID'
}

export interface AASAndSubmodels {
    assetAdministrationShell: {
        shell: AssetAdministrationShell | null
        url: string | null
    } | null
    nameplate: {
        submodel: Submodel | null
        url: string | null
    } | null
    technicalData: {
        submodel: Submodel | null
        url: string | null
    } | null
}