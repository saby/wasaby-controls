/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { Collection as ICollection } from 'Controls/display';
import type { TCollectionType } from './types';
import type { IAbstractListState } from '../interface/IAbstractListState';

import { create as diCreate } from 'Types/di';

import getGridOptions from './factory/_getGridOptions';
import getTreeOptions from './factory/_getTreeOptions';
import getTreeGridOptions from './factory/_getTreeGridOptions';
import getTileOptions from './factory/_getTileOptions';
import getTreeTileOptions from './factory/_getTreeTileOptions';
import getAdaptiveTileCollection from './factory/_getAdaptiveTileCollection';

const COLLECTION_LIBS: Record<Exclude<TCollectionType, 'List' | 'Columns'>, string> = {
    Grid: 'Controls/grid:GridCollection',
    Tile: 'Controls/tile:TileCollection',
    Tree: 'Controls/tree:TreeCollection',
    TreeGrid: 'Controls/treeGrid:TreeGridCollection',
    TreeTile: 'Controls/treeTile:TreeTileCollection',
    AdaptiveTile: 'Controls/adaptiveTile:Collection',
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
};

export function createCollection(type: TCollectionType, state: IAbstractListState): ICollection {
    if (type === 'List' || type === 'Columns') {
        throw Error('This factory is not implemented!');
    }
    return diCreate(COLLECTION_LIBS[type], COLLECTION_OPTIONS_GETTER[type](state));
}
