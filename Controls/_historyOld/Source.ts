/**
 * @kaizen_zone 36b6051b-790d-4170-b31c-ecc1485a7232
 */
import { SerializableMixin, OptionsToPropertyMixin, Model } from 'Types/entity';
import { mixin } from 'Types/util';
import { ICrud, DataSet, Query } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { object } from 'Types/util';
import { default as Service } from './Service';
import { TKey } from 'Controls/interface';
import { Store, IHistoryStoreData } from 'Controls/HistoryStore';
import { loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import cInstance = require('Core/core-instance');

export interface IHistorySourceOptions {
    originSource: ICrud;
    historySource: Service;
    parentProperty?: string;
    root?: string;
    pinned?: (string | number)[] | boolean;
    displayProperty?: string;
    nodeProperty?: string;
    unpinIfNotExist?: boolean;
}

const HISTORY_META_FIELDS: string[] = ['$_favorite', '$_pinned', '$_history', '$_addFromData'];

/**
 * Источник, который возвращает из исходного источника отсортированные данные с учётом истории.
 * @class Controls/_historyOld/Source
 * @extends Core/core-extend
 * @mixes Types/_entity/OptionsToPropertyMixin
 * @public
 *
 * @example
 * <pre class="brush: js">
 *    var source = new history.Source({
 *        originSource: new source.Memory({
 *           keyProperty: 'id',
 *           data: items
 *        }),
 *        historySource: new history.Service({
 *           historyId: 'TEST_HISTORY_ID'
 *        }),
 *        parentProperty: 'parent'
 *    });
 * </pre>
 */
export default class HistorySource
    extends mixin<SerializableMixin, OptionsToPropertyMixin>(
        SerializableMixin,
        OptionsToPropertyMixin
    )
    implements ICrud
{
    readonly '[Types/_source/ICrud]': boolean = true;
    protected _$oldItems: any = null;
    // Название состояния намеренно начинается не с _$,
    // чтобы это состояние не сериализовывалось при передаче источника с сервера на клиент
    // Прикладные программисты задают dataLoadCallback анонимной функцией, из-за этого сериализация падает
    protected _dataLoadCallback: Function = null;
    protected _$parentProperty: string = null;
    protected _$nodeProperty: string = null;
    protected _$root: string = null;
    protected _$displayProperty: string = null;
    protected _$originSource: ICrud = null;
    protected _$historySource: Service = null;
    protected _$unpinIfNotExist: boolean = true;
    protected _$pinned: (string | number)[] = null;
    protected _unpinIfNotExist = true;

    constructor(options: IHistorySourceOptions) {
        super(options);
        OptionsToPropertyMixin.initMixin(this, options);
    }

    // region private

    private _getDropdownLibrary(): Promise<typeof import('Controls/dropdown')> {
        return loadAsync<typeof import('Controls/dropdown')>('Controls/dropdown');
    }

    private _getHistorySourceConfig() {
        return {
            parentProperty: this._$parentProperty,
            nodeProperty: this._$nodeProperty,
            root: this._$root,
            displayProperty: this._$displayProperty,
            unpinIfNotExist: this._$unpinIfNotExist,
            pinned: this._$pinned,
        };
    }

    private _getSourceByMeta(
        meta: Record<string, string> = {},
        historySource: Service,
        originSource: ICrud
    ): Service | ICrud {
        const hasHistoryFields = Object.keys(meta).some((field: string): boolean => {
            return HISTORY_META_FIELDS.includes(field);
        });

        return hasHistoryFields ? historySource : originSource;
    }

    getRoot(): TKey {
        return this._$root || null;
    }

    // endregion
    create(meta: Record<string, any>): Promise<any> {
        return this._getSourceByMeta(meta, this._$historySource, this._$originSource).create(meta);
    }

    read(key: string, meta: any): Promise<any> {
        return this._getSourceByMeta(meta, this._$historySource, this._$originSource).read(
            key,
            meta
        );
    }

    update(data: any, meta: any): Promise<any> {
        if (meta.hasOwnProperty('$_pinned')) {
            return Promise.resolve(
                this._getDropdownLibrary()
                    .then((dropdownLib) => {
                        return dropdownLib.updatePinned;
                    })
                    .then((updatePinned) => {
                        return updatePinned(data, meta, this.getHistoryId());
                    })
            );
        }
        if (meta.hasOwnProperty('$_history')) {
            return Promise.resolve(
                this._getDropdownLibrary()
                    .then((dropdownLib) => {
                        return dropdownLib.updateRecent;
                    })
                    .then((updateRecent) => {
                        return updateRecent(data, meta, this.getHistoryId()).catch(() => {
                            return undefined;
                        });
                    })
            );
        }
        return this._getSourceByMeta(meta, this._$historySource, this._$originSource).update(
            data,
            meta
        );
    }

    destroy(keys: string[], meta: any): any {
        return this._getSourceByMeta(meta, this._$historySource, this._$originSource).destroy(
            keys,
            meta
        );
    }

    query(query: Query): Promise<DataSet> {
        let where = query.getWhere() as Record<string, any>;

        let newItems: RecordSet;

        let originSourceQuery: Promise<IHistoryStoreData>;
        let historySourceQuery: Promise<DataSet> | IHistoryStoreData;

        // For Selector/Suggest load data from history, if there is a historyKeys
        if (where && (where.$_history === true || where.historyKeys)) {
            where = object.clone(where);
            delete where.$_history;

            if (where.historyKeys) {
                delete where.historyKeys;
            }
            query.where(where);

            return Promise.allSettled([
                Store.load(this.getHistoryId()),
                this._$originSource.query(query),
                this._getDropdownLibrary(),
            ]).then((data) => {
                let result: DataSet;
                // method returns error
                if (data[1].status !== 'rejected' && data[1].value) {
                    // PrefetchProxy returns RecordSet
                    const loadedItems = data[1].value.getAll
                        ? data[1].value.getAll()
                        : data[1].value;
                    if (where[this._$parentProperty] && this._$oldItems) {
                        this._$oldItems.merge(loadedItems, {
                            inject: true,
                            remove: false,
                            add: true,
                        });
                    } else {
                        this._$oldItems = loadedItems;
                    }
                    if (this._dataLoadCallback) {
                        this._dataLoadCallback(this._$oldItems);
                    }

                    // history service returns error

                    if (data[0].value && data[0].status !== 'rejected') {
                        const historySourceConfig = this._getHistorySourceConfig();

                        const { getItemsWithHistory } = data[2].value;
                        newItems = getItemsWithHistory(
                            this._$oldItems,
                            this.getHistoryId(),
                            this._$originSource,
                            historySourceConfig
                        );
                    } else {
                        newItems = this._$oldItems;
                    }
                    result = new DataSet({
                        rawData: newItems.getRawData(true),
                        keyProperty: newItems.getKeyProperty(),
                        adapter: newItems.getAdapter(),
                        model: newItems.getModel(),
                    });
                } else if (data[0].status === 'rejected' || data[1].status === 'rejected') {
                    // Необходимо вернуть ошибку из deferred'a, чтобы вся цепочка завершилась ошибкой
                    result = data;
                } else {
                    result = data[1].value;
                }
                return result;
            });
        }
        return this._$originSource.query(query);
    }

    getItems(withHistory: boolean = true): RecordSet {
        if (Store.getLocal(this.getHistoryId()) && withHistory) {
            const { getItemsWithHistory } =
                loadSync<typeof import('Controls/dropdown')>('Controls/dropdown');
            return getItemsWithHistory(
                this._$oldItems,
                this.getHistoryId(),
                this._$originSource,
                this._getHistorySourceConfig()
            );
        } else {
            return this._$oldItems;
        }
    }

    prepareItems(items: RecordSet): RecordSet {
        this._$oldItems = items.clone();
        return this.getItems();
    }

    addOriginItems(items: RecordSet): void {
        this._$oldItems = items;
    }

    setUnpinIfNotExist(unpinIfNotExist): void {
        this._unpinIfNotExist = this._unpinIfNotExist && unpinIfNotExist;
    }

    setDataLoadCallback(dataLoadCallback: Function): void {
        this._dataLoadCallback = dataLoadCallback;
    }

    resetHistoryFields(historyItem: Model, keyProperty: string): Model {
        const item = historyItem.clone();
        if (item.has('copyOriginalId')) {
            item.setKeyProperty(keyProperty);
            return item;
        } else {
            return item;
        }
    }

    getOriginSource(): ICrud {
        return this._$originSource;
    }

    getModel(): Function | string {
        return this._$originSource.getModel();
    }

    getAdapter(): Function | string {
        return this._$originSource.getAdapter();
    }

    getHistory(): IHistoryStoreData {
        return Store.getLocal(this.getHistoryId());
    }

    getHistoryId(): string {
        return (
            this._$historySource.getHistoryIds()?.slice().sort().join() ||
            this._$historySource.getHistoryId()
        );
    }

    setHistory(history: IHistoryStoreData): void {
        this._$historySource.saveHistory(this.getHistoryId(), history);
    }

    getKeyProperty(): string {
        return (
            cInstance.instanceOfModule(this._$originSource, 'Types/_source/IDecorator')
                ? this._$originSource.getOriginal()
                : this._$originSource
        ).getKeyProperty();
    }
}

/**
 * @name Controls/_historyOld/Source#originSource
 * @cfg {Source} Источник данных.
 */
/**
 * @name Controls/_historyOld/Source#historySource
 * @cfg {Source} Источник, который работает с историей.
 * @see {Controls/_historyOld/Service} Источник работает с сервисом истории ввода.
 */

/**
 * @name Controls/_historyOld/Source#unpinIfNotExist
 * @default true
 * @cfg {Boolean} Флаг, определяющий будет ли снят пин с записи, которой нет в данных
 */

/**
 * @name Controls/_historyOld/Source#pinned
 * @cfg {String[]} Массив ключей элементов, которые по умолчанию должны быть запинены.
 * @example
 * <pre class="brush: js">
 *    this._source = new HistorySource({
 *       originSource: ...,
 *       historySource: new HistoryService(),
 *       pinned: ['1', '2', '3']
 *    });
 * </pre>
 */

Object.assign(HistorySource.prototype, {
    _moduleName: 'Controls/historyOld:Source',
    '[Controls/_historyOld/Source]': true,
});
