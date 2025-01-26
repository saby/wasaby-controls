import type { TCollectionType } from '../types/TCollectionType';
import type { TViewMode } from 'Controls-DataEnv/interface';
import type { Collection as ICollection } from 'Controls/display';

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

/**
 * Утилитная функция для валидации имени коллекции по писку доступных для списочных слайсов
 * */
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

/**
 * Утилитная функция для получения типа коллекции по имени
 * */
export function resolveCollectionType<T extends ICollection>(
    collection: T
): TCollectionType | undefined | never {
    let alias: TCollectionType | undefined;

    if (collection) {
        // @ts-ignore
        alias = MODULE_NAME_TO_COLLECTION_TYPE_MAP.get(collection._moduleName);
    }

    return validateCollectionAlias(alias);
}

/**
 * Утилитная функция для определения типа коллекции по ViewMode и последующей валидации
 * */
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

/**
 * Утилитная функция для определения типа коллекции по ViewMode
 * */
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

/**
 * Утилитная функция для валидации имени коллекции по писку доступных для списочных слайсов
 * */
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
