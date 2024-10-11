/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { default as IFilterItemLocal } from 'Controls/_filter/interface/IFilterItemLocal';
export type TViewMode = 'basic' | 'frequent' | 'extended';

/**
 * Базовый интерфейс элемента фильтра
 * @public
 */
export interface IFilterItemBase {
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
     * Устанавливается при сбросе фильтра (например при нажатии на крестик в быстром фильтров или при нажатии на "Сбросить" в окне фильтров)
     * <pre class="brush: js; highlight: [4]">
     *    this._filterSource = [{
     *        name: 'city',
     *        value: 'Yaroslavl',
     *        resetValue: null
     *   }]
     * </pre>
     */
    resetValue?: unknown;
    /**
     * Текстовое представление фильтра. Используется для отображения выбранных фильтров рядом с контролом {@link Controls-ListEnv/filterConnected:View}.
     * Так же используется для отображения в истории фильтров (см. опцию {@link Controls-ListEnv/filterConnected:View#historyId})
     * @remark При изменении {@link value значения} фильтра из кода, текстовое значение необходимо проставить самостоятельно.
     */
    textValue?: string;
    /**
     * @cfg {String} Режим отображения фильтра.
     * @variant frequent Фильтр, отображаемый в быстрых фильтрах.
     * @variant basic Фильтр, отображаемый в блоке "Отбираются".
     * @variant extended Фильтр, отображаемый в блоке "Можно отобрать".
     * @default basic
     * @remark
     * При указании viewMode: 'extended' необходимо дополнительно настроить текст метки в опции {@link extendedCaption}
     * @example
     * <pre class="brush: js; highlight: [5]">
     *     const filterDescription = [{
     *        name: 'employee',
     *        value: 'Герасимов А.М.',
     *        resetValue: null,
     *        viewMode: 'extended',
     *        extendedCaption: 'Сотрудник',
     *        ...
     *     }]
     * </pre>
     */
    viewMode?: TViewMode;
    /** Функция обратного вызова, которая вызывается при изменении фильтра.
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
     *     <li>Вызов метода updateFilterItems у {@link Controls/filterOld:ControllerClass контроллера фильтрации}</li>
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
     *     <li>Вызов метода updateFilterItems у {@link Controls/filterOld:ControllerClass контроллера фильтрации}</li>
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
     *    export default function employeeFilterVisibilityCallback(filterItem: IFilterItem, newFilter: object, changedFilters: object): boolean {
     *       // Если выбран фильтр по фазе, то фильтр по ответственному должен быть недоступен для редактирования, скроем его
     *       return !!newFilter['Фаза'].length;
     *    }
     * </pre>
     * @demo Controls-ListEnv-demo/Filter/View/FilterVisibilityCallback/Index
     */
    filterVisibilityCallback?: string;
    /**
     * Идентификатор, под которым будет сохранена история элемента фильтра.
     * Значение такого фильтра не будет сохраняться в общую историю.
     */
    historyId?: string;
    /**
     * Функция обратного вызова для получения значения фильтра.
     * Данную функцию необходимо использовать в случае, если значение поставляемое редактором фильтра
     * по каким то причинам не подходит для запроса к источнику данных. Например метод БЛ
     * не поддерживает фильтрацию по массиву дат и ожидает значения в двух полях фильтра.
     * @remark С помощью descriptionToValueConverter можно удалить поле в объекте фильтра,
     * если вернуть специальное значение DESCRIPTION_CONVERTER_DELETE_VALUE, эскпортируемое из библиотеки Controls/filter
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
     * <!-- MyModule/MyLib:descriptionToValueConverter -->
     * <pre class="brush: js;">
     *    // Вторым аргументом передаётся вся структура фильтра
     *    export function descriptionToValueConverter({value}: IFilterItem, items: IFilterItem[]) => {
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
    descriptionToValueConverter?: string | Function;
    /**
     * Подсказка, которая добавляется к текстовому значению фильтра в истории фильтров.
     * @example
     * В приведенном примере в историю будет записан текст: "Город: Ярославль"
     * <pre class="brush: js; highlight: [3]">
     *    this._filterSource = [{
     *        name: 'city',
     *        value: 'Yaroslavl',
     *        textValue: 'Ярославль',
     *        historyCaption: 'Город',
     *        ...
     *   }]
     * </pre>
     */
    historyCaption?: string;
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
    /**
     * Тип значения фильтра.
     * От типа значения зависит, как будут грузиться данные для редактора фильтра.
     * Так же, для некоторых значений (date/dateRange/dateMenu) автоматически строится редактор для быстрого выбора фильтра.
     *
     * При установке следующих значений типа будет построен соответствующий редактор этого типа.
     * @variant dateRange Рядом с воронкой фильтров будет построен контрол выбора периода {@link Controls/dateRange:Selector}.
     * @variant date Рядом с воронкой фильтров будет построен контрол выбора даты {@link Controls/date:Selector}.
     * @variant dateMenu При установке "dateMenu" рядом с воронкой фильтров будет построен редактор {@link Controls/filterPanelEditors:DateMenu}. В поле editorTemplateName необходимо задать редактор Controls/filterPanelEditors:DateMenu
     * @variant list Данные для редактора будут грузиться при построении страницы. Указывайте type: 'list', если редактор отображается в виде списка в панели фильтров на странице.
     * @demo Controls-ListEnv-demo/Filter/View/Editors/DateMenuEditor/Frequent/Index
     */
    type?: 'date' | 'dateRange' | 'dateMenu' | 'list' | 'lookup' | 'filterPopupList';
    /**
     * Определяет, будет ли значение фильтра записано в URL
     * @default false
     */
    saveToUrl?: boolean;
}

/**
 * Интерфейс для поддержки просмотра и редактирования полей фильтра.
 * @public
 */
export default interface IFilterDescriptionItem extends IFilterItemBase, IFilterItemLocal {
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
     * Текст, который выводится в блоке "Можно отобрать", когда значение для фильтра не выбрано
     * Актуально для фильтров с {@link viewMode} extended
     * @example
     * <pre class="brush: js; highlight: [4]">
     *    this._filterSource = [{
     *        name: 'city',
     *        value: 'Yaroslavl',
     *        extendedCaption: 'Город'
     *   }]
     * </pre>
     */
    extendedCaption?: string;
    /**
     * Имя редактора фильтра
     * @variant Controls/filterPanel:ListEditor редактор выбора из справочника в виде {@link Controls/filterPanel:ListEditor списка}
     * @variant Controls/filterPanelEditors:Lookup редактор выбора из справочника в виде {@link Controls/filterPanelEditors:Lookup кнопки выбора}
     * @variant Controls-ListEnv/filterPanelExtEditors:NumberRangeEditor редактор {@link Controls-ListEnv/filterPanelExtEditors:NumberRangeEditor диапазона чисел}
     * @variant Controls/filterPanelEditors:Dropdown редактор перечисляемого типа в виде {@link Controls/filterPanelEditors:Dropdown меню}
     * @variant Controls-ListEnv/filterPanelExtEditors:TumblerEditor редактор перечисляемого типа в виде {@link Controls-ListEnv/filterPanelExtEditors:TumblerEditor переключателя}
     * @variant Controls/filterPanelEditors:Boolean редактор {@link Controls/filterPanelEditors:Boolean логического типа}
     * @variant Controls/filterPanelEditors:Date редактор {@link Controls/filterPanelEditors:Date даты}
     * @variant Controls/filterPanelEditors:DateRange редактор для {@link Controls/filterPanelEditors:DateRange диапазона дат}
     * @remark Данные редакторы типов не поддерживаются для окна фильтров, построенном на основе {@link Controls/filterPopup:DetailPanel}.
     * @example
     * <pre class="brush: js; highlight: [5]">
     *    import {Memory} from 'Types/source'
     *    this._filterSource = [{
     *        name: 'city',
     *        value: 'Yaroslavl',
     *        editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
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
     *        editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
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
    editorOptions?: Record<string, unknown>;
    /**
     * Имя модуля экспортирующего функцию, возращающую опции для редактора фильтра.
     * Экспортируемая функция может быть как синхронной, так и асинхронной.
     * Если одновременно переданы опции {@link editorOptions} и editorOptionsName, то опции редактора будут смержены.
     * @example
     * <pre class="brush: js; highlight: [6]">
     *    import {Memory} from 'Types/source'
     *
     *    this._filterSource = [{
     *        name: 'city',
     *        value: 'Yaroslavl',
     *        editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
     *        editorOptionsName: 'MyModule/myLib:editorOpts'
     *   }]
     * </pre>
     *
     * Пример синхронной функции:
     *
     * // MyModule/myLib:editorOpts
     * <pre class="brush: js">
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
     *
     * Пример aсинхронной фунции:
     *
     * // MyModule/myLib:editorOpts
     * <pre class="brush: js; highlight: [12]">
     *    import {Memory} from 'Types/source';
     *
     *    export default function(): object {
     *       const { someFunction } = await import('AnotherModule/anotherLib');
     *       const loadedOptions = someFunction();
     *       const ourOptions: {
     *          someOptions: true
     *       };
     *       return {
     *           ...loadedOptions,
     *           ...ourOptions
     *       }
     *    }
     * </pre>
     */
    editorOptionsName?: string;
    /**
     * Определяет видимость кнопки сворачивания редактора в панели фильтра.
     * @remark Чтобы редактор переходил в область "Можно отобрать" при сворачивании,
     * дополнительно задайте {@link viewMode}: 'extended' и {@link extendedCaption}.
     * @example
     * В следующем примере у редактора будет отображаться кнопка сворачивания.
     * При сворачивании редактор покажется в блоке "Можно отобрать"
     * <pre class="brush: js; highlight: [8-10]">
     *   this._filterSource = [{
     *        name: 'city',
     *        value: 'Yaroslavl',
     *        resetValue: null,
     *        caption: 'Город',
     *        editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
     *        editorOptions: {
     *          ...
     *        },
     *        viewMode: 'extended',
     *        extendedCaption: 'Город',
     *        expanderVisible: true
     *   }]
     * </pre>
     */
    expanderVisible?: boolean;
}
