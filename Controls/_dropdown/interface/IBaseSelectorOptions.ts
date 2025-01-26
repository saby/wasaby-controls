/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
import { TemplateFunction } from 'UI/Base';
import { TSelectedKeys } from 'Controls/interface';

/**
 * Интерфейс для Controls/dropdown:Selector.
 *
 * @public
 */
export default interface IBaseSelectorOptions {
    maxVisibleItems?: number;
    fontColorStyle?: string;
    fontSize?: string;
    showHeader?: boolean;
    selectedAllText?: string;
    selectedAllKey: TSelectedKeys;
    onSelectedKeysChanged?: Function;
    itemTemplate?: TemplateFunction;
    contentTemplate?: TemplateFunction;
    buildByItems?: boolean;
    onTextValueChanged?: (textValue: string) => void;
}

/**
 * @name Controls/_dropdown/interface/IBaseSelectorOptions#maxVisibleItems
 * @cfg {Number} Максимальное количество выбранных записей, которые будут отображены.
 * @default 1
 * @demo Controls-demo/dropdown_new/Input/MaxVisibleItems/Index
 * @example
 * Отображение всех выбранных записей.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Selector
 *    bind:selectedKeys="_selectedKeys"
 *    keyProperty="key"
 *    displayProperty="title"
 *    source="{{_source}}"
 *    multiSelect="{{true}}"
 *    maxVisibleItems="{{null}}">
 * </Controls.dropdown:Selector>
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * this._source = new Memory({
 *    keyProperty: 'key',
 *    data: [
 *        {key: 1, title: 'Ярославль'},
 *        {key: 2, title: 'Москва'},
 *        {key: 3, title: 'Санкт-Петербург'},
 *        {key: 4, title: 'Новосибирск'},
 *        {key: 5, title: 'Нижний новгород'},
 *        {key: 6, title: 'Кострома'},
 *        {key: 7, title: 'Рыбинск'}
 *    ]
 * });
 * </pre>
 */

/**
 * @name Controls/_dropdown/interface/IBaseSelectorOptions#contentTemplate
 * @cfg {Function} Шаблон отображения вызывающего элемента.
 * @remark
 * Для определения шаблона вызовите базовый шаблон - "Controls/dropdown:inputDefaultContentTemplate".
 * Шаблон должен быть помещен в контрол с помощью тега <ws:partial> с атрибутом "template".
 * Содержимое можно переопределить с помощью параметра "contentTemplate".
 * Базовый шаблон {@link Controls/dropdown:inputDefaultContentTemplate} по умолчанию отображает только текст.
 * Для отображения иконки и текста используйте шаблон "{@link Controls/dropdown:defaultContentTemplateWithIcon}".
 * @demo Controls-demo/dropdown_new/Input/ContentTemplate/Index
 * @example
 * Отображение иконки и текста.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Selector
 *    bind:selectedKeys="_selectedKeys"
 *    keyProperty="id"
 *    displayProperty="title"
 *    source="{{_source}}"
 *    contentTemplate="Controls/dropdown:defaultContentTemplateWithIcon">
 * </Controls.dropdown:Selector>
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * this._source = new Memory({
 *    keyProperty: 'id',
 *    data: [
 *       {id: 1, title: 'Name', icon: 'icon-small icon-TrendUp'},
 *       {id: 2, title: 'Date of change', icon: 'icon-small icon-TrendDown'}
 *    ]
 * });
 * </pre>
 */

/**
 * @name Controls/_dropdown/interface/IBaseSelectorOptions#multiSelect
 * @cfg {Boolean} Определяет, установлен ли множественный выбор.
 * @default false
 * @demo Controls-demo/dropdown_new/Input/MultiSelect/Simple/Index
 * @demo Controls-demo/dropdown_new/Input/MultiSelect/PinnedItems/Index
 * @example
 * Множественный выбор установлен.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Selector
 *    bind:selectedKeys="_selectedKeys"
 *    keyProperty="id"
 *    displayProperty="title"
 *    source="{{_source}}"
 *    multiSelect="{{true}}" />
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * this._source = new Memory({
 *    keyProperty: 'id',
 *    data: [
 *       {id: 1, title: 'Yaroslavl'},
 *       {id: 2, title: 'Moscow'},
 *       {id: 3, title: 'St-Petersburg'}
 *    ]
 * });
 * this._selectedKeys = [1, 3];
 * </pre>
 */

/**
 * @name Controls/_dropdown/interface/IBaseSelectorOptions#selectedItems
 * @cfg {Types/collection:RecordSet} Задаёт выбранные записи в выпадающем списке
 * @remark Опцию задают, если необходимо построить выпадающий список с источником (опция source) и выбранныеми записями без вызова метода бл.
 * При этом метод БЛ будет вызван для получения записей в меню, которое открывается при клике.
 * @default null
 * @example
 * JS
 * <pre class="brush: js">
 *    import {RecordSet} from 'Types/collection';
 *    import {SbisService} from 'Types/source';
 *
 *    protected _selectedItems = new RecordSet({
 *         rawData: [
 *            {id: 'Yaroslavl', title: 'Ярославль'},
 *            {id: 'Moscow', title: 'Москва'}
 *         ],
 *         keyProperty: 'id'
 *    });
 *    protected _selectedKeys = ['Yaroslavl', 'Moscow']
 *
 *    protected _source = new SbisService({
 *       ...
 *    });
 * </pre>
 *
 * WML
 * <pre class="brush: html;">
 *    <Controls.dropdown:Selector
 *         bind:selectedKeys="_selectedKeys"
 *         selectedItems="{{_selectedItems}}
 *         keyProperty="id"
 *         displayProperty="title"
 *         source="{{_source}}"
 *         multiSelect="{{true}}"
 *    />
 * </pre>
 */

/**
 * @name Controls/_dropdown/interface/IBaseSelectorOptions#selectedAllKey
 * @cfg {String} Первичный ключ для пункта выпадающего списка, который создаётся при установке опции {@link selectedAllText}.
 * @default null
 * @demo Controls-demo/dropdown_new/Input/SelectedAllText/SelectedAllKey/Index
 */

/**
 * @name Controls/_dropdown/interface/IBaseSelectorOptions#selectedAllText
 * @cfg {String} Добавляет пустой элемент в список с заданным текстом.
 * Ключ элемента по умолчанию null, для изменения значения ключа используйте {@link selectedAllKey}.
 * @demo Controls-demo/dropdown_new/Input/SelectedAllText/Simple/Index
 */

/**
 * @name Controls/_dropdown/interface/IBaseSelectorOptions#multiSelect
 * @cfg {boolean} Определяет, установлен ли множественный выбор.
 * @demo Controls-demo/dropdown_new/Input/MultiSelect/Index
 * @default false
 */

/**
 * @name Controls/_dropdown/interface/IBaseSelectorOptions#multiSelectAccessibilityProperty
 * @cfg {Controls/display:MultiSelectAccessibility} Имя поля записи, в котором хранится состояние видимости чекбокса.
 * @demo Controls-demo/dropdown_new/Input/MultiSelect/MultiSelectAccessibilityProperty/Index
 * @example
 * Множественный выбор установлен
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Selector
 *    bind:selectedKeys="_selectedKeys"
 *    keyProperty="id"
 *    displayProperty="title"
 *    source="{{_source}}"
 *    multiSelectAccessibilityProperty="checkBoxState"
 *    multiSelect="{{true}}" />
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * import {MultiSelectAccessibility} from 'Controls/dropdown';
 *
 * this._source = new Memory({
 *    keyProperty: 'id',
 *    data: [
 *       {id: 1, title: 'Yaroslavl', checkBoxState: MultiSelectAccessibility.disabled},
 *       {id: 2, title: 'Moscow'},
 *       {id: 3, title: 'St-Petersburg'}
 *    ]
 * });
 * this._selectedKeys = [1, 3];
 * </pre>
 */

/**
 * @name Controls/_dropdown/interface/IBaseSelectorOptions#source
 * @cfg {Controls/_dropdown/interface/IBaseDropdown/SourceCfg.typedef}
 * @default undefined
 * @remark
 * Запись может иметь следующие {@link Controls/_dropdown/interface/IBaseDropdown/Item.typedef свойства}.
 * @demo Controls-demo/dropdown_new/Input/Source/Simple/Index
 * @example
 * Записи будут отображены из источника _source.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Selector bind:selectedKeys="_selectedKeys"
 *                             keyProperty="key"
 *                             displayProperty="title"
 *                             source="{{_source}}">
 * </pre>
 * <pre class="brush: js">
 * // TypeScript
 * import {Memory} from 'Types/source';
 *
 * protected _selectedKeys: string[] = ['2'];
 * protected _source: Memory = new Memory({
 *    keyProperty: 'key',
 *    data: [
 *       {key: '1', icon: 'icon-EmptyMessage', iconStyle: 'info', title: 'Message'},
 *       {key: '2', icon: 'icon-TFTask', title: 'Task'},
 *       {key: '3', title: 'Report'},
 *       {key: '4', title: 'News', readOnly: true}
 *    ]
 * })
 * </pre>
 */

/**
 * @typedef {String} SelectionType
 * @variant all Для выбора доступны любые типы элементов.
 * @variant allBySelectAction Для выбора доступен любой тип элемента. Выбор осуществляется нажатием кнопки «Выбрать».
 * @variant node Для выбора доступны только элементы типа «узел» и «скрытый узел».
 * @variant leaf Для выбора доступны только элементы типа «лист».
 */

/**
 * @name Controls/_dropdown/interface/IBaseSelectorOptions#selectionType
 * @cfg {SelectionType} Тип выбираемых записей, используется для меню с иерархией и множественным выбором.
 * @default all
 * @example
 * В этом примере для выбора будут доступны только узлы.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Selector ...
 *                             parentProperty="Раздел"
 *                             nodeProperty="Раздел@"
 *                             selectionType="node" />
 * </pre>
 * @see multiSelect
 * @see nodeProperty
 * @see parentProperty
 */

/**
 * @name Controls/_dropdown/interface/IBaseSelectorOptions#menuBeforeSelectionChangedCallback
 * @cfg {Function} Происходит до изменения {@link selectedKeys списка выбранных элементов}.
 * В аргументы приходит параметр selectionDiff - изменение в списке выбранных элементов по сравнению с текущим выбором {@link Controls/multiselection:ISelectionDifference}.
 * Из обработчика события можно вернуть новый список выбранных элементов или промис с ними {@link Controls/interface:ISelectionObject}.
 * @demo Controls-demo/dropdown_new/Input/MultiSelect/BeforeSelectionChangedCallback/Index
 * @example
 * Если в меню ничего не выбрано, из обработчика вернется selection с выбранной первой записью.
 * <pre class="brush: html; highlight: [7]">
 * <!-- WML -->
 * <Controls.dropdown:Selector
 *    menuBeforeSelectionChangedCallback="{{_beforeSelectionChangedCallback}}"
 *    bind:selectedKeys="_selectedKeys"
 *    keyProperty="id"
 *    displayProperty="title"
 *    source="{{_source}}"
 *    multiSelect="{{true}}" />
 * </pre>
 * <pre class="brush: js;">
 * // JavaScript
 * this._source = new Memory({
 *    keyProperty: 'id',
 *    data: [
 *       {id: 1, title: 'Yaroslavl'},
 *       {id: 2, title: 'Moscow'},
 *       {id: 3, title: 'St-Petersburg'}
 *    ]
 * });
 * this._beforeSelectionChangedCallback = (selection: ISelectionDifference) => {
 *     if (!selection.selectedKeysDifference.keys.length) {
 *         return {
 *             selected: [1],
 *             excluded: []
 *         }
 *     }
 * }
 * this._selectedKeys = [1, 3];
 * </pre>
 * @see selectedKeys
 * @see multiSelect
 */
