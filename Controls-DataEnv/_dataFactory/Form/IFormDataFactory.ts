import { IBaseDataFactoryArguments, IDataFactory } from '../interface/IDataFactory';
import { Model } from 'Types/entity';

type TKey = 'string';

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
}

export type IFormDataFactoryResult = Model;

export type IFormDataFactory = IDataFactory<IFormDataFactoryResult, IFormDataFactoryArguments>;
