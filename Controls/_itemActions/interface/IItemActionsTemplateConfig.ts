/**
 * @kaizen_zone 9beb6001-b33d-4e7f-87af-c7bc9798e225
 */
import {
    TBackgroundStyle,
    TIconStyle,
    TActionCaptionPosition,
    TItemActionsPosition,
} from 'Controls/interface';
import { TItemActionsVisibility } from 'Controls/itemActions';
import { TButtonStyle } from 'Controls/buttons';

export type TActionMode = 'showType' | 'adaptive' | 'strict';

/**
 * @typedef {String} TActionAlignment
 * @variant horizontal По горизонтали.
 * @variant vertical По вертикали.
 */
export type TActionAlignment = 'horizontal' | 'vertical';

/**
 * Интерфейс шаблона itemActionsTemplate и swipeTemplate
 * @interface Controls/_itemActions/interface/IItemActionsTemplateConfig
 * @private
 */

/*
 * Interface for templates itemActionsTemplate и swipeTemplate
 * @author Аверкиев П.А.
 * @private
 */

export interface IItemActionsTemplateConfig {
    /**
     * Настройка видимости панели с опциями записи.
     * @name Controls/_itemActions/interface/IItemActionsTemplateConfig#toolbarVisibility
     * @cfg {Boolean}
     * @description Может применяться в настройках режима редактирования
     */
    /*
     * @cfg {Boolean} Visibility setting for actions panel
     */
    toolbarVisibility?: boolean;

    /**
     * Опция, позволяющая настраивать фон панели операций над записью.
     * @name Controls/_itemActions/interface/IItemActionsTemplateConfig#style
     * @cfg {String}
     * @description Предустановленные варианты 'default' | 'transparent'
     */
    /*
     * @cfg {String} Style postfix of actions panel
     */
    style?: string;

    /**
     * Позиция опций записи.
     * @name Controls/_itemActions/interface/IItemActionsTemplateConfig#itemActionsPosition
     * @cfg {Controls/itemActions/TItemActionsPosition.typedef}
     */
    /*
     * @cfg {Controls/itemActions/TItemActionsPosition.typedef} Actions position relative to record
     */
    itemActionsPosition?: TItemActionsPosition;

    /**
     * Варианты расположения опций внутри панели {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи}.
     * @name Controls/_itemActions/interface/IItemActionsTemplateConfig#actionAlignment
     * @cfg {Controls/itemActions/TActionAlignment.typedef}
     */
    /*
     * @cfg {Controls/itemActions/TActionAlignment.typedef} Alignment of actions inside actions panel
     */
    actionAlignment?: TActionAlignment;

    /**
     * Позиция заголовка для опций записи, когда они отображаются в режиме swipe.
     * @name Controls/_itemActions/interface/IItemActionsTemplateConfig#actionCaptionPosition
     * @cfg {TActionCaptionPosition.typedef}
     */
    /*
     * @cfg {TActionCaptionPosition.typedef} Action caption position for swipe actions
     */
    actionCaptionPosition?: TActionCaptionPosition;

    /**
     * CSS-класс, позволяющий задать отступы и позицию панели с {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/event/ опциями записи} внутри элемента.
     * @name Controls/_itemActions/interface/IItemActionsTemplateConfig#itemActionsClass
     * @cfg {String}
     * @default controls-itemActionsV_position_bottomRight
     */
    /*
     * @cfg {String} CSS class, allowing to set position and padding for actions panel relative to record
     */
    itemActionsClass?: string;
    /**
     * Стиль операций над записью редактируемой записи
     */
    editingStyle?: string;
}

/*
 * Пропсы для внедрения ItemActions в реакт компоненты
 */
export interface IItemActionsTemplateProps {
    /*
     * @cfg {String} itemActionsClass CSS-класс, позволяющий задать отступы и позицию панели с {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/event/ опциями записи} внутри элемента.
     * @default controls-itemActionsV_position_bottomRight
     */
    itemActionsClass?: string;
    /*
     * @cfg {Boolean} Подсвертка записи по ховеру (вкл/выкл)
     */
    highlightOnHover?: boolean;
    /*
     * @cfg {TBackgroundStyle} Стиль заливки записи по ховеру
     */
    hoverBackgroundStyle?: TBackgroundStyle;
    /*
     * @cfg {TItemActionsVisibility} Видимость операций (по ховеру / с задержкой / всегда)
     */
    actionsVisibility?: TItemActionsVisibility;
    /*
     * @cfg {TBackgroundStyle} Стиль заливки блока с операциями над записью, принудительно установленный в шаблон itemActionsTemplate
     */
    itemActionsBackgroundStyle?: TBackgroundStyle;
    /*
     * @cfg {String} Отступ вокруг кнопки
     */
    actionPadding?: string;
    /*
     * @cfg {TButtonStyle} стиль заливки кнопок, Обычно прозрачный
     */
    actionStyle?: TButtonStyle;
    /*
     * @cfg {TIconStyle} стиль цвета иконок на кнопке
     */
    iconStyle?: TIconStyle;
    /*
     * @cfg {String} Режим для операций над записью по ховеру (Как указано или в зависимости от ширины).
     */
    actionMode?: TActionMode;
}
