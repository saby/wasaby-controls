import type { IAbstractListState, TCollectionType } from 'Controls-DataEnv/abstractList';

/**
 *
 */
export type TState = Pick<
    IAbstractListState,
    | 'viewMode'
    | 'isLatestInteractorVersion'
    | 'items'
    | 'nodeProperty'
    | 'isDebugging'
    | 'markerVisibility'
    | 'multiSelectVisibility'
    | 'markedKey'
    | 'itemActions'
> & {
    collectionType?: TCollectionType;
};
