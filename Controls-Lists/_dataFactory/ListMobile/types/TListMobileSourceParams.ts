/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
type TRpcEndpoint = {
    address: string;
    contract: string;
};

export type TListMobileSourceParams = {
    collectionEndpoint: TRpcEndpoint;
    collectionStorageEndpoint: TRpcEndpoint;
    observerEndpoint: TRpcEndpoint;
};
