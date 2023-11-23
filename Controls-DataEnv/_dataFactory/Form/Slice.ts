import { Slice } from 'Controls-DataEnv/slice';
import {
    IFormDataFactoryArguments,
    IFormDataFactoryResult,
    RecordLoader,
    FormSliceActionType,
    DEFAULT_USERDATA_PROPERTY,
    DEFAULT_DATA_PROPERTY,
} from './IFormDataFactory';
import { TKey } from 'Controls-DataEnv/interface';
import { Model as SbisRecord, getValueType, IObject, format, adapter } from 'Types/entity';
import { EntityMarker } from 'Types/declarations';
import { createLoader } from './createLoader';
import { object } from 'Types/util';

type NameBindingType = string[];

enum VALIDATION_STATE {
    valid = 'valid',
    invalid = 'invalid',
    invalidAccent = 'invalidAccent',
}

const DEFAULT_DELIMITER = '.';

export interface IFormSliceState {
    key: TKey;
    store: SbisRecord;
    loader: RecordLoader;
    dynamicFields: boolean;
    validationState: Record<string, VALIDATION_STATE>;
}

export interface IFormSlice<TData = any> {
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
     * Обновляет значения полей из загрузчика данных и помещает их в состояние формы.
     */
    read();

    /**
     * Сохраняет состояние формы через загрузчик данных.
     */
    update(type?: FormSliceActionType);

    /**
     * Регистрирует валидаторы
     * @param name название поля
     * @param fns функции-валидаторы
     */
    registerValidators(name: string, fns: Function[]): void;

    /**
     * Снимает валидатор с регистрации
     * @param name название поля
     */
    unRegisterValidators(name: string): void;

    /**
     * Выполняет валидацию значения поля
     * @param name
     */
    validate(name: string): Promise<boolean>;

    /**
     * Сбрасывает валидацию поля
     * @param name
     */
    resetValidation(name: string): void;

    /**
     * Выполняет валидацию всей формы
     */
    validateAll(): Promise<boolean[]>;

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
    [name: string]: Function[];
}

/**
 * Базовый слайс для работы с {@link Types/entity:Record} в формах@abstract
 * @class Controls-DataEnv/_dataFactory/Form/Slice
 * @public
 */
export default class FormSlice<TData = any>
    extends Slice<IFormSliceState>
    implements IFormSlice<TData>
{
    private key: TKey;
    private store: DataWrapper<TData>;
    private loader: RecordLoader;
    private _validators: IValidators = {};

    private _onDataLoad: IFormDataFactoryArguments['onDataLoad'];
    private _onDataSave: IFormDataFactoryArguments['onDataSave'];
    private _onDataChange: IFormDataFactoryArguments['onDataChange'];

    protected _initState(
        loadResult: IFormDataFactoryResult,
        config: IFormDataFactoryArguments
    ): IFormSliceState {
        const store = new DataWrapper(this._normalizeLoadResults(loadResult));

        this._onDataSave = config.onDataSave || defaultCallback;
        this._onDataLoad = config.onDataLoad || defaultCallback;
        this._onDataChange = config.onDataChange || defaultCallback;

        this._onDataLoad(store);
        return {
            key: config.id,
            store,
            loader: createLoader(config),
        };
    }

    registerValidators(name: string, fns: Function[]): void {
        this._validators[name] = fns;
    }

    unRegisterValidators(name: string): void {
        delete this._validators[name];
    }

    validate(name: string): Promise<boolean> {
        if (this._validators[name]) {
            let status = true;
            const promises: Promise<unknown>[] = [];
            this._validators[name].map((validator) => {
                const value = this.get(name);
                const res = validator({ value });
                // если валидатор вернул промис, нужно дожаться его выполнения
                if (res instanceof Promise) {
                    res.then((result) => {
                        if (result !== true) {
                            status = false;
                        }
                    });
                    return promises.push(res);
                }

                // если вернулся не boolean, значит валидатор вернул ошибку
                if (res !== true) {
                    status = false;
                    promises.push(Promise.resolve(res));
                }
            });

            return Promise.all(promises).then(() => {
                this.setState({
                    validationState: {
                        ...this.validationState,
                        [name]: status ? VALIDATION_STATE.valid : VALIDATION_STATE.invalid,
                    },
                });
                return status;
            });
        } else {
            this.setState({
                validationState: { ...this.validationState, [name]: VALIDATION_STATE.valid },
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

    validateAll(): Promise<boolean[]> {
        const promises = [];
        Object.keys(this._validators).forEach((name) => {
            promises.push(this.validate(name));
        });
        return Promise.all(promises);
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

    read(): Promise<void> {
        if (this._isLocalData) {
            throw new Error(`${this._moduleName} Не задан источник в опции source.`);
        }
        return this.loader.read(this.key).then((data) => {
            this.setState({ store: new DataWrapper(data, true) });
        });
    }

    update(type: FormSliceActionType = FormSliceActionType.PartialUpdate): Promise<void> {
        if (this._isLocalData) {
            this._onDataSave(this.store, type);
            return Promise.resolve();
        }
        return this.loader.update(this.key, this.store).then(() => {
            this._onDataSave(this.store, type);
        });
    }

    // #region IObject
    readonly '[Types/_entity/IObject]': EntityMarker;

    get(name: NameBindingType): unknown | undefined {
        return this.store.get(name);
    }

    set(name: NameBindingType, value: unknown): void {
        const changed = this.store.set(name, value);
        if (changed) {
            this._onDataChange(this, changed);
            this._onChange();
        }
    }

    has(name: NameBindingType): boolean {
        return this.store.has(name);
    }

    // #endregion IObject

    destroy(): void {
        this._onDataChange = null;
        this._onDataSave = null;
        this._onDataLoad = null;
        this.setState({ validationState: {} });
        super.destroy();
    }

    private get _isLocalData(): boolean {
        return !this.loader;
    }

    private _normalizeLoadResults(loadResult: SbisRecord): IFormDataFactoryResult | undefined {
        if (!loadResult) {
            return;
        }

        if (loadResult?.has(DEFAULT_DATA_PROPERTY) || loadResult?.has(DEFAULT_USERDATA_PROPERTY)) {
            return loadResult as IFormDataFactoryResult;
        }

        const result = new SbisRecord({
            adapter: loadResult.getAdapter(),
        });

        result.addField({ name: 'record', type: 'record' });
        result.set('record', loadResult);
        return result;
    }

    private readonly _moduleName = 'Controls-DataEnv/dataFactory:FormSlice';
}

function getFieldDeclaration(name: string, value: unknown): format.IFieldDeclaration {
    const type = getValueType(value);

    if (type !== null && typeof type === 'object') {
        return {
            name,
            ...type,
        };
    }

    return {
        name,
        type,
    };
}

const defaultCallback = () => {};

export class DataWrapper<TData = any> {
    readonly '[Types/_entity/IObject]': EntityMarker;
    private readonly _store: SbisRecord;

    constructor(store: SbisRecord) {
        this._store = this._normalizeStore(store);
    }

    set(name: NameBindingType | string, value: unknown): boolean {
        const { path, binding, root } = this._normalizeBinding(name);
        const userDataMode = root === DEFAULT_USERDATA_PROPERTY;

        const oldValue = this.get(name);

        if (userDataMode) {
            return this._setUserData(binding, value);
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

    private _normalizeStore(store: SbisRecord): SbisRecord {
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

        return {
            binding: name.join(DEFAULT_DELIMITER),
            path: [DEFAULT_DATA_PROPERTY, ...name],
            root: DEFAULT_DATA_PROPERTY,
        };
    }

    private _setUserData(field: string, value: unknown): boolean {
        const userData = this._store.get(DEFAULT_USERDATA_PROPERTY);

        if (!userData) {
            return false;
        }

        if (userData.has(field)) {
            userData.set(field, value);
        } else {
            userData.addField(getFieldDeclaration(field, value));
            userData.set(field, value);
        }

        return true;
    }

    private _isChanged(val1, val2): boolean {
        return val1 !== val2;
    }
}

function extractValue(obj: SbisRecord, path: NameBindingType): unknown | undefined {
    let model = obj;

    for (const part of path) {
        if (model && model['[Types/_entity/IObject]'] && model.has(part)) {
            model = model[part];
        } else {
            return undefined;
        }
    }

    return model;
}

function injectValue(obj: SbisRecord, path: NameBindingType, value: unknown): unknown {
    let model = obj;

    for (let i = 0; i < path.length; i++) {
        const part = path[i];

        if (i === path.length - 1) {
            model.set(part, value);
            return value;
        } else {
            if (!model.has(part)) {
                // попытка вставить значение, которого нет в карте
                return false;
            }
            model = model.get(part);
        }
    }
}
