/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { Collection as ICollection } from 'Controls/display';
import type { TCollectionType } from '../_interface/IAbstractListSliceTypes';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { addPageDeps } from 'UICommon/Deps';

const MODULE_NAME_TO_COLLECTION_TYPE_MAP = new Map<string, TCollectionType>([
    ['Controls/treeGrid:TreeGridCollection', 'TreeGrid'],
    ['Controls/tree:TreeCollection', 'Tree'],
    ['Controls/columns:ColumnsCollection', 'Columns'],
    ['Controls/grid:GridCollection', 'Grid'],
    ['Controls/gridReact:GridCollection', 'Grid'],
    ['Controls/display:Collection', 'List'],
    ['Controls/tile:TileCollection', 'Tile'],
    ['Controls/treeTile:TreeTileCollection', 'TreeTile'],
    ['Controls/adaptiveTile:Collection', 'AdaptiveTile'],
]);

const COLLECTION_TYPE_TO_LIB_PATH_MAP = new Map<TCollectionType, string>([
    ['TreeGrid', 'Controls/treeGrid'],
    ['Tree', 'Controls/tree'],
    ['Columns', 'Controls/columns'],
    ['Grid', 'Controls/grid'],
    ['List', 'Controls/display'],
    ['Tile', 'Controls/tile'],
    ['TreeTile', 'Controls/treeTile'],
    ['AdaptiveTile', 'Controls/adaptiveTile'],
]);

function validateCollectionAlias(
    name: TCollectionType | undefined
): TCollectionType | undefined | never {
    if (
        typeof name === 'undefined' ||
        name === 'Tree' ||
        name === 'TreeGrid' ||
        name === 'Columns' ||
        name === 'Grid' ||
        name === 'List' ||
        name === 'Tile' ||
        name === 'TreeTile' ||
        name === 'AdaptiveTile'
    ) {
        return name;
    }

    (function checkThatAllChecked(type: never): never {
        throw Error(`Unsupported collection: ${type}!`);
    })(name);
}

export default function resolveCollectionType<T extends ICollection>(
    collection: T
): TCollectionType | undefined | never {
    let alias: TCollectionType | undefined;

    if (collection) {
        alias = MODULE_NAME_TO_COLLECTION_TYPE_MAP.get(collection._moduleName);
    }

    return validateCollectionAlias(alias);
}

export async function loadCollectionModule(
    collectionType: TCollectionType,
    shouldAddPageDeps: boolean
): Promise<void> {
    const libName = COLLECTION_TYPE_TO_LIB_PATH_MAP.get(collectionType);

    if (!libName) {
        return;
    }

    await loadAsync(libName);

    if (shouldAddPageDeps) {
        addPageDeps([libName]);
    }
}
