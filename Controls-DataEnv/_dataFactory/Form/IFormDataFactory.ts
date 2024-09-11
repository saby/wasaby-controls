import type { Model } from 'Types/entity';
import { ICrud } from 'Types/source';
import { IDataFactory } from '../interface/IDataFactory';

type TKey = 'string';
export enum FormSliceActionType {
    Save = 'fullSave',
    PartialUpdate = 'partial',
}

export interface IFormDataFactoryArguments {
    id: TKey;
    source: ICrud;
    sourceOptions: unknown;
    onDataChange?: (store: Model, changed: Record<string, unknown>) => void;
    onDataSave?: (store: Model, type: FormSliceActionType) => void;
    onDataLoad?: (store: Model) => void;
    confirmationOptions?: IFormSliceConfirmationOptions;
    nullableKeyIsAllowed?: boolean;
    /**
     * @cfg {Object} Задает ассоциативный массив, который используется только при создании новой записи для инициализации её начальными значениями. Создание записи выполняется методом, который задан в опции {@link Types/source:ICrud#create}.
     * Также, это значение по умолчанию метода create.
     */
    createMetaData?: object;
    /**
     * @cfg {Object} Устанавливает набор инициализирующих значений, которые будут использованы при чтении записи. Подробнее {@link Types/source:ICrud#read}.
     * Также, это значение по умолчанию для метода read.
     */
    readMetaData?: object;
    /**
     * @cfg {Object} Устанавливает набор инициализирующих значений, которые будут использованы при уничтожении "черновика". Подробнее {@link Types/source:ICrud#destroy}
     * Также, это значение по умолчанию для метода destroy.
     */
    destroyMetaData?: object;
}

/**
 * Опции диалога подтверждения изменений
 */
export interface IFormSliceConfirmationOptions {
    message?: string;
    needShowConfirmationCallback?: (data: Model) => boolean;
}

export type IFormSliceConfirmationOptionsSafe = Required<IFormSliceConfirmationOptions>;

export const DEFAULT_DATA_PROPERTY = 'record';
export const DEFAULT_USERDATA_PROPERTY = 'UserData';

export interface IFormDataModel {
    [DEFAULT_DATA_PROPERTY]: Model;
    [DEFAULT_USERDATA_PROPERTY]: Model;
}

export type IFormDataFactoryResult = Model | Error;

// @ts-ignore
export type IFormDataFactory = IDataFactory<IFormDataFactoryResult, IFormDataFactoryArguments>;
