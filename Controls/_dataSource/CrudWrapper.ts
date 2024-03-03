/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { Query, ICrud, DataSet } from 'Types/source';
import { Record, Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import * as cInstance from 'Core/core-instance';

import { ErrorController, ErrorViewMode, ErrorViewConfig } from 'Controls/error';
import { Logger } from 'UI/Utils';
import { IQueryParams } from 'Controls/_interface/IQueryParams';

export interface ICrudWrapperOptions {
    source: ICrud;
    errorController?: ErrorController;
    errorViewMode?: ErrorViewMode;
}

/**
 * Прослойка между контролом и source: Types/_source/ICrud, которая позволяет перехватывать ошибку загрузки и возвращать в catch Controls/_dataSource/_error/ViewConfig конфиг для отображения ошибки
 * @class Controls/dataSource/CrudWrapper
 * @example
 * <pre class="brush: js>
 * const source = new Memory({
 *     keyProperty: 'id',
 *     data: data
 * });
 * const handlers = {
 *    handlers: [
 *        (config: IErrorHandlerConfig): error.ViewConfig) => ({
 *            template: LockedErrorTemplate,
 *            options: {
 *                // ...
 *            }
 *        })
 *        (config: IErrorHandlerConfig): error.ViewConfig) => ({
 *            template: LockedErrorTemplate,
 *            options: {
 *                // ...
 *            }
 *        })
 *    ]
 * }
 * const errorController = new ErrorController({handlers});
 * const errorConfig: ISourceErrorConfig = {
 *     mode: error.Mode.include,
 *     onBeforeProcessError: (error: Error) => {
 *         console.log(error);
 *     }
 * }
 * const crudWrapper = new CrudWrapper(source, errorConfig, errorController);
 * crudWrapper.create(...)
 *     .then((record: Record) => {
 *         // ...
 *     })
 *     .catch((error: error.ViewConfig) => {
 *         this._showError(error);
 *     })
 * </pre>
 * @public
 */

export class CrudWrapper {
    private _source: ICrud;
    private readonly _errorController: ErrorController;

    private readonly _boundPromiseCatchCallback: (error: Error) => Promise<null>;

    constructor(options: ICrudWrapperOptions) {
        if (CrudWrapper._isValidCrudSource(options.source)) {
            this._source = options.source;
        }
        this._errorController = options.errorController || new ErrorController({});
        this._boundPromiseCatchCallback = this._promiseCatchCallback.bind(this);
    }

    /**
     * Создает пустую запись через источник данных (при этом она не сохраняется в хранилище)
     * @function Controls/dataSource/CrudWrapper#create
     * @param {object} meta Дополнительные мета данные, которые могут понадобиться для создания записи
     * @return Асинхронный результат выполнения: в случае успеха вернет {@link Types/_entity/Record} - созданную запись, в случае ошибки - Error.
     */
    /*
     * Creates empty Record using current storage (without saving to the storage)
     * @param {object} meta Additional meta data to create a Record
     * @return Promise resolving created Record {@link Types/_entity/Record} and rejecting an Error.
     */
    create(meta?: object): Promise<Record> {
        return this._source.create(meta).catch(this._boundPromiseCatchCallback);
    }

    /**
     * Читает запись из источника данных
     * @function Controls/dataSource/CrudWrapper#read
     * @param {string|number} key Первичный ключ записи
     * @param {object} meta Дополнительные мета данные
     * @return Асинхронный результат выполнения: в случае успеха вернет {@link Types/_entity/Record} - прочитанную запись, в случае ошибки - Error.
     */
    /*
     * Reads a Record from current storage
     * @param {string|number} key Primary key for Record
     * @param {object} meta Additional meta data
     * @return Promise resolving created Record {@link Types/_entity/Record} and rejecting an Error.
     */
    read(key: number | string, meta?: object): Promise<Record> {
        return this._source.read(key, meta).catch(this._boundPromiseCatchCallback);
    }

    /**
     * Обновляет запись в источнике данных
     * @function Controls/dataSource/CrudWrapper#update
     * @param data Обновляемая запись или рекордсет
     * @param {object} meta Дополнительные мета данные
     * @return Асинхронный результат выполнения: в случае успеха ничего не вернет, в случае ошибки - Error.
     */
    /*
     * Updates existing Record or RecordSet in current storage
     * @param data Updating Record or RecordSet
     * @param {object} meta Additional meta data
     * @return Promise resolving nothing and rejecting an Error.
     */
    update(data: Record | RecordSet<Model>, meta?: object): Promise<void> {
        return this._source.update(data, meta).catch(this._boundPromiseCatchCallback);
    }

    /**
     * Выполняет запрос на выборку
     * @function Controls/dataSource/CrudWrapper#query
     * @param {Array} queryParams Параметры для формирования запроса Query {@link Types/source/Query}. Если передать массив, то параметры буду склеены через union.
     * @param {String} keyProperty Поле, которое будет использоваться в качестве ключа возвращаемого рекордсета
     * @return Асинхронный результат выполнения: в случае успеха вернет {@link Types/_source/DataSet} - прочитаннные данные, в случае ошибки - Error.
     */
    /*
     * Runs query to get a party of records
     * @param {} [queryParams] Params to build Query {@link Types/source/Query}
     * @return Promise resolving created Record {@link Types/_entity/Record} and rejecting an Error.
     */
    query(queryParams: IQueryParams | IQueryParams[], keyProperty?: string): Promise<RecordSet> {
        let query;
        if (Array.isArray(queryParams)) {
            const queriesArray = [];
            queryParams.forEach((queriesParamsItem) => {
                queriesArray.push(CrudWrapper._getQueryInstance(queriesParamsItem));
            });
            if (queriesArray.length > 1) {
                query = queriesArray[0].union.apply(queriesArray[0], queriesArray.slice(1));
            } else {
                query = queriesArray[0];
            }
        } else {
            query = CrudWrapper._getQueryInstance(queryParams);
        }

        return this._source
            .query(query)
            .then((dataSet: DataSet) => {
                // TODO разобраться с типами. Похоже что PrefetchProxy отдает не DataSet
                if (
                    keyProperty &&
                    dataSet.getKeyProperty &&
                    keyProperty !== dataSet.getKeyProperty()
                ) {
                    dataSet.setKeyProperty(keyProperty);
                }
                const result = dataSet.getAll ? dataSet.getAll() : (dataSet as RecordSet);

                if (!(result instanceof RecordSet)) {
                    Logger.error(
                        'Controls/dataSource:CrudWrapper источник данных вернул невалидное значение из метода query. Результатом работы метода query должен быть Types/collection:RecordSet.',
                        this
                    );
                }
                return result;
            })
            .catch(this._boundPromiseCatchCallback);
    }

    /**
     * Удаляет запись из источника данных
     * @function Controls/dataSource/CrudWrapper#destroy
     * @param {string|number} keys Первичный ключ, или массив первичных ключей записи
     * @param {object} meta Дополнительные мета данные
     * @return Асинхронный результат выполнения: в случае успеха ничего не вернет, в случае ошибки - Error.
     * @see Types/source:ICrud#destroy
     */
    /*
     * Removes record(s) from current storage
     * @param {string|number} key Primary key(s) for Record(s)
     * @param {object} meta Additional meta data
     * @return Promise resolving nothing and rejecting an Error.
     * @see Types/_source/ICrud
     */
    destroy(keys: number | string | number[] | string[], meta?: object): Promise<void> {
        return this._source.destroy(keys, meta).catch(this._boundPromiseCatchCallback);
    }

    updateOptions(newOptions: ICrudWrapperOptions): void {
        if (CrudWrapper._isValidCrudSource(newOptions.source)) {
            this._source = newOptions.source;
        }
    }

    /**
     * Реджектит в Promise результат с конфигурацией для показа ошибки. Этот результат можно будет отловить в catch
     * Перед обработкой ошибки вызывает внешний коллбек onError
     * @param error
     * @private
     */
    private _promiseCatchCallback(error: Error): Promise<Error> {
        // TODO добавить обработку ошибок
        return Promise.reject(error);
    }

    /**
     * Обрабатывает ошибку и возвращает Promise с её конфигурацией
     * @param {String} error
     * @param {String} mode
     * @private
     */
    private _processError(error: Error, mode?: ErrorViewMode): Promise<void | ErrorViewConfig> {
        return this._errorController.process({
            error,
            mode: mode || ErrorViewMode.include,
        });
    }

    /**
     * Валидатор, позволяющий убедиться, что для source был точно передан Types/_source/ICrud
     * @param {Types/source:ICrud} source
     * @private
     */
    private static _isValidCrudSource(source: ICrud): boolean {
        if (
            !cInstance.instanceOfModule(source, 'Types/_source/ICrud') &&
            !cInstance.instanceOfMixin(source, 'Types/_source/ICrud')
        ) {
            Logger.error(`Controls/dataSource:SourceController Источник данных должен реализовывать интерфейс Types/source:ICrud.
                          Подробнее можно почитать тут: https://wi.sbis.ru/doc/platform/developmentapl/interface-development/data-sources/interfaces/`);
            return false;
        }
        return true;
    }

    private static _getQueryInstance(queryParams: IQueryParams): Query {
        let query = new Query();
        if (queryParams.filter) {
            query = query.where(queryParams.filter);
        }
        if (queryParams.offset) {
            query = query.offset(queryParams.offset);
        }
        if (queryParams.limit) {
            query = query.limit(queryParams.limit);
        }
        if (queryParams.sorting) {
            query = query.orderBy(queryParams.sorting);
        }
        if (queryParams.meta) {
            query = query.meta(queryParams.meta);
        }
        if (queryParams.select) {
            query = query.select(queryParams.select);
        }
        return query;
    }
}
/**
 * Ресурс для запроса данных.
 * @name Controls/dataSource/CrudWrapper#source
 * @cfg {Types/source:ICrud}
 * @example
 * const source = new Memory({
 *     keyProperty: 'id',
 *     data: data
 * });
 */
/*
 * Data source
 * @name Controls/dataSource/CrudWrapper#source
 * @cfg {Types/source:ICrud}
 */

/**
 * Контроллер ошибки c предварительно настроенными Handlers.
 * @name Controls/dataSource/CrudWrapper#errorController
 * @cfg {Controls/error:ErrorController}
 * @example
 * const handlers = {
 *    handlers: [
 *        (config: IErrorHandlerConfig): error.ViewConfig) => ({
 *            template: LockedErrorTemplate,
 *            options: {
 *                // ...
 *            }
 *        })
 *        (config: IErrorHandlerConfig): error.ViewConfig) => ({
 *            template: LockedErrorTemplate,
 *            options: {
 *                // ...
 *            }
 *        })
 *    ]
 * }
 * const errorController = new ErrorController(handlers);
 */
/*
 * Error controller instance with previously configured handlers.
 * @name Controls/dataSource/CrudWrapper#errorController
 * @cfg {Controls/error:ErrorController}
 */
