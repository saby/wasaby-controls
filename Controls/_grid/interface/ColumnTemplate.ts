/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { TFontSize, TFontWeight, TFontColorStyle, TBackgroundStyle } from 'Controls/interface';

/**
 * @typedef {String} TCursor
 * @description Значения для типа курсора, отображаемого при наведении на ячейку.
 * @variant default Стандартный указатель (стрелка).
 * @variant pointer Указатель.
 */
export type TCursor = 'default' | 'pointer' | 'right';

/**
 * Шаблон, который по умолчанию используется для отображения ячеек в {@link Controls/grid:View таблице}.
 *
 * @class Controls/_grid/interface/ColumnTemplate
 *
 * @see Controls/_interface/grid/IGridControl/Column.typedef
 * @see Controls/grid:IGridControl#columns
 *
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/grid/columns/template/#_2 здесь}.
 *
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre class="brush: html; highlight: [7-13]">
 * <!-- WML -->
 * <Controls.grid:View source="{{_viewSource}}">
 *    <ws:columns>
 *       <ws:Array>
 *          <ws:Object displayProperty="name">
 *             <ws:template>
 *                <ws:partial template="Controls/grid:ColumnTemplate">
 *                   <ws:contentTemplate>
 *                      <div title="{{contentTemplate.item.contents.name}}">
 *                         {{contentTemplate.item.contents.name}}
 *                      </div>
 *                   </ws:contentTemplate>
 *                </ws:partial>
 *             </ws:template>
 *          </ws:Object>
 *       </ws:Array>
 *    </ws:columns>
 * </Controls.grid:View>
 * </pre>
 * @public
 */

export default interface IColumnTemplateOptions {
    /**
     * @cfg {String|TemplateFunction} Пользовательский шаблон для отображения содержимого ячейки.
     * @see Controls/grid:IGridControl#showEditArrow
     * @markdown
     * @remark
     * В области видимости шаблона доступны переменные **item**, **columns**, **editArrowTemplate** и **expanderTemplate**.
     *
     * Переменная **item** позволяет получить доступ к следующими свойствам:
     *
     * * **index** — порядковый номер строки. Отсчет от 0.
     * * **contents** (тип {@link Types/entity:Record}) — элемент, данные которого отображаются в колонке.
     * * **nodeType**  — тип элемента. Возвращает true для типа "узел", false — для типа "скрытый узел", null  — для типа "лист". Актуально для контрола {@link Controls/treeGrid:View Дерево}.
     * * **isEditing()** — возвращает true, если для записи выполняется {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирование по месту}.
     * * **getLevel()** — возвращает уровень вложенности элемента относительно корня иерархии. Актуально для контрола {@link Controls/treeGrid:View Дерево}.
     * * **getLadder()** — возвращает объект с конфигурацией {@link /doc/platform/developmentapl/interface-development/controls/list/grid/ladder/ лесенки} для текущей записи. Пример объекта конфигурации:
     * <pre class="brush: js">
     * {
     *    prop1: {ladderLength: number},
     *    ... ,
     *    propN: {ladderLength: number}
     * }
     * </pre>
     * где:
     *
     * * prop1, ... , propN — поля, для которых рассчитывается лесенка.
     * * ladderLength — количество записей с одинаковым значением текущего поля подряд. ladderLength присутствует только у первой записи в ряде (это та запись, у которой отображается значение).
     *
     * Переменная **column** позволяет получить доступ к следующими свойствам:
     *
     * * **config** (тип {@link Controls/grid:IColumn IColumn}) — объект с конфигурацией колонки.
     * * **columnIndex** — порядковый номер колонки. Отсчет от 0.
     *
     * Переменная **editArrowTemplate** позволяет отобразить {@link Controls/grid:IGridControl#showEditArrow стрелку-шеврон} в прикладном шаблоне для первой колонки. Переменную достаточно встроить в нужное место contentTemplate с помощью директивы {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-partial ws:partial}, как это показано в примере № 4. Шаблон принимает опцию backgroundStyle, позволяющую настраивать фон стрелки-шеврона. По умолчанию опция backgroundStyle рассчитывается в шаблоне ячейки в зависимости от опций highlightOnHover, hoverBackgroundStyle, editing.
     *
     * Переменная **expanderTemplate** доступна только, если шаблон используется в контроле {@link Controls/treeGrid:View}. С помощью переменной можно отобразить кнопку-экспандер в произвольном месте элемента. При этом опцию {@link Controls/_baseTree/interface/ITree#expanderPosition expanderPosition} необходимо установить в значение custom. Переменную expanderTemplate достаточно встроить в нужное место contentTemplate с помощью директивы {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-partial ws:partial}, как это показано в примере № 5.
     *
     * Переменная **itemActionsTemplate** — панель с [опциями записи](/doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/).
     * @example
     * **Пример 1.** Шаблон и контрол сконфигурированы в одном WML-файле.
     * <pre class="brush: html; highlight: [7-13]">
     * <!-- WML -->
     * <Controls.grid:View source="{{_viewSource}}">
     *    <ws:columns>
     *       <ws:Array>
     *          <ws:Object displayProperty="Name">
     *             <ws:template>
     *                <ws:partial template="Controls/grid:ColumnTemplate">
     *                   <ws:contentTemplate>
     *                      <div title="{{contentTemplate.item.contents.Name}}">
     *                         {{contentTemplate.item.contents.Name}}
     *                      </div>
     *                   </ws:contentTemplate>
     *                </ws:partial>
     *             </ws:template>
     *          </ws:Object>
     *       </ws:Array>
     *    </ws:columns>
     * </Controls.grid:View>
     * </pre>
     *
     * **Пример 2.** Контрол и шаблоны сконфигурированы в отдельных WML-файлах.
     * <pre class="brush: html; highlight: [7]">
     * <!-- file1.wml -->
     * <Controls.grid:View source="{{_viewSource}}">
     *    <ws:columns>
     *       <ws:Array>
     *          <ws:Object displayProperty="Name">
     *             <ws:template>
     *                <ws:partial template="wml!file2" scope="{{template}}"/>
     *             </ws:template>
     *          </ws:Object>
     *       </ws:Array>
     *    </ws:columns>
     * </Controls.grid:View>
     * </pre>
     *
     * <pre class="brush: html">
     * <!-- file2.wml -->
     * <ws:partial template="Controls/grid:ColumnTemplate">
     *    <ws:contentTemplate>
     *       <div>{{contentTemplate.item.contents.Name}}</div>
     *    </ws:contentTemplate>
     * </ws:partial>
     * </pre>
     *
     * **Пример 3.** Шаблон contentTemplate сконфигурирован в отдельном WML-файле.
     *
     * <pre class="brush: html; highlight: [9]">
     * <!-- file1.wml -->
     * <Controls.grid:View source="{{_viewSource}}">
     *    <ws:columns>
     *       <ws:Array>
     *          <ws:Object displayProperty="Name">
     *             <ws:template>
     *                <ws:partial template="Controls/grid:ColumnTemplate">
     *                   <ws:contentTemplate>
     *                      <ws:partial template="wml!file2" scope="{{contentTemplate}}"/>
     *                   </ws:contentTemplate>
     *                </ws:partial>
     *             </ws:template>
     *          </ws:Object>
     *       </ws:Array>
     *    </ws:columns>
     * </Controls.grid:View>
     * </pre>
     *
     * <pre class="brush: html">
     * <!-- file2.wml -->
     * <div title="{{contentTemplate.item.contents.Name}}">
     *    {{contentTemplate.item.contents.Name}}
     * </div>
     * </pre>
     *
     * **Пример 4.** Следующий пример настраивает контрол так, что для первой колонки задан пользовательский шаблон. При этом добавлено отображение {@link Controls/grid:IGridControl#showEditArrow стрелки-шеврона}.
     * <pre class="brush: html; highlight: [11]">
     * <Controls.grid:View source="{{_viewSource}}">
     *    <ws:columns>
     *       <ws:Array>
     *          <ws:Object displayProperty="name">
     *             <ws:template>
     *                <ws:partial template="Controls/grid:ColumnTemplate">
     *                   <ws:contentTemplate>
     *                      <div title="{{contentTemplate.item.contents.name}}">
     *                         {{contentTemplate.item.contents.name}}
     *                      </div>
     *                      <ws:partial template="{{ contentTemplate.editArrowTemplate }}" />
     *                   </ws:contentTemplate>
     *                </ws:partial>
     *             </ws:template>
     *          </ws:Object>
     *       </ws:Array>
     *    </ws:columns>
     * </Controls.grid:View>
     * </pre>
     *
     * **Пример 5.** Следующий пример настраивает контрол так, что для первой колонки задан пользовательский шаблон. При этом добавлено отображение кнопки раскрытия узла.
     * <pre class="brush: html; highlight: [1,13]">
     * <Controls.treeGrid:View source="{{_viewSource}}" nodeProperty="type" parentProperty="parent" expanderPosition="custom">
     *    <ws:itemTemplate>
     *       <ws:partial template="Controls/treeGrid:ItemTemplate" />
     *    </ws:itemTemplate>
     *    <ws:columns>
     *       <ws:Array>
     *          ...
     *          <ws:Object>
     *             <ws:template>
     *                <ws:partial template="Controls/grid:ColumnTemplate">
     *                   <ws:contentTemplate>
     *                      ...
     *                      <ws:partial template="{{ contentTemplate.expanderTemplate }}" scope="{{ contentTemplate }}"/>
     *                   </ws:contentTemplate>
     *                </ws:partial>
     *             </ws:template>
     *          </ws:Object>
     *       </ws:Array>
     *    </ws:columns>
     * </Controls.treeGrid:View>
     * </pre>
     */
    contentTemplate?: string;

    /**
     * @cfg {TCursor} Тип {@link https://developer.mozilla.org/ru/docs/Web/CSS/cursor курсора}, когда он находится в пределах ячейки.
     * @default pointer
     */
    cursor?: TCursor;

    /**
     * @cfg {Controls/_interface/IBackgroundStyle/TBackgroundStyle.typedef} Стиль фона ячейки.
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
     * @cfg {String} Позволяет задать стиль для цветных индикаторов в ячейке.
     * @variant info
     * @variant danger
     * @variant primary
     * @variant success
     * @variant warning
     * @variant secondary
     * @demo Controls-demo/gridNew/TagStyle/TagStyleFromTemplateParam/Index
     */
    tagStyle?: 'info' | 'danger' | 'primary' | 'success' | 'secondary';

    /**
     * @cfg {Boolean} Видимость подсветки строки при наведении курсора мыши.
     * @remark
     * В значении false элементы списка не будут подсвечиваться при наведении курсора мыши.
     * Дополнительно о подсветке строки таблицы читайте {@link /doc/platform/developmentapl/interface-development/controls/list/grid/background/#hover здесь}.
     * @default true
     */
    highlightOnHover?: boolean;

    /**
     * @cfg {Controls/_interface/IFontSize/TFontSize.typedef} Размер шрифта.
     * @default "l". Для контрола {@link Controls/treeGrid:View}: "m" (для листа), "xl" (для скрытого узла) и "2xl" (для узла).
     * @remark
     * Размер шрифта ячейки имеет больший приоритет, чем {@link Controls/_grid/interface/ItemTemplate#fontSize размер шрифта записи}.
     */
    fontSize?: TFontSize;

    /**
     * @cfg {Controls/_interface/IFontWeight/TFontWeight.typedef} Насыщенность шрифта.
     * @default "default".
     * @remark
     * Насыщенность шрифта ячейки имеет больший приоритет, чем {@link Controls/_grid/interface/ItemTemplate#fontWeight Насыщенность шрифта записи}.
     */
    fontWeight?: TFontWeight;

    /**
     * @cfg {Controls/interface/TFontColorStyle.typedef} Стиль цвета текста ячейки.
     * @remark
     * Стиль цвета текста ячейки имеет больший приоритет, чем {@link Controls/_grid/interface/ItemTemplate#fontColorStyle стиль цвета текста записи}.
     */
    fontColorStyle?: TFontColorStyle;

    /**
     * @cfg {String} Имя пользовательского класса для п5ередачи в шаблон контента ячейки.
     */
    className?: string;
}
