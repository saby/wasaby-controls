/**
 * @kaizen_zone 36b6051b-790d-4170-b31c-ecc1485a7232
 */
import { DataSet, ICrud, Query } from 'Types/source';
import { OptionsToPropertyMixin, SerializableMixin } from 'Types/entity';
import * as Constants from './Constants';
import { mixin } from 'Types/util';
import { getStore } from 'Application/Env';
import { Logger } from 'UI/Utils';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import type { IHistoryStoreData, IHistoryStore } from 'Controls/HistoryStore';

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

function callHistoryStoreMethod<T extends keyof IHistoryStore>(
    methodName: T,
    ...args: Parameters<IHistoryStore[T]>
): Promise<ReturnType<IHistoryStore[T]>> {
    return import('Controls/HistoryStore').then((HistoryStore) => {
        return HistoryStore.Store[methodName](...args);
    });
}

function callHistoryStoreMethodSync<T extends keyof IHistoryStore>(
    methodName: T,
    ...args: Parameters<IHistoryStore[T]>
): ReturnType<IHistoryStore[T]> {
    return loadSync<typeof import('Controls/HistoryStore')>('Controls/HistoryStore').Store[
        methodName
    ](...args);
}

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

    private _updateHistory(data: any, meta: any): any {
        let resultPromise;
        if (meta.params) {
            resultPromise = callHistoryStoreMethod(
                'update',
                data.get('HistoryId'),
                data.getKey(),
                data.get('ObjectData'),
                meta.params
            );
        } else if (data.ids) {
            resultPromise = callHistoryStoreMethod('push', this._$historyId, data.ids);
        } else {
            resultPromise = callHistoryStoreMethod(
                'push',
                data.get('HistoryId') || this._$historyId,
                data.getKey()
            );
        }
        return resultPromise;
    }

    // endregion

    update(data: any, meta: any): Promise<any> {
        let result: Promise<any> = Promise.resolve({});

        if (meta.hasOwnProperty('$_addFromData')) {
            result = callHistoryStoreMethod('push', this._$historyId, data).then((result) => {
                return new DataSet({ rawData: result });
            });
        }
        if (meta.hasOwnProperty('$_pinned')) {
            result = callHistoryStoreMethod(
                'togglePin',
                data.get('HistoryId') || this._$historyId,
                data.getKey(),
                !!meta.$_pinned
            );
        }
        if (meta.hasOwnProperty('$_history')) {
            result = this._updateHistory(data, meta);
        }

        return result;
    }

    deleteItem(data: any): Promise<unknown> {
        return callHistoryStoreMethodSync('delete', this._$historyId, data.getKey());
    }

    query(query?: Query): Promise<DataSet> {
        let resultDef;
        if (this._$historyId || this._$historyIds?.length) {
            resultDef = callHistoryStoreMethod(
                'load',
                this._$historyId ? [this._$historyId] : this._$historyIds,
                {
                    pinned: this._$pinned ? Constants.MAX_HISTORY : 0,
                    frequent: this._$frequent ? Constants.MAX_HISTORY - Constants.MIN_RECENT : 0,
                    recent: this._$recent || Constants.MAX_HISTORY,
                }
            );
        } else {
            Logger.error(
                'Controls/history: Не установлен идентификатор истории (опция historyId)',
                this
            );
            resultDef = Promise.reject();
        }
        return resultDef.then((data: IHistoryStoreData) => {
            return new DataSet({ rawData: data });
        });
    }

    destroy(id: number | string): Promise<void> {
        return id
            ? callHistoryStoreMethod('delete', this._$historyId, id)
            : Promise.resolve(void 0);
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

    /**
     * Save new history
     */
    saveHistory(historyId: string, history: IHistoryStoreData): void {
        getStore('ControlsHistoryDataStorage').set(historyId, { ...history });
    }

    /**
     * Returns a set of history items
     * @returns {Object}
     */
    getHistory(historyId: string): IHistoryStoreData {
        return callHistoryStoreMethodSync('getLocal', historyId);
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
