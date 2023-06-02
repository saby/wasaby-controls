/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { CollectionItem, itemsStrategy } from 'Controls/display';
import { IEnumerable, IList } from 'Types/collection';
import { object } from 'Types/util';
import { Model } from 'Types/entity';

export interface IOptions<S extends Model, T extends CollectionItem<S>>
    extends itemsStrategy.IAbstractOptions<S, T> {
    childrenProperty: string;
    root: string | Function;
}

interface ISortOptions {
    indexToPath: any[];
}

interface ISorter {
    name: string;
    enabled: boolean;
    method: Function;
    options: () => ISortOptions;
}

/**
 * Стратегия получения элементов проекции по материализованному пути из порядковых номеров элементов в коллекции
 * @class Controls/_baseTree/ItemsStrategy/MaterializedPath
 * @extends Controls/_display/ItemsStrategy/Abstract
 * @private
 */
export default class MaterializedPath<
    S extends Model,
    T extends CollectionItem<S> = CollectionItem<S>
> extends itemsStrategy.AbstractStrategy<S, T> {
    /**
     * @typedef {Object} Options
     * @property {Controls/_display/Collection} display Проекция
     * @property {String} childrenProperty Имя свойства, хранящего вложенных детей узла
     * @property {String} nodeProperty Имя свойства, хранящего признак "узел/лист"
     * @property {Controls/_display/TreeItem} root Корень
     */
    protected _options: IOptions<S, T>;

    /**
     * Соответствие "индекс в коллекции" - "путь"
     */
    protected _indexToPath: number[][] = [];

    getSorters(): ISorter[] {
        const sorters: ISorter[] = [];

        sorters.push({
            name: 'tree',
            enabled: true,
            method: MaterializedPath.sortItems,
            options: () => {
                return { indexToPath: this._indexToPath };
            },
        });

        return sorters;
    }

    // region IItemsStrategy

    get count(): number {
        let index = 0;
        while (this.at(index) !== undefined) {
            index++;
        }
        return index;
    }

    get items(): T[] {
        let index = 0;
        while (this.at(index) !== undefined) {
            index++;
        }
        return this._getItems();
    }

    at(index: number): T {
        const items = this._getItems();
        if (!items[index]) {
            const collection =
                this._getCollection() as unknown as IEnumerable<unknown> &
                    IList<unknown> &
                    unknown[];
            const path = MaterializedPathUtils.getPathToItem(index, {
                collection,
                childrenProperty: this._options.childrenProperty,
                indexToPath: this._indexToPath,
            });
            let contents;

            if (path) {
                contents = MaterializedPathUtils.getItemByPath(path, {
                    collection,
                    childrenProperty: this._options.childrenProperty,
                    indexToPath: this._indexToPath,
                });
            }

            if (contents) {
                items[index] = this.options.display.createItem({
                    contents,
                    parent: this._getParent(index, path),
                });
            }
        }

        return items[index];
    }

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        this._getItems().length = start;
        this._indexToPath.length = start;
        return [];
    }

    // endregion

    // region Protected

    /**
     * Возвращает родителя элемента с указанными порядковым номером и путем
     * @param index Порядковый номер элемента
     * @param path Путь до элемента
     * @protected
     */
    protected _getParent(index: number, path: number[]): T {
        const parentPath = path.slice(0, path.length - 1);
        if (parentPath.length) {
            const items = this._getItems();
            const collection =
                this._getCollection() as unknown as IEnumerable<unknown> &
                    IList<unknown> &
                    unknown[];
            const parentContents = MaterializedPathUtils.getItemByPath(
                parentPath,
                {
                    collection,
                    childrenProperty: this._options.childrenProperty,
                    indexToPath: this._indexToPath,
                }
            );
            if (parentContents) {
                for (let i = index - 1; i >= 0; i--) {
                    const item = items[i];
                    if (
                        item instanceof CollectionItem &&
                        item.getContents() === parentContents
                    ) {
                        return items[i];
                    }
                }
            }
        } else {
            return typeof this._options.root === 'function'
                ? this._options.root()
                : this._options.root;
        }
    }

    // endregion

    // region Statics

    /**
     * Создает индекс сортировки по материализованному пути - от корневой вершины вглубь до конечных вершин
     * @param items Элементы проекции.
     * @param current Текущий индекс сортировки
     * @param options Опции
     */
    static sortItems<T>(
        items: T[],
        current: number[],
        options: ISortOptions
    ): number[] {
        const indexToPath = options.indexToPath;
        const stringPathToIndex = {};
        const pathToString = (path) => {
            return path.join('.');
        };
        const getIndexByPath = (path) => {
            return stringPathToIndex[pathToString(path)];
        };
        const comparePaths = (pathA, pathB) => {
            const realIndexA = getIndexByPath(pathA);
            const realIndexB = getIndexByPath(pathB);

            return current.indexOf(realIndexA) - current.indexOf(realIndexB);
        };

        const stringIndexToPath = indexToPath.map(pathToString);

        stringIndexToPath.forEach((path, index) => {
            stringPathToIndex[path] = index;
        });

        return current.slice().sort((indexA, indexB) => {
            const pathA = indexToPath[indexA];
            const pathB = indexToPath[indexB];
            const pathALength = pathA.length;
            const pathBLength = pathB.length;
            const minLength = Math.min(pathALength, pathBLength);
            let result = 0;

            // Going deep into path and compare each level
            for (let level = 0; level < minLength; level++) {
                // Same paths are equal
                if (pathA[level] === pathB[level]) {
                    continue;
                }

                // Different paths possibly are not equal
                result = comparePaths(
                    pathA.slice(0, 1 + level),
                    pathB.slice(0, 1 + level)
                );

                if (result !== 0) {
                    // Paths are not equal
                    break;
                }
            }

            // Equal paths but various level: child has deeper level than parent, child should be after parent
            if (result === 0 && pathALength !== pathBLength) {
                result = pathALength - pathBLength;
            }

            return result;
        });
    }

    // endregion
}

Object.assign(MaterializedPath.prototype, {
    '[Controls/_baseTree/itemsStrategy/MaterializedPath]': true,
    _moduleName: 'Controls/display:itemsStrategy.MaterializedPath',
});

interface IMaterializedPathUtilOptions {
    collection: IEnumerable<unknown> & IList<unknown> & unknown[];
    childrenProperty: string;

    /**
     * Соответствие "индекс в коллекции" - "путь"
     */
    indexToPath: number[][];
}

export const MaterializedPathUtils = {
    /**
     * Возвращает путь до элемента с порядковым номером
     */
    getPathToItem: (
        index: number,
        options: IMaterializedPathUtilOptions
    ): number[] => {
        if (options.indexToPath[index]) {
            return options.indexToPath[index];
        }

        let current = 0;

        const iterator = (search, parent, path) => {
            const isArray = parent instanceof Array;
            const isList = parent['[Types/_collection/IList]'];
            const isEnumerable = parent['[Types/_collection/IEnumerable]'];
            let enumerator;
            let isLast;
            let item;
            let children;
            let sub;

            let index = 0;
            for (;;) {
                if (isArray) {
                    isLast = parent.length <= index;
                    if (!isLast) {
                        item = parent[index];
                    }
                } else if (isList) {
                    isLast = parent.getCount() <= index;
                    if (!isLast) {
                        item = parent.at(index);
                    }
                } else if (isEnumerable) {
                    if (!enumerator) {
                        enumerator = parent.getEnumerator();
                    }
                    item = enumerator.moveNext()
                        ? enumerator.getCurrent()
                        : undefined;
                    isLast = item === undefined;
                } else {
                    throw new TypeError(
                        'Unsupported object type: only Array, Types/_collection/IList or ' +
                            'Types/_collection/IEnumerable are supported.'
                    );
                }

                if (isLast) {
                    break;
                }

                if (search === current) {
                    return path.concat(index);
                }

                current++;

                children = object.getPropertyValue(
                    item,
                    options.childrenProperty
                );
                if (children instanceof Object) {
                    sub = iterator(search, children, path.concat(index));
                    if (sub) {
                        return sub;
                    }
                }

                index++;
            }
        };

        const path = iterator(index, options.collection, []);
        if (path) {
            options.indexToPath[index] = path;
        }

        return path;
    },

    /**
     * Возвращает элемент, находящийся по указанному пути
     */
    getItemByPath: (
        path: number[],
        options: IMaterializedPathUtilOptions
    ): unknown => {
        const childrenProperty = options.childrenProperty;
        let item = options.collection;
        let collection = options.collection;

        /**
         * Возвращает элемент по индексу в родителе
         */
        const getItemAt = (at: number) => {
            const isArray = collection instanceof Array;
            const isList = collection['[Types/_collection/IEnumerable]'];
            const isEnumerable = collection['[Types/_collection/IEnumerable]'];
            let item;

            if (isArray) {
                item = collection[at];
            } else if (isList) {
                item = collection.at(at);
            } else if (isEnumerable) {
                const enumerator = collection.getEnumerator();
                let current;
                let index = 0;
                while (enumerator.moveNext()) {
                    current = enumerator.getCurrent();
                    if (index === at) {
                        item = current;
                        break;
                    }
                    index++;
                }
            } else {
                throw new TypeError(
                    'Unsupported object type: only Array, Types/_collection/IList or ' +
                        'Types/_collection/IEnumerable are supported.'
                );
            }

            if (item === undefined) {
                throw new ReferenceError('Item at ' + at + ' is out of range.');
            }

            return item;
        };

        for (let level = 0; level < path.length; ) {
            item = getItemAt(path[level]);
            level++;
            if (level < path.length) {
                collection = object.getPropertyValue(item, childrenProperty);
            }
        }
        return item;
    },
};
