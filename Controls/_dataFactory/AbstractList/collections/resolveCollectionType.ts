import type { Collection as ICollection } from 'Controls/display';
import type { TCollectionType } from '../_interface/IAbstractListSliceTypes';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { addPageDeps } from 'UICommon/Deps';

const MODULE_NAME_TO_COLLECTION_TYPE_MAP = new Map<string, TCollectionType>([
    ['Controls/treeGrid:TreeGridCollection', 'TreeGrid'],
    ['Controls/tree:TreeCollection', 'Tree'],
    ['Controls/columns:ColumnsCollection', 'Columns'],
    ['Controls/grid:GridCollection', 'Grid'],
    ['Controls/display:Collection', 'List'],
]);

const COLLECTION_TYPE_TO_LIB_PATH_MAP = new Map<TCollectionType, string>([
    ['TreeGrid', 'Controls/baseTreeGrid'],
    ['Tree', 'Controls/tree'],
    ['Columns', 'Controls/columns'],
    ['Grid', 'Controls/baseGrid'],
    ['List', 'Controls/display'],
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
        name === 'List'
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
