import { WidgetMeta } from 'Meta/types';
import { TColumnsForCtor, THeaderForCtor } from 'Controls/grid';
import { IBasePopupOptions } from 'Controls/popup';
import { IColumnsEditorResult } from 'Controls-Lists-editors/_columnsEditor/components/HeaderContentTemplate';

export interface IOpenColumnsEditorProps extends IBasePopupOptions {
    /**
     * Название виджета
     */
    widget: string;
    /**
     * Параметры виджета
     */
    widgetProps: object;
    /**
     * Метатип виджета
     */
    widgetMetaType: WidgetMeta;
    /**
     * Выбранные колонки
     */
    columns: TColumnsForCtor;
    /**
     * Заголовки выбранных колонок
     */
    header: THeaderForCtor;
    /**
     * Конфигурация загрузки данных
     */
    bindings: IBindings;
    /**
     * Имя прикладного объекта
     */
    objectName: string;
    /**
     * Колбэк-функция, вызываемая при сохранении настроек
     * @param value {IColumnsEditorResult} настройки редактора
     */
    onChange: (value: IColumnsEditorResult) => void;
}

export interface IBindings {
    contextConfig: object;
    contextData?: object;
}

export interface IColumnsEditorRenderProps extends IBindings {
    onClose: Function;
}

export interface IContextConfig {
    SiteEditorSlice: object;
}
