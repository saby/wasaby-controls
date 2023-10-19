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
 * @typedef {String} Controls/_itemActions/interface/IItemActionsTemplateConfig/IItemActionsTemplateProps/TActionAlignment
 * @variant horizontal По горизонтали.
 * @variant vertical По вертикали.
 */
export type TActionAlignment = 'horizontal' | 'vertical';

/**
 * Оформление операций над записью
 * @typedef {String} Controls/_itemActions/interface/IItemActionsTemplateConfig/TItemActionsViewMode
 * @variant default По умолчанию
 * @variant filled Операции над записью расположены на подложке с полупрозрачной заливкой и скруглениями по краям.
 */
export type TItemActionsViewMode = 'default' | 'filled';

/**
 * Интерфейс шаблона itemActionsTemplate и swipeTemplate
 * @private
 */
export interface IItemActionsTemplateConfig {
    /**
     * Настройка видимости панели с опциями записи.
     * @cfg {Boolean}
     * @description Может применяться в настройках режима редактирования
     */
    /*
     * @cfg {Boolean} Visibility setting for actions panel
     */
    toolbarVisibility?: boolean;

    /**
     * Опция, позволяющая настраивать фон панели операций над записью.
     * @cfg {String}
     * @description Предустановленные варианты 'default' | 'transparent'
     */
    /*
     * @cfg {String} Style postfix of actions panel
     */
    style?: string;

    /**
     * Позиция опций записи.
     * @cfg {Controls/_interface/IAction/TItemActionsPosition.typedef}
     */
    /*
     * @cfg {Controls/_interface/IAction/TItemActionsPosition.typedef} Actions position relative to record
     */
    itemActionsPosition?: TItemActionsPosition;

    /**
     * Варианты расположения опций внутри панели {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи}.
     * @cfg {Controls/_itemActions/interface/IItemActionsTemplateConfig/IItemActionsTemplateProps/TActionAlignment.typedef}
     */
    actionAlignment?: TActionAlignment;

    /**
     * Позиция заголовка для опций записи, когда они отображаются в режиме swipe.
     * @cfg {TActionCaptionPosition.typedef}
     */
    /*
     * @cfg {TActionCaptionPosition.typedef} Action caption position for swipe actions
     */
    actionCaptionPosition?: TActionCaptionPosition;

    /**
     * CSS-класс, позволяющий задать отступы и позицию панели с {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/event/ опциями записи} внутри элемента.
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
    /**
     * @cfg {String} Стиль кнопки "Подтвердить"
     * @demo Controls-demo/gridNew/EditInPlace/Toolbar/Index
     */
    applyButtonStyle?: 'unaccent' | 'accent';
}

/**
 * Интерфейс настройки шаблона операций над записью
 * @interface Controls/_itemActions/interface/IItemActionsTemplateConfig/IItemActionsTemplateProps
 * @public
 */
export interface IItemActionsTemplateProps {
    /**
     * @cfg {String} itemActionsClass CSS-класс, позволяющий задать отступы и позицию панели с {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/event/ опциями записи} внутри элемента.
     * @default controls-itemActionsV_position_bottomRight
     */
    itemActionsClass?: string;
    /**
     * @cfg {Boolean} Подсвертка записи по ховеру (вкл/выкл)
     */
    highlightOnHover?: boolean;
    /**
     * @cfg {TBackgroundStyle} Стиль заливки записи по ховеру
     */
    hoverBackgroundStyle?: TBackgroundStyle;
    /**
     * @cfg {TItemActionsVisibility} Видимость операций (по ховеру / с задержкой / всегда)
     */
    actionsVisibility?: TItemActionsVisibility;
    /**
     * @cfg {TBackgroundStyle} Стиль заливки блока с операциями над записью, принудительно установленный в шаблон itemActionsTemplate
     */
    itemActionsBackgroundStyle?: TBackgroundStyle;
    /**
     * @cfg {String} Отступ вокруг кнопки
     */
    actionPadding?: null | '2xs' | 'xs';
    /**
     * @cfg {TButtonStyle} стиль заливки кнопок, Обычно прозрачный
     */
    actionStyle?: TButtonStyle;
    /**
     * @cfg {TIconStyle} стиль цвета иконок на кнопке
     */
    iconStyle?: TIconStyle;
    /**
     * @cfg {String} Режим для операций над записью по ховеру (Как указано или в зависимости от ширины).
     */
    actionMode?: TActionMode;
    /**
     * @cfg {TButtonStyle} стиль заливки кнопок в режиме редактирования
     */
    editingStyle?: TButtonStyle | 'translucent' | 'translucent_light';
    /*
     * @cfg {TItemActionsViewMode} Вид операций над записью
     */
    viewMode?: TItemActionsViewMode;
    /**
     * @cfg {String} Видимость кнопки открытия меню
     */
    menuActionVisibility?: 'hidden' | 'visible' | 'adaptive';
}
