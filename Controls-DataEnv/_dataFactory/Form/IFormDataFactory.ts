import { IBaseDataFactoryArguments, IDataFactory } from '../interface/IDataFactory';
import type { Model } from 'Types/entity';

type TKey = 'string';
export enum FormSliceActionType {
    Save = 'fullSave',
    PartialUpdate = 'partial',
}

/**
 * Интерфейс загрузчика данных для слайса формы.
 * @public
 */
export interface RecordLoader {
    read(id: TKey, options?: any): Promise<Model>;
    update(id: TKey, data: Model): Promise<void>;
}

export interface IFormDataFactoryArguments extends IBaseDataFactoryArguments {
    id: TKey;
    source: RecordLoader;
    sourceOptions: unknown;
    onDataChange?: (store: Model, changed: Record<string, unknown>) => void;
    onDataSave?: (store: Model, type: FormSliceActionType) => void;
    onDataLoad?: (store: Model) => void;
}

export type IFormDataFactoryResult = Model;

export type IFormDataFactory = IDataFactory<IFormDataFactoryResult, IFormDataFactoryArguments>;
