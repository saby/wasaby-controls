/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
export type IRpcEndpoint = {
    address: string;
    contract: string;
};

export type IListMobileSourceParams = {
    observerEndpoint: IRpcEndpoint;
    collectionEndpoint: IRpcEndpoint;
};
