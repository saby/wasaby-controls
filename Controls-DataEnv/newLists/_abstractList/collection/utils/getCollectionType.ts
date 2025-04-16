import type { TCollectionType } from '../types/TCollectionType';
import type { TViewMode } from 'Controls-DataEnv/interface';
import type { Collection as ICollection } from 'Controls/display';
import { SUPPORTED_COLLECTION_TYPES } from '../constants';

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
    ['Controls/searchBreadcrumbsGrid:SearchGridCollection', 'SearchTreeGrid'],
    ['Controls/searchBreadcrumbsTile:SearchTileCollection', 'SearchTreeTile'],
]);

/**
 * Утилитная функция для проверки содержания имени коллекции в списке доступных для списочных слайсов
 * */
function isSupportedCollection(name: TCollectionType): name is TCollectionType {
    return SUPPORTED_COLLECTION_TYPES.includes(name);
}

/**
 * Утилитная функция для валидации имени коллекции по списку доступных для списочных слайсов
 * */
function validateCollectionAlias(
    name: TCollectionType | undefined
): TCollectionType | undefined | never {
    if (typeof name === 'undefined' || isSupportedCollection(name)) {
        return name;
    }

    (function checkThatAllChecked(type: never): never {
        // Не выносим дескриптор, т.к. нужно синхронно выдавать ошибку.
        throw Error(`Unsupported collection: ${type}!`);
    })(name);
}

/**
 * Утилитная функция для получения типа коллекции по имени
 * @private
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
 * @private
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
        search: 'SearchTreeGrid',
        searchTile: 'SearchTreeTile',
        composite: undefined,
    };
    return map[viewMode];
}

/**
 * Утилитная функция для валидации имени коллекции по списку доступных для списочных слайсов
 * */
function validateCollectionType(name: TCollectionType | undefined): TCollectionType | never {
    if (name && isSupportedCollection(name)) {
        return name;
    } else {
        // Не выносим дескриптор, т.к. нужно синхронно выдавать ошибку.
        if (typeof name === 'undefined') {
            throw Error('В аргументах фабрики не задан обязательный параметр collectionType!');
        } else {
            throw Error(`Unsupported collection: ${name}!`);
        }
    }
}
