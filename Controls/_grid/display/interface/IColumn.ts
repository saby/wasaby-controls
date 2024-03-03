/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { TemplateFunction } from 'UI/Base';
import { FunctionComponent } from 'react';
import {
    TFontSize,
    TFontColorStyle,
    TFontWeight,
    ITagStyle,
    TBackgroundStyle,
} from 'Controls/interface';

/**
 * @typedef {IColumn[]} TColumns
 * @description Тип опции columns в таблице
 * @public
 */
export type TColumns = IColumn[];

/**
 * @typedef {String} TCellPaddingVariant
 * @description Возможные значения отступов внутри ячейки таблицы
 * @variant s Небольшой отступ.
 * @variant m Средний отступ.
 * @variant null Нулевой отступ.
 */
export type TCellPaddingVariant = 'S' | 'M' | 's' | 'm' | 'null';

/**
 * Опции для задания ячейкам левого и правого отступа, исключая левый отступ первой ячейки и правый последней.
 * @public
 */
export interface ICellPadding {
    /**
     * @cfg {TCellPaddingVariant} Отступ от левой границы ячейки.
     * @default m
     * @see right
     */
    left?: TCellPaddingVariant;
    /**
     * @cfg {TCellPaddingVariant} Отступ от правой границы ячейки.
     * @default m
     * @see left
     */
    right?: TCellPaddingVariant;
}

/**
 * @typedef {Object} IDisplayTypeOptions
 * @description Настройки для типа отображаемых данных.
 * @property {searchHighlight} [searchHighlight=true] Подсветку данных при поиске (по умолчанию подсветка включена).
 */
export interface IDisplayTypeOptions {
    searchHighlight?: boolean;
}

/**
 * Значения для горизонтального выравнивания содержимого
 * @typedef {String} TCellHorizontalAlign
 * @variant left Содержимое прижато к левому краю
 * @variant center Содержимое выровнено по центру ячейки
 * @variant right Содержимое прижато к правому краю
 */
export type TCellHorizontalAlign = 'left' | 'center' | 'right';

/**
 * Значения для вертикального выравнивания содержимого
 * @typedef {String} TCellVerticalAlign
 * @variant top Прижато к верхнему краю ячейки
 * @variant center Содержимое выровнено по центру ячейки
 * @variant bottom Прижато к нижнему краю ячейки
 * @variant baseline Содержимое ячейки выровнено по базовой линии
 */
export type TCellVerticalAlign = 'top' | 'center' | 'bottom' | 'baseline';

/**
 * Значения для обрезки текста
 * @typedef {String} TOverflow
 * @variant ellipsis Текст обрезается и добавляется многоточие
 * @variant none Текст не обрезается, но разбивается на несколько строк
 */
export type TOverflow = 'ellipsis' | 'none';

/**
 * Значения для вертикального разделителя между ячейками
 * @typedef {String} TColumnSeparatorSize
 * @variant s Стандартный разделитель толщиной 1px
 * @variant null без вертикального разделителя
 */
export type TColumnSeparatorSize = 's' | 'null';

/**
 * Конфиг линии-разделителя колонок слева и справа.
 * @public
 */
export interface IColumnSeparatorSizeConfig {
    /**
     * @cfg {String|null} Размер линии-разделителя колонок слева.
     * @variant s Размер тонкой линии-разделителя.
     * @variant null Без линии-разделителя.
     */
    left?: TColumnSeparatorSize;
    /**
     * @cfg {String|null} Размер линии-разделителя колонок справа.
     * @variant s Размер тонкой линии-разделителя.
     * @variant null Без линии-разделителя.
     */
    right?: TColumnSeparatorSize;
}

export interface IColspanParams {
    startColumn?: number;
    endColumn?: number;
    colspan?: number;
}

/**
 * @typedef {String} Controls/_grid/display/interface/IColumn/TTagStyle
 * @description Стиль тега
 * @variant info
 * @variant danger
 * @variant primary
 * @variant success
 * @variant warning
 * @variant secondary
 */
/*
 * @typedef {String} TTagStyle
 * @variant info
 * @variant danger
 * @variant primary
 * @variant success
 * @variant warning
 * @variant secondary
 */
export type TTagStyle = 'info' | 'danger' | 'primary' | 'success' | 'warning' | 'secondary';

/**
 * Интерфейс для конфигурации {@link /doc/platform/developmentapl/interface-development/controls/list/grid/columns/ колонки} в {@link Controls/grid:View таблице}.
 *
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @public
 */
export interface IColumn extends IColspanParams, ITagStyle {
    /**
     * @cfg Ширина колонки.
     * @remark
     * В качестве значения свойства можно указать пиксели (px), проценты (%), доли (1fr), "auto", "minmax", "max-content" и "min-content".
     * В значении "auto" ширина колонки устанавливается автоматически исходя из типа и содержимого элемента.
     * В значении "minmax(,)" ширина колонки устанавливается автоматически в рамках заданного интервала. Например, "minmax(600px, 1fr)" означает, что минимальная ширина колонки 600px, а максимальная — 1fr.
     * В значении "max-content" ширина колонки устанавливается автоматически в зависимости от самой большой ячейки. Например, если в первой строке ширина ячейки 100px, а во второй строке — 200px, тогда ширина колонки будет определена как 200px.
     * В значении "min-content" для колонки устанавливается наименьшая возможная ширина, при которой не возникает переполнения ячейки. Например, если в первой строке ячейка содержит контент "Первая строка", а во второй — "Содержимое второй строки" и включен перенос по словам, то ширина рассчитается по наиболее широкому непереносимому слову, а это слово "Содержимое" из второй строки.
     * Для браузеров, которые не поддерживают технологию {@link https://developer.mozilla.org/ru/docs/web/css/css_grid_layout CSS Grid Layout}, не работает ширина колонки, указанная в долях, "auto" или "minmax". Для таких браузеров используйте свойство {@link compatibleWidth}.
     * При установке ширины фиксированным колонкам рекомендуется использовать абсолютные величины (px). От конфигурации ширины фиксированных колонок зависит ширина скроллируемой области. Например, при установке ширины фиксированной колонки 1fr её контент может растянуться на всю ширину таблицы, и в результате не останется свободного пространства для скролла.
     * @see compatibleWidth
     */
    width?: string;
    /**
     * @cfg Минимальная ширина колонки.
     * @remark
     * В качестве значения свойства можно указать пиксели (px). Работает только {@link /docs/js/Controls/grid/View/options/resizerVisibility/ при включенном механизме изменения размеров колонок}.
     * @see Controls/_grid/Grid#resizerVisibility
     * @see maxWidth
     */
    minWidth?: number;
    /**
     * @cfg Максимальная ширина колонки.
     * @remark
     * В качестве значения свойства можно указать пиксели (px). Работает только {@link /docs/js/Controls/grid/View/options/resizerVisibility/ при включенном механизме изменения размеров колонок}.
     * @see Controls/_grid/Grid#resizerVisibility
     * @see minWidth
     */
    maxWidth?: number;
    /**
     * @cfg Имя поля, данные которого отображаются в колонке.
     * @demo Controls-demo/gridNew/Columns/CellNoClickable/Index В демо-примере в конфигурации колонок заданы свойства displayProperty со значениями number, country и capital.
     * @example
     * <pre class="brush: html; highlight: [6,11,12]">
     * <Controls.grid:View
     *     keyProperty="id"
     *     source="{{_viewSource}}">
     *     <ws:columns>
     *         <ws:Array>
     *             <ws:Object displayProperty="number" width="40px">
     *                 <ws:template>
     *                     <ws:partial template="Controls/grid:ColumnTemplate" clickable="{{false}}" itemData="{{itemData}}"/>
     *                 </ws:template>
     *             </ws:Object>
     *             <ws:Object displayProperty="country" width="300px"/>
     *             <ws:Object displayProperty="capital" width="max-content" compatibleWidth="98px">
     *                 <ws:template>
     *                     <ws:partial template="Controls/grid:ColumnTemplate" clickable="{{false}}" itemData="{{itemData}}"/>
     *                 </ws:template>
     *             </ws:Object>
     *         </ws:Array>
     *     </ws:columns>
     * </Controls.grid:View>
     * </pre>
     * <pre class="brush: js; highlight: [8,9,10]">
     * protected _beforeMount(): void {
     *     this._viewSource = new Memory({
     *         keyProperty: 'id',
     *         // tslint:disable-next-line
     *         data: [
     *             {
     *                 id: 0,
     *                 number: 1,
     *                 country: 'Россия',
     *                 capital: 'Москва',
     *                 population: 143420300,
     *                 square: 17075200,
     *                 populationDensity: 8
     *             },
     *             ...
     *         ]
     *     });
     * }
     * </pre>
     * @see template
     */
    displayProperty?: string;
    /**
     * @cfg Ширина колонки в браузерах, не поддерживающих {@link https://developer.mozilla.org/ru/docs/web/css/css_grid_layout CSS Grid Layout}.
     * @remark
     * В качестве значения свойства можно указать только пиксели (px) или проценты (%). Если свойство не задано, применяется значение "auto".
     * @demo Controls-demo/gridNew/Columns/CellNoClickable/Index В демо-примере в конфигурации третьей колонки свойство compatibleWidth установлено в значение 98px.
     * @see width
     */
    compatibleWidth?: string;
    /**
     * @cfg Шаблон отображения ячейки.
     * @default undefined
     * @markdown
     * @remark
     * Позволяет установить пользовательский шаблон отображения ячейки (**именно шаблон**, а не контрол!). При установке шаблона **ОБЯЗАТЕЛЕН** вызов базового шаблона {@link Controls/grid:ColumnTemplate}.
     *
     * По умолчанию Controls/grid:ColumnTemplate отображает значение поля, имя которого задано в конфигурации колонки в свойстве {@link displayProperty}. Также шаблон Controls/grid:ColumnTemplate поддерживает {@link Controls/grid:ColumnTemplate параметры}, с помощью которых можно изменить отображение ячейки.
     *
     * При настройке пользовательского шаблона следует использовать директиву {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-partial ws:partial}. Также в опцию template можно передавать и более сложные шаблоны, которые содержат иные директивы, например {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-if ws:if}. В этом случае каждая ветка вычисления шаблона должна заканчиваться директивой ws:partial, которая встраивает Controls/grid:ColumnTemplate.
     *
     * Дополнительно о работе с шаблоном вы можете прочитать в {@link /doc/platform/developmentapl/interface-development/controls/list/grid/columns/template/ руководстве разработчика}.
     * @see Controls/grid:ColumnTemplate
     * @demo Controls-demo/gridNew/Columns/Template/Index В демо-примере в конфигурации первой колонки задан пользовательский шаблон отображения ячейки. В конфигурации шаблона переопределён контент ячейки в опции contentTemplate.
     * @example
     * В следующем примере показано, что шаблон отображения ячейки колонки задаётся из отдельного WML-файла.
     * <pre class="brush: js">
     * import * as countryRatingNumber from 'wml!Controls-demo/gridNew/resources/CellTemplates/CountryRatingNumber';
     * ...
     * protected _columns: IColumn[] = [
     *     {
     *         displayProperty: 'number',
     *         template: countryRatingNumber
     *     },
     *     ...
     * ]
     * </pre>
     *
     * <pre class="brush: html; highlight: [5]">
     * <!-- WML -->
     * <Controls.grid:View
     *     keyProperty="id"
     *     source="{{_viewSource}}"
     *     columns="{{_columns}}" />
     * </pre>
     *
     * <pre class="brush: html">
     * <!-- CountryRatingNumber.wml -->
     * <ws:partial template="Controls/grid:ColumnTemplate" itemData="{{itemData}}">
     *     <ws:contentTemplate>
     *         <span style="color: #f60">№ {{item.contents['number']}}</span>
     *     </ws:contentTemplate>
     * </ws:partial>
     * </pre>
     * @see resultTemplate
     */
    template?: TemplateFunction | string | JSX.Element;
    reactContentTemplate?: FunctionComponent;
    /**
     * @cfg Шаблон отображения редактора ячейки при активном редактировании по месту.
     * @default undefined
     * @markdown
     * @remark
     * Позволяет установить пользовательский шаблон редактора ячейки.
     *
     * @demo Controls-demo/gridNew/EditInPlace/EditingTemplateFromColumn/Index В демо-примере в конфигурации колонок заданы пользовательские шаблоны редакторов.
     * @example
     * В следующем примере показано, что шаблон шаблон редактора ячейки задаётся из отдельного WML-файла.
     * <pre class="brush: js">
     * import * as EditorTemplate from 'wml!Controls-demo/gridNew/EditInPlace/EditingTemplateFromColumn/EditorTemplate';
     * ...
     * protected _columns: IColumn[] = [
     *     {
     *         displayProperty: 'number',
     *         editorTemplate: EditorTemplate
     *     },
     *     ...
     * ]
     * </pre>
     *
     * <pre class="brush: html; highlight: [5]">
     * <!-- WML -->
     * <Controls.grid:View
     *     keyProperty="id"
     *     source="{{_viewSource}}"
     *     columns="{{_columns}}" />
     * </pre>
     *
     * <pre class="brush: html">
     * <!-- EditorTemplate.wml -->
     * <Controls.input:Text bind:value="editorTemplate.item.contents['title']"
     *                      contrastBackground="{{true}}"/>
     * </pre>
     */
    editorTemplate?: TemplateFunction | string;
    /**
     * @cfg Объект с опциями для колонки.
     * @remark
     * Позволяет передать дополнительные настройки в шаблон колонки, которые будут доступны в области видимости шаблона.
     * Необходимо использовать для кастомизации шаблона колонки, в случаях когда нужно избежать дублирования кода.
     * @example
     * В следующем примере показано как использовать templateOptions для кастомизации цвета текста в колонке.
     *
     * <pre class="brush: js">
     * import * as exampleTemplate 'wml!.../ExampleColumn';
     * ...
     * protected _columns: IColumn[] = [
     *     {
     *         template: exampleTemplate
     *         templateOptions: {
     *             displayProperty: 'price',
     *             style: 'primary'
     *         }
     *     },
     *     {
     *         template: exampleTemplate
     *         templateOptions: {
     *             displayProperty: 'sum',
     *             style: 'secondary'
     *         }
     *     },
     *     ...
     * ]
     * </pre>
     *
     * <pre class="brush: html; highlight: [4]">
     * <!-- ExampleColumn.wml -->
     * <Controls.grid:ColumnTemplate itemData="{{itemData}}">
     *     <ws:contentTemplate>
     *         <div class="controls-text-{{style}}_theme-{{_options.theme}}">{{item.contents[displayProperty]}}</div>
     *     </ws:contentTemplate>
     * </Controls.grid:ColumnTemplate>
     * </pre>
     */
    templateOptions?: { [key: string]: unknown };
    /**
     * @cfg Шаблон отображения ячейки в {@link /doc/platform/developmentapl/interface-development/controls/list/grid/results/ строке итогов}.
     * @default undefined
     * @demo Controls-demo/gridNew/Results/FromMeta/CustomResultsCells/Index
     * @markdown
     * @remark
     * Позволяет установить пользовательский шаблон отображения ячейки в строке итогов (именно шаблон, а не контрол!). При установке шаблона **ОБЯЗАТЕЛЕН** вызов базового шаблона {@link Controls/grid:ResultColumnTemplate}.
     *
     * Также шаблон {@link Controls/grid:ResultColumnTemplate} поддерживает параметры, с помощью которых можно изменить отображение ячейки.
     *
     * В разделе "Примеры" показано как с помощью директивы {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-partial ws:partial} задать пользовательский шаблон. Также в опцию resultTemplate можно передавать и более сложные шаблоны, которые содержат иные директивы, например {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-if ws:if}. В этом случае каждая ветка вычисления шаблона должна заканчиваться директивой ws:partial, которая встраивает Controls/grid:ResultColumnTemplate.
     *
     * Дополнительно о работе с шаблоном вы можете прочитать в {@link /doc/platform/developmentapl/interface-development/controls/list/grid/results/template/ руководстве разработчика}.
     *
     * Для отображения строки итогов необходимо задать значение в опции {@link Controls/grid:View#resultsPosition resultsPosition}.
     * @example
     * <pre class="brush: html; highlight: [5,6,7,8,9,10,11]">
     * <Controls.grid:View source="{{_viewSource}}">
     *     <ws:columns>
     *         <ws:Array>
     *             <ws:Object displayProperty="Name">
     *                 <ws:resultTemplate>
     *                     <ws:partial template="Controls/grid:ResultColumnTemplate">
     *                         <div title="{{resultTemplate.results.get('Name')}}">
     *                             {{resultTemplate.results.get('Name')}}
     *                         </div>
     *                     </ws:partial>
     *                 </ws:resultTemplate>
     *             </ws:Object>
     *         </ws:Array>
     *     </ws:columns>
     * </Controls.grid:View>
     * </pre>
     * @see template
     */
    resultTemplate?: TemplateFunction | string;
    /**
     * @cfg Объект с опциями для шаблона итогов колонки.
     * @remark
     * Позволяет передать дополнительные настройки в шаблон итогов колонки, которые будут доступны в области видимости шаблона.
     * Необходимо использовать для кастомизации шаблона итогов колонки, в случаях когда нужно избежать дублирования кода.
     *
     * По умолчанию при видимой {@link Controls/_treeGrid/TreeGrid#expanderVisibility кнопке разворота узла} в первую ячейку итогов таблицы добавляется отступ, позволяющий отобразить содержимое на одоной вертикаоьной линии.
     * Для того, чтобы убрать этот отступ, необходимо передать параметр withoutExpanderPadding и присвоить ему значение true.
     *
     * @example
     * В следующем примере показано как использовать resultTemplateOptions для кастомизации цвета текста в шаблоне итогов колонки.
     *
     * <pre class="brush: js">
     * import * as exampleTemplate 'wml!.../ExampleResultColumn';
     * ...
     * protected _columns: IColumn[] = [
     *     {
     *         ...
     *         resultTemplate: exampleTemplate
     *         resultTemplateOptions: {
     *             style: 'primary'
     *         }
     *     },
     *     {
     *         ...
     *        resultTemplate: exampleTemplate
     *         resultTemplateOptions: {
     *             style: 'secondary'
     *         }
     *     },
     *     ...
     * ]
     * </pre>
     *
     * <pre class="brush: html; highlight: [4]">
     * <!-- ExampleColumn.wml -->
     * <ws:partial template="Controls/grid:ResultColumnTemplate">
     *      <div title="{{resultTemplate.results.get('Name')}}"
     *           class="controls-text-{{style}}_theme-{{_options.theme}}">
     *          {{resultTemplate.results.get('Name')}}
     *      </div>
     * </ws:partial>
     * </pre>
     */
    resultTemplateOptions?: { [key: string]: unknown };
    /**
     * @cfg {TCellHorizontalAlign} Горизонтальное выравнивание для содержимого ячейки.
     * @default left
     * @variant left По левому краю.
     * @variant center По центру.
     * @variant right По правому краю.
     * @demo Controls-demo/gridNew/Columns/Align/Index В демо-примере для каждой колонки задано собственное выравнивание содержимого ячеек.
     * @see valign
     */
    align?: TCellHorizontalAlign;
    /**
     * @cfg {TCellVerticalAlign} Вертикальное выравнивание для содержимого ячейки.
     * @default baseline
     * @variant top По верхнему краю.
     * @variant center По центру.
     * @variant bottom По нижнему краю.
     * @variant baseline По базовой линии.
     * @demo Controls-demo/gridNew/Columns/Valign/Index В демо-примере для каждой колонки задано собственное выравнивание содержимого ячеек.
     * @remark
     * См. {@link https://developer.mozilla.org/ru/docs/Web/CSS/align-items align-items}.
     * @see align
     */
    valign?: TCellVerticalAlign;
    /**
     * @cfg Имя поля, которое используется для настройки прилипания данных колонки к верхней границе таблицы. Чтобы сделать прилипание по двум полям в одной колонке, нужно передать массив из двух строк.
     * Прилипание работает только для первой колонки таблицы.
     * @remark Подробнее о настройке колонок с прилипанием читайте в {@link /doc/platform/developmentapl/interface-development/controls/list/grid/ladder/#sticky руководстве разработчика}.
     * @default undefined
     * @demo Controls-demo/gridNew/LadderStickyMultiline/StickyMultilineWithHeader/Index В демо-примере лесенка и прилипание данных работает для колонок "photo" и "time".
     * @demo Controls-demo/gridNew/Ladder/Sticky/Index В демо-примере отображение лесенкой включено для колонок "photo" (первая колонка) и "date" (последняя колонка). Прилипание данных работает для колонки photo.
     * @see Controls/grid:IGridControl#ladderProperties
     */
    stickyProperty?: string | string[];
    /**
     * @cfg {TOverflow} Как отображается текст, если он не умещается в ячейке.
     * @default none
     * @variant ellipsis Текст обрезается многоточием.
     * @variant none Текст разбивается на несколько строк.
     * @demo Controls-demo/gridNew/Columns/TextOverflow/Ellipsis/Index В демо-примере для первой колонки свойство textOverflow установлено в значение ellipsis.
     */
    textOverflow?: TOverflow;
    /**
     * @cfg {IColumnSeparatorSizeConfig} Ширина вертикальных разделителей колонок.
     * @default none
     * @remark
     * Ширину линии-разделителя между двумя колонками можно задать на любой из них (левую или правую соответственно).
     * В случае, если одна и та же граница была определена на двух ячейках, приоритет отдается ячейке, для которой эта граница является левой.
     * Опция {@link Controls/grid:IColumn#columnSeparatorSize columnSeparatorSize} на колонке является приоритетной по сравнению с опцией {@link Controls/grid:View#columnSeparatorSize columnSeparatorSize} на таблице.
     * @example
     * Разделитель только между первой и второй колонками.
     * <pre class="brush: html; highlight: [5,10]">
     * <Controls.grid:View
     *     keyProperty="id"
     *     source="{{_viewSource}}"
     *     columns="{{_columns}}"
     *     columnSeparatorSize="s">
     *     <ws:columns>
     *         <ws:Array>
     *             <ws:Object .../>
     *             <ws:Object .../>
     *             <ws:Object ... columnSeparatorSize="{{ {left: null, right: null} }}" />
     *             <ws:Object .../>
     *         </ws:Array>
     *     </ws:columns>
     * </Controls.grid:View>
     * </pre>
     * @demo Controls-demo/gridNew/ColumnSeparator/WithMultiHeader/Index В демо-примере ширина вертикальных разделителей колонок задана с размером "s".
     * @see Controls/list:IList#rowSeparatorSize
     * @see Controls/grid:IGridControl#columnSeparatorSize
     */
    columnSeparatorSize?: IColumnSeparatorSizeConfig;
    /**
     * @cfg {Controls/grid:ICellPadding} Конфигурация левого и правого отступа в ячейках колонки, исключая левый отступ первой и правый последней ячейки.
     * @example
     * <pre class="brush: js; highlight: [6,7,8,14,15,16,17]">
     * columns: [
     *     {
     *         displayProperty: 'number',
     *         width: '100px',
     *         template: itemCountr,
     *         cellPadding: {
     *             right: 's'
     *         }
     *     },
     *     {
     *         displayProperty: 'country',
     *         width: '100px',
     *         template: itemTpl,
     *         cellPadding: {
     *             left: 's',
     *             right: 'null'
     *         }
     *     },
     *     {
     *         displayProperty: 'capital',
     *         width: '100px'
     *     }
     * ]
     * </pre>
     * @demo Controls-demo/gridNew/CellPadding/Index В демо-примере в конфигурации колонок заданы различные отступы для ячеек колонок.
     * @see template
     */
    cellPadding?: ICellPadding;
    /**
     * @cfg {String} Имя свойства, содержащего стиль тега.
     * @demo Controls-demo/gridNew/TagStyle/TagStyleFromCellData/Index
     */
    tagStyleProperty?: string;
    /**
     * @cfg Тип данных, отображаемых колонкой.
     * @variant money Деньги. Данные колонки будут отформатированы с помощью декоратора {@link Controls/baseDecorator:Money}.
     * @variant number Число. Данные колонки будут отформатированы с помощью декоратора {@link Controls/baseDecorator:Number}.
     * @variant date Дата. Данные колонки будут отформатированы с помощью декоратора {@link Controls/baseDecorator:Date}.
     * @variant string Строка.
     * @default string
     * @remark
     * Конфигурация декоратора задается в опции {@link displayTypeOptions}.
     * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/grid/columns/visual/type/ здесь}.
     * @example
     * В следующем примере показано как отобразить поле записи типа "число"
     *
     * <pre class="brush: js; highlight: [6]">
     * // TypeScript
     * ...
     * protected _columns: IColumn[] = [
     *     {
     *         displayProperty: 'price',
     *         displayType: 'number'
     *     }
     * ]
     * </pre>
     * @see displayTypeOptions
     * @see tooltipProperty
     */
    displayType?: string;
    /**
     * @cfg Конфигурация декоратора (см. {@link displayType}), который используется для отображения данных в колонке.
     * @example
     * В следующем примере показано как отключить подсветку данных при поиске.
     *
     * <pre class="brush: js">
     * // TypeScript
     * protected _columns: IColumn[] = [
     *     {
     *         displayProperty: 'price',
     *         displayType: 'string',
     *         displayTypeOptions: {
     *             searchHighlight: false
     *         }
     *     },
     * ]
     * </pre>
     *
     * В следующем примере показано как отобразить поле записи типа "деньги" без группировки триад цифр.
     *
     * <pre class="brush: js">
     * // TypeScript
     * protected _columns: IColumn[] = [
     *     {
     *         displayProperty: 'price',
     *         displayType: 'money',
     *         displayTypeOptions: {
     *             useGrouping: false
     *         }
     *     },
     *     ...
     * ]
     * </pre>
     * @see displayType
     */
    displayTypeOptions?: IDisplayTypeOptions;
    /**
     * @cfg {Controls/interface/TFontColorStyle.typedef} Стиль цвета текста ячейки.
     * @demo Controls-demo/gridNew/Columns/FontColorStyle/Index
     * @remark
     * Стиль цвета текста ячейки имеет больший приоритет, чем {@link Controls/_grid/interface/ItemTemplate#fontColorStyle стиль цвета текста записи}.
     */
    fontColorStyle?: TFontColorStyle;
    /**
     * @cfg {Controls/_interface/IBackgroundStyle/TBackgroundStyle.typedef} Цвет фона колонки.
     * @demo Controls-demo/gridNew/Columns/BackgroundColorStyle/Index
     * @see hoverBackgroundStyle
     */
    backgroundColorStyle?: TBackgroundStyle;
    /**
     * @cfg {Controls/_interface/IBackgroundStyle/TBackgroundStyle.typedef} Цвет фона колонки при наведении курсора мыши.
     *
     * @remark
     * Позволяет определить произвольный фон колонки при наведении.
     * Поддерживается стандартная палитра цветов ховера.
     * Для отключения цвета при наведении используйте значение "transparent"
     * Для определения собственных цветов при наведении, необходимо указать специальный hoverBackgroundStyle, а
     * также определить в своем less-файле стиль controls-hover-background-@{yourBackgroundStyle}.
     * @demo Controls-demo/gridNew/Columns/HoverBackgroundStyle/Index
     * @see backgroundColorStyle
     */
    hoverBackgroundStyle?: TBackgroundStyle;
    /**
     * @cfg Поле с текстом подсказки при наведении на ячейку
     * @demo Controls-demo/gridNew/Columns/Tooltip/Index
     */
    tooltipProperty?: string;
    /**
     * @cfg {Controls/_interface/IFontSize/TFontSize.typedef} Размер шрифта.
     * @default "l". Для контрола {@link Controls/treeGrid:View}: "m" (для листа), "xl" (для скрытого узла) и "2xl" (для узла).
     * @remark
     * Размер шрифта ячейки имеет больший приоритет, чем {@link Controls/_grid/interface/ItemTemplate#fontSize размер шрифта записи}.
     * @demo Controls-demo/gridNew/Columns/FontSize/Index
     */
    fontSize?: TFontSize;
    /**
     * @cfg {Controls/interface/TFontWeight.typedef} Насыщенность шрифта.
     * @default "default".
     * @demo Controls-demo/gridNew/Columns/FontWeight/Index
     * @remark
     * Насыщенность шрифта ячейки имеет больший приоритет, чем {@link Controls/_grid/interface/ItemTemplate#fontWeight Насыщенность шрифта записи}.
     */
    fontWeight?: TFontWeight;
    /**
     * @cfg {Boolean} Позволяет пометить ячейку нередактируемой при включенном {@link Controls/_grid/interface/IGridEditingConfig#mode редактировании отдельных ячеек}.
     * @default true
     */
    editable?: boolean;
    /*
     * Базовая линия итогов. Необходимо для выравнивания итогов в одну строку с functionalButton.
     */
    resultBaseline?: string;
}
