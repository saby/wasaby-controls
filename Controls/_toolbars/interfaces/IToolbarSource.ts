/**
 * @kaizen_zone 5c260dca-bc4a-4366-949a-824d00984a8e
 */
import { ICrudPlus } from 'Types/source';

export interface IToolbarSourceOptions {
    source?: ICrudPlus;
}

/**
 * Интерфейс для доступа к источнику данных, который возвращает данные в формате, необходимом для контрола Toolbar или контролов, реализующих Toolbar (например Controls/operationsPanel).
 *
 * @public
 */
export default interface IToolbarSource {
    readonly '[Controls/_toolbars/interfaces/IToolbarSource]': boolean;
}

/**
 * @typedef {String} Controls/_toolbars/interfaces/IToolbarSource/ShowType
 * @variant 0 Элемент отображается только в выпадающем меню. Рекомендуем использовать константу toolbar.showType.MENU.
 * @variant 1 Элемент отображается в выпадающем меню и в тулбаре. Рекомендуем использовать константу toolbar.showType.MENU_TOOLBAR.
 * @variant 2 Элемент отображается только в тулбаре. Рекомендуем использовать константу toolbar.showType.TOOLBAR.
 */

/*
 * @typedef {String} Controls/_toolbars/interfaces/IToolbarSource/ShowType
 * @variant showType.MENU item is displayed only in the menu
 * @variant showType.MENU_TOOLBAR item is displayed in the menu and toolbar
 * @variant showType.TOOLBAR item is displayed only in the toolbar
 */

/**
 * @typedef {String} Controls/_toolbars/interfaces/IToolbarSource/CaptionPosition
 * @variant left Текст расположен перед иконкой.
 * @variant right Текст расположен после иконки.
 */

/**
 * @interface Controls/_toolbars/IToolBarItem
 * @public
 */
export interface IToolBarItem {
    [key: string]: unknown;

    /**
     * @name Controls/_toolbar/IToolBarItem#readonly
     * @cfg {Boolean} Определяет, может ли пользователь изменить значение контрола. См. {@link UICore/Base:Control#readOnly подробнее}.
     */
    readonly?: boolean;
    /**
     * @name Controls/_toolbar/IToolBarItem#caption
     * @cfg {String} Определяет текст кнопки элемента. См. {@link Controls/interface:ICaption#caption подробнее}.
     */
    caption?: string;
    /**
     * @name Controls/_toolbar/IToolBarItem#contrastBackground
     * @cfg {Boolean} Определяет, имеет ли кнопка элемента фон. См. {@link Controls/buttons:IButton#contrastBackground подробнее}.
     */
    contrastBackground?: boolean;
    /**
     * @name Controls/_toolbar/IToolBarItem#iconStyle
     * @cfg {String} Цвет иконки элемента. См. {@link Controls/interface:IIconStyle#iconStyle подробнее}.
     */
    iconStyle?: string;
    /**
     * @name Controls/_toolbar/IToolBarItem#icon
     * @cfg {String} Иконка элемента. См. {@link Controls/interface:IIcon#icon подробнее}.
     */
    icon?: string;
    /**
     * @name Controls/_toolbar/IToolBarItem#title
     * @cfg {String} Определяет текст элемента в выпадающем списке.
     */
    title?: string;
    /**
     * @name Controls/_toolbar/IToolBarItem#showHeader
     * @cfg {Boolean} Определяет, будет ли отображаться шапка у выпадающего списка элемента.
     */
    showHeader?: boolean;
    /**
     * @name Controls/_toolbar/IToolBarItem#tooltip
     * @cfg {String} Текст подсказки, при наведении на элемент тулбара. См. {@link Controls/interface:ITooltip#tooltip подробнее}.
     */
    tooltip?: string;
    /**
     * @name Controls/_toolbar/IToolBarItem#showType
     * @cfg {Controls/_toolbars/interfaces/IToolbarSource/ShowType.typedef} Определяет, где будет отображаться элемент. Значение берется из класса {@link Controls/toolbars:showType}.
     * @default 1
     */
    showType?: 0 | 1 | 2;
    /**
     * @name Controls/_toolbar/IToolBarItem#viewMode
     * @cfg {String} Стиль отображения кнопки элемента. См. {@link Controls/buttons:Button#viewMode подробнее}.
     */
    viewMode?: string;
    /**
     * @name Controls/_toolbar/IToolBarItem#captionPosition
     * @cfg {Controls/_toolbars/interfaces/IToolbarSource/CaptionPosition.typedef} Определяет, с какой стороны расположен текст кнопки относительно иконки.
     */
    captionPosition?: 'left' | 'right';
    /**
     * @name Controls/_toolbar/IToolBarItem#buttonStyle
     * @cfg {String} Стиль отображения кнопки. См. {@link Controls/buttons:IButton#buttonStyle подробнее}.
     */
    buttonStyle?: string;
}

/**
 * @name Controls/_toolbar/IToolBarItem#inlineHeight
 * @cfg {String} Высота кнопки.
 */
/**
 * @name Controls/_toolbar/IToolBarItem#fontSize
 * @cfg {String} Размер текста кнопки.
 */
/**
 * @name Controls/_toolbar/IToolBarItem#captionPosition
 * @cfg {String} Расположение текста кнопки.
 */

/*
 * @typedef {Object} Controls/_toolbars/interfaces/IToolbarSource/Item
 * @property {Boolean} [item.readOnly] Determines item readOnly state.
 * @property {String} [item.caption] Caption of toolbar element.
 * @property {String} [item.iconStyle] Icon style of toolbar element.
 * @property {String} [item.icon] Icon of toolbar element.
 * @property {String} [item.title] Determines item caption.
 * @property {Boolean} [item.showHeader] Indicates whether folders should be displayed.
 * @property {String} [item.tooltip] Text of the tooltip shown when the item is hovered over.
 * @property {Controls/_toolbars/interfaces/IToolbarSource/ShowType.typedef} [item.showType] Determines where item is displayed. The value is taken from the util 'Controls/Utils/Toolbar'. {@link Controls/toolbars:showType}.
 * @property {Controls/_toolbars/interfaces/IToolbarSource/CaptionPosition.typedef} [item.captionPosition]
 * @property {String} [item.buttonStyle] Button style of toolbar element.
 * @property {String} [item.buttonViewMode] Button style of toolbar element.
 */

/**
 * @typedef {Object} Controls/_toolbars/interfaces/IToolbarSource/SourceCfg
 * @property {Controls/_toolbars/IToolBarItem} [SourceCfg.item] Формат исходной записи.
 */

/*
 * @typedef {Object} Controls/_toolbars/interfaces/IToolbarSource/SourceCfg
 * @property {Controls/_toolbars/IToolBarItem} [SourceCfg.item] Format of source record.
 */

/**
 * @name Controls/_toolbars/interfaces/IToolbarSource#source
 * @cfg {Controls/_toolbars/interfaces/IToolbarSource/SourceCfg.typedef} Объект, который реализует интерфейс {@link Types/source:ICrud}, необходимый для работы с источником данных.
 * @default undefined
 * @example
 * Кнопки будут отображены из источника _source. Первый элемент выравнен по левому краю, другие элементы выравнены по правому краю по умолчанию.
 * <pre class="brush: html; highlight: [2]">
 * <!-- WML -->
 * <Controls.toolbars:View keyProperty="key" source="{{_source}}" />
 * </pre>
 * <pre class="brush: html; highlight: [5]">
 * // TypeScript
 * import {showType} from 'Controls/toolbars';
 * import {Memory} from 'Types/source';
 * ...
 * this._source = new Memory({
 *     keyProperty: 'key',
 *     data: [{
 *         key: '1',
 *         showType: showType.TOOLBAR,
 *         icon: 'icon-Time',
 *         iconStyle: 'secondary',
 *         '@parent': false,
 *         parent: null,
 *         contrastBackground: true
 *     }]
 * })
 * </pre>
 */

/**
 * @name Controls/_toolbars/interfaces/IToolbarSource#keyProperty
 * @cfg {String} Имя свойства, содержащего информацию об идентификаторе текущей строки.
 * @remark Например, идентификатор может быть первичным ключом записи в базе данных.
 */
