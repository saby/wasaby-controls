/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { TMarkerSize } from 'Controls/display';
import {
    IFontColorStyleOptions,
    IFontSizeOptions,
    IFontWeightOptions,
    TBackgroundStyle,
    ITooltipOptions,
} from 'Controls/interface';
import { TItemActionsVisibility } from 'Controls/itemActions';

/**
 * @typedef {String} Controls/_list/interface/IBaseItemTemplate/TCursor
 * @description Значения, с помощью которых задается вид курсора мыши.
 * @variant default Стандартный указатель (стрелка).
 * @variant pointer Указатель.
 * @variant text Текст
 */
export type TCursor = 'default' | 'pointer' | 'right' | 'text';

export default interface IBaseItemTemplateOptions
    extends IFontColorStyleOptions,
        IFontSizeOptions,
        IFontWeightOptions,
        ITooltipOptions {
    highlightOnHover?: boolean;
    cursor?: TCursor;
    itemActionsClass?: string;
    actionsVisibility?: TItemActionsVisibility;
    showItemActionsOnHover?: boolean;
    backgroundColorStyle?: TBackgroundStyle;
    hoverBackgroundStyle?: TBackgroundStyle;
    displayProperty?: string;
    marker?: boolean;
    markerSize?: TMarkerSize;
    markerPosition?: 'outside' | 'custom';
    markerClassName?: string;
}

/**
 * Интерфейс для шаблона отображения элемента в {@link /doc/platform/developmentapl/interface-development/controls/list/ списке}.
 * @interface Controls/_list/interface/IBaseItemTemplate
 * @public
 */
/**
 * @name Controls/_list/interface/IBaseItemTemplate#highlightOnHover
 * @cfg {Boolean} Видимость подсветки строки при наведении курсора мыши.
 * @remark
 * В значении false элементы списка не будут подсвечиваться при наведении курсора мыши.
 * Если при отключенной подсветке строки требуется подсветить определённую область внутри строки, то на области, которую необходимо подсветить, можно указать платформенный CSS класс "controls-hover-background-default"
 * Вместо default можно указать цвет из линейки цветов платформы.
 * Дополнительно о подсветке строки читайте {@link /doc/platform/developmentapl/interface-development/controls/list/list/background/#highlight здесь}.
 * @default true
 * @demo Controls-demo/list_new/ItemTemplate/NoHighlightOnHover/Index
 */
/**
 * @name Controls/_list/interface/IBaseItemTemplate#cursor
 * @cfg {Controls/_list/interface/IBaseItemTemplate/TCursor.typedef} Вид {@link https://developer.mozilla.org/ru/docs/Web/CSS/cursor курсора мыши} при наведении на строку.
 * @default pointer
 * @demo Controls-demo/list_new/ItemTemplate/Clickable/Index
 */
/**
 * @name Controls/_list/interface/IBaseItemTemplate#marker
 * @cfg {Boolean} Позволяет отключить видимость {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркера} для отдельной записи списка.
 * @default true
 * @demo Controls-demo/list_new/ItemTemplate/Marker/Index В следующем примере выделение маркером отключено для первой записи.
 * @remark Отключение видимости маркера для всех записей описано {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/#all здесь}.
 * @see markerSize
 * @see Controls/marker:IMarkerList#markerVisibility
 */
/**
 * @typedef {String} Controls/_list/interface/IBaseItemTemplate/ItemActionsClass
 * @description Классы, с помощью которых задается {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/position/ позиционирование панели опций записи} внутри элемента.
 * @variant controls-itemActionsV_position_bottomRight В правом нижнем углу элемента.
 * @variant controls-itemActionsV_position_topRight В правом верхнем углу элемента.
 */
/**
 * @name Controls/_list/interface/IBaseItemTemplate#itemActionsClass
 * @cfg {Controls/_list/interface/IBaseItemTemplate/ItemActionsClass.typedef} Класс, используемый для позиционирования {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ панели опций записи} при отображении её внутри элемента списка (опция {@link Controls/itemActions:IItemActions#itemActionsPosition itemActionsPosition}).
 * @default controls-itemActionsV_position_bottomRight
 * @remark
 * Дополнительно об использовании опции читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/position/#inside здесь}.
 * @demo Controls-demo/list_new/ItemTemplate/ItemActionsClass/Index
 */
/**
 * @name Controls/_interface/IBaseGroupTemplate#fontColorStyle
 * @cfg {Controls/_interface/IFontColorStyle/TFontColorStyle.typedef} Стиль цвета текста записи.
 * @remark
 * Стиль цвета текста задается константой из стандартного набора цветов, который определен для текущей темы оформления.
 */
/**
 * @name Controls/_list/interface/IBaseItemTemplate#fontSize
 * @cfg {Controls/_interface/IFontSize/TFontSize.typedef} Размер шрифта записи.
 * @remark
 * Размер шрифта задается константой из стандартного набора размеров шрифта, который определен для текущей темы оформления.
 * @default l
 */
/**
 * @name Controls/_list/interface/IBaseItemTemplate#fontWeight
 * @cfg {Controls/interface/TFontWeight.typedef} Насыщенность шрифта.
 * @default "default".
 */
/*
 * @cfg {boolean} Flag, allowing to set "readonly" state for checkbox within multiSelect.
 * @default false
 */

/**
 * @name Controls/_list/interface/IBaseItemTemplate#backgroundColorStyle
 * @cfg {Controls/_interface/IBackgroundStyle/TBackgroundStyle.typedef} Настройка фона строки.
 * @remark
 * Поддерживается стандартная палитра цветов записи.
 * Подробнее о настройке фона строки читайте {@link /doc/platform/developmentapl/interface-development/controls/list/list/background/#highlight здесь}.
 * @demo Controls-demo/list_new/ItemTemplate/BackgroundColorStyle/Index
 */

/**
 * @name Controls/_list/interface/IList#hoverBackgroundStyle
 * @cfg {Controls/_interface/IBackgroundStyle/TBackgroundStyle.typedef} {@link /doc/platform/developmentapl/interface-development/controls/list/list/background/#hover Стиль подсветки строки} при наведении курсора мыши.
 * @default default
 * @remark
 * Позволяет определить произвольный фон записи при наведении.
 * Поддерживается стандартная палитра цветов ховера.
 * Для отключения цвета при наведении используйте значение "transparent"
 * Для определения собственных цветов при наведении, необходимо указать специальный hoverBackgroundStyle, а
 * также определить в своем less-файле стиль controls-hover-background-@{yourBackgroundStyle}.
 * @example
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <Controls.list:View
 *    source="{{_viewSource}}"
 *    hoverBackgroundStyle="primary" />
 * </pre>
 */

/**
 * @name Controls/_list/interface/IBaseItemTemplate#markerSize
 * @cfg {Controls/display/TMarkerSize.typedef} Размер {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркера}.
 * @default content-xs
 * @demo Controls-demo/gridNew/MarkerSize/Index
 * @see marker
 */

/**
 * @name Controls/_list/interface/IBaseItemTemplate#markerClassName
 * @cfg {string} Класс стилей {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркера}.
 * @default undefined
 * @demo Controls-demo/list_new/Marker/MarkerClassName/Index
 * @see marker
 */
