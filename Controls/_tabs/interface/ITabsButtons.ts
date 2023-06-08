/**
 * @kaizen_zone f43717a4-ecb5-4bdd-a32c-4ebbcb125017
 */
import { IControlOptions } from 'UI/Base';
import { SbisService } from 'Types/source';
import { ISingleSelectableOptions, IItemsOptions } from 'Controls/interface';
import { RecordSet } from 'Types/collection';
import { IIconCounterTabTemplate } from 'Controls/_tabs/interface/IIconCounterTabTemplate';

/**
 * Опция определяющая положение вкладки
 * @typedef {String} Controls/_tabs/interface/ITabsButtons/Align
 * @variant 'right' Вкладка отображается справа.
 * @variant 'left' Вкладка отображается слева.
 */

/**
 * Опция определяющая конфигурацию вкладок
 * @typedef {Object} Controls/_tabs/interface/ITabsButtons/Item
 * @property {Controls/_tabs/interface/ITabsButtons/Align.typedef} [item.align] Определяет с какой стороны отображается вкладка.
 * @property {Number|String} [item.maxWidth] Максимальная ширина вкладки. Может принимать числовое значение(в пикселях) или в процентах(Например: '20%')
 * @property {Number|String} [item.minWidth] Минимальная ширина вкладки. Может принимать числовое значение(в пикселях) или в процентах(Например: '20%')
 * @property {Number|String} [item.width] Фиксированная ширина вкладки.
 * @property {String} [item.tooltip] Текст всплывающей подсказки, отображаемой при наведении указателя мыши на вкладку.
 * Может принимать числовое значение(в пикселях) или в процентах(Например: '20%')
 * При задании фиксированной ширины задание minWidth и maxWidth не имеет смысла, т.к. ширина зафиксируется.
 * @property {Boolean} [item.isMainTab] Определяет, является ли вкладка главной. Главная вкладка визуально выделяется относительно других вкладок. Поддерживается визуальное оформление только для первой вкладки слева.
 * @property {String} [item.icon] Название иконки. {@link Controls/_tabs/ITabsTemplate#itemTemplate Для настройки смотри пример}
 * @property {String} [item.iconStyle] Стиль отображения иконки. {@link Controls/_tabs/ITabsTemplate#itemTemplate Для настройки смотри пример}
 * @property {String} [item.iconTooltip] Отдельная всплывающая подсказка для иконки. {@link Controls/_tabs/ITabsTemplate#itemTemplate}
 * @property {Number} [item.mainCounter] Значение счетчика. {@link Controls/_tabs/ITabsTemplate#itemTemplate Для настройки смотри пример}
 * @property {Number} [item.mainCounterStyle] Стиль отображения счетчика. {@link Controls/_tabs/ITabsTemplate#itemTemplate Для настройки смотри пример}
 * @property {String} [item.caption] Подпись вкладки. {@link Controls/_tabs/ITabsTemplate#itemTemplate Для настройки смотри пример}
 * @property {Controls/_tabs/interface/ITabsButtons/image.typedef} [item.image] Конфигурация для отображения картинки. {@link Controls/_tabs/ITabsTemplate#itemTemplate Для настройки смотри пример}
 */

/**
 * Опция определяющая настройку изображения
 * @typedef {Object} Controls/_tabs/interface/ITabsButtons/image
 * @property {String} [image.src] Url картинки.
 * @property {Number} [image.srcSet] Значение аттрибута srcset.
 * @property {String} [image.tooltip] Значение тултипа.
 */

export interface ITabButtonItem extends IIconCounterTabTemplate {
    isMainTab?: boolean;
    align?: 'left' | 'right';
    title?: string;
    tooltip?: string;
    minWidth?: string | number;
    width?: string | number;
    maxWidth?: string | number;
    [key: string]: any;
}
/**
 * Интерфейс для опций контрола вкладок.
 * @public
 * @implements Controls/interface:ISingleSelectable
 */
export interface ITabsButtons {
    readonly '[Controls/_tabs/interface/ITabsButtons]': boolean;
}

export interface ITabsButtonsOptions
    extends IControlOptions,
        ISingleSelectableOptions,
        IItemsOptions<object> {
    /**
     * @name Controls/_tabs/interface/ITabsButtons#source
     * @cfg {Types/source:Base} Объект, реализующий ISource интерфейс для доступа к данным.
     * @default undefined
     * @remark
     * Элементу можно задать свойство align, которое определяет выравнивание вкладок.
     * Если одной из крайних вкладок надо отобразить оба разделителя, слева и справа, то используйте свойство contentTab в значении true.
     * @example
     * На вкладках будут отображаться данные из _source. Первый элемент отображается с выравниванием по левому краю, другие элементы отображаются по умолчанию - справа.
     * <pre class="brush: html; highlight: [4]">
     * <Controls.tabs:Buttons
     *     bind:selectedKey="_selectedKey"
     *     keyProperty="key"
     *     source="{{_source}}" />
     * </pre>
     * <pre class="brush: js; highlight: [5-22]">
     * _selectedKey: null,
     * _source: null,
     * _beforeMount: function() {
     *    this._selectedKey: '1',
     *    this._source: new Memory({
     *       keyProperty: 'key',
     *       data: [
     *          {
     *             key: '1',
     *             title: 'Yaroslavl',
     *             align: 'left'
     *          },
     *          {
     *             key: '2',
     *             title: 'Moscow'
     *          },
     *          {
     *             key: '3',
     *             title: 'St-Petersburg'
     *          }
     *       ]
     *    });
     * }
     * </pre>
     * @see items
     */
    source?: SbisService;

    /**
     * @name Controls/_tabs/interface/ITabsButtons#items
     * @cfg {RecordSet.<Controls/_tabs/interface/ITabsButtons/Item.typedef>} Рекордсет с конфигурацией вкладок.
     * @default undefined
     * @remark
     * Элементу можно задать свойство align, которое определяет выравнивание вкладок.
     * Если одной из крайних вкладок надо отобразить оба разделителя, слева и справа, то используйте свойство contentTab в значении true.
     * @example
     * На вкладках будут отображаться данные из _items. Первый элемент отображается с выравниванием по левому краю, другие элементы отображаются по умолчанию - справа.
     * <pre class="brush: html; highlight: [4]">
     *  <!--WML-->
     * <Controls.tabs:Buttons
     *     bind:selectedKey="_selectedKey"
     *     keyProperty="key"
     *     items="{{_items}}" />
     * </pre>
     * <pre class="brush: js; highlight: [5-22]">
     * // TS
     * protected _selectedKey: string = null;
     * protected _items: RecordSet = null;
     * protected _beforeMount(options: ITabsOptions) {
     *    this._selectedKey = '1';
     *    this._items = new RecordSet({
     *       keyProperty: 'key',
     *       rawData: [
     *          {
     *             key: '1',
     *             title: 'Yaroslavl',
     *             align: 'left',
     *             maxWidth: '50%'
     *          },
     *          {
     *             key: '2',
     *             title: 'Moscow',
     *             minWidth: 150,
     *             maxWidth: 300
     *          },
     *          {
     *             key: '3',
     *             title: 'St-Petersburg',
     *             width: 200
     *          }
     *       ]
     *    });
     * }
     * </pre>
     * @demo Controls-demo/Tabs/Buttons/TabsWidth/Index
     * @see items
     */
    items?: RecordSet<ITabButtonItem>;
    /**
     * @name Controls/_tabs/interface/ITabsButtons#borderVisible
     * @cfg {Boolean} Определяет видимость горизонтальной линии, которая подчеркивает вкладки снизу.
     * @default true
     * @demo Controls-demo/Tabs/Buttons/BorderVisible/Index
     */
    borderVisible?: boolean;
    /**
     * Опция определяющая высоту вкладки
     * @typedef {String} Controls/_tabs/interface/ITabsButtons/InlineHeight
     * @variant s
     * @variant l
     */
    /**
     * @name Controls/_tabs/interface/ITabsButtons#inlineHeight
     * @cfg {Controls/_tabs/interface/ITabsButtons/InlineHeight.typedef} Определяет высоту вкладок
     * @default s
     * @demo Controls-demo/Tabs/Buttons/InlineHeight/Index
     */
    inlineHeight?: string;
    /**
     * Опция определяющая горизонтальные отступ вкладки
     * @typedef {String} Controls/_tabs/interface/ITabsButtons/HorizontalPadding
     * @variant xs
     * @variant null
     */
    /**
     * @name Controls/_tabs/interface/ITabsButtons#horizontalPadding
     * @cfg {Controls/_tabs/interface/ITabsButtons/HorizontalPadding.typedef} Определяет размер отступов контрола по горизонтали.
     * @default xs
     * @demo Controls-demo/Tabs/Buttons/HorizontalPadding/Index
     */
    horizontalPadding?: string;
    /**
     * @name Controls/_tabs/interface/ITabsButtons#displayProperty
     * @cfg {String} Устанавливает имя поля элемента, значение которого будет отображено.
     */
    displayProperty?: string;

    /**
     * @name Controls/_tabs/interface/ITabsButtons#canShrink
     * @cfg {Boolean} Определяет могут ли вкладки сжиматься. Если вкладки не могут сжиматься, то при недостатке места они скролятся по горизонтали.
     * @default true
     */
    canShrink?: boolean;

    /**
     * @name Controls/_tabs/interface/ITabsButtons#fontColorStyle
     * @cfg {Controls/interface:IFontColorStyle/TFontColorStyle.typedef} Устанавливает цвет текста вкладок.
     * @default secondary
     * @see IFontColorStyle
     * @demo Controls-demo/Tabs/Buttons/FontColorStyle/Index
     */
    fontColorStyle?: string;

    /**
     * @name Controls/_tabs/interface/ITabsButtons#selectedStyle
     * @cfg {Controls/interface:IFontColorStyle/TFontColorStyle.typedef} Устанавливает цвет текста и маркера выбранной вкладки.
     * @default primary
     * @see IFontColorStyle
     * @demo Controls-demo/Tabs/Buttons/FontColorStyle/Index
     */
    selectedStyle?: string;

    /**
     * @name Controls/_tabs/interface/ITabsButtons#direction
     * @cfg {String} Определяет направление расположения табов.
     * @demo Controls-demo/Tabs/Buttons/Direction/Index
     * @variant vertical
     * @variant horizontal
     * @default horizontal
     */
    direction?: 'vertical' | 'horizontal';
}
