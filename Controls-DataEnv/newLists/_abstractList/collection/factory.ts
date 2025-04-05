import type { Collection as ICollection, ICollectionOptions } from 'Controls/display';
import type { TCollectionType } from './types';
import type { IAbstractListState } from '../interface/IAbstractListState';

import getListOptions from './factory/_getListOptions';
import getGridOptions from './factory/_getGridOptions';
import getTreeOptions from './factory/_getTreeOptions';
import getTreeGridOptions from './factory/_getTreeGridOptions';
import getTileOptions from './factory/_getTileOptions';
import getTreeTileOptions from './factory/_getTreeTileOptions';
import getAdaptiveTileCollection from './factory/_getAdaptiveTileCollection';
import getSearchTreeGridOptions from './factory/_getSearchTreeGridOptions';
import getSearchTreeTileOptions from './factory/_getSearchTreeTileOptions';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { LibPaths } from 'Controls-DataEnv/staticLoader';

const COLLECTION_CTOR_GETTER: Record<TCollectionType, () => typeof ICollection> = {
    List: () =>
        loadSync<typeof import('Controls/display')>(LibPaths.ListDisplay)
            .Collection as unknown as typeof ICollection,
    Grid: () =>
        loadSync<typeof import('Controls/gridDisplay')>(LibPaths.GridDisplay)
            .GridCollection as unknown as typeof ICollection,
    Tile: () =>
        loadSync<typeof import('Controls/tile')>(LibPaths.Tile)
            .TileCollection as unknown as typeof ICollection,
    Tree: () =>
        loadSync<typeof import('Controls/tree')>(LibPaths.Tree)
            .TreeCollection as unknown as typeof ICollection,
    TreeGrid: () =>
        loadSync<typeof import('Controls/treeGridDisplay')>(LibPaths.TreeGridDisplay)
            .TreeGridCollection as unknown as typeof ICollection,
    TreeTile: () =>
        loadSync<typeof import('Controls/treeTile')>(LibPaths.TreeTile)
            .TreeTileCollection as unknown as typeof ICollection,
    AdaptiveTile: () =>
        loadSync<typeof import('Controls/adaptiveTile')>(LibPaths.AdaptiveTile)
            .Collection as unknown as typeof ICollection,
    SearchTreeGrid: () =>
        loadSync<typeof import('Controls/searchBreadcrumbsGrid')>(LibPaths.SearchBreadcrumbsGrid)
            .SearchGridCollection as unknown as typeof ICollection,
    SearchTreeTile: () =>
        loadSync<typeof import('Controls/searchBreadcrumbsTile')>(LibPaths.SearchBreadcrumbsTile)
            .SearchTileCollection as unknown as typeof ICollection,
    Columns: () =>
        loadSync<typeof import('Controls/columns')>(LibPaths.Columns)
            .ColumnsCollection as unknown as typeof ICollection,
};

const COLLECTION_OPTIONS_GETTER: Record<TCollectionType, (state: IAbstractListState) => object> = {
    List: getListOptions,
    Grid: getGridOptions,
    Tree: getTreeOptions,
    TreeGrid: getTreeGridOptions,
    Tile: getTileOptions,
    TreeTile: getTreeTileOptions,
    AdaptiveTile: getAdaptiveTileCollection,
    SearchTreeGrid: getSearchTreeGridOptions,
    SearchTreeTile: getSearchTreeTileOptions,
    // TODO: Поддержать когда придет время
    Columns: getListOptions,
};

/**
 * @private
 */
export function getCollectionOptions(
    type: TCollectionType,
    state: IAbstractListState
): ICollectionOptions {
    return COLLECTION_OPTIONS_GETTER[type](state) as ICollectionOptions;
}

/**
 * @private
 */
export function createCollection(type: TCollectionType, state: IAbstractListState): ICollection {
    const ctor = COLLECTION_CTOR_GETTER[type]();
    return new ctor(getCollectionOptions(type, state));
}
