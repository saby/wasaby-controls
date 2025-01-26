/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TCollectionType } from '../_interface/IAbstractListSliceTypes';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { addPageDeps } from 'UICommon/Deps';

const COLLECTION_TYPE_TO_LIB_PATH_MAP = new Map<TCollectionType, string>([
    ['TreeGrid', 'Controls/treeGridDisplay'],
    ['Tree', 'Controls/tree'],
    ['Columns', 'Controls/columns'],
    ['Grid', 'Controls/gridDisplay'],
    ['List', 'Controls/display'],
    ['Tile', 'Controls/tile'],
    ['TreeTile', 'Controls/treeTile'],
    ['AdaptiveTile', 'Controls/adaptiveTile'],
]);

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
