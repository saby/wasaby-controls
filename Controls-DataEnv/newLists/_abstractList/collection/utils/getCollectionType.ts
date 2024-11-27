import type { TCollectionType } from '../types/TCollectionType';
import type { TViewMode } from 'Controls-DataEnv/interface';

export const getCollectionType = (
    collectionType?: TCollectionType,
    viewMode?: TViewMode
): TCollectionType | undefined | never => {
    if (!collectionType) {
        return;
    }

    const result = viewMode ? getCollectionTypeByViewMode(viewMode) : collectionType;

    return validateCollectionType(result);
};

function getCollectionTypeByViewMode(viewMode: TViewMode): TCollectionType | undefined {
    const map: Record<TViewMode, TCollectionType | undefined> = {
        list: 'List',
        table: 'TreeGrid',
        tile: 'TreeTile',
        search: undefined,
        searchTile: undefined,
        composite: undefined,
    };
    return map[viewMode];
}

function validateCollectionType(name: TCollectionType | undefined): TCollectionType | never {
    if (
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
    } else {
        if (typeof name === 'undefined') {
            throw Error(
                'В аргументах фабрики не фабрики не задан обязательный параметр collectionType!'
            );
        } else {
            throw Error(`Unsupported collection: ${name}!`);
        }
    }
}
