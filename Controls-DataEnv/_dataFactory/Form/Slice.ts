import { Slice } from 'Controls-DataEnv/slice';
import {
    IFormDataFactoryArguments,
    IFormDataFactoryResult,
    RecordLoader,
} from './IFormDataFactory';
import { TKey } from 'Controls-DataEnv/interface';
import { Model as SbisRecord, getValueType, IObject, format, adapter } from 'Types/entity';
import { EntityMarker } from 'Types/declarations';
import { createLoader } from './createLoader';

export interface IFormSliceState {
    key: TKey;
    store: SbisRecord;
    loader: RecordLoader;
    dynamicFields: boolean;
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

    read(): void {
        this.loader.read(this.key).then((store) => {
            this.setState({ store });
        });
    }

    update(): Promise<void> {
        return this.loader.update(this.key, this.store).then(() => {
            this._onDataSave(this.store);
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
