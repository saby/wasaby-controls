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
    TOptions extends IFlatDataStrategyOptions = IFlatDataStrategyOptions,
> {
    updateOptions(options: Partial<TOptions>): void;
    getSourceCollection(): TCollection;
    getSourceItemByKey(key: TKey): TSourceItem | undefined;
    getSourceIndexByKey(key: TKey): number | undefined;
    getSourceIndexBySourceItem(item: TSourceItem): number | undefined;
    getSourceItemBySourceIndex(index: number): TSourceItem | undefined;

    getCount(): number;
    getMetaData(): Record<string, unknown>;

    destroy(): void;
}

/**
 * Стратегия обхода "плоских" данных в исходной коллекции
 * @private
 */
export default class FlatDataStrategy<
    TOptions extends IFlatDataStrategyOptions = IFlatDataStrategyOptions,
> implements IDataStrategy<TOptions>
{
    protected _options: TOptions;

    constructor(options: TOptions) {
        this._bindHandlers();
        this._updateCollectionEventHandlers(null, options.collection);
        this._options = {
            collection: options.collection,
            keyProperty: options.keyProperty,
        };
    }

    updateOptions(options: Partial<TOptions>): void {
        const isCollectionChanged =
            options.hasOwnProperty('collection') && this._options.collection !== options.collection;
        if (isCollectionChanged) {
            this._updateCollectionEventHandlers(this._options.collection, options.collection);
            this._options.collection = options.collection as TCollection;
        }
    }

    getSourceCollection(): TCollection {
        if (
            !this._options.collection['[Types/_collection/IList]' as keyof TCollection] &&
            !this._options.collection['[Types/_collection/IEnumerable]' as keyof TCollection] &&
            !(this._options.collection instanceof Array)
        ) {
            throw TypeError('Source collection has invalid type');
        }

        return this._options.collection;
    }

    getSourceIndexByKey(key: TKey): number | undefined {
        const collection = this.getSourceCollection();

        if (collection['[Types/_collection/IList]' as keyof TCollection]) {
            return (collection as RecordSet).getIndexByValue(this._options.keyProperty, key);
        } else if (collection instanceof Array) {
            return (collection as TSourceItem[]).findIndex((it) => {
                return object.getPropertyValue<TKey>(it, this._options.keyProperty) === key;
            });
        }
    }

    getSourceIndexBySourceItem(item: TSourceItem): number | undefined {
        const collection = this.getSourceCollection();

        if (collection['[Types/_collection/IList]' as keyof TCollection]) {
            return (collection as RecordSet).getIndex(item as Model);
        } else if (collection instanceof Array) {
            return (collection as TSourceItem[]).indexOf(item);
        }
    }

    getSourceItemByKey(key: TKey): TSourceItem | undefined {
        const collection = this.getSourceCollection();

        if (collection['[Types/_collection/RecordSet]' as keyof TCollection]) {
            return (collection as RecordSet).getRecordById(key);
        } else if (collection instanceof Array) {
            return (collection as Model[]).find((it) => {
                return object.getPropertyValue(it, this._options.keyProperty) === key;
            });
        }
    }

    getSourceItemBySourceIndex(index: number): TSourceItem | undefined {
        const collection = this.getSourceCollection();

        if (collection['[Types/_collection/IList]' as keyof TCollection]) {
            return (collection as RecordSet).at(index);
        } else if (collection instanceof Array) {
            return (collection as TSourceItem[])[index];
        }
    }

    getCount(): number {
        const collection = this.getSourceCollection();
        return collection['[Types/_collection/RecordSet]' as keyof TCollection]
            ? (collection as RecordSet).getCount()
            : (collection as TSourceItem[]).length;
    }

    getMetaData(): Record<string, unknown> {
        const collection = this.getSourceCollection();
        return collection['[Types/_collection/RecordSet]' as keyof TCollection]
            ? (collection as RecordSet).getMetaData() || {}
            : {};
    }

    destroy(): void {
        this._updateCollectionEventHandlers(this._options.collection, null);
    }

    // region CollectionEvents

    private _updateCollectionEventHandlers(
        oldCollection: TCollection | null,
        newCollection?: TCollection | null
    ): void {
        if (oldCollection && oldCollection['[Types/_collection/RecordSet]' as keyof TCollection]) {
            (oldCollection as RecordSet).unsubscribe(
                'onCollectionChange',
                this._onCollectionChange
            );
            (oldCollection as RecordSet).unsubscribe(
                'onCollectionItemChange',
                this._onCollectionItemChange
            );
        }
        if (newCollection && newCollection['[Types/_collection/RecordSet]' as keyof TCollection]) {
            (newCollection as RecordSet).subscribe('onCollectionChange', this._onCollectionChange);
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

    protected _onCollectionChange(_event: EventObject, _action: string): void {
        // overridden
    }

    protected _onCollectionItemChange(
        _event: EventObject,
        _item: Model,
        _index: number,
        _properties: object
    ): void {
        // overridden
    }

    // endregion CollectionEvents
}
