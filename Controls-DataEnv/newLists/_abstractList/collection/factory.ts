import type { Collection as ICollection, ICollectionOptions } from 'Controls/display';
import type { TCollectionType } from './types';
import type { IAbstractListState } from '../interface/IAbstractListState';

import getGridOptions from './factory/_getGridOptions';
import getTreeOptions from './factory/_getTreeOptions';
import getTreeGridOptions from './factory/_getTreeGridOptions';
import getTileOptions from './factory/_getTileOptions';
import getTreeTileOptions from './factory/_getTreeTileOptions';
import getAdaptiveTileCollection from './factory/_getAdaptiveTileCollection';
import getSearchTreeGridOptions from './factory/_getSearchTreeGridOptions';
import getSearchTreeTileOptions from './factory/_getSearchTreeTileOptions';
import { loadSync } from 'WasabyLoader/ModulesLoader';

const COLLECTION_CTOR_GETTER: Record<
    Exclude<TCollectionType, 'List' | 'Columns'>,
    () => typeof ICollection
> = {
    Grid: () =>
        loadSync<typeof import('Controls/gridDisplay')>('Controls/gridDisplay')
            .GridCollection as unknown as typeof ICollection,
    Tile: () =>
        loadSync<typeof import('Controls/tile')>('Controls/tile')
            .TileCollection as unknown as typeof ICollection,
    Tree: () =>
        loadSync<typeof import('Controls/tree')>('Controls/tree')
            .TreeCollection as unknown as typeof ICollection,
    TreeGrid: () =>
        loadSync<typeof import('Controls/treeGridDisplay')>('Controls/treeGridDisplay')
            .TreeGridCollection as unknown as typeof ICollection,
    TreeTile: () =>
        loadSync<typeof import('Controls/treeTile')>('Controls/treeTile')
            .TreeTileCollection as unknown as typeof ICollection,
    AdaptiveTile: () =>
        loadSync<typeof import('Controls/adaptiveTile')>('Controls/adaptiveTile')
            .Collection as unknown as typeof ICollection,
    SearchTreeGrid: () =>
        loadSync<typeof import('Controls/searchBreadcrumbsGrid')>('Controls/searchBreadcrumbsGrid')
            .SearchGridCollection as unknown as typeof ICollection,
    SearchTreeTile: () =>
        loadSync<typeof import('Controls/searchBreadcrumbsTile')>('Controls/searchBreadcrumbsTile')
            .SearchTileCollection as unknown as typeof ICollection,
};

const COLLECTION_OPTIONS_GETTER: Record<
    Exclude<TCollectionType, 'List' | 'Columns'>,
    (state: IAbstractListState) => object
> = {
    Grid: getGridOptions,
    Tree: getTreeOptions,
    TreeGrid: getTreeGridOptions,
    Tile: getTileOptions,
    TreeTile: getTreeTileOptions,
    AdaptiveTile: getAdaptiveTileCollection,
    SearchTreeGrid: getSearchTreeGridOptions,
    SearchTreeTile: getSearchTreeTileOptions,
};

export function createCollection(type: TCollectionType, state: IAbstractListState): ICollection {
    if (type === 'List' || type === 'Columns') {
        throw Error('This factory is not implemented!');
    }
    const ctor = COLLECTION_CTOR_GETTER[type]();
    const options = COLLECTION_OPTIONS_GETTER[type](state) as ICollectionOptions;
    return new ctor(options);
}
