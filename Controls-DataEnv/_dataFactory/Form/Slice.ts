import { Slice } from 'Controls-DataEnv/slice';
import {
    IFormDataFactoryArguments,
    IFormDataFactoryResult,
    RecordLoader,
} from './IFormDataFactory';
import { TKey } from 'Controls-DataEnv/interface';
import { Model as SbisRecord, getValueType, IObject } from 'Types/entity';
import { EntityMarker } from 'Types/declarations';
import { createLoader } from './createLoader';

export interface IFormSliceState {
    key: TKey;
    store: SbisRecord;
    loader: RecordLoader;
    dynamicFields: boolean;
}

/**
 * Базовый слайс для работы с {@link Types/entity:Record} в формах@abstract
 * @class Controls-DataEnv/_dataFactory/Form/Slice
 * @public
 */
export default class FormSlice<TData = any>
    extends Slice<IFormSliceState>
    implements IObject<TData>
{
    private key: TKey;
    private store: SbisRecord<TData>;
    private loader: RecordLoader;
    private dynamicFields: boolean;

    protected _initState(
        loadResult: IFormDataFactoryResult,
        config: IFormDataFactoryArguments
    ): IFormSliceState {
        return {
            key: config.id,
            dynamicFields: config.sourceOptions.dynamicFields,
            store: loadResult,
            loader: createLoader(config),
        };
    }

    read(): void {
        this.loader.read(this.key).then((store) => {
            this.setState({ store });
        });
    }

    update(): Promise<void> {
        return this.loader.update(this.key, this.store);
    }

    private _set<K extends keyof TData>(name: K, value: TData[K]): void {
        if (this.store.has(name)) {
            return this.store.set(name, value);
        }
        if (this.dynamicFields) {
            this.store.addField({
                name,
                type: getValueType(value),
            });
            this.store.set(name, value);
        }
    }

    private _get<K extends keyof TData>(name: K): TData[K] {
        return this.store.get(name);
    }

    // #region IObject
    readonly '[Types/_entity/IObject]': EntityMarker;

    get<TKey extends keyof TData>(name: TKey): TData[TKey] {
        return this._get(name);
    }

    set<TKey extends keyof TData>(name: TKey, value: TData[TKey]): void {
        this._set(name, value);
    }

    has(name: string): boolean {
        return this.store.has(name);
    }
    // #endregion IObject
}
