/**
 * @kaizen_zone 36b6051b-790d-4170-b31c-ecc1485a7232
 */
import { SbisService, DataSet, ICrud, Query } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { OptionsToPropertyMixin, SerializableMixin, Model } from 'Types/entity';
import * as Constants from './Constants';
import { Deferred } from 'Types/deferred';
import { mixin } from 'Types/util';
import { getStore } from 'Application/Env';
import { Logger } from 'UI/Utils';
import { detection } from 'Env/Env';
import { IStore } from 'Application/Request';

export type HistoryListParam = (number | string)[] | boolean;

export interface IHistoryServiceOptions {
    historyId: string;
    historyIds?: string[];
    pinned?: HistoryListParam;
    frequent?: HistoryListParam;
    recent?: HistoryListParam;
    favorite?: HistoryListParam;
    dataLoaded?: boolean;
}

interface IHistory {
    recent: RecordSet;
    frequent: RecordSet;
    pinned: RecordSet;
}
const STORAGES_USAGE = {};
const HISTORY_DATA_STORAGE_KEY = 'ControlsHistoryDataStorage';
const HISTORY_LOAD_PROMISES_STORAGE_KEY = 'ControlsLoadPromisesStorage';

/**
 * Источник, который работает с <a href="/doc/platform/developmentapl/middleware/input-history-service/">сервисом истории ввода</a>.
 *
 * @class Controls/_history/Service
 * @extends Core/core-extend
 * @implements Types/_source/ICrud
 * @mixes Types/_entity/OptionsToPropertyMixin
 * @public
 * @example
 * <pre class="brush: js">
 * new history.Service({
 *    historyId: 'TEST_HISTORY_ID'
 * })
 * </pre>
 */

/*
 * Source working with the service of InputHistory
 *
 * @class Controls/_history/Service
 * @extends Core/core-extend
 * @implements Types/_source/ICrud
 * @mixes Types/_entity/OptionsToPropertyMixin
 * @public
 * @author Герасимов А.М.
 * @example
 * <pre>
 *    new historyService({
 *       historyId: 'TEST_HISTORY_ID'
 *    })
 * </pre>
 */

export default class HistoryService
    extends mixin<SerializableMixin, OptionsToPropertyMixin>(
        SerializableMixin,
        OptionsToPropertyMixin
    )
    implements ICrud
{
    protected _$historyDataSource: SbisService = null;
    protected _$historyId: string = null;
    protected _$historyIds: string[] = null;
    protected _$pinned: (string | number)[] = null;
    protected _$frequent: (string | number)[] = null;
    protected _$favorite: (string | number)[] = null;
    protected _$recent: number = null;
    protected _$dataLoaded: boolean = null;

    constructor(options: IHistoryServiceOptions) {
        super(options);
        OptionsToPropertyMixin.initMixin(this, options);
    }
    // region private
    private _getHistoryDataSource(): SbisService {
        if (!this._$historyDataSource) {
            this._$historyDataSource = new SbisService({
                endpoint: {
                    address: '/input-history/service/',
                    contract: 'InputHistory',
                },
            });
        }
        return this._$historyDataSource;
    }

    private _callQuery(method: string, params: Record<string, any>): any {
        return this._getHistoryDataSource().call(method, params);
    }

    private _getMethodNameByIdType(
        stringMethod: string,
        intMethod: string,
        id: number | string
    ): string {
        return typeof id === 'number' ? intMethod : stringMethod;
    }

    private _validateDataForSave(data: Model): boolean {
        if (!data || !data.get('ObjectData')) {
            Logger.error('Нет данных для записи в историю', this);
            return false;
        }
        return true;
    }

    private _updateFavoriteData(data: Model, meta: Record<string, any>): void {
        if (this._validateDataForSave(data)) {
            this._getHistoryDataSource().call('UpdateData', {
                history_id: this._$historyId || data.get('HistoryId'),
                object_id: data.getKey(),
                data: data.get('ObjectData'),
                history_type: Number(meta.isClient),
            });
        }
    }

    private _load(): Promise<any> {
        let resultDef;
        if (this._$favorite) {
            resultDef = this._callQuery('ClientAndUserHistoryList', {
                params: {
                    historyId: this._$historyId,
                    client: { count: Constants.MAX_HISTORY_REPORTS },
                    pinned: { count: Constants.MAX_HISTORY_REPORTS },
                    recent: { count: Constants.MAX_HISTORY_REPORTS },
                    getObjectData: true,
                },
            });
        } else if (this._$dataLoaded && this._$historyIds) {
            const params = {
                history_query: {
                    [this._$historyId]: {
                        recentCount: this._$recent || Constants.MAX_HISTORY,
                        frequentCount: this._$frequent
                            ? Constants.MAX_HISTORY - Constants.MIN_RECENT
                            : 0,
                        pinnedCount: this._$pinned ? Constants.MAX_HISTORY : 0,
                    },
                },
            };
            this._$historyIds.forEach((id) => {
                params.history_query[id] = {
                    recentCount: 1,
                    frequentCount: 0,
                    pinnedCount: 0,
                };
            });
            resultDef = this._callQuery('BatchIndexesList', params);
        } else {
            if (this._$historyId || this._$historyIds?.length) {
                resultDef = this._callQuery('UnionMultiHistoryIndexesList', {
                    params: {
                        historyIds: this._$historyId ? [this._$historyId] : this._$historyIds,
                        pinned: {
                            count: this._$pinned ? Constants.MAX_HISTORY : 0,
                        },
                        frequent: {
                            count: this._$frequent
                                ? Constants.MAX_HISTORY - Constants.MIN_RECENT
                                : 0,
                        },
                        recent: {
                            count: this._$recent || Constants.MAX_HISTORY,
                        },
                        getObjectData: this._$dataLoaded,
                    },
                });
            } else {
                Logger.error(
                    'Controls/history: Не установлен идентификатор истории (опция historyId)',
                    this
                );
                resultDef = Promise.reject();
            }
        }
        return resultDef;
    }

    private _deleteItem(data: Model, meta: any): Promise<any> {
        return this._callQuery('Delete', {
            history_id: this._$historyId,
            object_id: data.getKey(),
            history_type: Number(meta.isClient),
        });
    }

    private _updateHistory(data: any, meta: any): any {
        let resultPromise;
        if (meta.params) {
            if (this._validateDataForSave(data)) {
                resultPromise = this._callQuery('UpdateDataAndSetParams', {
                    history_id: data.get('HistoryId'),
                    object_id: data.getKey(),
                    data: data.get('ObjectData'),
                    params: meta.params,
                });
            } else {
                resultPromise = Promise.resolve();
            }
        } else if (meta.parentKey) {
            resultPromise = this._callQuery('AddHierarchyList', {
                history_id: this._$historyId,
                parent1: meta.parentKey,
                ids: data.ids,
            });
        } else if (data.ids) {
            resultPromise = this._callQuery(
                this._getMethodNameByIdType('AddList', 'AddIntList', data.ids[0]),
                {
                    history_id: this._$historyId,
                    ids: data.ids,
                    history_context: null,
                }
            );
        } else {
            const id = data.getKey();
            resultPromise = this._callQuery(this._getMethodNameByIdType('Add', 'AddInt', id), {
                history_id: data.get('HistoryId') || this._$historyId,
                id,
                history_context: null,
            });
        }
        return resultPromise;
    }

    private _addFromData(data: { items: unknown; historyParams: unknown }): unknown {
        if (this._$dataLoaded && this._$historyIds) {
            return this._getHistoryDataSource().call('AddFromDataAndSetParams', {
                history_id: this._$historyId,
                data: data.items,
                params: data.historyParams,
            });
        }
        return this._getHistoryDataSource().call('AddFromData', {
            history_id: this._$historyId,
            data,
        });
    }

    private _updatePinned(data: any, meta: any): any {
        const id = data.getKey();
        const historyId = data.get('HistoryId') || this._$historyId;
        let resultPromise;
        if (meta.isClient) {
            resultPromise = this._callQuery('PinForClient', {
                history_id: historyId,
                object_id: id,
                data: data.get('ObjectData'),
            });
        } else {
            resultPromise = this._callQuery(
                this._getMethodNameByIdType('SetPin', 'SetIntPin', id),
                {
                    history_id: historyId,
                    id,
                    history_context: null,
                    pin: !!meta.$_pinned,
                }
            );
        }
        return resultPromise;
    }

    private _incrementUsage(): void {
        if (!STORAGES_USAGE[this._$historyId]) {
            STORAGES_USAGE[this._$historyId] = 0;
        }
        STORAGES_USAGE[this._$historyId]++;
    }

    private _decrementUsage(): void {
        STORAGES_USAGE[this._$historyId]--;
        if (STORAGES_USAGE[this._$historyId] === 0) {
            getStore(HISTORY_DATA_STORAGE_KEY).remove(this._$historyId);
        }
    }

    private _createRecordSet(data: object): RecordSet {
        return new RecordSet({
            rawData: data,
            keyProperty: 'ObjectId',
            adapter: 'adapter.sbis',
        });
    }
    // endregion

    update(data: any, meta: any): Promise<any> {
        let result: Promise<any> = Promise.resolve({});
        /*
          В isDesktop нет сервиса истории и его там нельзя вызывать, в таком случае работаем без истории вообще.
          FIXME: https://online.sbis.ru/opendoc.html?guid=f0e4521b-873a-4b1a-97fe-2ecbb12409d1
         */
        if (detection.isDesktop) {
            result = Promise.resolve();
        } else {
            if (meta.hasOwnProperty('$_addFromData')) {
                result = this._addFromData(data);
            }
            if (meta.hasOwnProperty('$_pinned')) {
                result = this._updatePinned(data, meta);
            }
            if (meta.hasOwnProperty('$_history')) {
                result = this._updateHistory(data, meta);
            }
            if (meta.hasOwnProperty('$_favorite')) {
                this._updateFavoriteData(data, meta);
            }
        }

        return result;
    }

    deleteItem(data: any, meta: any): any {
        return this._deleteItem(data, meta);
    }

    query(query?: Query): Promise<DataSet> {
        const historyId = this.getHistoryIdForStorage();
        const historyIds = [];
        if (this._$historyId && this._$historyIds) {
            historyIds.push(...this._$historyIds);
        }
        const storageDef = getStore(HISTORY_LOAD_PROMISES_STORAGE_KEY).get(historyId);
        const storageData = getStore(HISTORY_DATA_STORAGE_KEY).get(historyId);
        const storageDataParams = [];
        historyIds.forEach((id) => {
            const data = getStore(HISTORY_DATA_STORAGE_KEY).get(id);
            if (data) {
                storageDataParams.push(data);
            }
        });
        let resultDef;

        const getHistoryDataSet = (): DataSet => {
            const rawData = {
                ...this.getHistory(historyId),
            };
            if (historyIds.length) {
                const params = {};
                historyIds.forEach((id) => {
                    const data = getStore(HISTORY_DATA_STORAGE_KEY).get(id);
                    if (data) {
                        params[id] = data.params;
                    }
                });
                rawData.params = params;
            }
            return new DataSet({
                rawData,
            });
        };

        if (storageDef) {
            resultDef = new Deferred();
            // create new deferred, so in the first callback function, the result of the query will be changed
            storageDef.addBoth((dataSet) => {
                /*
                   В случае истории с меню, запись в кэш происходит после ответа списочного метода.
                   Если метод подвиснет, то в кэше ничего не будет и мы создадим пустой dataSet, чего быть не должно.
                 */
                resultDef.callback(this.getHistory(historyId) ? getHistoryDataSet() : dataSet);
            });
        } else if (
            !storageDef &&
            (!storageData || (historyIds.length && storageDataParams.length !== historyIds.length))
        ) {
            /*
              В isDesktop нет сервиса истории и его там нельзя вызывать, в таком случае работаем без истории вообще.
              FIXME: https://online.sbis.ru/opendoc.html?guid=f0e4521b-873a-4b1a-97fe-2ecbb12409d1
             */
            if (detection.isDesktop) {
                const emptyData = new DataSet({
                    rawData: {
                        pinned: this._createRecordSet({}),
                        frequent: this._createRecordSet({}),
                        recent: this._createRecordSet({}),
                    },
                });
                resultDef = Deferred.success(emptyData);
            } else {
                resultDef = this._load();
            }
            getStore(HISTORY_LOAD_PROMISES_STORAGE_KEY).set(historyId, resultDef);
            resultDef.addBoth((res) => {
                getStore(HISTORY_LOAD_PROMISES_STORAGE_KEY).remove(historyId);
                return res;
            });
        } else {
            resultDef = Deferred.success(getHistoryDataSet());
        }
        this._incrementUsage();
        return resultDef;
    }

    destroy(id: number | string): Promise<null> {
        let result;

        if (id) {
            result = this._callQuery('Delete', {
                history_id: this._$historyId,
                object_id: id,
            });
        } else {
            result = Deferred.success(null);
        }

        this._decrementUsage();
        return result;
    }

    /**
     * Returns a service history identifier
     * @returns {String}
     */
    getHistoryId(): string {
        return this._$historyId;
    }

    /**
     * Returns a service history identifiers of parameters
     * @returns {String}
     */
    getHistoryIds(): string[] {
        return this._$historyIds;
    }

    getHistoryIdForStorage(): string {
        // Если задают historyIds в параметрах источника, то кэш сохраняем по строке,
        // склееной из всех идентификаторов, заданных в опции historyIds
        return this._$historyId || this._$historyIds?.slice().sort().join();
    }

    /**
     * Save new history
     */
    saveHistory(historyId: string, history: IHistory): void {
        getStore(HISTORY_DATA_STORAGE_KEY).set(historyId, { ...history });
    }

    /**
     * Returns a set of history items
     * @returns {Object}
     */
    getHistory(historyId: string): RecordSet {
        return (getStore(HISTORY_DATA_STORAGE_KEY) as IStore<any>).get(historyId);
    }
}

/**
 * @name Controls/_history/Service#historyId
 * @cfg {String} Уникальный идентификатор <a href="/doc/platform/developmentapl/middleware/input-history-service/">сервиса истории</a>.
 */

/*
 * @name Controls/_history/Service#historyId
 * @cfg {String} unique service history identifier
 */

/**
 * @name Controls/_history/Service#historyIds
 * @cfg {Array of String} Уникальные идентификаторы <a href="/doc/platform/developmentapl/middleware/input-history-service/">сервиса истории</a>.
 */

/*
 * @name Controls/_history/Service#historyIds
 * @cfg {Array of String} unique service history identifiers
 */

/**
 * @name Controls/_history/Service#pinned
 * @cfg {Boolean} Загружает закрепленные записи из БЛ.
 * @remark
 * true - Load items
 * false - No load items
 */

/*
 * @name Controls/_history/Service#pinned
 * @cfg {Boolean} Loads pinned items from BL
 * @remark
 * true - Load items
 * false - No load items
 */

/**
 * @name Controls/_history/Service#frequent
 * @cfg {Boolean} Загружает наиболее часто выбираемые записи из БЛ.
 * @remark
 * true - Load items
 * false - No load items
 */

/*
 * @name Controls/_history/Service#frequent
 * @cfg {Boolean} Loads frequent items from BL
 * @remark
 * true - Load items
 * false - No load items
 */

/**
 * @name Controls/_history/Service#recent
 * @cfg {Boolean} Загружает последние записи из БЛ.
 * @remark
 * true - Load items
 * false - No load items
 */

/*
 * @name Controls/_history/Service#recent
 * @cfg {Boolean} Loads recent items from BL
 * @remark
 * true - Load items
 * false - No load items
 */

/**
 * @name Controls/_history/Service#dataLoaded
 * @cfg {Boolean} Записи, загруженные с данными объекта.
 * @private
 * @remark
 * true - БЛ вернет записи с данными.
 * false - Бл вернет записи без данных.
 */

/*
 * @name Controls/_history/Service#dataLoaded
 * @cfg {Boolean} Items loaded with object data
 * @remark
 * true - BL return items with data
 * false - BL return items without data
 */

Object.assign(HistoryService.prototype, {
    _moduleName: 'Controls/history:Service',
});
