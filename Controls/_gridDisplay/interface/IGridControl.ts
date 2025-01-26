/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import type { Model } from 'Types/entity';
import { IList } from 'Controls/baseList';
import { TemplateFunction } from 'UI/Base';
import { TGroupViewMode } from 'Controls/display';
import type { IColumnConfig, IEditArrowGridProps, IGridProps } from 'Controls/gridRender';
import type { IEmptyTemplateColumn } from 'Controls/gridDisplay';

/**
 * Тип возвращаемого значения для ColspanCallback
 * @typedef TColspanCallbackResult
 */
export type TColspanCallbackResult = number | 'end' | undefined;

/**
 * Функция обратного вызова для расчёта объединения колонок строки (colspan).
 * @typedef TColspanCallback
 * @param {Types/entity:Model} item Элемент, для которого рассчитывается объединение
 * @param {Controls/grid:IColumn} column Колонка грида
 * @param {Number} columnIndex Индекс колонки грида
 * @param {Boolean} isEditing Актуальное состояние редактирования элемента
 */
export type TColspanCallback = (
    item: Model,
    column: IColumnConfig,
    columnIndex: number,
    isEditing: boolean
) => TColspanCallbackResult;

export type TResultsColspanCallback = (
    column: IColumnConfig,
    columnIndex: number
) => TColspanCallbackResult;

/**
 * Допустимые значения для опции {@link columnScrollStartPosition}.
 * @typedef TColumnScrollStartPosition
 * @variant start Устанавливает горизонтальную прокрутку в начальное (крайнее левое) положение.
 * @variant end Устанавливает горизонтальную прокрутку в конечное (крайнее правое) положение.
 */
export type TColumnScrollStartPosition = 'start' | 'end';

/**
 * Допустимые значения для опции {@link headerVisibility}.
 * @typedef Controls/_gridDisplay/interface/IGridControl/HeaderVisibility
 * @variant hasdata Отображается при наличии элементов в таблице.
 * @variant visible Отображается всегда, вне зависимости от количества элементов в таблице.
 */
export type HeaderVisibility = 'hasdata' | 'visible';

/**
 * Допустимые значения для опции {@link columnScrollViewMode}.
 * @typedef TColumnScrollViewMode
 * @variant scrollbar Отображается ползунок горизонтальной прокрутки.
 * @variant arrows Отображаются стрелки навигации для горизонтальной прокрутки.
 * @variant unaccented Элементы управления прокруткой скрыты, прокручиваемая область не выделяется тенью справа и слева.
 * @see dragScrolling
 */
export type TColumnScrollViewMode = 'scrollbar' | 'arrows' | 'unaccented';

/**
 * Допустимые значения для опции {@link columnScrollAutoScrollMode}.
 * @typedef TAutoScrollMode
 * @variant mostVisible Подскролл происходит ближайшему наиболее видимому элементу по направлению скролла.
 * @variant closest Подскролл происходит ближайшему элементу по направлению скролла.
 */
export type TAutoScrollMode = 'mostVisible' | 'closest';

/**
 * Допустимые значения для опции {@link height}.
 * @typedef TEmptyTemplateHeight
 * @variant auto Пустое представление занимает столько места, сколько занимает его содержимое.
 * @variant stretch Строка таблицы с пустым представлением принудительно растягивается на максимальную высоту.
 */
export type TEmptyTemplateHeight = 'auto' | 'stretch';

/**
 * Допустимые значения для опции {@link backgroundColorStyle}.
 * Подробнее про {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/template/#table-background фон строки в режиме редактирования}.
 * @typedef TEmptyTemplateBackgroundColorStyle
 * @variant editing Фон соответствующий фону строки в режиме редактирования.
 * @variant transparent Прозрачный фон строки.
 */
export type TEmptyTemplateBackgroundColorStyle = 'editing' | 'transparent';

/**
 * Объект с опциями для настройки пустого представления, сконфигурированного через {@link Controls/_gridDisplay/interface/IGridControl#emptyTemplate emptyTemplate}.
 * @public
 */
export interface IEmptyTemplateOptions {
    /**
     * Настройка высоты пустого представления
     * @default stretch
     */
    height: TEmptyTemplateHeight;
    /**
     * Настройка фона строки пустого представления.
     * @dwfault editing
     */
    backgroundColorStyle: TEmptyTemplateBackgroundColorStyle;
}

/**
 * Интерфейс конфигурации таблицы с лесенкой
 * @public
 */
export interface IGridLadderProps {
    /**
     * Массив с именами полей, по которым строится {@link /doc/platform/developmentapl/interface-development/controls/list/grid/ladder/ лесенка}.
     * @cfg
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
    ladderProperties?: string[];

    /**
     * Режим, в котором следует скрывать повторяющиеся элементы при применении лесенки.
     * @variant visibility - элемент скрывается при помощи visibility: hidden, с сохранением за ним пустого места. Режим по умолчанию.
     * @variant display - элемент скрывается при помощи display: none и не занимает места в шаблоне.
     * @cfg
     */
    ladderMode?: string;
}

/**
 * Интерфейс конфигурации таблицы, порддерживающей скролл колонок
 * @public
 */
export interface IColumnScrollGridProps {
    /**
     * Количество зафиксированных колонок, которые не двигаются при {@link /doc/platform/developmentapl/interface-development/controls/list/grid/horizontal-scrolling/ горизонтальной прокрутке}.
     * @cfg
     * @default 1
     * @remark
     * Колонка с чекбоксами {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/ множественного выбора} всегда зафиксирована и не входит в число stickyColumnsCount.
     * @demo Controls-demo/gridNew/ColumnScroll/Base/Index
     * @see columnScroll
     * @see columnScrollStartPosition
     * @see dragScrolling
     */
    stickyColumnsCount?: number;

    /**
     * Включает {@link /doc/platform/developmentapl/interface-development/controls/list/grid/horizontal-scrolling/ горизонтальную прокрутку} колонок.
     * @cfg
     * @default false
     * @see Controls/_gridDisplay/interface/IGridControl#columnScrollStartPosition
     * @see Controls/_gridDisplay/interface/IGridControl#stickyColumnsCount
     */
    columnScroll?: boolean;

    /**
     * Начальное положение {@link /doc/platform/developmentapl/interface-development/controls/list/grid/horizontal-scrolling/ горизонтальной прокрутки} колонок.
     * @cfg
     * @default start
     * @see columnScroll
     * @see stickyColumnsCount
     * @see dragScrolling
     */
    columnScrollStartPosition?: TColumnScrollStartPosition;

    /**
     * Режим отображения {@link /doc/platform/developmentapl/interface-development/controls/list/grid/horizontal-scrolling/ горизонтальной прокрутки} колонок в таблице.
     * @cfg
     * @default scrollBar
     * @see columnScroll
     */
    columnScrollViewMode?: TColumnScrollViewMode;

    /**
     * Режим автоподскрола при завершении скроллирования.
     * @cfg
     * @default closest
     */
    columnScrollAutoScrollMode?: TAutoScrollMode;

    /**
     * Включает скроллирование колонок перетаскиванием при {@link /doc/platform/developmentapl/interface-development/controls/list/grid/horizontal-scrolling/ горизонтальной прокрутке}.
     * @cfg
     * @remark По умолчанию прокрутка колонок перетаскиванием включена, если в списке нет Drag'N'Drop записей.
     * @default true
     * @see columnScroll
     * @see stickyColumnsCount
     * @see columnScrollStartPosition
     */
    dragScrolling?: boolean;

    /**
     * Включает прилипание операций над записью к правому краю прокручиваемой области при горизонтальном скролле.
     * @cfg
     * @default false
     */
    stickyItemActions?: boolean;
}

/**
 * Интерфейс таблицы, поддерживающей опции в старом wasaby-стиле
 * @public
 */
export interface IGridControlCompatibleProps {
    /**
     * Конфигурация колонок {@link /doc/platform/developmentapl/interface-development/controls/list/grid/empty/#empty-template-columns пустой таблицы}.
     * @cfg
     * @demo Controls-demo/gridNew/EmptyGrid/Editing/Index
     * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
     */
    emptyTemplateColumns?: IEmptyTemplateColumn;

    emptyTemplate?: TemplateFunction | string;
}

/**
 * Интерфейс для контрола {@link Controls/grid:View Таблица}.
 * @public
 */
export interface IGridControl
    extends IList,
        IGridProps,
        IGridLadderProps,
        IColumnScrollGridProps,
        IEditArrowGridProps,
        IGridControlCompatibleProps {
    /**
     * Отображение {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/ шапки} при наличии или отсутствии элементов.
     * @cfg {Controls/_gridDisplay/interface/IGridControl/HeaderVisibility.typedef}
     * @demo Controls-demo/gridNew/Header/HeaderVisibility/Index
     * @default hasdata
     */
    headerVisibility?: HeaderVisibility;

    /**
     * Режим отображения группировки.
     * @cfg
     * @default default
     * @demo Controls-demo/gridNew/Grouped/groupViewMode/blocks/Index В следующем примере группировка записей отображается в виде блоков.
     * @demo Controls-demo/gridNew/Grouped/groupViewMode/titledBlocks/Index В следующем примере группировка записей отображается в виде блоков, включающих заголовок группы.
     * @demo Controls-demo/gridNew/WI/Group/Base В следующем примере группировка записей отображается по умолчанию.
     */
    groupViewMode?: TGroupViewMode;

    /**
     * Опция, определяющая возможность сброса сортировки
     * @cfg
     * @default true
     * @demo Controls-demo/gridNew/Sorting/WI/canResetSorting/Index
     */
    canResetSorting?: boolean;

    /**
     * Закрепляет {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/ шапку} таблицы.
     * @cfg
     * @demo Controls-demo/gridNew/Header/NoSticky/Index В демо-примере опция stickyHeader установлена в значение false.
     * @demo Controls-demo/gridNew/Header/Sticky/Index В демо-примере опция stickyHeader установлена в значение true.
     * @default true
     */
    stickyHeader?: boolean;

    /**
     * Функция обратного вызова для расчёта объединения колонок строки (колспана).
     * @cfg
     * @demo Controls-demo/gridNew/ColspanCallback/Index
     * @remark
     * Функция возвращает количество объединяемых колонок, учитывая текущую. Для объединения всех колонок, начиная с текущей, из функции нужно вернуть специальное значение "end".
     * @markdown
     */
    colspanCallback?: TColspanCallback;
}

// region deprecated

/**
 * @name Controls/_gridDisplay/interface/IGridControl#resultsTemplate
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
 * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
 */

/**
 * Объект с опциями для настройки шаблона строки итогов, сконфигурированного через {@link Controls/_gridDisplay/interface/IGridControl#resultsTemplate resultsTemplate}.
 * Позволяет передать дополнительные настройки в шаблон строки итогов, которые будут доступны в области видимости шаблона.
 * @name Controls/_gridDisplay/interface/IGridControl#resultsTemplateOptions
 * @cfg {Object}
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
 * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
 */

/**
 * @name Controls/_gridDisplay/interface/IGridControl#colspanCallback
 * @cfg {Controls/_gridDisplay/interface/IGridControl/TColspanCallback.typedef} Функция обратного вызова для расчёта объединения колонок строки (колспана).
 * @demo Controls-demo/gridNew/ColspanCallback/Index
 * @remark
 * Функция возвращает количество объединяемых колонок, учитывая текущую. Для объединения всех колонок, начиная с текущей, из функции нужно вернуть специальное значение "end".
 * @markdown
 * @see resultsColspanCallback
 * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
 */

/**
 * @name Controls/_gridDisplay/interface/IGridControl#resultsColspanCallback
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
 * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
 */

/**
 * Объект с опциями для настройки пустого представления, сконфигурированного через {@link Controls/_gridDisplay/interface/IGridControl#emptyTemplate emptyTemplate}.
 * Позволяет передать дополнительные настройки в шаблон пустого представления, которые будут доступны в области видимости шаблона.
 * Также позволяет задать параметры:
 * * height - настройка растягивания пустого представления по высоте.
 * * backgroundColorStyle - стиль фона строки пустого представления.
 * @name Controls/_gridDisplay/interface/IGridControl#emptyTemplateOptions
 * @cfg {Controls/_gridDisplay/interface/IGridControl/TEmptyTemplateOptions.typedef}
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
 * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
 */

/**
 * @name Controls/_gridDisplay/interface/IGridControl#itemEditorTemplate
 * @cfg {UI/Base:TemplateFunction|String} Пользовательский шаблон, используемый в таблице для {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирования строки по месту} без деления на ячейки.
 * @default undefined
 * @remark
 * При установке шаблона **ОБЯЗАТЕЛЕН** вызов базового шаблона {@link Controls/grid:ItemEditorTemplate}.
 * Если опция определена, то в таблице будет использоваться {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/template/#string расширенное редактирование строк}.
 * Подробнее об настройке шаблона читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/template/#item-editor-template здесь}.
 * @see itemEditorTemplateOptions
 * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
 */

/**
 * @name Controls/_gridDisplay/interface/IGridControl#itemEditorTemplateOptions
 * @cfg {any} Объект с опциями для редактируемой строки, сконфигурированной через {@link Controls/_gridDisplay/interface/IGridControl#itemEditorTemplate itemEditorTemplate}.
 * @remark
 * Позволяет передать дополнительные настройки в шаблон редактируемой строки, которые будут доступны в области видимости шаблона.
 * @default undefined
 * @see itemEditorTemplate
 * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
 */

// endregion deprecated

// region events

/**
 * Устанавливает положение горизонтального скролла в крайнее левое положение, в начало таблицы.
 * @function scrollToLeft
 * @name Controls/_gridDisplay/interface/IGridControl#scrollToLeft
 * @returns {void}
 */

/**
 * Устанавливает положение горизонтального скролла в крайнее правое положение, в конец таблицы.
 * @function scrollToRight
 * @name Controls/_gridDisplay/interface/IGridControl#scrollToRight
 * @returns {void}
 */

/**
 * Проскролливает к колонке с заданным индексом.
 * @function scrollToColumn
 * @name Controls/_gridDisplay/interface/IGridControl#scrollToColumn
 * @param {Number} [columnIndex] Индекс колонки, к которой необходимо проскроллить.
 * @returns {void}
 */

/**
 * @event Controls/_gridDisplay/interface/IGridControl#hoveredCellChanged Происходит при наведении курсора мыши на ячейку таблицы.
 * @param {UI/Events:SyntheticEvent} event Объект события.
 * @param {Types/entity:Model} item Элемент, на который навели курсор.
 * @param {HTMLElement} itemContainer Контейнер элемента, на который навели курсор.
 * @param {Number} columnIndex Индекс ячейки, на которую навели курсор.
 * @param {HTMLElement} cellContainer Контейнер ячейки элемента, на которую навели курсор.
 */

/**
 * @event Controls/_gridDisplay/interface/IGridControl#editArrowClick Происходит при клике на "шеврон" элемента.
 * @param {UI/Events:SyntheticEvent} event Объект события.
 * @param {Types/entity:Model} item Элемент, по которому произвели клик.
 */

/**
 * @event Controls/_gridDisplay/interface/IGridControl#tagClick Происходит при клике на {@link /doc/platform/developmentapl/interface-development/controls/list/grid/columns/visual/tag/ тег} внутри ячейки таблицы.
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
 * @event Controls/_gridDisplay/interface/IGridControl#tagHover Происходит при наведении курсора мыши на {@link /doc/platform/developmentapl/interface-development/controls/list/grid/columns/visual/tag/ тег} внутри ячейки таблицы.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Экземпляр элемента списка, на котором было вызвано событие.
 * @param {number} columnIndex порядковый номер колонки, на которой было вызвано событие.
 * @param {UI/Events:SyntheticEvent} event Дескриптор события мыши. Может быть использовано для получения тега как DOM-элемента для отображения инфобокса.
 * @remark Событие никогда не запустится, если вы не укажете опцию {@link Controls/grid:ColumnTemplate#tagStyle tagStyle} шаблона колонки или {@link Controls/grid:IColumn#tagStyleProperty tagStyleProperty} у колонки.
 * @demo Controls-demo/gridNew/TagStyle/TagHover/Index
 * @see tagClick
 */

// endregion events
