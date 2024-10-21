import { WidgetMeta } from 'Meta/types';
import { TColumnsForCtor, THeaderForCtor } from 'Controls/grid';
import { IBasePopupOptions } from 'Controls/popup';
import { ListSlice } from 'Controls/dataFactory';

/**
 * @description Параметры, необходимые для открытия окна "Редактора колонок"
 * @public
 */
export interface IOpenColumnsEditorProps extends IBasePopupOptions {
    /**
     * @name Controls-Lists-editors/_columnsEditor/interface/IOpenColumnsEditorProps#bindings
     * @cfg {Controls-Lists-editors/columnsEditor:IColumnsProps} Редактируемое значение
     */
    value: IColumnsProps;
    /**
     * @name Controls-Lists-editors/_columnsEditor/interface/IOpenColumnsEditorProps#onChange
     * @param {IColumnsEditorResult} value настройки редактора
     */
    onChange: (value: IColumnsProps) => void;
    /**
     * @name Controls-Lists-editors/_columnsEditor/interface/IOpenColumnsEditorProps#onChange
     * @param {IEditorProps} editorProps Дополнительные настройки редактора
     */
    editorProps: IEditorProps;
}

export interface IEditorProps {
    /**
     * @name Controls-Lists-editors/_columnsEditor/interface/IOpenColumnsEditorProps#widget
     * @cfg {String} Путь до прикладного виджета таблицы
     */
    widget: string;
    /**
     * @name Controls-Lists-editors/_columnsEditor/interface/IOpenColumnsEditorProps#widgetMetaType
     * @cfg {WidgetMeta} Мета-описание прикладного виджета таблицы
     */
    widgetMetaType: WidgetMeta;
    /**
     * @name Controls-Lists-editors/_columnsEditor/interface/IOpenColumnsEditorProps#bindings
     * @cfg {Controls-Lists-editors/columnsEditor:IBindings} Конфигурация загрузчика данных
     */
    bindings: IBindings;
    /**
     * @name Controls-Lists-editors/_columnsEditor/interface/IOpenColumnsEditorProps#objectName
     * @cfg {String} Имя прикладного объекта
     */
    objectName: string;
    /**
     * @name Controls-Lists-editors/_columnsEditor/interface/IOpenColumnsEditorProps#widgetProps
     * @cfg {Object} Параметры виджета
     */
    widgetProps?: object;
}

/**
 * Параметры конфигурации загрузчика данных
 * @public
 */
export interface IBindings {
    contextConfig: IGridWidgetSlice;
}

/**
 * Слайс прикладного виджета "Редактора колонок"
 * @public
 */
export interface IGridWidgetSlice {
    GridWidgetSlice: ListSlice;
}

export interface IRenderWrapperProps {
    onClose: Function;
    contextConfig: IGridWidgetSlice;
    contextData?: object;
}

export interface IContextConfig {
    SiteEditorSlice: object;
}

/**
 * Интерфейс для значения "Редактора колонок"
 * @public
 */
export interface IColumnsProps {
    /**
     * @name Controls-Lists-editors/_columnsEditor/interface/IOpenColumnsEditorProps#columns
     * @cfg {Controls/grid:IColumnForCtor/TColumnsForCtor.typedef} Список используемых колонок
     */
    columns: TColumnsForCtor;
    /**
     * @name Controls-Lists-editors/_columnsEditor/interface/IOpenColumnsEditorProps#header
     * @cfg {Controls/grid:IColumnForCtor/THeaderForCtor.typedef} Список заголовков, соответствующих используемым колонкам или папкам
     */
    header: THeaderForCtor;
}
