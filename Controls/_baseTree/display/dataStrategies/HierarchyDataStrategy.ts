import { CrudEntityKey as TKey } from 'Types/source';
import { RecordSet, IObservable } from 'Types/collection';
import { object } from 'Types/util';
import { Object as EventObject } from 'Env/Event';

import {
    FlatDataStrategy,
    IFlatDataStrategyOptions,
    TCollection,
    TSourceItem,
} from 'Controls/display';
import { MaterializedPathUtils } from '../strategies/MaterializedPath';

export interface IHierarchyDataStrategyOptions extends IFlatDataStrategyOptions {
    /**
     * Свойство, в котором содержится вложенная коллекция
     */
    childrenProperty?: string;
}

/**
 * Стратегия обхода "иерархический" данных в исходной коллекции
 * @private
 */
export default class HierarchyDataStrategy<
    TOptions extends IHierarchyDataStrategyOptions = IHierarchyDataStrategyOptions
> extends FlatDataStrategy<TOptions> {
    /**
     * Соответствие "индекс в коллекции" - "путь до элемента в SourceCollection"
     * "индекс в коллекции" - подразумевает индекс в DisplayCollection и в SourceCollection.
     *
     * В SourceCollection с вложенными коллекциями тоже сквозная нумерация.
     * Иначе нельзя идентифицировать записи по индексу из разных рекордсетов.
     * DisplayCollection построен на индексах, поэтому на ключи заточиться не получится.
     */
    private _indexToPath: number[][] = [];

    /**
     * Соответствие ключа записи его "индексу в коллекции".
     * По этому индексу можно получить путь к записи., а по пути уже саму запись.
     */
    private _keyToIndex: Record<TKey, number> = {};

    constructor(options: TOptions) {
        super(options);
        this._initializeState();
    }

    getSourceItemByKey(key: TKey): TSourceItem {
        if (!this._options.childrenProperty) {
            return super.getSourceItemByKey(key);
        }

        const index = this._keyToIndex[key];
        if (index === -1 || index === undefined) {
            return null;
        }

        return this.getSourceItemBySourceIndex(index);
    }

    getSourceIndexBySourceItem(item: TSourceItem): number {
        if (!this._options.childrenProperty) {
            return super.getSourceIndexBySourceItem(item);
        }

        const key = object.getPropertyValue<TKey>(item, this._options.keyProperty);
        const index = this._keyToIndex[key];
        return index === undefined ? -1 : index;
    }

    getSourceIndexByKey(key: TKey): number {
        if (!this._options.childrenProperty) {
            return super.getSourceIndexByKey(key);
        }

        const index = this._keyToIndex[key];
        return index === undefined ? -1 : index;
    }

    getSourceItemBySourceIndex(index: number): TSourceItem {
        if (!this._options.childrenProperty) {
            return super.getSourceItemBySourceIndex(index);
        }

        const path = this._getPathByIndex(index);
        return MaterializedPathUtils.getItemByPath(path, {
            indexToPath: this._indexToPath,
            collection: this._options.collection,
            childrenProperty: this._options.childrenProperty,
        }) as TSourceItem;
    }

    getCount(): number {
        if (!this._options.childrenProperty) {
            return super.getCount();
        }

        return this._keyToIndex.length;
    }

    // region CollectionChanges

    protected _onCollectionChange(event: EventObject, action: string): void {
        if (
            this._options.childrenProperty &&
            (action === IObservable.ACTION_RESET ||
                action === IObservable.ACTION_ADD ||
                action === IObservable.ACTION_REMOVE ||
                action === IObservable.ACTION_MOVE ||
                action === IObservable.ACTION_REPLACE)
        ) {
            this._initializeState();
        }
    }

    protected _onCollectionItemChange(
        event: EventObject,
        item: TSourceItem,
        index: number,
        properties: object
    ): void {
        if (properties.hasOwnProperty(this._options.childrenProperty)) {
            this._initializeState();
        }
    }

    // endregion CollectionChanges

    // region State

    private _initializeState(): void {
        this._initializeKeyToIndex();
        this._clearIndexToPath();
    }

    private _initializeKeyToIndex(): void {
        if (!this._options.childrenProperty) {
            return;
        }

        this._keyToIndex = {};

        iterator(
            (item: TSourceItem, index) => {
                const key = object.getPropertyValue<TKey>(item, this._options.keyProperty);
                this._keyToIndex[key] = index;
            },
            {
                collection: this._options.collection,
                childrenProperty: this._options.childrenProperty,
            }
        );
    }

    private _clearIndexToPath(): void {
        this._indexToPath = [];
    }

    private _getPathByIndex(index: number): number[] {
        return MaterializedPathUtils.getPathToItem(index, {
            indexToPath: this._indexToPath,
            collection: this._options.collection,
            childrenProperty: this._options.childrenProperty,
        });
    }

    // endregion State
}

function iterator(
    callback: (item: unknown, index: number) => void,
    options: { collection: TCollection; childrenProperty: string }
): void {
    // Сквозной индекс по всем вложенным коллекциям
    let throughIndex = 0;

    const iterator = (collection: TCollection) => {
        let item;

        // Юниты написаны на массивах, поэтому нужна проверка
        const isArray = collection instanceof Array;

        // index - индекс в пределах одной коллекции
        const itemsCount = isArray
            ? (collection as unknown[]).length
            : (collection as RecordSet).getCount();
        for (let index = 0; index < itemsCount; index++) {
            item = isArray ? collection[index] : (collection as RecordSet).at(index);
            callback(item, throughIndex);
            throughIndex++;

            const children = object.getPropertyValue<TCollection>(item, options.childrenProperty);
            if (children) {
                iterator(children);
            }
        }
    };

    iterator(options.collection);
}
