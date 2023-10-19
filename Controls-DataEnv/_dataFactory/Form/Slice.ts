import { Slice } from 'Controls-DataEnv/slice';
import {
    IFormDataFactoryArguments,
    IFormDataFactoryResult,
    RecordLoader,
    FormSliceActionType,
} from './IFormDataFactory';
import { TKey } from 'Controls-DataEnv/interface';
import { Model as SbisRecord, getValueType, IObject, format, adapter } from 'Types/entity';
import { EntityMarker } from 'Types/declarations';
import { createLoader } from './createLoader';

enum VALIDATION_STATE {
    valid = 'valid',
    invalid = 'invalid',
    invalidAccent = 'invalidAccent',
}

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
    get<TKey extends keyof TData>(name: TKey): TData[TKey];

    /**
     * Устанавливает значение для поля в состоянии формы
     * @param name название поля
     * @param value значение поля
     */
    set<TKey extends keyof TData>(name: TKey, value: TData[TKey]): void;

    /**
     * Возвращает признак наличия поля в состоянии формы
     * @param name название поля
     */
    has(name: string): boolean;

    /**
     * Обновляет значения полей из загрузчика данных и помещает их в состояние формы.
     */
    read();

    /**
     * Сохраняет состояние формы через загрузчик данных.
     */
    update();

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
     * Возвращает состояние валидации
     */
    get validationState(): Record<string, VALIDATION_STATE>;
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
    implements IObject<TData>, IFormSlice<TData>
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
        const store = new DataWrapper(loadResult, config.sourceOptions.dynamicFields);

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

    read(): void {
        this.loader.read(this.key).then((store) => {
            this.setState({ store });
        });
    }

    update(type?: FormSliceActionType = FormSliceActionType.PartialUpdate): Promise<void> {
        return this.loader.update(this.key, this.store).then(() => {
            this._onDataSave(this.store, type);
        });
    }

    // #region IObject
    readonly '[Types/_entity/IObject]': EntityMarker;

    get<TKey extends keyof TData>(name: TKey): TData[TKey] {
        return this.store.get(name);
    }

    set<TKey extends keyof TData>(name: TKey, value: TData[TKey]): void {
        const changed = this.store.set(name, value);
        if (changed) {
            this._onDataChange(this, changed);
            this._onChange();
        }
    }

    has(name: string): boolean {
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

// TODO: это всё должен научиться делать Types/entity:Record
export class DataWrapper<TData = any> implements IObject<TData> {
    readonly '[Types/_entity/IObject]': EntityMarker;
    private readonly _store: SbisRecord;
    private readonly _dynamicFields: boolean;

    constructor(store: SbisRecord, dynamicFields) {
        this._store = this._normalizeStore(store);
        this._dynamicFields = dynamicFields;
    }

    set<K extends keyof TData>(name: K, value: TData[K]): Record<string, unknown> {
        if (this._store.has(name)) {
            this._store.set(name, value);
            return { [name]: value };
        }
        if (this._dynamicFields) {
            this._store.addField(getFieldDeclaration(name, value));
            this._store.set(name, value);
            return { [name]: value };
        }
    }

    get<K extends keyof TData>(name: K): TData[K] {
        return this._store.get(name);
    }

    has(name: string): boolean {
        return this._store.has(name);
    }

    getCount(): number {
        return this._store.getFormat().getCount();
    }

    getStore(): SbisRecord {
        return this._store;
    }

    private _normalizeStore(store: SbisRecord): SbisRecord {
        if (store && store['[Types/_entity/Record]']) {
            return store;
        }
        return new SbisRecord({
            adapter: new adapter.Sbis(),
        });
    }
}
