import { RecordSet } from 'Types/collection';
import { ArrayMeta, Meta } from 'Meta/types';
import { IColumn, IHeaderCell } from 'Controls/gridDisplay';
import { TKey } from 'Controls/interface';
import { IEditorValidation, IObjectTypeFactoryArguments } from 'Controls-editors/object-type';
import { Record } from 'Types/entity';
import { StackOpener } from 'Controls/popup';
import { Control, IControlOptions } from 'UI/Base';

export interface IEditor<T> {
    value: RecordSet;
    onChange: (value: RecordSet) => void;
    metaType: ArrayMeta<T[]>;
    columns: IColumn[];
    header: IHeaderCell[];
    keyProperty?: TKey;
    propertyGridStoreId: string;
    validation?: IEditorValidation;
    onBeforeCreate?: (metaType: Meta<T>) => Promise<Record>;
}

export interface ITemplateOptions<T> {
    /**
     * Значение для PropertyGrid
     */
    value: Record;
    /**
     * Коллбэк-функция, вызываемая при изменении значения в PropertyGrid
     * @param value
     */
    onChange: (value: Record) => void;
    /**
     * Мета описание для построения PropertyGrid
     */
    metaType: T;
    pgFactoryArguments: Partial<IObjectTypeFactoryArguments>;
    /**
     * Валидация для PropertyGrid
     */
    validation?: IEditorValidation;
    /**
     * Отобразить ли PropertyGrid только для чтения
     */
    readOnly?: boolean;
    /**
     * Версия данных для стекового окна. Используется в случае, если редактор массива обновляет значение для propertyGrid
     */
    version?: number;
}

export interface IOpenStackParams<T> {
    /**
     * Опенер стекового окна
     */
    stack: StackOpener;
    /**
     * Опции шаблона окна
     */
    templateOptions: ITemplateOptions<T>;
    /**
     * Логический инициатор открытия окна
     */
    opener?: Control<IControlOptions, unknown> | Element | null;
    /**
     * Коллбэк-функция, вызываемая при закрытии окна
     */
    onClose?: () => void;
}
