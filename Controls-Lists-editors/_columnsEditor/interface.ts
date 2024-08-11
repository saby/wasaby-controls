import { WidgetMeta } from 'Meta/types';
import { TColumnsForCtor, THeaderForCtor } from 'Controls/grid';
import { IBasePopupOptions } from 'Controls/popup';
import { IColumnsEditorResult } from 'Controls-Lists-editors/_columnsEditor/components/HeaderContentTemplate';
import { ListSlice } from 'Controls/dataFactory';

/**
 * @description Параметры, необходимые для открытия окна "Редактора колонок"
 * @public
 */
export interface IOpenColumnsEditorProps extends IBasePopupOptions {
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
     * @name Controls-Lists-editors/_columnsEditor/interface/IOpenColumnsEditorProps#columns
     * @cfg {Controls/grid:IColumnForCtor/TColumnsForCtor.typedef} Список используемых колонок
     */
    columns: TColumnsForCtor;
    /**
     * @name Controls-Lists-editors/_columnsEditor/interface/IOpenColumnsEditorProps#header
     * @cfg {Controls/grid:IColumnForCtor/THeaderForCtor.typedef} Список заголовков, соответствующих используемым колонкам или папкам
     */
    header: THeaderForCtor;
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
     * @name Controls-Lists-editors/_columnsEditor/interface/IOpenColumnsEditorProps#onChange
     * Колбэк-функция, вызываемая при сохранении настроек
     * @param value {IColumnsEditorResult} настройки редактора
     */
    onChange: (value: IColumnsEditorResult) => void;
    /**
     * @name Controls-Lists-editors/_columnsEditor/interface/IOpenColumnsEditorProps#widgetProps
     * @cfg {Object} Параметры виджета
     */
    widgetProps?: object;
}

/**
 * Параметры конфигурации загрузчика данных
 * public
 */
export interface IBindings {
    contextConfig: IGridWidgetSlice;
}

/**
 * Слайс прикладного виджета "Редактора колонок"
 * public
 */
export interface IGridWidgetSlice {
    GridWidgetSlice: ListSlice;
}

export interface IColumnsEditorRenderProps {
    onClose: Function;
    contextConfig: IGridWidgetSlice;
    contextData?: object;
}

export interface IContextConfig {
    SiteEditorSlice: object;
}
