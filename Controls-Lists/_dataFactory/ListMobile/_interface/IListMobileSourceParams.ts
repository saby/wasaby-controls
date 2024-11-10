export type IRpcEndpoint = {
    address: string;
    contract: string;
};

export type IListMobileSourceParams = {
    observerEndpoint: IRpcEndpoint;
    collectionEndpoint: IRpcEndpoint;
};
