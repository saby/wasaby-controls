/**
 * @kaizen_zone 7932f75e-2ad3-49ad-b51a-724eb5c140eb
 */
import tmpl = require('wml!Controls/_form/FormController/FormController');
import { TemplateFunction, Control } from 'UI/Base';
import { constants } from 'Env/Env';
import { readWithAdditionalFields } from './crudProgression';
import { Deferred } from 'Types/deferred';
import { error as dataSourceError } from 'Controls/dataSource';
import { DialogOpener, ErrorController, OnProcessCallback } from 'Controls/error';
import { ErrorType, ErrorViewConfig, ErrorViewMode, ErrorViewSize } from 'ErrorHandling/interface';
import { Model } from 'Types/entity';
import { CRUD_EVENTS, default as CrudController, ICrudConfig } from 'Controls/_form/CrudController';
import ControllerBase from 'Controls/_form/ControllerBase';
import { default as IFormController } from 'Controls/_form/interface/IFormController';
import * as rk from 'i18n!Controls';
import { IUpdateConfig } from 'Controls/_form/interface/IControllerBase';

interface IReceivedState {
    data?: Model;
    errorConfig?: ErrorViewConfig;
}

interface ICrudResult extends IReceivedState {
    error?: Error;
}

interface IAdditionalData {
    key?: string;
    record?: Model;
    isNewRecord?: boolean;
    error?: Error;
}

export interface IResultEventData {
    formControllerEvent: string;
    record: Model;
    additionalData: IAdditionalData;
}

interface IConfigInMounting {
    isError: boolean;
    result: Model;
}

export enum INITIALIZING_WAY {
    PRELOAD = 'preload',
    LOCAL = 'local',
    READ = 'read',
    CREATE = 'create',
    DELAYED_READ = 'delayedRead',
    DELAYED_CREATE = 'delayedCreate',
}

const DELAYED_INITIALIZING_WAYS = [
    INITIALIZING_WAY.DELAYED_CREATE,
    INITIALIZING_WAY.DELAYED_READ,
    INITIALIZING_WAY.PRELOAD,
];

/**
 * Контроллер, в котором определена логика CRUD-методов, выполняемых над редактируемой записью.
 * В частном случае контрол применяется для создания <a href="/doc/platform/developmentapl/interface-development/controls/list/actions/editing-dialog/">диалогов редактирования записи</a>. Может выполнять запросы CRUD-методов на БЛ.
 * @remark
 * Для того, чтобы дочерние контролы могли отреагировать на начало сохранения, либо уничтожения контрола, им необходимо зарегистрировать соответствующие обработчики.
 * Обработчики регистрируются через событие registerFormOperation, в аргументах которого ожидается объект с полями:
 *
 * * save:Function - вызов происходит перед началом сохранения.
 * * cancel:Function - вызов происходит перед показом вопроса о сохранении.
 * * isDestroyed:Function - функция, которая сообщает о том, не разрушился ли контрол, зарегистрировавший операцию.
 * В случае, если он будет разрушен - операция автоматически удалится из списка зарегистрированных.
 *
 * Для ускорения построения данных диалога редактирования необходимо внутри шаблона использовать **content.record**:
 * <pre>
 * <Controls.form:Controller source="{{ _dataSource }}" record="{{ _record }}">
 *   <div>
 *       ...
 *       <Controls.input:Text bind:value="content.record.name" />
 *   </div>
 * </Controls.form:Controller>
 * </pre>
 *
 * @class Controls/form:FormController
 * @extends Controls/form:ControllerBase
 * @implements Controls/interface:ISource
 * @implements Controls/form:IFormController
 * @ignoreOptions dataLoadCallback
 * @public
 *
 * @demo Controls-demo/Popup/Edit/Opener
 */

/*
 * Record editing controller. The control stores data about the record and can execute queries CRUD methods on the BL.
 * <a href="/doc/platform/developmentapl/interface-development/controls/list/actions/editing-dialog/">More information and details.</a>.
 * @class Controls/_form/FormController
 * @extends Controls/form:ControllerBase
 * @implements Controls/interface:ISource
 * @implements Controls/form:IFormController
 * @demo Controls-demo/Popup/Edit/Opener
 *
 * @public
 * @author Мочалов М.А.
 */

class FormController extends ControllerBase<IFormController> {
    protected _template: TemplateFunction = tmpl;
    protected _errorContainer: typeof Control = dataSourceError.Container;
    private _isNewRecord: boolean = false;
    private _finishCreatePromiseInMount = false;
    private _createMetaDataOnUpdate: unknown = null;
    private _errorController: ErrorController;
    private _createdInMounting: IConfigInMounting;
    private _isMount: boolean;
    private _readInMounting: IConfigInMounting;
    private _wasCreated: boolean;
    private _wasRead: boolean;
    private _wasDestroyed: boolean;
    private _error: ErrorViewConfig;
    private _crudController: CrudController = null;
    private _dialogOpener: DialogOpener;
    private _updatePromise: Promise<unknown>;
    private _isSetRepeatFunction: boolean = false;
    private _repeatFunction: () => Promise<unknown> = () => {
        return Promise.resolve();
    };

    protected _beforeMount(
        options?: IFormController,
        context?: object,
        receivedState: IReceivedState = {}
    ): Promise<ICrudResult> | void {
        this._errorController = options.errorController || new ErrorController();
        this._updateErrorRepeatConfig();

        this._crudController = new CrudController(
            options.source,
            this._notifyHandler.bind(this),
            this.registerPendingNotifier.bind(this),
            this._notify.bind(this)
        );
        const receivedError = receivedState.errorConfig;
        const receivedData = receivedState.data;

        if (receivedError) {
            return this._showError(receivedError);
        }
        const record = receivedData || options.record || null;

        this._isNewRecord = !!options.isNewRecord;
        this._setRecord(record);

        const initializingWay = this._calcInitializingWay(options);
        this._finishCreatePromiseInMount = true;

        if (initializingWay === INITIALIZING_WAY.PRELOAD) {
            // В случае с предзагрузкой рекорда может не быть, но он придет на фазе обновления с prefetchData.
        } else if (initializingWay !== INITIALIZING_WAY.LOCAL) {
            let recordPromise;
            if (
                initializingWay === INITIALIZING_WAY.READ ||
                initializingWay === INITIALIZING_WAY.DELAYED_READ
            ) {
                const hasKey: boolean =
                    options.entityKey !== undefined && options.entityKey !== null;
                if (!hasKey) {
                    this._throwInitializingWayException(initializingWay, 'entityKey');
                }
                recordPromise = this._readRecordBeforeMount(options);
            } else {
                this._finishCreatePromiseInMount = initializingWay !== INITIALIZING_WAY.DELAYED_CREATE;
                recordPromise = this._createRecordBeforeMount(options);
                recordPromise.finally(() => {
                    this._finishCreatePromiseInMount = true;
                });
            }
            if (
                initializingWay === INITIALIZING_WAY.READ ||
                initializingWay === INITIALIZING_WAY.CREATE
            ) {
                return recordPromise;
            }
        } else if (!record) {
            this._throwInitializingWayException(initializingWay, 'record');
        }
    }

    protected _afterMount(options: IFormController): void {
        super._afterMount();
        this._isMount = true;
        // если рекорд был создан во время beforeMount, уведомим об этом
        if (this._createdInMounting) {
            this._createRecordBeforeMountNotify();
        }

        // если рекорд был прочитан через ключ во время beforeMount, уведомим об этом
        if (this._readInMounting) {
            this._readRecordBeforeMountNotify();
        }
    }

    protected _beforeUpdate(newOptions: IFormController): void {
        const isPreloadWay = newOptions.initializingWay === INITIALIZING_WAY.PRELOAD;
        const createMetaData = newOptions.createMetaData;
        const needRead: boolean =
            !isPreloadWay &&
            newOptions.entityKey !== undefined &&
            this._options.entityKey !== newOptions.entityKey;
        const needCreate: boolean =
            !isPreloadWay &&
            newOptions.entityKey === undefined &&
            !newOptions.record &&
            this._createMetaDataOnUpdate !== createMetaData;

        const updateData = () => {
            if (newOptions.record && this._record !== newOptions.record) {
                this._setRecord(newOptions.record);
            }
            if (newOptions.source && newOptions.source !== this._options.source) {
                // Сбрасываем состояние, только если данные поменялись, иначе будет зацикливаться
                // создание записи -> ошибка -> beforeUpdate
                this._createMetaDataOnUpdate = null;
                this._crudController.setDataSource(newOptions.source);
            }
        };

        if (newOptions.record && this._record !== newOptions.record) {
            const isEqualId = this._isEqualId(this._record, newOptions.record);
            if (!needCreate && !needRead && !isEqualId) {
                this._confirmRecordChangeHandler(() => {
                    this._setRecord(newOptions.record);
                });
            }
        }
        if (needRead) {
            // Если текущий рекорд изменен, то покажем вопрос
            this._confirmRecordChangeHandler(
                () => {
                    updateData();
                    this.read(newOptions.entityKey, newOptions.readMetaData);
                },
                () => {
                    this._tryDeleteNewRecord().then(() => {
                        this.read(newOptions.entityKey, newOptions.readMetaData);
                    });
                    updateData();
                }
            );
        } else if (needCreate) {
            // Может возникнуть ситуация, что отправили запрос на создание в beforeMount, и произошел rerender
            // Из-за чего запись создается еще раз. Поэтому убеждаемся что запрос на beforeMount завершился
            // https://online.sbis.ru/opendoc.html?guid=cfcc5b01-d192-4ed4-9f8d-af64d6f3437f&client=3
            if (this._finishCreatePromiseInMount) {
                // Если нет ключа и записи - то вызовем метод создать.
                // Состояние isNewRecord обновим после того, как запись вычитается,
                // иначе можем удалить рекорд, к которому новое значение опции isNewRecord не относится.
                // Добавил защиту от циклических вызовов: У контрола стреляет _beforeUpdate, нет рекорда и ключа =>
                // вызывается создание записи. Метод падает с ошибкой. У контрола стреляет _beforeUpdate,
                // вызов метода создать повторяется бесконечно. Нельзя чтобы контрол ддосил БЛ.
                this._confirmRecordChangeHandler(() => {
                    this._createMetaDataOnUpdate = createMetaData;
                    updateData();
                    this.create(newOptions.createMetaData).then(() => {
                        if (newOptions.hasOwnProperty('isNewRecord')) {
                            this._isNewRecord = newOptions.isNewRecord;
                        }
                        this._createMetaDataOnUpdate = null;
                    });
                });
            }
        } else {
            if (!this._isConfirmShowed) {
                if (newOptions.hasOwnProperty('isNewRecord')) {
                    this._isNewRecord = newOptions.isNewRecord;
                }
                updateData();
            }
        }
    }

    private _throwInitializingWayException(
        initializingWay: INITIALIZING_WAY,
        requiredOptionName: string
    ): void {
        throw new Error(`${this._moduleName}: Опция initializingWay установлена в значение ${initializingWay}.
        Для корректной работы требуется передать опцию ${requiredOptionName}, либо изменить значение initializingWay`);
    }

    private _calcInitializingWay(options: IFormController): INITIALIZING_WAY {
        if (options.initializingWay) {
            return options.initializingWay;
        }
        const hasKey: boolean = options.entityKey !== undefined && options.entityKey !== null;
        if (options.record) {
            if (hasKey) {
                return INITIALIZING_WAY.DELAYED_READ;
            }
            return INITIALIZING_WAY.LOCAL;
        }
        if (hasKey) {
            return INITIALIZING_WAY.READ;
        }
        return INITIALIZING_WAY.CREATE;
    }

    protected _afterUpdate(options: IFormController): void {
        if (this._wasCreated || this._wasRead || this._wasDestroyed) {
            // сбрасываем результат валидации, если только произошло создание, чтение или удаление рекорда
            this._validateController.setValidationResult(null);
            this._wasCreated = false;
            this._wasRead = false;
            this._wasDestroyed = false;
        }

        // В случае прелоада при появлении рекорда ставим фокус,
        // т.к. могло не быть много контента и фокус поставить было некуда
        if (
            this._options.initializingWay === INITIALIZING_WAY.PRELOAD &&
            !options.record &&
            this._options.record
        ) {
            this.activate();
        }
        super._afterUpdate();
    }

    protected _beforeUnmount(): void {
        super._beforeUnmount();
        // when FormController destroying, its need to check new record was saved or not.
        // If its not saved, new record trying to delete.
        // Текущая реализация не подходит, завершать пендинги могут как сверху(при закрытии окна), так и
        // снизу (редактирование закрывает пендинг).
        // надо делать так, чтобы редактирование только на свой пендинг влияло
        // https://online.sbis.ru/opendoc.html?guid=78c34d53-8705-4e25-bbb5-0033e81d6152
        if (this._needDestroyRecord()) {
            const removePromise = this._tryDeleteNewRecord();
            this._notifyToOpener(CRUD_EVENTS.DELETE_STARTED, [
                this._record,
                this._getRecordId(),
                {removePromise},
            ]);
        }
        this._crudController = null;
        this._dialogOpener?.destroy();
        this._dialogOpener = null;
    }

    private _setFunctionToRepeat(foo: Function, ...args: unknown[]): void {
        this._isSetRepeatFunction = true;
        this._repeatFunction = foo.bind(this, ...args);
    }

    private _updateErrorRepeatConfig(): void {
        /*
          Отключаем кнопку повтора действия, если ошибка строится на сервисе представления,
          потому что это значит, что панель открыли в отдельной вкладке/окне.
          Кнопка повтора призвана повторять действие без перезагрузки страницы и в ней нет смысла,
          если вся страница - это панель.
         */
        if (constants.isServerSide) {
            return;
        }

        this._errorController.updateOnProcess((viewConfig) => {
            const display =
                viewConfig.mode !== ErrorViewMode.dialog &&
                viewConfig.type !== ErrorType.accessDenied &&
                viewConfig.type !== ErrorType.notFound &&
                viewConfig.type !== ErrorType.network;

            viewConfig.options.repeatConfig = {
                display,
                function: () => {
                    return this._repeatFunction()
                        .then(() => {
                            if (!this._isSetRepeatFunction && this._options.source) {
                                this._readRecordBeforeMount(this._options);
                            }
                            this._hideError();
                        })
                        .catch(() => {
                            /* FIXME: empty */
                        });
                },
            };

            // Форм-контроллер всегда большой, поэтому показываем ошибку в большом размере.
            viewConfig.options.size = ErrorViewSize.large;

            return viewConfig;
        });
    }

    private _createRecordBeforeMount(cfg: IFormController): Promise<ICrudResult> {
        // если ни рекорда, ни ключа, создаем новый рекорд и используем его.
        // до монитрования в DOM не можем сделать notify событий (которые генерируются в CrudController,
        // а стреляются с помощью FormController'а, в данном случае), поэтому будем создавать рекорд напрямую.
        return cfg.source.create(cfg.createMetaData).then(
            (record: Model) => {
                const initializingWay = this._calcInitializingWay(cfg);

                // Если initializingWay === Create, то нужно установить запись на состояние, чтобы на момент маунта
                // Верстка была готова. Если этого не сделать, то опция record обновится только после маунта, т.к.
                // раньше событие о вычитке записи мы пронотифаить не можем.
                if (initializingWay === INITIALIZING_WAY.CREATE) {
                    this._setRecord(record);
                }
                this._createdInMounting = {isError: false, result: record};

                if (this._isMount) {
                    this._createRecordBeforeMountNotify();
                }
                return {
                    data: record,
                };
            },
            (e: Error) => {
                this._createdInMounting = {isError: true, result: e};
                this._setFunctionToRepeat(this.create, cfg.createMetaData, cfg);
                return this.processError(e).then(this._getState);
            }
        );
    }

    private _readRecordBeforeMount(cfg: IFormController): Promise<ICrudResult> {
        // если в опции не пришел рекорд, смотрим на ключ key, который попробуем прочитать.
        // до монитрования в DOM не можем сделать notify событий (которые генерируются в CrudController,
        // а стреляются с помощью FormController'а, в данном случае), поэтому будем создавать рекорд напрямую.
        return readWithAdditionalFields(cfg.source, cfg.entityKey, cfg.readMetaData)
            .then(
                (record: Model) => {
                    this._setRecord(record);
                    this._readInMounting = {isError: false, result: record};

                    return {
                        data: record,
                    };
                },
                (e: Error) => {
                    this._readInMounting = {isError: true, result: e};
                    this._setFunctionToRepeat(this.read, cfg.entityKey, cfg.readMetaData, cfg);
                    return this.processError(e).then(this._getState);
                }
            )
            .finally(() => {
                if (this._isMount) {
                    this._readRecordBeforeMountNotify();
                }
            }) as Promise<{ data: Model }>;
    }

    private _readRecordBeforeMountNotify(): void {
        if (!this._readInMounting.isError) {
            this._notifyHandler(CRUD_EVENTS.READ_SUCCESSED, [this._readInMounting.result]);

            // перерисуемся
            this._readHandler(this._record);
        } else {
            this._notifyHandler(CRUD_EVENTS.READ_FAILED, [this._readInMounting.result]);
        }
        this._readInMounting = null;
    }

    private _createRecordBeforeMountNotify(): void {
        if (!this._createdInMounting.isError) {
            this._notifyHandler(CRUD_EVENTS.CREATE_SUCCESSED, [this._createdInMounting.result]);

            // зарегистрируем пендинг, перерисуемся
            this._createHandler(this._record);
        } else {
            this._notifyHandler(CRUD_EVENTS.CREATE_FAILED, [this._createdInMounting.result]);
        }
        this._createdInMounting = null;
    }

    private _getState = (crudResult: ICrudResult): IReceivedState => {
        delete crudResult.error;
        return crudResult;
    };

    private _getData = (crudResult: ICrudResult): Promise<undefined | Model> => {
        if (!crudResult) {
            return Promise.resolve();
        }
        if (crudResult.hasOwnProperty('data')) {
            return Promise.resolve(crudResult.data);
        }
        return Promise.reject(crudResult.error);
    };

    private _tryDeleteNewRecord(): Promise<undefined> {
        if (this._needDestroyRecord()) {
            return this._options.source.destroy(this._getRecordId(), this._options.destroyMetaData);
        }
        return Promise.resolve();
    }

    private _needDestroyRecord(): number | string {
        // Destroy record when:
        // 1. The record obtained by the method "create"
        // 2. The "create" method returned the key
        return this._record && this._isNewRecord && this._getRecordId();
    }

    create(metaDataCreator: unknown, config?: ICrudConfig): Promise<undefined | Model> {
        const createMetaData = metaDataCreator || this._options.createMetaData;
        this._setFunctionToRepeat(this.create, createMetaData, config);
        return this._crudController
            .create(createMetaData, config)
            .then(this._createHandler.bind(this), this._crudErrback.bind(this));
    }

    private _createHandler(record: Model): Model {
        this._updateIsNewRecord(true);
        this._setRecord(record);
        this._wasCreated = true;
        this._forceUpdate();
        return record;
    }

    read(key: string, metaDataReader: unknown, config?: ICrudConfig): Promise<Model> {
        const readMetaData = metaDataReader || this._options.readMetaData;
        this._setFunctionToRepeat(this.read, key, readMetaData, config);
        return this._crudController
            .read(key, readMetaData, config)
            .then(this._readHandler.bind(this), this._crudErrback.bind(this));
    }

    registerPendingNotifier(params: unknown[]): void {
        this._notify('registerPending', params, {bubbling: true});
    }

    indicatorNotifier(eventType: string, params: []): string {
        return this._notify(eventType, params, {bubbling: true});
    }

    private _readHandler(record: Model): Model {
        this._wasRead = true;
        this._setRecord(record);
        this._updateIsNewRecord(false);
        this._forceUpdate();
        this._hideError();
        return record;
    }

    update(config?: IUpdateConfig): Promise<unknown> {
        const updateResult = new Deferred();
        const updateCallback = (updResult) => {
            // if result is true, custom update called and we dont need to call original update.
            if (updResult !== true) {
                this._notifyToOpener(CRUD_EVENTS.UPDATE_STARTED, [
                    this._record,
                    this._getRecordId(),
                ]);
                this._startFormOperations('save')
                    .then(() => {
                        const res = this._update(config).then(this._getData);
                        updateResult.dependOn(res);
                    })
                    .catch((error) => {
                        updateResult.errback(error);
                    });
            } else {
                this._updateIsNewRecord(false);
                updateResult.callback(true);
            }
        };

        // maybe anybody want to do custom update. check it.
        const result = this._notify('requestCustomUpdate', [this._record, config]);

        // pending waiting while update process finished
        this._updatePromise = new Deferred();
        this._notify('registerPending', [this._updatePromise, {showLoadingIndicator: false}], {
            bubbling: true,
        });
        this._updatePromise.dependOn(updateResult);

        if (result && result.then) {
            result.then(
                (defResult) => {
                    updateCallback(defResult);
                    return defResult;
                },
                (err) => {
                    updateResult.errback(err);
                    return err;
                }
            );
        } else {
            updateCallback(result);
        }
        return updateResult;
    }

    private _update(config: IUpdateConfig = {}): Promise<boolean> {
        const record = this._record;
        const updateDef = new Deferred();

        // запускаем валидацию
        const validationDef = this.validate();
        validationDef.then(
            (results) => {
                if (!results.hasErrors) {
                    // при успешной валидации пытаемся сохранить рекорд
                    this._notify('validationSuccessed', []);
                    let res = this._crudController.update(record, this._isNewRecord, {
                        updateMetaData: this._options.updateMetaData,
                        ...config,
                    });
                    // fake deferred used for code refactoring
                    if (!(res && res.then)) {
                        res = new Deferred();
                        res.callback();
                    }
                    res.then((arg) => {
                        this._updateIsNewRecord(false);

                        updateDef.callback({data: arg});
                        return arg;
                    }).catch((error: Error) => {
                        updateDef.errback(error);
                        this._setFunctionToRepeat(this._update, config);
                        return this.processError(error, ErrorViewMode.dialog);
                    });
                } else {
                    // если были ошибки валидации, уведомим о них
                    const validationErrors = this._validateController.getValidationResult();
                    this._notify('validationFailed', [validationErrors]);
                    const error = this._createError(rk('Некорректно заполнены обязательные поля'));
                    updateDef.errback(error);
                }
            },
            (e) => {
                updateDef.errback(e);
                return e;
            }
        );
        return updateDef;
    }

    private _createError(message: string): Error {
        return new Error(message);
    }

    delete(destroyMetaData: unknown, config?: ICrudConfig): Promise<Model | undefined> {
        const resultProm = this._crudController.delete(
            this._record,
            destroyMetaData || this._options.destroyMetaData,
            config
        );

        return resultProm.then(
            (record) => {
                this._setRecord(null);
                this._wasDestroyed = true;
                this._updateIsNewRecord(false);
                this._forceUpdate();
                return record;
            },
            (error) => {
                this._setFunctionToRepeat(this.delete, destroyMetaData, config);
                return this._crudErrback(error, ErrorViewMode.dialog);
            }
        );
    }

    /**
     *
     * @param {Error} error
     * @param {Controls/_dataSource/_error/ErrorViewMode} [errorViewMode]
     * @return {Promise<*>}
     * @private
     */
    private _crudErrback(error: Error, errorViewMode: ErrorViewMode): Promise<undefined | Model> {
        return this.processError(error, errorViewMode).then(this._getData);
    }

    /**
     * Изменение состояния для редактирование новой записи.
     * Нужно использовать, чтобы избежать удаления записи при unMount
     * @param value
     */
    updateIsNewRecord(value: boolean): void {
        this._updateIsNewRecord(value);
    }

    private _updateIsNewRecord(value: boolean): void {
        if (this._isNewRecord !== value) {
            this._isNewRecord = value;
            this._notify('isNewRecordChanged', [value]);
        }
    }

    /**
     * Обработка ошибки возникшей при чтении/создании записи.
     * Нужно использовать, если вы каким-либо образом самостоятельно получаете запись и получаете ошибку от сервера.
     * @param {Error} error
     * @param {Controls.error:ErrorViewMode} [mode]
     * @param {Controls.error:OnProcessCallback} [onProcessCallback]
     * @return {Promise.<CrudResult>}
     */
    processError(
        error: Error,
        mode?: ErrorViewMode,
        onProcessCallback?: OnProcessCallback
    ): Promise<ICrudResult> {
        if (onProcessCallback) {
            this._errorController.setOnProcess(onProcessCallback);
        }
        return this._errorController
            .process({
                error,
                theme: this._options.theme,
                mode: mode || this._getErrorProcessingMode(),
            })
            .then((errorConfig: ErrorViewConfig) => {
                if (errorConfig) {
                    this._showError(errorConfig);
                }

                return {
                    error,
                    errorConfig,
                };
            });
    }

    /**
     * Если выбран способ инициализации с дфухфазной отрисовкой, то показываем ошибку в диалоге только в том случае,
     * если мы уже показали какой-то контент и не логично его затирать ошибкой. Если показывать нечего, выведем
     * ошибку в форме.
     * @private
     */
    private _getErrorProcessingMode(): ErrorViewMode {
        const initializingWay = this._calcInitializingWay(this._options);
        return DELAYED_INITIALIZING_WAYS.includes(initializingWay) && this._record
            ? ErrorViewMode.dialog
            : ErrorViewMode.include;
    }

    /**
     * @private
     */
    private _showError(errorConfig: ErrorViewConfig): void {
        if (errorConfig.mode !== ErrorViewMode.dialog) {
            this._error = errorConfig;
            return;
        }

        if (!this._dialogOpener) {
            this._dialogOpener = new DialogOpener();
        }

        this._dialogOpener.open(errorConfig, {
            opener: this,
            modal: false,
            eventHandlers: {
                onClose: this._onCloseErrorDialog.bind(this),
            },
        });
    }

    private _hideError(): void {
        if (this._error) {
            this._error = null;
        }
        this._dialogOpener?.close();
    }

    private _onCloseErrorDialog(): void {
        this._hideError();
        if (!this._record) {
            this._notify('close', [], {bubbling: true});
        }
    }

    private _notifyHandler(eventName: string, args: [Model, string | number, object?]): void {
        this._notifyToOpener(eventName, args);
        this._notify(eventName, args);
    }

    private _notifyToOpener(eventName: string, args: [Model, string | number, object?]): void {
        const handlers = {
            [CRUD_EVENTS.CREATE_SUCCESSED]: this._getCreateSuccessedData,
            [CRUD_EVENTS.UPDATE_STARTED]: this._getUpdateStartedData,
            [CRUD_EVENTS.UPDATE_SUCCESSED]: this._getUpdateSuccessedData,
            [CRUD_EVENTS.READ_SUCCESSED]: this._getReadSuccessedData,
            [CRUD_EVENTS.DELETE_STARTED]: this._getDeleteStartedData,
            [CRUD_EVENTS.DELETE_SUCCESSED]: this._getDeleteSuccessedData,
            [CRUD_EVENTS.UPDATE_FAILED]: this._getUpdateFailedData,
        };
        const handler = handlers[eventName];
        if (handler) {
            const resultData = handler.apply(this, args);
            this._notify('sendResult', [resultData], {bubbling: true});
        }
    }

    private _getUpdateStartedData(record: Model, key: string): IResultEventData {
        const config = this._getUpdateSuccessedData(record, key);
        config.formControllerEvent = CRUD_EVENTS.UPDATE_STARTED;
        return config;
    }

    private _getUpdateSuccessedData(record: Model, key: string, config?: object): IResultEventData {
        const configData = config ? config.additionalData : {};
        const additionalData: IAdditionalData = {
            key,
            isNewRecord: this._isNewRecord,
            ...configData,
        };
        return this._getResultData('update', record, additionalData);
    }

    private _getDeleteStartedData(record: Model, key: string, config: object): IResultEventData {
        return this._getResultData(CRUD_EVENTS.DELETE_STARTED, record, config);
    }

    private _getDeleteSuccessedData(record: Model): IResultEventData {
        return this._getResultData('delete', record);
    }

    private _getCreateSuccessedData(record: Model): IResultEventData {
        return this._getResultData('create', record);
    }

    private _getReadSuccessedData(record: Model): IResultEventData {
        return this._getResultData('read', record);
    }

    private _getUpdateFailedData(error: Error, record: Model): IResultEventData {
        const additionalData: IAdditionalData = {
            record,
            error,
            isNewRecord: this._isNewRecord,
        };
        return this._getResultData(CRUD_EVENTS.UPDATE_FAILED, record, additionalData);
    }

    private _getResultData(
        eventName: string,
        record: Model,
        additionalData?: IAdditionalData
    ): IResultEventData {
        return {
            formControllerEvent: eventName,
            record,
            additionalData: additionalData || {},
        };
    }
}

/**
 * Объект с состоянием, полученным при серверном рендеринге.
 * @typedef {Object} ReceivedState
 * @property {*} [data]
 * @property {Controls/dataSource:error.ViewConfig} [errorConfig]
 */

/*
 * Object with state from server side rendering
 * @typedef {Object}
 * @name ReceivedState
 * @property {*} [data]
 * @property {Controls/dataSource:error.ViewConfig} [errorConfig]
 */

/**
 * @typedef {Object} CrudResult
 * @property {*} [data]
 * @property {Controls/dataSource:error.ViewConfig} [errorConfig]
 * @property {Controls/dataSource:error.ViewConfig} [error]
 */

export default FormController;
