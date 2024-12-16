/**
 * @kaizen_zone 1889d83a-b7c4-4a26-8824-ae82de6d5a77
 */
import { TemplateFunction } from 'UI/Base';
import {
    IFontColorStyleOptions,
    IFontSizeOptions,
    IFontWeightOptions,
    IIconSizeOptions,
    IIconStyleOptions,
    ITextTransformOptions,
    TFontColorStyle,
    TFontSize,
    TFontWeight,
    THorizontalAlign,
    TIconSize,
    TIconStyle,
    TSize,
    TTextTransform,
} from 'Controls/interface';

/**
 * Допустимые значения для опции {@link expanderAlign}.
 * @typedef TGroupExpanderAlign
 * @description
 * @variant left Слева от названия группы.
 * @variant right Справа от названия группы.
 */
export type TGroupExpanderAlign = 'left' | 'right';

/**
 * Интерфейс для шаблона отображения заголовка {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ группы} в {@link /doc/platform/developmentapl/interface-development/controls/list/ списке}.
 * @public
 */
export interface IBaseGroupTemplate
    extends IFontColorStyleOptions,
        IFontSizeOptions,
        IFontWeightOptions,
        IIconSizeOptions,
        IIconStyleOptions,
        ITextTransformOptions {
    /**
     * Горизонтальное позиционирование {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ кнопки-экспандера} относительно текста заголовка группы.
     * @cfg
     * @default left
     * @demo Controls-demo/list_new/Grouped/CaptionAlign/Right/Index В следующем примере для кнопки-экспандера установлено позиционирование справа от текста залоговка группы.
     * @see expanderVisible
     * @see iconSize
     */
    expanderAlign?: TGroupExpanderAlign;

    /**
     * Видимость {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ кнопки-экспандера}.
     * @cfg
     * @default true
     * @demo Controls-demo/list_new/Grouped/WithoutExpander/Index В следующем примере кнопка-экспандр скрыта.
     * @remark
     * Когда опция установлена в значение false, кнопка-экспандер будет скрыта.
     * @see expanderAlign
     * @see iconSize
     */
    expanderVisible?: boolean;

    /**
     * Пользовательский шаблон, отображаемый в правой части заголовка группы.
     * @cfg
     * @default undefined
     * @demo Controls-demo/list_new/Grouped/RightTemplate/Index
     * @markdown
     * @remark
     * В области видимости шаблона доступна переменная **item** со следующими свойствами:
     *
     * * item — идентификатор отрисовываемой группы, полученный из {@link Controls/interface/IGroupedGrid#groupProperty groupProperty}.
     * * {@link Types/collection:RecordSet#metaData metaData} — метаданные рекордсета, который загружен для таблицы.
     *
     * @example
     * В следующих примерах показано, как изменять опции шаблона для контрола {@link Controls/list:View}, однако то же самое справедливо и для других {@link /doc/platform/developmentapl/interface-development/controls/list/ списочных контролов}.
     *
     *
     * **Пример 1.** Контрол и шаблон groupTemplate настроены в одном WML-файле.
     * <pre class="brush: html; highlight: [3-9]">
     * <!-- file1.wml -->
     * <Controls.list:View source="{{_viewSource}}">
     *    <ws:groupTemplate>
     *       <ws:partial template="Controls/list:GroupTemplate" scope="{{groupTemplate}}">
     *          <ws:rightTemplate>
     *             {{ rightTemplate.item.metaData.groupResults[rightTemplate.item.contents] }}
     *          </ws:rightTemplate>
     *       </ws:partial>
     *    </ws:groupTemplate>
     * </Controls.list:View>
     * </pre>
     *
     * **Пример 2.** Контрол и шаблон groupTemplate настроены в отдельных WML-файлах.
     * <pre class="brush: html; highlight: [3-5]">
     * <!-- file1.wml -->
     * <Controls.list:View source="{{_viewSource}}">
     *    <ws:groupTemplate>
     *       <ws:partial template="wml!file2" scope="{{groupTemplate}}"/>
     *    </ws:groupTemplate>
     * </Controls.list:View>
     * </pre>
     *
     * <pre class="brush: html">
     * <!-- file2.wml -->
     * <ws:partial template="Controls/list:GroupTemplate">
     *    <ws:rightTemplate>
     *       {{ rightTemplate.item.metaData.groupResults[rightTemplate.item.contents] }}
     *    </ws:rightTemplate>
     * </ws:partial>
     * </pre>
     *
     * **Пример 3.** Контрол и шаблон rightTemplate настроены в отдельных WML-файлах.
     *
     * <pre class="brush: html; highlight: [3-9]">
     * <!-- file1.wml -->
     * <Controls.list:View source="{{_viewSource}}">
     *    <ws:groupTemplate>
     *       <ws:partial template="Controls/list:GroupTemplate">
     *          <ws:rightTemplate>
     *             <ws:partial template="wml!file2" scope="{{rightTemplate}}"/>
     *          </ws:rightTemplate>
     *       </ws:partial>
     *    </ws:groupTemplate>
     * </Controls.list:View>
     * </pre>
     *
     * <pre class="brush: html">
     * <!-- file2.wml -->
     * {{ rightTemplate.item.metaData.groupResults[rightTemplate.item.contents] }}
     * </pre>
     */
    rightTemplate?: string | TemplateFunction;

    /**
     * Пользовательский шаблон вместо текста заголовка группы.
     * @cfg
     * @default undefined
     * @demo Controls-demo/list_new/Grouped/ContentTemplate/Index
     * @remark
     * В области видимости шаблона доступна переменная **item** со следующими свойствами:
     *
     * * item — идентификатор отрисовываемой группы, полученный из {@link Controls/interface/IGroupedGrid#groupProperty groupProperty}.
     * * {@link Types/collection:RecordSet#metaData metaData} — метаданные рекордсета, который загружен для списка.
     *
     * @example
     * В следующих примерах показано, как изменять опции шаблона для контрола {@link Controls/list:View}, однако то же самое справедливо и для других списочных контролов.
     *
     * В примерах ниже показано, как получить доступ к переменной item из области видимости шаблона.
     *
     * **Пример 1.** Контрол и шаблон groupTemplate настроены в одном WML-файле.
     *
     * <pre class="brush: html; highlight: [3-10]">
     * <!-- file1.wml -->
     * <Controls.list:View source="{{_viewSource}}">
     *    <ws:groupTemplate>
     *       <ws:partial template="Controls/list:GroupTemplate" scope="{{groupTemplate}}">
     *          <ws:contentTemplate>
     *             <ws:if data="{{contentTemplate.item.contents === 'nonexclusive'}}">Неисключительные права</ws:if>
     *             <ws:if data="{{contentTemplate.item.contents === 'works'}}">Работы</ws:if>
     *          </ws:contentTemplate>
     *       </ws:partial>
     *    </ws:groupTemplate>
     * </Controls.list:View>
     * </pre>
     *
     * **Пример 2.** Контрол и шаблон groupTemplate настроены в отдельных WML-файлах.
     * <pre class="brush: html; highlight: [3-5]">
     * <!-- file1.wml -->
     * <Controls.list:View source="{{_viewSource}}">
     *    <ws:groupTemplate>
     *       <ws:partial template="wml!file2" scope="{{groupTemplate}}"/>
     *    </ws:groupTemplate>
     * </Controls.list:View>
     * </pre>
     *
     * <pre class="brush: html;">
     * <!-- file2.wml -->
     * <ws:partial template="Controls/list:GroupTemplate">
     *    <ws:contentTemplate>
     *       <ws:if data="{{contentTemplate.item.contents === 'nonexclusive'}}">Неисключительные права</ws:if>
     *       <ws:if data="{{contentTemplate.item.contents === 'works'}}">Работы</ws:if>
     *    </ws:contentTemplate>
     * <ws:partial>
     * </pre>
     *
     * **Пример 3.** Контрол и шаблон contentTemplate настроены в отдельных WML-файлах.
     *
     * <pre class="brush: html; highlight: [3-9]">
     * <!-- file1.wml -->
     * <Controls.list:View source="{{_viewSource}}">
     *    <ws:groupTemplate>
     *       <ws:partial template="Controls/list:GroupTemplate">
     *          <ws:contentTemplate>
     *             <ws:partial template="wml!file2" scope="{{contentTemplate}}"/>
     *          </ws:contentTemplate>
     *       </ws:partial>
     *    </ws:groupTemplate>
     * </Controls.list:View>
     * </pre>
     *
     * <pre class="brush: html">
     * <!-- file2.wml -->
     * <ws:if data="{{item.contents === 'nonexclusive'}}">Неисключительные права</ws:if>
     * <ws:if data="{{item.contents === 'works'}}">Работы</ws:if>
     * </pre>
     * @see textAlign
     * @see fontSize
     */
    contentTemplate?: TemplateFunction;

    /**
     * Видимость {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/visual/text/ текста заголовка группы}.
     * @cfg
     * @default true
     * @demo Controls-demo/list_new/Grouped/TextVisible/Index В следующем примере текст заголовка группы скрыт.
     * @remark
     * Позволяет скрыть в заголовке группы текст вместе с кнопкой-экспандером. При использовании игнорируются {@link textAlign} и {@link expanderVisible}
     * @see textAlign
     * @see expanderVisible
     */
    textVisible?: boolean;

    /**
     * Размер {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/visual/text/#font-size текста заголовка группы}.
     * @cfg
     * @default xs
     * @remark
     * Данное значение влияет на базовую линию в группе.
     * Размер шрифта задается константой из стандартного набора размеров шрифта, который определен для текущей темы оформления.
     * @default l
     * @see textAlign
     * @see contentTemplate
     */
    fontSize?: TFontSize;

    /**
     * Стиль цвета текста заголовка группы.
     * @cfg
     * @demo Controls-demo/breadCrumbs_new/FontColorStyle/Index
     * @remark
     * Стиль цвета текста задается константой из стандартного набора цветов, который определен для текущей темы оформления.
     */
    fontColorStyle?: TFontColorStyle;

    /**
     * Размер иконки {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ кнопки-экспандера}.
     * @cfg
     * @default s
     * @see iconStyle
     * @see expanderAlign
     * @see expanderVisible
     */
    iconSize?: TIconSize;

    /**
     * Стиль цвета иконки {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ кнопки-экспандера}.
     * @cfg
     * @default default
     * @remark
     * Цвет иконки задается константой из стандартного набора цветов, который определен для текущей темы оформления.
     * @see iconSize
     * @see expanderAlign
     * @see expanderVisible
     */
    iconStyle?: TIconStyle;

    /**
     * Насыщенность шрифта.
     * @cfg
     * @default default
     */
    fontWeight?: TFontWeight;

    /**
     * @name Controls/_list/interface/IBaseGroupTemplate#textTransform
     * @cfg {Controls/_interface/ITextTransform/TTextTransform.typedef} Управляет преобразованием текста элемента в заглавные или прописные символы
     * @default none
     */
    textTransform?: TTextTransform;

    /**
     * Стиль фона
     * @cfg
     * @remark
     * Согласно {@link /doc/platform/developmentapl/interface-development/controls/list/list/background/ документации} поддерживаются любые произвольные значения опции.
     */
    backgroundStyle?: string;

    /**
     * Размер верхнего внутреннего отступа
     * @cfg
     * @default s
     */
    paddingTop?: TSize;

    /**
     * Размер нижнего внутреннего отступа
     * @cfg
     * @default 2xs
     */
    paddingBottom?: TSize;

    /**
     * Видимость {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ горизонтальной линии}.
     * @cfg
     * @remark
     * Когда опция установлена в значение false, горизонтальная линия-разделитель будет скрыта.
     * @default true
     * @demo Controls-demo/list_new/Grouped/WithoutSeparator/Left/Index В следующем примере горизонтальная линия скрыта.
     */
    separatorVisible?: boolean;

    /**
     * Выравнивание {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/visual/text/ текста заголовка группы}.
     * @cfg
     * @default center
     * @demo Controls-demo/list_new/Grouped/CaptionAlign/Right/Index В следующем примере для текста заголовка группы задано выравнивание по правому краю.
     * @see contentTemplate
     */
    halign?: THorizontalAlign;

    textAlign?: THorizontalAlign;
    separatorVisibility?: boolean;
}
