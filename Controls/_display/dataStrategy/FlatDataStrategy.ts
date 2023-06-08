import { CrudEntityKey as TKey } from 'Types/source';
import { Model } from 'Types/entity';
import { RecordSet, IEnumerable } from 'Types/collection';
import { Object as EventObject } from 'Env/Event';
import { object } from 'Types/util';

export type TSourceItem = Model | object;
export type TCollection = RecordSet | TSourceItem[] | IEnumerable<unknown>;

export interface IFlatDataStrategyOptions {
    collection: TCollection;
    keyProperty: string;
}

export interface IDataStrategy<
    TOptions extends IFlatDataStrategyOptions = IFlatDataStrategyOptions
> {
    updateOptions(options: Partial<TOptions>): void;
    getSourceCollection(): TCollection;
    getSourceItemByKey(key: TKey): TSourceItem;
    getSourceIndexByKey(key: TKey): number;
    getSourceIndexBySourceItem(item: TSourceItem): number;
    getSourceItemBySourceIndex(index: number): TSourceItem;

    getCount(): number;
    getMetaData(): Record<string, unknown>;

    destroy(): void;
}

/**
 * Стратегия обхода "плоских" данных в исходной коллекции
 * @private
 */
export default class FlatDataStrategy<
    TOptions extends IFlatDataStrategyOptions = IFlatDataStrategyOptions
> implements IDataStrategy<TOptions>
{
    protected _options: TOptions;

    constructor(options: TOptions) {
        this._bindHandlers();
        this._updateCollectionEventHandlers(null, options.collection);
        this._options = { ...options };
    }

    updateOptions(options: Partial<TOptions>): void {
        const isCollectionChanged =
            options.hasOwnProperty('collection') &&
            this._options.collection !== options.collection;
        if (isCollectionChanged) {
            this._updateCollectionEventHandlers(
                this._options.collection,
                options.collection
            );
            this._options.collection = options.collection;
        }
    }

    getSourceCollection(): TCollection {
        if (
            !this._options.collection['[Types/_collection/IList]'] &&
            !this._options.collection['[Types/_collection/IEnumerable]'] &&
            !(this._options.collection instanceof Array)
        ) {
            throw TypeError('Source collection has invalid type');
        }

        return this._options.collection;
    }

    getSourceIndexByKey(key: TKey): number {
        const collection = this.getSourceCollection();

        if (collection['[Types/_collection/IList]']) {
            return (collection as RecordSet).getIndexByValue(
                this._options.keyProperty,
                key
            );
        } else if (collection instanceof Array) {
            return (collection as TSourceItem[]).findIndex((it) => {
                return (
                    object.getPropertyValue<TKey>(
                        it,
                        this._options.keyProperty
                    ) === key
                );
            });
        }
    }

    getSourceIndexBySourceItem(item: TSourceItem): number {
        const collection = this.getSourceCollection();

        if (collection['[Types/_collection/IList]']) {
            return (collection as RecordSet).getIndex(item as Model);
        } else if (collection instanceof Array) {
            return (collection as TSourceItem[]).indexOf(item);
        }
    }

    getSourceItemByKey(key: TKey): TSourceItem {
        const collection = this.getSourceCollection();

        if (collection['[Types/_collection/RecordSet]']) {
            return (collection as RecordSet).getRecordById(key);
        } else if (collection instanceof Array) {
            return (collection as Model[]).find((it) => {
                return (
                    object.getPropertyValue(it, this._options.keyProperty) ===
                    key
                );
            });
        }
    }

    getSourceItemBySourceIndex(index: number): TSourceItem {
        const collection = this.getSourceCollection();

        if (collection['[Types/_collection/IList]']) {
            return (collection as RecordSet).at(index);
        } else if (collection instanceof Array) {
            return (collection as TSourceItem[])[index];
        }
    }

    getCount(): number {
        const collection = this.getSourceCollection();
        return collection['[Types/_collection/RecordSet]']
            ? (collection as RecordSet).getCount()
            : (collection as TSourceItem[]).length;
    }

    getMetaData(): Record<string, unknown> {
        const collection = this.getSourceCollection();
        return collection['[Types/_collection/RecordSet]']
            ? (collection as RecordSet).getMetaData() || {}
            : {};
    }

    destroy(): void {
        this._updateCollectionEventHandlers(this._options.collection, null);
    }

    // region CollectionEvents

    private _updateCollectionEventHandlers(
        oldCollection: TCollection,
        newCollection: TCollection
    ): void {
        if (oldCollection && oldCollection['[Types/_collection/RecordSet]']) {
            (oldCollection as RecordSet).unsubscribe(
                'onCollectionChange',
                this._onCollectionChange
            );
            (oldCollection as RecordSet).unsubscribe(
                'onCollectionItemChange',
                this._onCollectionItemChange
            );
        }
        if (newCollection && newCollection['[Types/_collection/RecordSet]']) {
            (newCollection as RecordSet).subscribe(
                'onCollectionChange',
                this._onCollectionChange
            );
            (newCollection as RecordSet).subscribe(
                'onCollectionItemChange',
                this._onCollectionItemChange
            );
        }
    }

    private _bindHandlers(): void {
        this._onCollectionChange = this._onCollectionChange.bind(this);
        this._onCollectionItemChange = this._onCollectionItemChange.bind(this);
    }

    protected _onCollectionChange(event: EventObject, action: string): void {
        // overridden
    }

    protected _onCollectionItemChange(
        event: EventObject,
        item: Model,
        index: number,
        properties: object
    ): void {
        // overridden
    }

    // endregion CollectionEvents
}
