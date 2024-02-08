import { WidgetMeta } from 'Meta/types';
import { TColumnsForCtor, THeaderForCtor } from 'Controls/grid';

export interface IOpenColumnsEditorProps {
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
