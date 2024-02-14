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
    read(id: TKey, options?: any): Promise<IFormDataFactoryResult>;
    update(id: TKey, data: Model): Promise<IFormDataFactoryResult>;
}

export interface IFormDataFactoryArguments extends IBaseDataFactoryArguments {
    id: TKey;
    source: RecordLoader;
    sourceOptions: unknown;
    onDataChange?: (store: Model, changed: Record<string, unknown>) => void;
    onDataSave?: (store: Model, type: FormSliceActionType) => void;
    onDataLoad?: (store: Model) => void;
}

export const DEFAULT_DATA_PROPERTY = 'record';
export const DEFAULT_USERDATA_PROPERTY = 'UserData';

export interface IFormDataModel {
    [DEFAULT_DATA_PROPERTY]: Model;
    [DEFAULT_USERDATA_PROPERTY]: Model;
}

export type IFormDataFactoryResult = Model<IFormDataModel>;

export type IFormDataFactory = IDataFactory<IFormDataFactoryResult, IFormDataFactoryArguments>;
