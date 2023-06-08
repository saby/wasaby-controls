/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { ICrudPlus, ICrud, QueryWhereExpression } from 'Types/source';
import { Source as HistorySource } from 'Controls/history';
import { IPopupOptions } from 'Controls/popup';
import { INavigationOptionValue, INavigationSourceConfig } from 'Controls/interface';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { RecordSet } from 'Types/collection';

export type TNavigation = INavigationOptionValue<INavigationSourceConfig>;

export type TKey = boolean | string | number;

export type TViewMode = 'basic' | 'frequent' | 'extended';

/**
 * Интерфейс опций для конфигурации редактора полей фильтра.
 * @remark
 * См. {@link Controls/filter:IFilterItem#editorOptions}
 * @interface Controls/filter:IEditorOptions
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IFilter
 * @implements Controls/interface:INavigation
 * @public
 */
export interface IEditorOptions {
    source?: ICrudPlus | (ICrud & ICrudPlus) | HistorySource;
    keyProperty?: string;
    /**
     * Имя свойства элемента, содержимое которого будет отображаться. Влияет только на значение при выборе.
     * @see nodeProperty
     * @see parentProperty
     */
    displayProperty?: string;
    parentProperty?: string;
    /**
     * Имя свойства, содержащего информацию о типе элемента (лист, узел, скрытый узел).
     * Если тип элемента указан как скрытый узел, дочерние элементы будут отображаться в виде подпунктов.
     * Текст при выборе таких пунктов склеивается из родительского значения и дочернего значения.
     * @demo Controls-ListEnv-demo/Filter/NotConnectedView/Source/ViewMode/Frequent/Hierarchy/Index
     * @see parentProperty
     */
    nodeProperty?: string;
    /**
     * Минимальное количество элементов для отображения фильтра. По умолчанию фильтр с одним элементом будет скрыт.
     */
    minVisibleItems?: number;
    /**
     * Определяет, установлен ли множественный выбор.
     */
    multiSelect?: boolean;
    /**
     * Шаблон панели выбора элементов.
     */
    selectorTemplate?: {
        templateName: string;
        templateOptions?: Record<string, any>;
        popupOptions?: IPopupOptions;
    };
    /**
     * Шаблон отображения элементов.
     * @remark
     * Подробнее о настройке itemTemplate читайте {@link Controls/menu:IMenuBase#itemTemplate здесь}.
     * Для задания элемента в качестве заголовка используйте шаблон {@link Controls/filterPopup:SimplePanelEmptyItemTemplate}.
     * @see itemTemplateProperty
     */
    itemTemplate?: string;
    /**
     * Режим отображения редактора. Принимаемые значения смотрите в документации редактора.
     * Например для редактора Controls/filter:DateRangeEditor принимаемые значения можно посмотреть {@link Controls/filter:DateRangeEditor#editorMode здесь}.
     */
    editorMode?: string;
    filter?: QueryWhereExpression<unknown>;
    navigation?: TNavigation;
    /**
     * Имя свойства, содержащего шаблон для рендеринга элементов.
     * @remark
     * Подробнее о настройке itemTemplateProperty читайте {@link Controls/menu:IMenuBase#itemTemplateProperty здесь}.
     * Для задания элемента в качестве заголовка используйте шаблон {@link Controls/filterPopup:SimplePanelEmptyItemTemplate}.
     * @see itemTemplate
     */
    itemTemplateProperty?: string;
    sourceController?: SourceController;
    dataLoadCallback?: (items: RecordSet, direction: 'up' | 'down') => void;
    /**
     * Шаблон отображения элемента в списке автодополнения строки поиска {@link ExtSearch/input:Suggest}
     */
    suggestItemTemplate?: string;
    [key: string]: unknown;
    /**
     * Заголовок в быстром фильтре.
     * @demo Controls-ListEnv-demo/Filter/View/ViewMode/Frequent/HeadingCaption/Index
     */
    headingCaption?: string;
    /**
     * Имя свойства, содержащего текст подсказки, которая отображается при наведении на элемент фильтра.
     */
    tooltip?: string;
    /**
     * Массив функций валидации значений фильтра.
     */
    validators?: Function[];
}

/**
 * Интерфейс для поддержки просмотра и редактирования полей фильтра.
 * @public
 */
export interface IFilterItem {
    /**
     * Имя фильтра.
     * @example
     * Опишем структуру фильтров. В поле фильтра <b>city</b> будет передано значение <b>Yaroslavl</b>
     * <pre class="brush: js; highlight: [2]">
     *    this._filterSource = [{
     *        name: 'city',
     *        value: 'Yaroslavl',
     *        ...
     *   }]
     * </pre>
     * В результате будет сформирован фильтр:
     * <pre class="brush: js; highlight: [2]">
     *     {
     *         name: 'Yaroslavl'
     *     }
     * </pre>
     */
    name: string;
    id?: string;
    /**
     * Текущее значение фильтра.
     * @example
     * Опишем структуру фильтров, чтобы в поле фильтра <b>city</b> было передано значение <b>Yaroslavl</b>
     * <pre class="brush: js; highlight: [3]">
     *    this._filterSource = [{
     *        name: 'city',
     *        value: 'Yaroslavl',
     *        ...
     *   }]
     * </pre>
     * В результате будет сформирован фильтр:
     * <pre class="brush: js; highlight: [2]">
     *     {
     *         name: 'Yaroslavl'
     *     }
     * </pre>
     */
    value: unknown;
    /**
     * Значение фильтра по умолчанию.
     */
    resetValue?: unknown;
    /**
     * Текстовое представление фильтра. Используется для отображения выбранных фильтров рядом с контролом {@link Controls-ListEnv/filterConnected:View}.
     * Так же используется для отображения в истории фильтров (см. опцию {@link Controls-ListEnv/filterConnected:View#historyId})
     * @remark При изменении {@link value значения} фильтра из кода, текстовое значение необходимо проставить самостоятельно.
     */
    textValue?: string;
    /**
     * Определяет, нужно ли отображать {@link textValue текстовое представление фильтра}
     * @remark Независимо от значения опции, текстовое представление фильтра используется для отображения истории фильтров (см. опцию {@link Controls-ListEnv/filterConnected:View#historyId}).
     * @default true
     */
    textValueVisible?: boolean;
    /**
     * Текст метки редактора фильтра
     * @example
     * <pre class="brush: js; highlight: [3]">
     *    this._filterSource = [{
     *        name: 'city',
     *        caption: 'Город',
     *        value: 'Yaroslavl',
     *        ...
     *   }]
     * </pre>
     */
    caption?: string;
    /**
     * Текст пункта меню быстрого фильтра, при выборе которого фильтр будет сброшен.
     * Пункт будет добавлен в начало списка с заданным текстом.
     * @remark Опция актуальна только при {@link viewMode} установленном в значение "frequent"
     * @see emptyKey
     * @see viewMode
     */
    emptyText?: string;
    /**
     * Первичный ключ для пункта меню быстрого фильтра, который создаётся при установке опции {@link emptyText}.
     * @remark Опция актуальна только при {@link viewMode} установленном в значение "frequent"
     * @see emptyText
     * @see viewMode
     */
    emptyKey?: TKey;
    /**
     * Определяет, следует ли сохранять данный фильтр в {@link Controls/filter:IFilterView#historyId историю}.
     * @remark Опция актуальна, если включена {@link Controls/filter:IFilterView#historyId история фильтров}.
     * @see Controls/filter:IFilterView#historyId
     * @example
     * <pre class="brush: js; highlight: [4]">
     *    this._filterSource = [{
     *        name: 'city',
     *        value: 'Yaroslavl',
     *        doNotSaveToHistory: true
     *        ...
     *   }]
     * </pre>
     */
    doNotSaveToHistory?: boolean;
    visibility?: boolean;
    /**
     * Режим отображения фильтра.
     * @variant frequent Фильтр, отображаемый в быстрых фильтрах.
     * @variant basic Фильтр, отображаемый в блоке "Отбираются".
     * @variant extended Фильтр, отображаемый в блоке "Можно отобрать".
     * @default basic
     */
    viewMode?: TViewMode;
    /**
     * Тип значения фильтра.
     * Если тип не указан, он будет автоматически определяться по значению фильтра.
     * Для каждого типа будет построен соответствующий редактор этого типа.
     *
     * В настоящей версии фреймворка поддерживается значение — "dateRange" для выбора периода и "date" для выбора конкретной даты
     * При установке "dateRange" будет построен контрол {@link Controls/dateRange:Selector}.
     * При установке "date" будет построен контрол {@link Controls/date:Selector}.
     * При установке "dateMenu" рядом с кнопкой фильтров будет построен редактор {@link Controls/filterPanel:DateMenuEditor}. В поле editorTemplateName необходимо задать редактор Controls/filterPanel:DateMenuEditor
     * @demo Controls-ListEnv-demo/Filter/View/Editors/DateMenuEditor/Frequent/Index
     */
    type?: string;
    /**
     * Текст, который выводится в блоке "Можно отобрать", когда значение для фильтра не выбрано
     * Актуально для фильтров с {@link viewMode} extended
     */
    extendedCaption?: string;
    /**
     * Идентификатор, под которым будет сохранена история элемента фильтра.
     * Значение такого фильтра не будет сохраняться в общую историю.
     */
    historyId?: string;
    /**
     * Имя редактора фильтра
     * @variant Controls/filterPanel:ListEditor редактор выбора из справочника в виде {@link Controls/filterPanel:ListEditor списка}
     * @variant Controls/filterPanel:LookupEditor редактор выбора из справочника в виде {@link Controls/filterPanel:LookupEditor кнопки выбора}
     * @variant Controls-ListEnv/filterPanelExtEditors:NumberRangeEditor редактор {@link Controls-ListEnv/filterPanelExtEditors:NumberRangeEditor диапазона чисел}
     * @variant Controls/filterPanel:DropdownEditor редактор перечисляемого типа в виде {@link Controls/filterPanel:DropdownEditor меню}
     * @variant Controls-ListEnv/filterPanelExtEditors:TumblerEditor редактор перечисляемого типа в виде {@link Controls-ListEnv/filterPanelExtEditors:TumblerEditor переключателя}
     * @variant Controls/filterPanel:BooleanEditor редактор {@link Controls/filterPanel:TextEditor логического типа}
     * @variant Controls/filterPanel:DateEditor редактор {@link Controls/filterPanel:DateEditor даты}
     * @variant Controls/filterPanel:DateRangeEditor редактор для {@link Controls/filterPanel:DateRangeEditor диапазона дат}
     * @remark Данные редакторы типов не поддерживаются для окна фильтров, построенном на основе {@link Controls/filterPopup:DetailPanel}.
     * @example
     * <pre class="brush: js; highlight: [5]">
     *    import {Memory} from 'Types/source'
     *    this._filterSource = [{
     *        name: 'city',
     *        value: 'Yaroslavl',
     *        editorTemplateName: 'Controls/filterPanel:DropdownEditor',
     *        editorOptions: {
     *           source: new Memory({
     *              data: [
     *                  {
     *                      id: 'Yaroslavl',
     *                      title: 'Ярославль'
     *                  },
     *                  {
     *                      id: 'Moscow',
     *                      title: 'Москва'
     *                  },
     *                  {
     *                      id: 'Rostov',
     *                      title: 'Ростов'
     *                  }
     *              ],
     *              keyProperty: 'id'
     *           }),
     *           displayProperty: 'title',
     *           keyProperty: 'id'
     *        }
     *        ...
     *   }]
     * </pre>
     */
    editorTemplateName?: string;
    /**
     * Опции для редактора.
     * @example
     * <pre class="brush: js; highlight: [6-23]">
     *    import {Memory} from 'Types/source'
     *    this._filterSource = [{
     *        name: 'city',
     *        value: 'Yaroslavl',
     *        editorTemplateName: 'Controls/filterPanel:DropdownEditor',
     *        editorOptions: {
     *           source: new Memory({
     *              data: [
     *                  {
     *                      id: 'Yaroslavl',
     *                      title: 'Ярославль'
     *                  },
     *                  {
     *                      id: 'Moscow',
     *                      title: 'Москва'
     *                  },
     *                  {
     *                      id: 'Rostow',
     *                      title: 'Ростов'
     *                  }
     *              ],
     *              keyProperty: 'id'
     *           }),
     *           displayProperty: 'title',
     *           keyProperty: 'id'
     *        }
     *        ...
     *   }]
     * </pre>
     */
    editorOptions?: IEditorOptions;
    /**
     * @cfg {string} Имя модуля экспортирующего функцию, возращающую опции для редактора фильтра.
     * Если одновременно переданы опции {@link editorOptions} и editorOptionsName, то опции редактора будут смержены.
     * @example
     * <pre class="brush: js; highlight: [6-23]">
     *    import {Memory} from 'Types/source'
     *    this._filterSource = [{
     *        name: 'city',
     *        value: 'Yaroslavl',
     *        editorTemplateName: 'Controls/filterPanel:DropdownEditor',
     *        editorOptionsName: 'MyModule/myLib:editorOpts'
     *   }]
     * </pre>
     *
     * // MyModule/myLib:editorOpts
     * <pre class="brush: js; highlight: [12]">
     *    import {Memory} from 'Types/source';
     *
     *    export default function(): object {
     *       return {
     *           source: new Memory({
     *              data: [
     *                  {
     *                      id: 'Yaroslavl',
     *                      title: 'Ярославль'
     *                  },
     *                  {
     *                      id: 'Moscow',
     *                      title: 'Москва'
     *                  },
     *                  {
     *                      id: 'Rostow',
     *                      title: 'Ростов'
     *                  }
     *              ],
     *              keyProperty: 'id'
     *           }),
     *           displayProperty: 'title',
     *           keyProperty: 'id'
     *        }
     *    }
     * </pre>
     */
    editorOptionsName?: string;
    /** Функция обратного вызова, которая вызывается при изменении фильтра.
     * Значение для опции можно передать в виде функции или пути до функции в виде строки.
     * Из функции можно вернуть изменённый элемент структуры фильтра, например, изменив опции редактора или даже значение фильтра.
     * Функция вызывается:
     * <ul>
     *     <li>на mount’e контрола, если какие-то фильтры изменены ({@link value} !== {@link resetValue})</li>
     *     <li>при <b>изменении</b> значения фильтров в runtime</li>
     * </ul>
     * Под <b>изменением</b> значения фильтров понимается
     * <ul>
     *     <li>Изменении фильтра через {@link Controls-ListEnv/filterPanelConnected:View панель фильтров}</li>
     *     <li>Изменение фильтров на {@link Controls-ListEnv/filterConnected:View окне фильтров}. Функция будет вызываться только для фильтров, которые редактируются на окне фильтра.</li>
     *     <li>Применение фильтров на {@link Controls-ListEnv/filterConnected:View окне фильтров} (после нажатия на кноку "Отобрать")</li>
     *     <li>Изменении фильтра любой другой {@link Controls-widgets/filter контрол фильтрации}</li>
     *     <li>Вызов метода updateFilterItems у {@link Controls/filter:ControllerClass контроллера фильтрации}</li>
     * </ul>
     * В функцию будут переданы следующие аргументы:
     * <ul>
     *     <li>{@link IFilterItem элемент фильтрации}</li>
     *     <li>{@link Controls/interface:IFilter#filter объект фильтра}</li>
     *     <li>объект, содержащий изменённые поля фильтра и их значения</li>
     * </ul>
     * @example
     * В следующем примере при изменении фильтра "Ответственный" будут изменены опции редактора фильтра "Фаза"
     * Определим структуру фильтра (в примере приводится неполный набор настроек для упрощения понимания):
     * <pre class="brush: js; highlight: [15]">
     *    this._filterSource = [
     *       {
     *           name: 'Ответственный',
     *           value: [],
     *           resetValue: [],
     *           ...
     *       },
     *       {
     *           name: 'Фаза',
     *           value: [],
     *           resetValue: [],
     *           editorOptions: {
     *               filter: {}
     *           },
     *           filterChangedCallback: 'MyModule/MyLib:phaseFilterChanged,
     *           ...
     *       }
     *   ]
     * </pre>
     * Определим функцию phaseFilterChanged
     * <pre class="brush: js;">
     *    export default function phaseFilterChanged(filterItem: IFilterItem, newFilter: object, changedFilters: object): IFilterItem|void {
     *       if (changedFilters['Ответственный']) {
     *           filterItem.editorOptions.filter['Ответственный'] = changedFilters['Ответственный'];
     *           return filterItem;
     *       }
     *    }
     * </pre>
     */
    filterChangedCallback?: string;
    /** Функция обратного вызова для определния видимости редактора фильтра.
     * Функция вызывается:
     * <ul>
     *     <li>на mount’e контрола, если какие-то фильтры изменены ({@link value} !== {@link resetValue})</li>
     *     <li>при <b>изменении</b> значения фильтров в runtime</li>
     * </ul>
     * Под <b>изменением</b> значения фильтров понимается
     * <ul>
     *     <li>Изменении фильтра через {@link Controls-ListEnv/filterPanelConnected:View панель фильтров}</li>
     *     <li>Изменение фильтров на {@link Controls-ListEnv/filterConnected:View окне фильтров}. Функция будет вызываться только для фильтров, которые редактируются на окне фильтра.</li>
     *     <li>Применение фильтров на {@link Controls-ListEnv/filterConnected:View окне фильтров} (после нажатия на кноку "Отобрать")</li>
     *     <li>Изменении фильтра любой другой {@link Controls-widgets/filter контрол фильтрации}</li>
     *     <li>Вызов метода updateFilterItems у {@link Controls/filter:ControllerClass контроллера фильтрации}</li>
     * </ul>
     * В функцию будут переданы следующие аргументы:
     * <ul>
     *     <li>{@link IFilterItem элемент фильтрации}</li>
     *     <li>{@link Controls/interface:IFilter#filter объект фильтра}</li>
     *     <li>объект, содержащий изменённые поля фильтра и их значения</li>
     * </ul>
     * @example
     * В следующем примере при изменении фильтра "Фаза" будет скрыт редактор фильтра "Ответственный"
     * Определим структуру фильтра (в примере приводится неполный набор настроек для упрощения понимания):
     * <pre class="brush: js; highlight: [6]">
     *    this._filterSource = [
     *       {
     *           name: 'Ответственный',
     *           value: [],
     *           resetValue: [],
     *           filterVisibilityCallback: 'MyModule/MyLib:employeeFilterVisibilityCallback,
     *           ...
     *       },
     *       {
     *           name: 'Фаза',
     *           value: [],
     *           resetValue: [],
     *           ...
     *       }
     *   ]
     * </pre>
     * Определим функцию обратного вызова employeeFilterVisibilityCallback
     * <pre class="brush: js;">
     *    export default function employeeFilterVisibilityCallback(filterItem: IFilterItem, newFilter: object, changedFilters: object): IFilterItem|void {
     *       // Если выбран фильтр по фазе, то фильтр по ответственному должен быть недоступен для редактирования, скроем его
     *       return !!newFilter['Фаза'].length;
     *    }
     * </pre>
     * @demo Controls-ListEnv-demo/Filter/View/FilterVisibilityCallback/Index
     */
    filterVisibilityCallback?: string;
    /**
     * Функция обратного вызова для получения значения фильтра.
     * Данную функцию необходимо использовать в случае, если значение поставляемое редактором фильтра
     * по каким то причинам не подходит для запроса к источнику данных. Например метод БЛ
     * не поддерживает фильтрацию по массиву дат и ожидает значения в двух полях фильтра.
     * @example
     * <pre class="brush: js; highlight: [13]">
     *   import {IFilterItem} from 'Controls/filter';
     *
     *   this._filterSource = [
     *      {
     *          name: 'Ответственный',
     *          value: ['Герасимов А.М.'],
     *          resetValue: []
     *      }
     *      {
     *         name: 'Дата',
     *         value: ['10.04.2022', '20.04.2022'],
     *         resetValue: [null, null],
     *         descriptionToValueConverter: 'MyModule/MyLib:descriptionToValueConverter'
     *      }
     *   ];
     * </pre>
     * Определим функцию, которая будет конвертировать значение фильтра:
     * <pre class="brush: js;">
     *    export function descriptionToValueConverter({value}: IFilterItem) => {
     *        return {
     *           ДатаНачала: value[0],
     *           ДатаКонца: value[1]
     *        }
     *    }
     * </pre>
     * По итогу будет сформирован фильтр следующего вида:
     * <pre class="brush: js;">
     *   {
     *       Ответственный: ['Герасимов А.М.'],
     *       ДатаНачала: '10.04.2022',
     *       ДатаКонца: '20.04.2022'
     *   }
     * </pre>
     */
    descriptionToValueConverter?: string;
    /**
     * Определяет видимость разделителя в заголовке редактора.
     * @variant visible Разделитель отображается
     * @variant hidden Разделитель скрыт
     * @default visible
     */
    separatorVisibility?: string;
    /**
     * Определяет видимость кнопки сворачивания редактора.
     * @default false
     */
    expanderVisible?: boolean;
    [key: string]: any;
    /**
     * Видимость фильтра, установленная пользователем в настройках фильтра.
     */
    userVisibility?: boolean;
    /**
     * Порядок фильтра, вычисленный на основе пользовательских настроек фильтра.
     */
    order?: number;
}

/*
 * @typedef {Object} Controls/filter:EditorOptions
 * @property {String} keyProperty Name of the item property that uniquely identifies collection item.
 * @property {String} displayProperty Name of the item property that content will be displayed. Only affects the value when selecting.
 * @property {Types/source:Base} source Object that implements ICrud interface for data access. If 'items' is specified, 'source' will be ignored.
 * @property {Boolean} multiSelect Determines whether multiple selection is set.
 * @property {Controls/interface:ISelectorDialog} selectorTemplate Items selection panel template.
 * @property {Function} itemTemplate Template for item render. For more information, see {@link Controls/_menu/interface/IMenuBase#itemTemplate}
 * @property {String} itemTemplateProperty Name of the item property that contains template for item render. For more information, see {@link Controls/_menu/interface/IMenuBase#itemTemplateProperty}
 * @property {Object} filter Filter configuration - object with field names and their values. {@link Controls/_interface/IFilter}
 * @property {Object} navigation List navigation configuration. Configures data source navigation (pages, offset, position) and navigation view (pages, infinite scroll, etc.) {@link Controls/_interface/INavigation}
 * @property {Types/collection:IList} items Special structure for the visual representation of the filter. {@link Types/collection:IList}.
 */
