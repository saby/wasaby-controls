/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { IList } from 'Controls/baseList';
import { TColumns } from './IColumn';
import { IHeaderCell } from './IHeaderCell';
import { IFooterColumn } from './IFooterColumn';
import { TemplateFunction } from 'UI/Base';
import { TGroupViewMode } from 'Controls/display';

type HeaderVisibility = 'hasdata' | 'visible';

/**
 * Варианты значений позиции итогов таблицы
 * @typedef Controls/_baseGrid/display/interface/IGridControl/TResultsPosition
 * @variant top Итоги отображаются в верхней части таблицы, под шапкой
 * @variant bottom Итоги отображаются в нижней части таблицы, над подвалом
 */
export type TResultsPosition = 'top' | 'bottom';

/**
 * Интерфейс для контрола {@link Controls/grid:View Таблица}.
 * @public
 */
export interface IGridControl extends IList {
    columns: TColumns;
    header?: IHeaderCell[];
    headerVisibility?: HeaderVisibility;
    footer?: IFooterColumn[];
    emptyTemplate?: TemplateFunction | string;
    stickyColumnsCount?: number;
    columnScroll?: boolean;
    emptyTemplateColumns?: TemplateFunction | string;

    /**
     * Режим отображения группировки.
     * @cfg
     * @default default
     * @demo Controls-demo/gridNew/Grouped/groupViewMode/blocks/Index В следующем примере группировка отображается в виде блоков.
     * @demo Controls-demo/gridNew/Grouped/groupViewMode/titledBlocks/Index В следующем примере группировка отображается в виде блоков, включающих заголовок группы.
     */
    groupViewMode?: TGroupViewMode;
    /**
     * Опция, определяющая возможность сброса сортировки
     * @cfg
     * @default true
     * @demo Controls-demo/gridNew/Sorting/WI/canResetSorting/Index
     */
    canResetSorting?: boolean;
}

/*
 * Interface for Grid (table view).
 *
 * @interface Controls/_baseGrid/display/interface/IGridControl
 * @public
 * @author Авраменко А.С.
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#ladderProperties
 * @cfg {Array.<String>} Массив с именами полей, по которым строится {@link /doc/platform/developmentapl/interface-development/controls/list/grid/ladder/ лесенка}.
 * @demo Controls-demo/gridNew/Ladder/BasicLadder/Index В демо-примере настроено отображение лесенки без использования прикладных шаблонов.
 * @demo Controls-demo/gridNew/Ladder/Sticky/Index В демо-примере настроено отображение данных "лесенкой" для свойств "photo" и "date". Дополнительно включено прилипание заголовка таблицы, а также прилипание по первой колонке (см. {@link Controls/grid:IColumn#stickyProperty stickyProperty}).
 * @demo Controls-demo/gridNew/LadderStickyMultiline/StickyMultiline/Index В демо-примере настроено отображение данных "лесенкой" для свойств "date" и "time". Дополнительно включено прилипание по первой колонке.
 * @example
 * <pre class="brush: js">
 * protected _ladderProperties: string[] = ['date', 'time'];
 * </pre>
 * <pre class="brush: html; highlight: [6]">
 * <Controls.grid:View
 *     keyProperty="id"
 *     source="{{_viewSource}}"
 *     columns="{{_columns}}"
 *     header="{{_header}}"
 *     ladderProperties="{{_ladderProperties}}"/>
 * </pre>
 * @remark
 * Подробнее о конфигурации лесенки читайте в {@link /doc/platform/developmentapl/interface-development/controls/list/grid/ladder/ руководстве разработчика}.
 * @see Controls/grid:IColumn#stickyProperty
 * @markdown
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#ladderMode
 * @cfg {String} Режим, в котором следует скрывать повторяющиеся элементы при применении лесенки.
 * @variant visibility - элемент скрывается при помощи visibility: hidden, с сохранением за ним пустого места. Режим по-умолчанию.
 * @variant display - элемент скрывается при помощи display: none и не занимает места в шаблоне.
 */

/*
 * @name Controls/_baseGrid/display/interface/IGridControl#ladderProperties
 * @cfg {Array.<String>} Array of fields that should be sticky.
 * @demo Controls-demo/gridNew/Ladder/Sticky/Index
 * @demo Controls-demo/gridNew/LadderStickyMultiline/StickyMultiline/Index
 * @example
 * Set ladderProperties and render item template through the ladderWrapper:
 * <pre>
 *    <div class="demoGrid">
 *       <Controls.grid:View
 *          ...
 *          ladderProperties="{{ ['date'] }}">
 *          <ws:columns>
 *             <ws:Array>
 *                <ws:Object width="1fr">
 *                   <ws:template>
 *                      <ws:partial template="Controls/grid:ColumnTemplate">
 *                         <ws:contentTemplate>
 *                            <ws:partial template="{{template.ladderWrapper}}" ladderProperty="date">
 *                               <div class="demoGrid__date">
 *                                  {{template.item.contents['date']}}
 *                               </div>
 *                            </ws:partial>
 *                         </ws:contentTemplate>
 *                      </ws:partial>
 *                   </ws:template>
 *                </ws:Object>
 *             </ws:Array>
 *          </ws:columns>
 *       </Controls.grid:View>
 *    </div>
 * </pre>
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#header
 * @cfg {Array.<Controls/grid:IHeaderCell>} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/ шапки} таблицы.
 * @demo Controls-demo/gridNew/Header/Default/Index
 * @example
 * Пример 1. Для первой ячейки задаём пользовательский шаблон.
 * <pre class="brush: html; highlight: [2,3,4,5,6,7,8]">
 *    <Controls.grid:View>
 *       <ws:header>
 *          <ws:Array>
 *              <ws:object>
 *                  <ws:template>
 *                      <ws:partial template="Controls/grid:HeaderContent" attr:class="controls-Grid__cell_spacing_money"  scope="{{_options}}" />
 *                  </ws:template>
 *             <ws:object>
 *          </ws:Array>
 *       </ws:header>
 *    </Controls.grid:View>
 * </pre>
 * @example
 * Пример 2. Настройка опции задаётся в хуке и передаётся в шаблон.
 * <pre class="brush: js">
 * _header: null,
 * _beforeMount: function(options) {
 *    this._header = [
 *       {
 *          caption: 'Name',
 *          startRow: 1,
 *          endRow: 3,
 *          startColumn: 1,
 *          endColumn: 2
 *       },
 *       {
 *          caption: 'Price',
 *          startRow: 1,
 *          endRow: 2,
 *          startColumn: 2,
 *          endColumn: 4
 *       },
 *       {
 *          caption: 'Cell',
 *          startRow: 2,
 *          endRow: 3,
 *          startColumn: 2,
 *          endColumn: 3
 *       },
 *       {
 *          caption: 'Residue',
 *          startRow: 2,
 *          endRow: 3,
 *          startColumn: 3,
 *          endColumn: 4
 *       }
 *    ]
 * }
 * </pre>
 */

/*
 * @name Controls/_baseGrid/display/interface/IGridControl#header
 * @cfg {Array.<HeaderCell>} Describes grid's header.
 * @demo Controls-demo/gridNew/Header/Default/Index
 * @remark
 * Base header content template for Controls/grid:View: "Controls/grid:HeaderContent".
 * @example
 * Add header text spacing for columns with money fields:
 * <pre>
 *    <ws:partial template="Controls/grid:HeaderContent" attr:class="controls-Grid__cell_spacing_money" scope="{{_options}}" />
 * </pre>
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#columns
 * @cfg {Array.<Controls/grid:IColumn>} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/grid/columns/ колонок} таблицы.
 * @remark
 * Если при отрисовске контрола данные не отображаются или выводится только их часть, то следует проверить {@link Controls/collection:RecordSet}, полученный от {@link /doc/platform/developmentapl/interface-development/controls/list/source/ источника данных}.
 * Такой RecordSet должен содержать набор полей, которые заданы в конфигурации контрола в опции columns, а также сами данные для каждого поля.
 * @example
 * <pre class="brush: js">
 * _columns: null,
 * _beforeMount: function() {
 *    this._columns = [
 *       {
 *          displayProperty: 'name',
 *          width: '1fr',
 *          align: 'left',
 *          template: _customNameTemplate
 *       },
 *       {
 *          displayProperty: 'balance',
 *          align: 'right',
 *          width: 'auto',
 *          resutTemplate: _customResultTemplate,
 *          result: 12340
 *       }
 *    ];
 * }
 * </pre>
 * <pre class="brush: html">
 *  <Controls.grid:View columns="{{_columns}}" />
 * </pre>
 */

/*
 * @name Controls/_baseGrid/display/interface/IGridControl#columns
 * @cfg {TColumns} Describes grid's columns.
 * @remark Before rendering, make sure that {@link Controls/display:Collection Collection} contains required data, when the {@link Controls/_baseGrid/display/interface/IGridControl#columns columns} option changes. Call asynchronous 'reload' method before changing {@link Controls/_baseGrid/display/interface/IGridControl#columns columns} option, if necessary.
 * @example
 * <pre>
 * _columns = [
 * {
 *     displayProperty: 'name',
 *     width: '1fr',
 *     align: 'left',
 *     template: _customNameTemplate
 * },
 * {
 *     displayProperty: 'balance',
 *     align: 'right',
 *     width: 'auto',
 *     resutTemplate: '_customResultTemplate',
 *     result: 12340
 * }
 * ];
 * </pre>
 * <pre>
 *  <Controls.grid:View
 *      ...
 *      columns="{{_columns}}">
 *  </Controls.grid:View>
 * </pre>
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#footer
 * @cfg {Array.<Controls/_baseGrid/display/interface/IFooterColumn>} Конфигурация колонок {@link /doc/platform/developmentapl/interface-development/controls/list/grid/footer/ подвала таблицы}.
 */

/*
 * @name Controls/_baseGrid/display/interface/IGridControl#footer
 * @cfg {TColumns} Describes the columns in the footer of the table.
 * @example
 * <pre class="brush: js">
 * _columns: null,
 * _beforeMount: function() {
 *    this._columns = getGridColumns();
 *    // this._columns.length === 10
 * }
 * </pre>
 *
 * <pre class="brush: html">
 *  <Controls.grid:View ...>
 *      <ws:footer>
 *          <ws:Array>
 *              <ws:Object startColumn="{{ 2 }}">
 *                  <ws:template>
 *                      <div>Footer column 2 - 4</div>
 *                  </ws:template>
 *              </ws:Object>
 *              <ws:Object startColumn="{{ 4 }}" endColumn="{{ 6 }}">
 *                  <ws:template>
 *                      <div>Footer column 4 - 6</div>
 *                  </ws:template>
 *              </ws:Object>
 *              <ws:Object endColumn="{{ 8 }}" >
 *                  <ws:template>
 *                      <div>Footer column 6 - 8</div>
 *                  </ws:template>
 *              </ws:Object>
 *              </ws:Array>
 *          </ws:footer>
 *      </Controls.grid:View>
 * </pre>
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#stickyHeader
 * @cfg {Boolean} Закрепляет {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/ шапку} таблицы.
 * @demo Controls-demo/gridNew/Header/NoSticky/Index В демо-примере опция stickyHeader установлена в значение false.
 * @demo Controls-demo/gridNew/Header/Sticky/Index В демо-примере опция stickyHeader установлена в значение true.
 * @default true
 */

/*
 * @name Controls/_baseGrid/display/interface/IGridControl#stickyHeader
 * @cfg {Boolean} Fix the table header.
 * @demo Controls-demo/gridNew/Header/Sticky/Index
 * @demo Controls-demo/gridNew/Header/NoSticky/Index
 * @default true
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#columnScroll
 * @cfg {Boolean} Включает {@link /doc/platform/developmentapl/interface-development/controls/list/grid/horizontal-scrolling/ горизонтальную прокрутку} колонок.
 * @default false
 * @see Controls/_baseGrid/display/interface/IGridControl#columnScrollStartPosition
 * @see Controls/_baseGrid/display/interface/IGridControl#stickyColumnsCount
 */

/*
 * @name Controls/_baseGrid/display/interface/IGridControl#columnScroll
 * @cfg {Boolean} Enable column scroll.
 * @default false
 * @see Controls/_baseGrid/display/interface/IGridControl#columnScrollStartPosition
 * @see Controls/_baseGrid/display/interface/IGridControl#stickyColumnsCount
 */

/**
 * @typedef {String} Controls/_baseGrid/display/interface/IGridControl/ColumnScrollStartPosition
 * @description Допустимые значения для опции {@link columnScrollStartPosition}.
 * @variant start Устанавливает горизонтальную прокрутку в начальное (крайнее левое) положение.
 * @variant end Устанавливает горизонтальную прокрутку в конечное (крайнее правое) положение.
 */

/*
 * @typedef {String} ColumnScrollStartPosition
 * @variant start Puts horizontal scroll into the leftmost position.
 * @variant end Puts horizontal scroll into the rightmost position.
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#columnScrollStartPosition
 * @cfg {Controls/_baseGrid/display/interface/IGridControl/ColumnScrollStartPosition.typedef} Начальное положение {@link /doc/platform/developmentapl/interface-development/controls/list/grid/horizontal-scrolling/ горизонтальной прокрутки} колонок.
 * @default start
 * @see columnScroll
 * @see stickyColumnsCount
 * @see dragScrolling
 */

/*
 * @name Controls/_baseGrid/display/interface/IGridControl#columnScrollStartPosition
 * @cfg {Controls/_baseGrid/display/interface/IGridControl/ColumnScrollStartPosition.typedef} Determines the starting columns scroll position if it is enabled.
 * @default start
 * @see Controls/_baseGrid/display/interface/IGridControl#columnScroll
 */

/**
 * @typedef {String} Controls/_baseGrid/display/interface/IGridControl/TColumnScrollViewMode
 * @description Допустимые значения для опции {@link columnScrollViewMode}.
 * @variant scrollbar Отображается ползунок горизонтальной прокрутки.
 * @variant arrows Отображаются стрелки навигации для горизонтальной прокрутки.
 * @variant unaccented Элементы управления прокруткой скрыты, прокручиваемая область не выделяется тенью справа и слева.
 * @see dragScrolling
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#columnScrollViewMode
 * @cfg {Controls/_baseGrid/display/interface/IGridControl/TColumnScrollViewMode.typedef} Режим отображения {@link /doc/platform/developmentapl/interface-development/controls/list/grid/horizontal-scrolling/ горизонтальной прокрутки} колонок в таблице.
 * @default scrollBar
 * @see columnScroll
 */

/**
 * @typedef {String} Controls/_baseGrid/display/interface/IGridControl/TAutoScrollMode
 * @description Допустимые значения для опции {@link columnScrollAutoScrollMode}.
 * @variant mostVisible Подскролл происходит ближайшему наиболее видимому элементу по направлению скролла.
 * @variant closest Подскролл происходит ближайшему элементу по направлению скролла.
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#columnScrollAutoScrollMode
 * @cfg {Controls/_baseGrid/display/interface/IGridControl/TAutoScrollMode.typedef} Режим автоподскрола при завершении скроллирования.
 * @default closest
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#stickyColumnsCount
 * @cfg {Number} Количество зафиксированных колонок, которые не двигаются при {@link /doc/platform/developmentapl/interface-development/controls/list/grid/horizontal-scrolling/ горизонтальной прокрутке}.
 * @default 1
 * @remark
 * Колонка с чекбоксами {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/ множественного выбора} всегда зафиксирована и не входит в число stickyColumnsCount.
 * @demo Controls-demo/gridNew/ColumnScroll/Base/Index
 * @see columnScroll
 * @see columnScrollStartPosition
 * @see dragScrolling
 */

/*
 * @name Controls/_baseGrid/display/interface/IGridControl#stickyColumnsCount
 * @cfg {Number} Determines the number of fixed columns that do not move during horizontal scroll.
 * @default 1
 * @see Controls/_baseGrid/display/interface/IGridControl#columnScroll
 * @remark
 * Multiple selection column is always fixed and does not count towards this number.
 * @demo Controls-demo/gridNew/ColumnScroll/Base/Index
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#dragScrolling
 * @cfg {Boolean} Включает скроллирование колонок перетаскиванием при {@link /doc/platform/developmentapl/interface-development/controls/list/grid/horizontal-scrolling/ горизонтальной прокрутке}.
 * @remark По умолчанию прокрутка колонок перетаскиванием включена, если в списке нет Drag'N'Drop записей.
 * @default true
 * @see columnScroll
 * @see stickyColumnsCount
 * @see columnScrollStartPosition
 */

/*
 * @name Controls/_baseGrid/display/interface/IGridControl#dragScrolling
 * @cfg {Boolean} Enable column drag scrolling in grid with column scroll.
 * @remark By default, column scrolling by drag and drop is enabled if there are no items Drag'N'Drop in the list.
 * @default true
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#stickyItemActions
 * @cfg {Boolean} Включает прилипание операций над записью к правому краю прокручиваемой области при горизонтальном скролле.
 * @default false
 */

/**
 * @typedef {String} Controls/_baseGrid/display/interface/IGridControl/RowSeparatorSize
 * @description Значения для опции {@link rowSeparatorSize}.
 * @variant s Тонкая линия-разделитель.
 * @variant l Толстая линия-разделитель.
 * @variant null Линия-разделитель не отображается.
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#rowSeparatorSize
 * @cfg {Controls/_baseGrid/display/interface/IGridControl/RowSeparatorSize.typedef|null} Толщина линии-разделителя строк.
 * @default null
 * @remark В значении null линия-разделители не отображается.
 * @see columnSeparatorSize
 */

/*
 * @name Controls/_baseGrid/display/interface/IGridControl#rowSeparatorSize
 * @cfg {RowSeparatorSize} set row separator height.
 * @variant s Thin row separator line.
 * @variant l Wide row separator line.
 * @variant null Without row separator line
 * @default null
 */

/**
 * @typedef {String} Controls/_baseGrid/display/interface/IGridControl/ColumnSeparatorSize
 * @variant s Тонкая линия-разделитель.
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#columnSeparatorSize
 * @cfg {Controls/_baseGrid/display/interface/IGridControl/ColumnSeparatorSize.typedef} Толщина {@link /doc/platform/developmentapl/interface-development/controls/list/grid/separator/#column линии-разделителя колонок}.
 * @remark В значении null линия-разделители не отображается.
 * @default null
 * @see rowSeparatorSize
 */

/*
 * @name Controls/_baseGrid/display/interface/IGridControl#columnSeparatorSize
 * @cfg {RowSeparatorSize} set column separator height.
 * @variant s Thin column separator line.
 * @variant null Without column separator line
 * @default null
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#resultsTemplate
 * @cfg {UI/Base:TemplateFunction|String} Пользовательский шаблон отображения {@link /doc/platform/developmentapl/interface-development/controls/list/grid/results/ строки итогов}.
 * @default undefined
 * @demo Controls-demo/gridNew/Results/ResultsTemplate/Index
 * @markdown
 * @remark
 * Позволяет установить пользовательский шаблон отображения строки итогов (именно шаблон, а не контрол!). При установке шаблона **ОБЯЗАТЕЛЕН** вызов базового шаблона Controls/grid:ResultsTemplate.
 *
 * В разделе "Примеры" показано как с помощью директивы {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-partial ws:partial} задать пользовательский шаблон. Также в опцию resultsTemplate можно передавать и более сложные шаблоны, которые содержат иные директивы, например {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-if ws:if}. В этом случае каждая ветка вычисления шаблона должна заканчиваться директивой ws:partial, которая встраивает Controls/grid:ResultTemplate.
 *
 * Дополнительно о работе с шаблоном вы можете прочитать в {@link /doc/platform/developmentapl/interface-development/controls/list/grid/results/template/ руководстве разработчика}.
 *
 * Для отображения строки итогов необходимо задать значение в опции {@link resultsPosition}.
 * @example
 * <pre class="brush: html;">
 * <Controls.grid:View source="{{_viewSource}}" columns="{{_columns}}" resultsPosition="top">
 *     <ws:resultsTemplate>
 *         <ws:partial template="Controls/grid:ResultsTemplate" scope="{{_options}}">
 *             <ws:contentTemplate>
 *                 <div>Итого: 2 страны с населением более миллиарда человек</div>
 *             </ws:contentTemplate>
 *         </ws:partial>
 *     </ws:resultsTemplate>
 * </Controls.grid:View>
 * </pre>
 * @see resultsPosition
 * @see resultsVisibility
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#resultsTemplateOptions
 * @cfg {Object} Объект с опциями для настройки шаблона строки итогов, сконфигурированного через {@link Controls/_baseGrid/display/interface/IGridControl#resultsTemplate resultsTemplate}.
 * @description
 * Позволяет передать дополнительные настройки в шаблон строки итогов, которые будут доступны в области видимости шаблона.
 * @example
 * <pre class="brush: html; highlight: [2]">
 * <!-- WML -->
 * <Controls.grid:View source="{{_viewSource}}">
 *     <ws:resultsTemplateOptions shownCountry="{{ _shownCountry }}"/>
 *     <ws:resultsTemplate>
 *         <ws:partial template="wml!CustomResults"/>
 *     </ws:resultsTemplate>
 * </Controls/grid:View>
 *
 * CustomResults.wml
 * <ws:partial template="Controls/grid:ResultsTemplate" scope="{{ _options }}">
 *     <ws:contentTemplate>
 *         <div>Итого: {{ shownCountry }} страны с населением более миллиарда человек</div>
 *     </ws:contentTemplate>
 * </ws:partial>
 * </pre>
 * @default undefined
 * @see resultsTemplate
 */

/*
 * @name Controls/_baseGrid/display/interface/IGridControl#resultsTemplate
 * @cfg {UI/Base:TemplateFunction} Results row template.
 * @default Controls/grid:ResultsTemplate
 * @see resultsPosition
 * @see resultsVisibility
 */

/**
 * @typedef {String} Controls/_baseGrid/display/interface/IGridControl/ResultsPosition
 * @description Значения для опции {@link resultsPosition}.
 * @variant top Над списком.
 * @variant bottom Под списком.
 */
export type ResultsPosition = 'top' | 'bottom';

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#resultsPosition
 * @cfg {Controls/_baseGrid/display/interface/IGridControl/ResultsPosition.typedef|undefined} Позиция отображения {@link /doc/platform/developmentapl/interface-development/controls/list/grid/results/ строки итогов}.
 * @default undefined
 * @demo Controls-demo/gridNew/Results/ResultsPosition/Index
 * @remark
 * В значении undefined строка итогов скрыта.
 * @result
 * @see resultsTemplate
 * @see resultsVisibility
 */

/*
 * @name Controls/_baseGrid/display/interface/IGridControl#resultsPosition
 * @cfg {String} Results row position.
 * @variant top Show results above the list.
 * @variant bottom Show results below the list.
 */

/**
 * @typedef {String} Controls/_baseGrid/display/interface/IGridControl/ResultsVisibility
 * @description Допустимые значения для опции {@link resultsVisibility}.
 * @variant hasdata Отображается при наличии более 1 элемента в таблице.
 * @variant visible Отображается всегда, вне зависимости от количества элементов в таблице.
 * @variant hidden Строка итогов скрыта.
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#resultsVisibility
 * @cfg {Controls/_baseGrid/display/interface/IGridControl/ResultsVisibility.typedef} Отображение {@link /doc/platform/developmentapl/interface-development/controls/list/grid/results/ строки итогов} при наличии или отсутствии элементов.
 * @demo Controls-demo/gridNew/Results/FromMeta/Index
 * @remark
 * Для отображения строки итогов необходимо задать значение в опции {@link resultsPosition}.
 * @default hasdata
 * @see resultsTemplate
 * @see resultsPosition
 */

/**
 * @typedef {String} Controls/_baseGrid/display/interface/IGridControl/HeaderVisibility
 * @description Допустимые значения для опции {@link headerVisibility}.
 * @variant hasdata Отображается при наличии элементов в таблице.
 * @variant visible Отображается всегда, вне зависимости от количества элементов в таблице.
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#headerVisibility
 * @cfg {Controls/_baseGrid/display/interface/IGridControl/HeaderVisibility.typedef} Отображение {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/ шапки} при наличии или отсутствии элементов.
 * @demo Controls-demo/gridNew/Header/HeaderVisibility/Index
 * @default hasdata
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#editArrowVisibilityCallback
 * @cfg {Function} Функция обратного вызова для управления видимостью кнопки редактирования.
 * @remark
 * Первый и единственный аргумент функции - запись таблицы, для которой вызвана функция.
 * Функция вызывается при включенной опции showEditArrow для каждой записи списка,
 * таким образом позволяет убрать видимость стрелки редактирования у отдельно взятых записей.
 * @see showEditArrow
 */

/**
 * @typedef {Function} Controls/_baseGrid/display/interface/IGridControl/TColspanCallback
 * @description
 * Функция обратного вызова для расчёта объединения колонок строки (колспана).
 * @param {Types/entity:Model} item Элемент, для которого рассчитывается объединение
 * @param {Controls/grid:IColumn} column Колонка грида
 * @param {Number} columnIndex Индекс колонки грида
 * @param {Boolean} isEditing Актуальное состояние редактирования элемента
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#colspanCallback
 * @cfg {Controls/_baseGrid/display/interface/IGridControl/TColspanCallback.typedef} Функция обратного вызова для расчёта объединения колонок строки (колспана).
 * @demo Controls-demo/gridNew/ColspanCallback/Index
 * @remark
 * Функция возвращает количество объединяемых колонок, учитывая текущую. Для объединения всех колонок, начиная с текущей, из функции нужно вернуть специальное значение "end".
 * @markdown
 * @see resultsColspanCallback
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#resultsColspanCallback
 * @cfg {Function} Функция обратного вызова для расчёта объединения колонок {@link /doc/platform/developmentapl/interface-development/controls/list/grid/results/ строки итого}.
 * @demo Controls-demo/gridNew/Results/ResultsColspanCallback/Index
 * @remark
 * Аргументы функции:
 * * {Controls/grid:IColumn} column Колонка таблицы.
 * * {Number} columnIndex Индекс колонки таблицы.
 *
 * Функция возвращает количество объединяемых колонок, учитывая текущую. Для объединения всех колонок, начиная с текущей, из функции нужно вернуть специальное значение "end".
 * @markdown
 * @see colspanCallback
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#emptyTemplateColumns
 * @cfg {Array.<Controls/_baseGrid/display/mixins/Grid/IEmptyTemplateColumn>} Конфигурация колонок {@link /doc/platform/developmentapl/interface-development/controls/list/grid/empty/#empty-template-columns пустой таблицы}.
 * @demo Controls-demo/gridNew/EmptyGrid/Editing/Index
 */

/**
 * @typedef {String} Controls/_baseGrid/display/interface/IGridControl/TEmptyTemplateHeight
 * @description Допустимые значения для опции {@link height}.
 * @variant auto Пустое представление занимает столько места, сколько занимает его содержимое.
 * @variant stretch Строка таблицы с пустым представлением принудительно растягивается на максимальную высоту.
 */

/**
 * @typedef {String} Controls/_baseGrid/display/interface/IGridControl/TEmptyTemplateBackgroundColorStyle
 * @description Допустимые значения для опции {@link backgroundColorStyle}.
 * @variant editing Фон соответствующий фону строки в режиме редактирования.
 * @variant transparent Прозрачный фон строки.
 * @remark
 * Подробнее про {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/template/#table-background фон строки в режиме редактирования}.
 */

/**
 * @typedef {Object} Controls/_baseGrid/display/interface/IGridControl/TEmptyTemplateOptions
 * @description Объект с опциями для настройки пустого представления, сконфигурированного через {@link Controls/_baseGrid/display/interface/IGridControl#emptyTemplate emptyTemplate}.
 * @property {Controls/_baseGrid/display/interface/IGridControl/TEmptyTemplateHeight.typedef} [height=stretch] настройка высоты пустого представления
 * @property {Controls/_baseGrid/display/interface/IGridControl/TEmptyTemplateBackgroundColorStyle.typedef} [backgroundColorStyle=editing] Настройка фона строки пустого представления.
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#emptyTemplateOptions
 * @cfg {Controls/_baseGrid/display/interface/IGridControl/TEmptyTemplateOptions.typedef} Объект с опциями для настройки пустого представления, сконфигурированного через {@link Controls/_baseGrid/display/interface/IGridControl#emptyTemplate emptyTemplate}.
 * @description
 * Позволяет передать дополнительные настройки в шаблон пустого представления, которые будут доступны в области видимости шаблона.
 * Также позволяет задать параметры:
 * * height - настройка растягивания пустого представления по высоте.
 * * backgroundColorStyle - стиль фона строки пустого представления.
 * @remark
 * По умолчанию при пустом представлении таблица растягивается по высоте родительского контейнера. Пустое представление занимает максимальную высоту. При помощи параметра height можно изменить это поведение.
 * @example
 * <pre class="brush: html; highlight: [2]">
 * <!-- WML -->
 * <Controls.grid:View source="{{_viewSource}}">
 *     <ws:emptyTemplateOptions height="auto"/>
 *     <ws:emptyTemplate>
 *         <ws:partial template="Controls/grid:EmptyTemplate">
 *             <ws:contentTemplate>No data available!</ws:contentTemplate>
 *         </ws:partial>
 *     </ws:emptyTemplate>
 * </Controls/grid:View>
 * </pre>
 * @default undefined
 * @see itemEditorTemplate
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#showEditArrow
 * @cfg {Boolean} Видимость кнопки, которая отображается в первой колонке при наведении курсора.
 * @remark
 * Чтобы стрелка отобразилась в прикладном шаблоне ячейки, необходимо в опции {@link Controls/grid:ColumnTemplate#contentTemplate contentTemplate} явно указать позицию стрелки. Для этого используется переменная editArrowTemplate из области видимости contentTemplate. Пример использования посмотрите {@link Controls/grid:ColumnTemplate#contentTemplate тут}.
 * Чтобы скрыть стрелку у некоторых записей, используйте {@link Controls/_baseGrid/display/interface/IGridControl#editArrowVisibilityCallback}.
 * **Обратите внимание!** Для отображения стрелки по свайпу необходимо всегда указывать опцию showEditArrow=true, вне зависимости от того, используется прикладной шаблон или нет.
 * @demo Controls-demo/gridNew/ShowEditArrow/Index
 * @example
 * <pre class="brush: html; highlight: [5,12]">
 * <!-- WML -->
 * <Controls.grid:View
 *     keyProperty="id"
 *     source="{{_viewSource}}"
 *     showEditArrow="{{true}}">
 *     <ws:columns>
 *         <ws:Array>
 *             <ws:Object>
 *                  <ws:template>
 *                      <ws:partial template="Controls/grid:ColumnTemplate">
 *                          <ws:contentTemplate>
 *                              <ws:partial template="{{ contentTemplate.editArrowTemplate }}"/>
 *                          </ws:contentTemplate>
 *                      </ws:partial>
 *                  </ws:template>
 *             </ws:Object>
 *         </ws:Array>
 *     </ws:columns>
 * </Controls.grid:View>
 * </pre>
 * @see editArrowVisibilityCallback
 */

/*
 * Allows showing button in first column on hover and in swipe menu.
 * @name Controls/_baseGrid/display/interface/IGridControl#showEditArrow
 * @cfg {Boolean}
 * <a href="/materials/DemoStand/app/Controls-demo%2FList%2FTree%2FEditArrow">Example</a>
 * @remark To place the button in the user column template, you should use the editArrowTemplate
 * @demo Controls-demo/gridNew/ShowEditArrow/Index
 * @example
 * <ws:partial template="{{editArrowTemplate}}" itemData="{{itemData}}"/>
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#itemEditorTemplate
 * @cfg {UI/Base:TemplateFunction|String} Пользовательский шаблон, используемый в таблице для {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования строки по месту} без деления на ячейки.
 * @default undefined
 * @remark
 * При установке шаблона **ОБЯЗАТЕЛЕН** вызов базового шаблона {@link Controls/grid:ItemEditorTemplate}.
 * Если опция определена, то в таблице будет использоваться {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/template/#string расширенное редактирование строк}.
 * Подробнее об настройке шаблона читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/template/#item-editor-template здесь}.
 * @see itemEditorTemplateOptions
 */

/**
 * @name Controls/_baseGrid/display/interface/IGridControl#itemEditorTemplateOptions
 * @cfg {any} Объект с опциями для редактируемой строки, сконфигурированной через {@link Controls/_baseGrid/display/interface/IGridControl#itemEditorTemplate itemEditorTemplate}.
 * @remark
 * Позволяет передать дополнительные настройки в шаблон редактируемой строки, которые будут доступны в области видимости шаблона.
 * @default undefined
 * @see itemEditorTemplate
 */

/**
 * Устанавливает положение горизонтального скролла в крайнее левое положение, в начало таблицы.
 * @function scrollToLeft
 * @name Controls/_baseGrid/display/interface/IGridControl#scrollToLeft
 * @returns {void}
 */

/**
 * Устанавливает положение горизонтального скролла в крайнее правое положение, в конец таблицы.
 * @function scrollToRight
 * @name Controls/_baseGrid/display/interface/IGridControl#scrollToRight
 * @returns {void}
 */

/**
 * Проскролливает к колонке с заданным индексом.
 * @function scrollToColumn
 * @name Controls/_baseGrid/display/interface/IGridControl#scrollToColumn
 * @param {Number} [columnIndex] Индекс колонки к которой необходимо проскролить.
 * @returns {void}
 */

/**
 * @event Controls/_baseGrid/display/interface/IGridControl#hoveredCellChanged Происходит при наведении курсора мыши на ячейку таблицы.
 * @param {UI/Events:SyntheticEvent} event Объект события.
 * @param {Types/entity:Model} item Элемент, на который навели курсор.
 * @param {HTMLElement} itemContainer Контейнер элемента, на который навели курсор.
 * @param {Number} columnIndex Индекс ячейки, на которую навели курсор.
 * @param {HTMLElement} cellContainer Контейнер ячейки элемента, на которую навели курсор.
 */

/**
 * @event Controls/_baseGrid/display/interface/IGridControl#editArrowClick Происходит при клике на "шеврон" элемента.
 * @param {UI/Events:SyntheticEvent} event Объект события.
 * @param {Types/entity:Model} item Элемент, по которому произвели клик.
 */

/**
 * @event Controls/_baseGrid/display/interface/IGridControl#tagClick Происходит при клике на {@link /doc/platform/developmentapl/interface-development/controls/list/grid/columns/visual/tag/ тег} внутри ячейки таблицы.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Экземпляр элемента списка, на котором было вызвано событие.
 * @param {number} columnIndex порядковый номер колонки, на которой было вызвано событие.
 * @param {UI/Events:SyntheticEvent} event Дескриптор события мыши. Может быть использовано для получения тега как DOM-элемента для отображения инфобокса.
 * @remark Событие никогда не запустится, если вы не укажете опцию {@link Controls/grid:ColumnTemplate#tagStyle tagStyle} шаблона колонки или {@link Controls/grid:IColumn#tagStyleProperty tagStyleProperty} у колонки.
 * @demo Controls-demo/gridNew/TagStyle/TagClick/Index
 * @see tagStyle
 * @see tagHover
 */

/**
 * @event Controls/_baseGrid/display/interface/IGridControl#tagHover Происходит при наведении курсора мыши на {@link /doc/platform/developmentapl/interface-development/controls/list/grid/columns/visual/tag/ тег} внутри ячейки таблицы.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Экземпляр элемента списка, на котором было вызвано событие.
 * @param {number} columnIndex порядковый номер колонки, на которой было вызвано событие.
 * @param {UI/Events:SyntheticEvent} event Дескриптор события мыши. Может быть использовано для получения тега как DOM-элемента для отображения инфобокса.
 * @remark Событие никогда не запустится, если вы не укажете опцию {@link Controls/grid:ColumnTemplate#tagStyle tagStyle} шаблона колонки или {@link Controls/grid:IColumn#tagStyleProperty tagStyleProperty} у колонки.
 * @demo Controls-demo/gridNew/TagStyle/TagHover/Index
 * @see tagClick
 */
