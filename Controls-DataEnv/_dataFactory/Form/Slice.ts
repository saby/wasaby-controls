import { EntityMarker } from 'Types/declarations';
import { adapter, format, Model as SbisRecord } from 'Types/entity';
import { CrudEntityKey, ICrud } from 'Types/source';
import { object } from 'Types/util';
import { TKey } from 'Controls-DataEnv/interface';
import { Slice } from 'Controls-DataEnv/slice';
import { createLoader } from './createLoader';
import { ConfirmationManager } from './ConfirmationManager';
import { ErrorManager } from './ErrorManager';
import {
    DEFAULT_DATA_PROPERTY,
    DEFAULT_USERDATA_PROPERTY,
    FormSliceActionType,
    IFormDataFactoryArguments,
    IFormDataFactoryResult,
} from './IFormDataFactory';
import { setPropertyValue } from './pathHelpers';
import { getFieldDeclaration } from './recordHelpers';
import { MutableRefObject } from 'react';

type NameBindingType = string[];

enum VALIDATION_STATE {
    valid = 'valid',
    invalid = 'invalid',
    invalidAccent = 'invalidAccent',
}

const DEFAULT_DELIMITER = '.';

export interface IFormSliceState {
    key: TKey;
    store: DataWrapper;
    loader: ICrud;
    validationState: Record<string, VALIDATION_STATE>;
    error?: Error;
}

interface IValidator {
    ref: MutableRefObject<any>;
    callbacks: Function[];
}

interface IValidatorResult {
    msg: string;
    validator: IValidator;
}

type TValidationResult = boolean | IValidatorResult;

export interface IFormSlice {
    state: IFormSliceState;

    /**
     * Возвращает значение поля из состоянии формы
     * @param name название поля
     */
    get(name: NameBindingType): unknown;

    /**
     * Устанавливает значение для поля в состоянии формы
     * @param name название поля
     * @param value значение поля
     */
    set(name: NameBindingType, value: unknown): void;

    /**
     * Возвращает признак наличия поля в состоянии формы
     * @param name название поля
     */
    has(name: NameBindingType): boolean;

    /**
     * Создает новую запись на источнике и помещает его в состояние формы.
     */
    create(meta?: object): Promise<void>;

    /**
     * Читает запись из источника данных и помещает их в состояние формы.
     */
    read(meta?: object): Promise<void>;

    /**
     * Сохраняет состояние формы через загрузчик данных.
     */
    update(type?: FormSliceActionType, meta?: object): Promise<void>;

    /**
     * Удаляет запись на источнике данных
     */
    delete(meta?: object): Promise<void>;

    /**
     * Регистрирует валидаторы
     * @param name название поля
     * @param fns функции-валидаторы
     * @param ref
     */
    registerValidators(name: string, fns: Function[], ref?: MutableRefObject<any>): void;

    /**
     * Снимает валидатор с регистрации
     * @param name название поля
     */
    unRegisterValidators(name: string): void;

    /**
     * Выполняет валидацию значения поля
     * @param name
     * @param showInfobox
     */
    validate(name: string, showInfobox: boolean): Promise<TValidationResult>;

    /**
     * Сбрасывает валидацию поля
     * @param name
     */
    resetValidation(name: string): void;

    /**
     * Выполняет валидацию всей формы
     */
    validateAll(): Promise<TValidationResult[]>;

    focus(name: string): boolean;

    /**
     * Возвращает состояние валидации по полям
     */
    validationState: Record<string, VALIDATION_STATE>;

    /**
     * Возвращает признак валидации для всей формы
     */
    isValid(): boolean;
}

interface IValidators {
    [name: string]: IValidator;
}

/**
 * Базовый слайс для работы с {@link Types/entity:Record} в формах@abstract
 * @class Controls-DataEnv/_dataFactory/Form/Slice
 * @public
 */
export default class FormSlice extends Slice<IFormSliceState> implements IFormSlice {
    private key: CrudEntityKey;
    private store: DataWrapper;
    private loader: ICrud;
    private _validators: IValidators = {};
    private _confirmationManager: ConfirmationManager;
    private _errorManager: ErrorManager;
    private _config: IFormDataFactoryArguments;

    private _onDataLoad: IFormDataFactoryArguments['onDataLoad'];
    private _onDataSave: IFormDataFactoryArguments['onDataSave'];
    private _onDataChange: IFormDataFactoryArguments['onDataChange'];
    // не можем взять тип из Controls/popup из-за циклических зависимостей
    private _infoboxOpener: any;

    protected _initState(
        loadResult: IFormDataFactoryResult,
        config: IFormDataFactoryArguments
    ): IFormSliceState {
        this._config = config;
        const store = new DataWrapper(this._normalizeLoadResults(loadResult) as SbisRecord, {
            newRecord: !config.id,
        });

        this._onDataSave = config.onDataSave || defaultCallback;
        this._onDataLoad = config.onDataLoad || defaultCallback;
        this._onDataChange = config.onDataChange || defaultCallback;
        this._confirmationManager = new ConfirmationManager(config?.confirmationOptions);
        this._errorManager = new ErrorManager();
        //@ts-ignore;
        this._onDataLoad(store);
        return {
            key: config.id || store.getId(),
            store,
            loader: createLoader(config),
            validationState: {},
            error: this._getErrorState(loadResult),
        };
    }

    protected _beforeApplyState(
        nextState: IFormSliceState
    ): IFormSliceState | Promise<IFormSliceState> {
        // если в стейт положили новый рекорд, надо старый сохранить
        if (nextState.store.getStore() && this.store.getStore() !== nextState.store.getStore()) {
            this._beforeRecordClose();
        }
        return super._beforeApplyState(nextState);
    }

    registerValidators(name: string, fns: Function[], ref: MutableRefObject<any>): void {
        this._validators[name] = {
            ref,
            callbacks: fns,
        };
    }

    unRegisterValidators(name: string): void {
        delete this._validators[name];
    }

    protected _infoboxOpenerCb(callback: Function) {
        if (this._infoboxOpener) {
            callback();
        } else {
            import('Controls/popup').then(({ Infobox }) => {
                this._infoboxOpener = Infobox;
                callback();
            });
        }
    }

    protected _showInfobox(validator: IValidator, msg: string) {
        const cb = () => {
            if (msg && validator.ref?.current) {
                this._infoboxOpener.openPopup({
                    target: validator.ref.current,
                    message: msg,
                    closeOnOutsideClick: false,
                    borderStyle: 'danger',
                });
            }
        };
        this._infoboxOpenerCb(cb);
    }

    protected _closeInfobox() {
        this._infoboxOpenerCb(() => {
            this._infoboxOpener.closePopup();
        });
    }

    async validate(name: string, showInfobox: boolean = true): Promise<TValidationResult> {
        const result = await this._validate(name, showInfobox);
        this.setState({
            validationState: {
                ...this.validationState,
                [name]: computeValidationState(result),
            },
        });

        return result;
    }

    private _validate(name: string, showInfobox: boolean = true): Promise<TValidationResult> {
        if (showInfobox) {
            this._closeInfobox();
        }
        if (this._validators[name]) {
            let status = true;
            const promises: Promise<TValidationResult>[] = [];
            let msg: string;
            this._validators[name].callbacks.map((validator) => {
                // @ts-ignore
                const normalizedName = name instanceof Array ? name : name.split(',');
                const value = this.get(normalizedName);
                const res = validator({ value });
                // если валидатор вернул промис, нужно дожаться его выполнения
                if (res instanceof Promise) {
                    res.then((result) => {
                        if (result !== true) {
                            status = false;
                            if (!msg) {
                                msg = result;
                            }
                        }
                    });
                    return promises.push(res);
                }

                // если вернулся не boolean, значит валидатор вернул ошибку
                if (res !== true) {
                    status = false;
                    if (!msg) {
                        msg = res;
                    }
                    promises.push(Promise.resolve(res));
                }
            });

            return Promise.all(promises).then(() => {
                if (showInfobox && msg) {
                    this._showInfobox(this._validators[name], msg);
                }
                return status
                    ? status
                    : {
                          msg,
                          validator: this._validators[name],
                      };
            });
        }
        return Promise.resolve(true);
    }

    resetValidation(name: string): void {
        if (this.validationState[name] !== VALIDATION_STATE.valid) {
            this.setState({
                validationState: { ...this.validationState, [name]: VALIDATION_STATE.valid },
            });
        }
    }

    get validationState(): Record<string, VALIDATION_STATE> {
        return this.state.validationState || {};
    }

    isValid(): boolean {
        let state = true;
        for (const validationState of Object.values(this.validationState)) {
            if (
                validationState === VALIDATION_STATE.invalid ||
                validationState === VALIDATION_STATE.invalidAccent
            ) {
                state = false;
            }
        }
        return state;
    }

    validateAll(): Promise<TValidationResult[]> {
        this._closeInfobox();
        const promises: Promise<TValidationResult>[] = [];
        const keys = Object.keys(this._validators);
        keys.forEach((name) => {
            promises.push(this._validate(name, false));
        });
        return Promise.all(promises).then((results) => {
            const validationState = { ...this.validationState };
            for (let i = 0; i < results.length; i++) {
                const state = computeValidationState(results[i]);
                if (
                    state === VALIDATION_STATE.invalid ||
                    state === VALIDATION_STATE.invalidAccent
                ) {
                    this._showInfobox(
                        (results[i] as IValidatorResult).validator,
                        (results[i] as IValidatorResult).msg
                    );
                }
                validationState[keys[i]] = state;
            }
            this.setState({
                validationState: {
                    ...this.validationState,
                    ...validationState,
                },
            });
            return results;
        });
    }

    focus(name: string): boolean {
        let res = false;
        for (const validateName in this.validationState) {
            if (validateName === name) {
                if (
                    this.validationState[validateName] !== VALIDATION_STATE.valid &&
                    this.validationState[validateName] !== VALIDATION_STATE.invalidAccent
                ) {
                    res = true;
                    this.setState({
                        validationState: {
                            ...this.validationState,
                            [validateName]: VALIDATION_STATE.invalidAccent,
                        },
                    });
                }
            } else {
                if (this.validationState[validateName] !== VALIDATION_STATE.valid) {
                    this.setState({
                        validationState: {
                            ...this.validationState,
                            [validateName]: VALIDATION_STATE.invalid,
                        },
                    });
                }
            }
        }
        return res;
    }

    create(sourceMeta?: object): Promise<void> {
        if (this._isLocalData) {
            throw new Error(`${this._moduleName} Не задан источник в опции source.`);
        }
        return this.loader
            .create(sourceMeta || this._config.createMetaData)
            .then((data) => {
                this.setState({
                    store: new DataWrapper(data as SbisRecord),
                    error: this._getErrorState(data as SbisRecord),
                });
            })
            .catch((e) => this._errorManager.processSourceError(e));
    }

    read(sourceMeta?: object): Promise<void> {
        if (this._isLocalData) {
            throw new Error(`${this._moduleName} Не задан источник в опции source.`);
        }
        return this._beforeRecordClose().then(() => {
            return this.loader
                .read(this.key, sourceMeta || this._config.readMetaData)
                .then((data) => {
                    this.setState({
                        store: new DataWrapper(data as SbisRecord),
                        error: this._getErrorState(data as SbisRecord),
                    });
                })
                .catch((e) => this._errorManager.processSourceError(e));
        });
    }

    async update(
        type: FormSliceActionType = FormSliceActionType.PartialUpdate,
        sourceMeta?: object
    ): Promise<void> {
        if (this._isLocalData) {
            this._onDataSave?.(this._getStoreRecord(), type);
            return Promise.resolve();
        }

        const data = this.store.get(DEFAULT_USERDATA_PROPERTY)
            ? (this.store.getStore() as SbisRecord)
            : (this.store.get(DEFAULT_DATA_PROPERTY) as SbisRecord);
        //@ts-ignore
        return this.loader
            .update(data, sourceMeta)
            .then(() => {
                this._onDataSave?.(this._getStoreRecord(), type);
            })
            .catch((e) => this._errorManager.processSourceError(e));
    }

    delete(sourceMeta?: object): Promise<void> {
        if (this._isLocalData) {
            throw new Error(`${this._moduleName} Не задан источник в опции source.`);
        }

        return this.loader
            .destroy(this.key, sourceMeta || this._config.destroyMetaData)
            .catch((e) => this._errorManager.processSourceError(e));
    }

    // #region IObject
    readonly '[Types/_entity/IObject]': EntityMarker;

    get(name: NameBindingType): unknown | undefined {
        return this.store.get(name);
    }

    set(name: NameBindingType, value: unknown): void {
        const changed = this.store.set(name, value);
        if (changed) {
            // @ts-ignore
            this._onDataChange?.(this, changed);
            this._onChange?.();
        }
    }

    has(name: NameBindingType): boolean {
        return this.store.has(name);
    }

    // #endregion IObject

    destroy(): void {
        // @ts-ignore
        this._onDataChange = null;
        // @ts-ignore
        this._onDataSave = null;
        // @ts-ignore
        this._onDataLoad = null;
        this.setState({ validationState: {} });
        super.destroy();
    }

    private get _isLocalData(): boolean {
        return !this.loader;
    }

    private _normalizeLoadResults(loadResult: SbisRecord | Error): IFormDataFactoryResult {
        if (!loadResult || loadResult instanceof Error) {
            return new SbisRecord({});
        }

        if (loadResult?.has(DEFAULT_DATA_PROPERTY) || loadResult?.has(DEFAULT_USERDATA_PROPERTY)) {
            return loadResult as IFormDataFactoryResult;
        }

        const result = new SbisRecord({
            adapter: loadResult.getAdapter(),
        });

        result.addField({ name: DEFAULT_DATA_PROPERTY, type: 'record' });
        result.set(DEFAULT_DATA_PROPERTY, loadResult);
        result.acceptChanges([DEFAULT_DATA_PROPERTY]);
        return result;
    }

    private _getStoreRecord(): SbisRecord {
        return this.store.getStore().get(DEFAULT_DATA_PROPERTY);
    }

    private _beforeRecordClose(): Promise<void> {
        if (!this.store.getStore()) {
            return Promise.resolve();
        }
        return this._confirmationManager
            .confirmSave(this.store.getStore())
            .then(async () => {
                await this.validateAll();
                if (!this.isValid()) {
                    throw Error('Некорректно заполнены обязательные поля');
                }
                return this.update();
            })
            .catch(() => {
                if (this.store.needDestroy()) {
                    return this.loader.destroy(this.store.getId());
                }
            });
    }

    private _getErrorState(loadResult: SbisRecord | Error): Error | undefined {
        return loadResult instanceof Error ? loadResult : undefined;
    }

    private readonly _moduleName = 'Controls-DataEnv/dataFactory:FormSlice';
}

const defaultCallback = () => {};

interface IDataWrapperOptions {
    newRecord?: boolean;
}

export class DataWrapper {
    readonly '[Types/_entity/IObject]': EntityMarker;
    private readonly _store: SbisRecord;
    private _newRecord: boolean = false;

    constructor(store?: SbisRecord, options?: IDataWrapperOptions) {
        this._store = this._normalizeStore(store);
        this._newRecord = !!options?.newRecord;
    }

    set(name: NameBindingType | string, value: unknown): boolean {
        const { path, binding, root } = this._normalizeBinding(name);
        const userDataMode = root === DEFAULT_USERDATA_PROPERTY;

        const oldValue = this.get(name);

        if (userDataMode) {
            this._setUserData(binding, value);
            return this._isChanged(value, oldValue);
        }

        // совместимость со старыми плоскими рекордами
        if (this._store.has(binding)) {
            this._store.set(binding, value);
            return this._isChanged(this._store.get(binding), oldValue);
        }

        const rootRecord = this._store.get(root);
        if (rootRecord?.has(binding)) {
            rootRecord.set(binding, value);
            return this._isChanged(rootRecord.get(binding), oldValue);
        }

        const injectedValue = injectValue(this._store, path, value);
        return this._isChanged(injectedValue, oldValue);
    }

    get(name: NameBindingType | string): unknown | undefined {
        const { path, binding, root } = this._normalizeBinding(name);

        // совместимость со старыми плоскими рекордами
        if (this._store.has(binding)) {
            return this._store.get(binding);
        }

        const rootRecord = this._store.get(root);
        if (rootRecord?.has(binding)) {
            return rootRecord.get(binding);
        }

        return extractValue(this._store, path);
    }

    has(name: NameBindingType | string): boolean {
        const value = this.get(name);
        return !!value;
    }

    getCount(): number {
        const userDataCount = this._store.get(DEFAULT_USERDATA_PROPERTY).getFormat().getCount();
        const dataCount = this._store.get(DEFAULT_DATA_PROPERTY).getFormat().getCount();
        return userDataCount + dataCount;
    }

    getStore(): SbisRecord {
        return this._store;
    }

    getId(): number | string {
        const dataRecord = this._store.get(DEFAULT_DATA_PROPERTY);
        if (dataRecord) {
            return dataRecord.getKey();
        }
        return this._store.getKey();
    }

    getType(name: NameBindingType | string): format.Field | undefined {
        if (!this.has(name)) {
            return;
        }

        // совместимость для плоских рекордов
        const { root, binding } = this._normalizeBinding(name);

        if (this._store.has(binding)) {
            return this._getType(this._store, binding);
        }

        const rootRecord = this._store.get(root);
        if (rootRecord?.has(binding)) {
            return this._getType(rootRecord, binding);
        }

        const [parentPath, targetNode] = [
            name.slice(0, name.length - 1),
            ...name.slice(name.length - 1),
        ];
        return this._getType(this.get(parentPath) as SbisRecord, targetNode);
    }

    needDestroy(): boolean {
        /*
         * Рекорд нужно удалить если:
         *   1. Он получен методом "create"
         *   2. "create" вернул ключ
         */
        return this._newRecord && !!this.getId();
    }

    private _getType(store: SbisRecord, field: string): format.Field | undefined {
        const format = store?.getFormat?.();
        if (!format) {
            return;
        }
        const index = format.getFieldIndex(field);
        if (index === null || index === undefined || index < 0) {
            return;
        }
        return format.at(index);
    }

    private _normalizeStore(store?: SbisRecord): SbisRecord {
        // @ts-ignore
        if (store && store['[Types/_entity/Record]']) {
            return store;
        }
        return new SbisRecord({
            adapter: new adapter.Sbis(),
        });
    }

    private _normalizeBinding(name: NameBindingType | string): {
        binding: string;
        path: NameBindingType;
        root: string;
    } {
        if (!Array.isArray(name)) {
            name = (name as string).split(DEFAULT_DELIMITER);
        }
        const root = name[0];

        if (this._store.has(root)) {
            return {
                binding: name.join(DEFAULT_DELIMITER),
                path: [root, ...name],
                root,
            };
        }

        if (root === DEFAULT_USERDATA_PROPERTY) {
            return {
                binding: name.join(DEFAULT_DELIMITER),
                path: name,
                root: DEFAULT_USERDATA_PROPERTY,
            };
        }

        return {
            binding: name.join(DEFAULT_DELIMITER),
            path: [DEFAULT_DATA_PROPERTY, ...name],
            root: DEFAULT_DATA_PROPERTY,
        };
    }

    private _setUserData(field: string, value: unknown): boolean {
        if (!this._store.has(DEFAULT_USERDATA_PROPERTY)) {
            this._store.addField({ name: DEFAULT_USERDATA_PROPERTY, type: 'record' });
        }

        let userData = this._store.get(DEFAULT_USERDATA_PROPERTY);
        if (!userData) {
            this._store.set(
                DEFAULT_USERDATA_PROPERTY,
                new SbisRecord({
                    adapter: this._store.getAdapter(),
                })
            );
            this._store.acceptChanges([DEFAULT_USERDATA_PROPERTY]);
            userData = this._store.get(DEFAULT_USERDATA_PROPERTY);
        }

        if (userData.has(field)) {
            userData.set(field, value);
        } else {
            userData.addField(getFieldDeclaration(field, value));
            userData.set(field, value);
        }

        return true;
    }

    private _isChanged(val1: unknown, val2: unknown): boolean {
        return val1 !== val2;
    }
}

function extractValue(obj: SbisRecord, path: NameBindingType): unknown | undefined {
    let currentModel = obj;

    for (const pathPart of path) {
        if (!currentModel) {
            return;
        }
        currentModel = object.getPropertyValue(currentModel, pathPart);
    }

    return currentModel;
}

function injectValue(obj: SbisRecord, path: NameBindingType, value: unknown): unknown {
    if (!obj || path.length === 0) {
        return;
    }

    // Traverse by all parts of the path except the last one
    let model = obj;
    for (let i = 0; i < path.length - 1; i++) {
        model = object.getPropertyValue(model, path[i]);
        if (!model) {
            return;
        }
    }

    const lastPart = path[path.length - 1];
    // Handle the last part of the path
    return setPropertyValue(model, lastPart, value);
}

function computeValidationState(result: TValidationResult): VALIDATION_STATE {
    return result === true ? VALIDATION_STATE.valid : VALIDATION_STATE.invalid;
}
