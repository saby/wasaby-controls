import type { Collection as ICollection } from 'Controls/display';
import type { TCollectionType } from '../_interface/IAbstractListSliceTypes';

function validateCollectionAlias(
    name: TCollectionType | undefined
): TCollectionType | undefined | never {
    if (
        typeof name === 'undefined' ||
        name === 'Tree' ||
        name === 'TreeGrid' ||
        name === 'Columns'
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (collection['[Controls/treeGrid:TreeGridCollection]']) {
            alias = 'TreeGrid';
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
        } else if (collection['[Controls/tree:TreeCollection]']) {
            alias = 'Tree';
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
        } else if (collection['[Controls/columns:ColumnsCollection]']) {
            alias = 'Columns';
        }
    }

    return validateCollectionAlias(alias);
}
