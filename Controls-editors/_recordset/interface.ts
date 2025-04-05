import { RecordSet } from 'Types/collection';
import { ArrayMeta, Meta } from 'Meta/types';
import { IColumn, IHeaderCell } from 'Controls/gridDisplay';
import { TKey } from 'Controls/interface';
import { IEditorValidation, IObjectTypeFactoryArguments } from 'Controls-editors/object-type';
import { Record } from 'Types/entity';
import { StackOpener } from 'Controls/popup';
import { TItemActionVisibilityCallback } from 'Controls/interface';
import { IEmptyViewConfig } from 'Controls/gridRender';

/**
 * Режим редактирования
 * @variant popup Редактирование элемента списка происходит в окне с PropertyGrid
 * @variant inplace Редактирование элемента списка происходит по месту
 * @default popup
 */
type TEditMode = 'popup' | 'inline';

export interface IEditor<T> {
    value: RecordSet;
    onChange: (value: RecordSet) => void;
    metaType: ArrayMeta<T[]>;
    displayProperties?: string[];
    columns?: IColumn[];
    header?: IHeaderCell[];
    editMode?: TEditMode;
    keyProperty?: TKey;
    propertyGridStoreId: string;
    validation?: IEditorValidation;
    onBeforeCreate?: ((metaType: Meta<T>, pgObject?: Record) => Promise<Record>) | string;
    customItemActionsVisibilityCallback?: TItemActionVisibilityCallback;
    hasSearch?: boolean;
    emptyView?: IEmptyViewConfig[];
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
     * Отобразить ли PropertyGrid только для чтения
     */
    readOnly?: boolean;
}

export interface IOpenStackParams<T> {
    /**
     * Опенер стекового окна
     */
    stack: StackOpener;
    /**
     * Опции шаблона окна
     */
    templateOptions?: ITemplateOptions<T>;
    /**
     * Коллбэк-функция, вызываемая при закрытии окна
     */
    onClose?: () => void;
}

/**
 * Конфигурация режима работы всплывающего окна
 */
export interface IPopupConfig {
    /**
     * Режим работы
     * @vatiant edit Редактирование существующего элемента
     * @variant add Добавление нового элемента
     */
    mode: 'add' | 'edit';
    /**
     * Элемент
     */
    item?: Record;
    /**
     * Индекс элемента
     */
    itemIndex?: number;
}
