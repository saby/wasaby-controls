/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { IFilterItem } from 'Controls/_filter/View/interface/IFilterItem';

export interface IFilterViewOptions extends IControlOptions {
    source: IFilterItem[];
    itemTemplate?: TemplateFunction;
    historyId?: string;
    alignment?: 'right' | 'left';
    emptyText?: string;

    resetButtonVisibility?: string;
    resetFilterButtonCaption?: string;

    detailPanelTemplateName?: string;
    detailPanelTemplateOptions?: unknown;
    detailPanelPopupOptions?: unknown;
    detailPanelTopTemplateName?: string;
    detailPanelTopTemplateOptions?: string;

    panelTemplateName?: string;
    panelTemplateOptions?: unknown;

    useStore?: boolean;
}

/**
 * Интерфейс для поддержки просмотра и редактирования полей фильтра.
 * @public
 */
export interface IFilterView {
    readonly '[Controls/_filter/View/interface/IFilterView]': boolean;
}

/**
 * @name Controls/_filter/View/interface/IFilterView#emptyText
 * @default Все
 * @cfg {String} Текстовое значение, которое будет использовано для отображения рядом с кнопкой, когда во всех фильтрах установлено значение "по-умолчанию"
 * @demo Controls-ListEnv-demo/Filter/NotConnectedView/EmptyText/WithDetailPanel/Index
 * @remark
 * Текст отображается только в случае, если настроены быстрые фильтры.
 * @example
 * <pre class="brush: html">
 * <Controls.filter:View
 *    source="{{_source}}"
 *    detailPanelTemplateName="wml!MyModule/detailPanelTemplate"
 *    emptyText="Все состояния"
 *    panelTemplateName="Controls/filterPopup:SimplePanel"/>
 * </pre>
 */

/**
 * @name Controls/_filter/View/interface/IFilterView#source
 * @cfg {Array.<Controls/filter:IFilterItem>} Устанавливает список полей фильтра и их конфигурацию.
 * В числе прочего, по конфигурации определяется визуальное представление поля фильтра в составе контрола.
 * @demo Controls-demo/FilterOld/FilterView/Source/AdditionalTemplateProperty/Index
 * @example
 * Пример настройки для двух фильтров.
 * Первый фильтр отобразится в главном блоке "Отбираются" и не будет сохранен в истории.
 * Второй фильтр будет отображаться в блоке "Можно отобрать", так как для него установлено свойство visibility = false.
 * <pre class="brush: html">
 * <!-- MyModule.wml -->
 * <Controls.filter:View
 *    source="{{_source}}"
 *    detailPanelTemplateName="wml!MyModule/detailPanelTemplate"
 *    panelTemplateName="Controls/filterPopup:SimplePanel"/>
 * </pre>
 * <pre class="brush: html">
 * <!-- detailPanelTemplate.wml -->
 * <Controls.filterPopup:DetailPanel items="{{items}}">
 *    <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
 *    <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
 * </Controls.filterPopup:DetailPanel>
 * </pre>
 * <pre class="brush: js">
 * // MyModule.js
 * _source: null,
 * _beforeMount: function(options) {
 *    this._source = [
 *       { name: 'type', value: ['1'], resetValue: ['1'], textValue: '', viewMode: 'frequent', doNotSaveToHistory: true,
 *          editorOptions: {
 *             source: new sourceLib.Memory({
 *                keyProperty: 'id',
 *                data: [
 *                   { id: '1', title: 'Yaroslavl' },
 *                   { id: '2', title: 'Moscow' },
 *                   { id: '3', title: 'St-Petersburg' }
 *                ]
 *             }),
 *             displayProperty: 'title',
 *             keyProperty: 'id'
 *          }
 *       },
 *       { name: 'group', value: '1', resetValue: 'null', textValue: '', viewMode: 'basic' },
 *       { name: 'deleted', value: true, resetValue: false, textValue: 'Deleted', viewMode: 'extended' }
 *    ];
 * }
 * </pre>
 */

/*
 * @name Controls/_filter/View/interface/IFilterView#source
 * @cfg {Array.<Controls/_filter/View/interface/IFilterView/FilterItem.typedef>} Special structure for the visual representation of the filter.
 * @remark
 * The "value" from every item will insert in filter by "name" of this item.
 * @example
 * Example setting option "filterSource" for two filters.
 * The first filter will be displayed in the main block "Selected"
 * The second filter will be displayed in the "Also possible to select" block, because the property is set for it visibility = false.
 * TMPL:
 * <pre>
 *    <Controls.filter:View
 *       source="{{_source}}"
 *       detailPanelTemplateName="wml!MyModule/detailPanelTemplate"
 *       panelTemplateName="Controls/filterPopup:SimplePanel"/>
 * </pre>
 *
 * MyModule/detailPanelTemplate.wml
 * <pre>
 *    <Controls.filterPopup:DetailPanel>
 *       <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
 *       <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
 *    </Controls.filterPopup:DetailPanel>
 * </pre>
 *
 * JS:
 * <pre>
 *    this._source = [
 *       { name: 'type', value: ['1'], resetValue: ['1'], textValue: '', viewMode: 'frequent',
 *          editorOptions: {
 *                 source: new sourceLib.Memory({
 *                    keyProperty: 'id',
 *                    data: [
 *                       { id: '1', title: 'Yaroslavl' },
 *                       { id: '2', title: 'Moscow' },
 *                       { id: '3', title: 'St-Petersburg' }
 *                    ]
 *                 }),
 *                 displayProperty: 'title',
 *                 keyProperty: 'id'
 *          }
 *       },
 *       { name: 'group', value: '1', resetValue: 'null', textValue: '', viewMode: 'basic' },
 *       { name: 'deleted', value: true, resetValue: false, textValue: 'Deleted', viewMode: 'extended' }
 *    ];
 * </pre>
 */

/**
 * @name Controls/_filter/View/interface/IFilterView#detailPanelTemplateName
 * @cfg {String} Шаблон всплывающей панели, которая открывается после клика по кнопке.
 * @remark
 * В качестве шаблона рекомендуется использовать контрол {@link Controls/filterPopup:DetailPanel}
 * Подробнее о настройке панели фильтров читайте {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-panel/ здесь}.
 * Важно: для ленивой загрузки шаблона в опции укажите путь до контрола.
 * @example
 * Пример настройки параметров для двух фильтров.
 * Шаблоны отображения обоих фильтров в главном блоке находятся в разделе "MyModule/mainBlockTemplate.wml"
 * Шаблоны отображения второго фильтра в дополнительном блоке находятся в разделе "MyModule/additionalBlockTemplate.wml"
 * <pre class="brush: html">
 * <!-- MyModule.wml -->
 * <Controls.filter:View
 *    source="{{_source}}"
 *    detailPanelTemplateName="wml!MyModule/panelTemplate"/>
 * </pre>
 *
 * <pre class="brush: html">
 * <!-- MyModule/panelTemplate.wml -->
 * <Controls.filterPopup:DetailPanel>
 *    <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
 *    <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
 * </Controls.filterPopup:DetailPanel>
 * </pre>
 *
 * <pre class="brush: js">
 * // MyModule.js
 * _items: null,
 * _beforeMount: function(options) {
 *    this._source = [
 *       { name: 'type', value: ['1'], resetValue: ['1'] },
 *       { name: 'deleted', value: true, resetValue: false, textValue: 'Deleted', viewMode: 'extended' }
 *    ];
 * }
 * </pre>
 * @see Controls/filterPopup:DetailPanel
 */

/*
 * @name Controls/_filter/View/interface/IFilterView#detailPanelTemplateName
 * @cfg {String} Template for the pop-up panel, that opens after clicking on the button.
 * @remark
 * As a template, it is recommended to use the control {@link Controls/filterPopup:DetailPanel}
 * The description of setting up the filter panel you can read <a href='/doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-panel/'>here</a>.
 * Important: for lazy loading template in the option give the path to the control
 * @example
 * Example setting options for two filters.
 * Templates for displaying both filters in the main block are in "MyModule/mainBlockTemplate.wml"
 * Templates for displaying second filter in the additional block are in "MyModule/additionalBlockTemplate.wml"
 * TMPL:
 * <pre>
 *    <Controls.filter:View
 *       items="{{_items}}""
 *       detailPanelTemplateName="wml!MyModule/panelTemplate"/>
 * </pre>
 *
 * MyModule/panelTemplate.wml
 * <pre>
 *    <Controls.filterPopup:DetailPanel>
 *       <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
 *       <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
 *    </Controls.filterPopup:Panel>
 * </pre>
 *
 * JS:
 * <pre>
 *    this._items = [
 *       { name: 'type', value: ['1'], resetValue: ['1'] },
 *       { name: 'deleted', value: true, resetValue: false, textValue: 'Deleted', viewMode: extended }
 *    ];
 * </pre>
 * @see <a href='/doc/platform/developmentapl/interface-development/controls/filterbutton-and-fastfilters/'>Guide for setup Filter Button and Fast Filter</a>
 * @see Controls/filterPopup:DetailPanel
 */

/**
 * @name Controls/_filter/View/interface/IFilterView#panelTemplateName
 * @cfg {String} Устанавливает шаблон всплывающей панели быстрых фильтров, которая открывается после клика по параметрам быстрого фильтра.
 * @default Controls/filterPopup:SimplePanel
 * @remark
 * При указании panelTemplateName, параметр items должен быть передан в шаблон.
 * Важно: для ленивой загрузки шаблона в опции укажите путь до контрола.
 * @example
 * <pre class="brush: html">
 * <!-- MyModule.wml -->
 * <Controls.filter:View
 *    source="{{_source}}"
 *    panelTemplateName="wml!MyModule/panelTemplate"/>
 * </pre>
 *
 * <pre class="brush: html">
 * <!-- MyModule/panelTemplate.wml -->
 * <Controls.filterPopup:SimplePanel items="{{_options.items}}" />
 * </pre>
 *
 * <pre class="brush: js">
 * // MyModule.js
 * _source: null,
 * _beforeMount: function(options) {
 *    this._source = [
 *       { name: 'type', value: ['1'], resetValue: ['1'], viewMode: 'frequent',
 *          editorOptions: {
 *             source: new sourceLib.Memory({
 *                keyProperty: 'id',
 *                data: [
 *                   { id: '1', title: 'Yaroslavl' },
 *                   { id: '2', title: 'Moscow' },
 *                   { id: '3', title: 'St-Petersburg' }
 *                ]
 *             }),
 *             displayProperty: 'title',
 *             keyProperty: 'id'
 *          }
 *       }
 *    ];
 * }
 * </pre>
 * @see Controls/filterPopup:SimplePanel
 */

/*
 * @name Controls/_filter/View/interface/IFilterView#panelTemplateName
 * @cfg {String} Template for the pop-up panel, that opens after clicking on fast filter parameters.
 * @remark
 * As a template, it is recommended to use the control {@link Controls/filterPopup:SimplePanel}
 * When specifying the panelTemplateName, the items option must be forwarded to the template.
 * Important: for lazy loading template in the option give the path to the control
 * @example
 * TMPL:
 * <pre>
 *    <Controls.filter:View
 *       source="{{_source}}""
 *       panelTemplateName="MyModule/panelTemplate"/>
 * </pre>
 *
 * MyModule/panelTemplate.wml
 * <pre>
 *    <Controls.filterPopup:SimplePanel items="{{_options.items}}"/>
 * </pre>
 *
 * JS:
 * <pre>
 *    this._source = [
 *       { name: 'type', value: ['1'], resetValue: ['1'], viewMode: 'frequent',
 *          editorOptions: {
 *                 source: new sourceLib.Memory({
 *                    keyProperty: 'id',
 *                    data: [
 *                       { id: '1', title: 'Yaroslavl' },
 *                       { id: '2', title: 'Moscow' },
 *                       { id: '3', title: 'St-Petersburg' }
 *                    ]
 *                 }),
 *                 displayProperty: 'title',
 *                 keyProperty: 'id'
 *          }
 *       }
 *    ];
 * </pre>
 * @see Controls/filterPopup:SimplePanel
 */

/**
 * @name Controls/_filter/View/interface/IFilterView#detailPanelTemplateOptions
 * @cfg {Object} Опции для шаблона всплывающей панели, которая задана в {@link detailPanelTemplateName}.
 * @remark
 * В качестве шаблона всплывающей панели рекомендуется использовать контрол {@link Controls/filterPopup:DetailPanel}.
 * @example
 * <pre class="brush: html; highlight: [5]">
 * <!-- MyModule.wml -->
 * <Controls.filter:View
 *    items="{{_items}}"
 *    detailPanelTemplateName="wml!MyModule/panelTemplate">
 *    <ws:detailPanelTemplateOptions historyId="demo_history_id"/>
 * </Controls.filter:View>
 * </pre>
 *
 * <pre class="brush: html; highlight: [2]">
 * <!-- MyModule/panelTemplate.wml -->
 * <Controls.filterPopup:DetailPanel items="{{items}}" historyId="{{historyId}}">
 *    <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
 *    <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
 * </Controls.filterPopup:Panel>
 * </pre>
 * @see detailPanelTemplateName
 */

/**
 * @name Controls/_filter/View/interface/IFilterView#detailPanelPopupOptions
 * @cfg {Controls/popup:IStickyOpener} Опции для Sticky-опенера, открывающего панель фильтров.
 * @example
 * <pre class="brush: html">
 * <!-- MyModule.wml -->
 * <Controls.filter:View
 *    items="{{_items}}"
 *    detailPanelTemplateName="wml!MyModule/panelTemplate">
 *        <ws:detailPanelPopupOptions closeOnOutSideClick="{{false}}"/>
 * </Controls.filter:View>
 * </pre>
 */

/**
 * @name Controls/_filter/View/interface/IFilterView#panelTemplateOptions
 * @cfg {Object} Опции для контрола, который передан в {@link panelTemplateName}.
 * @example
 * <pre class="brush: html">
 * <!-- MyModule.wml -->
 * <Controls.filter:View
 *    items="{{_items}}"
 *    panelTemplateName="wml!MyModule/panelTemplate">
 *    <ws:panelTemplateOptions itemTemplate="wml!MyModule/panelTemplate/itemTemplate"/>
 * </Controls.filter:View>
 * </pre>
 * <pre class="brush: html">
 * <!-- MyModule/panelTemplate/itemTemplate.wml -->
 * <Controls.filterPopup:SimplePanel itemTemplate="{{itemTemplate}}" />
 * </pre>
 * @see panelTemplateName
 */

/**
 * @typedef {String} Controls/_filter/View/interface/IFilterView/Alignment
 * @variant right Кнопка прикреплена к правому краю. Всплывающая панель открывается влево. Строка выбранных фильтров отображается слева от кнопки.
 * @variant left Кнопка прикреплена к левому краю. Всплывающая панель открывается вправо. Строка выбранных фильтров отображается справа от кнопки.
 */

/**
 * @name Controls/_filter/View/interface/IFilterView#alignment
 * @cfg {Controls/_filter/View/interface/IFilterView/Alignment.typedef} Задаёт выравнивание элементов объединённого фильтра.
 * @default right
 * @example
 * <pre class="brush: html">
 * <Controls.filter:View
 *    detailPanelTemplateName="wml!MyModule/panelTemplate"
 *    source="{{_source}}"
 *    alignment="left" />
 * </pre>
 * @demo Controls-ListEnv-demo/Filter/View/Alignment/Index
 */

/*
 * @typedef {String} Controls/_filter/View/interface/IFilterView/Alignment
 * right The button is attached to the right edge, the pop-up panel opens to the left.
 * left The button is attached to the left edge, the pop-up panel opens to the right.
 */

/*
 * @name Controls/_filter/View/interface/IFilterView#alignment
 * @cfg {Controls/_filter/View/interface/IFilterView/Alignment.typedef} Sets the direction in which the popup panel will open.
 * @default right
 * @remark
 * The string, that is formed by the values from items, also changes position.
 * @example
 * Example of opening the filter panel in the right
 * <pre>
 *    <Controls.filter:View
 *       detailPanelTemplateName="wml!MyModule/panelTemplate"
 *       source="{{_source}}"
 *       alignment="left" />
 * </pre>
 */

/**
 * @name Controls/_filter/View/interface/IFilterView#itemTemplate
 * @cfg {String|TemplateFunction} Устанавливает шаблон отображения элемента в строке выбранных значений рядом с кнопкой.
 * @default Controls/filter:ViewItemTemplate
 * @demo Controls-demo/FilterOld/FilterView/resources/ItemTemplates/Index
 * @example
 * <pre class="brush: html">
 * <Controls.filter:View
 *    source="{{_source}}"
 *    detailPanelTemplateName="wml!MyModule/detailPanelTemplate"
 *    panelTemplateName="Controls/filterPopup:SimplePanel">
 *    <ws:itemTemplate>
 *       <ws:partial
 *          template="Controls/filter:ViewItemTemplate"
 *          beforeContentTemplate="{{null}}" />
 *    </ws:itemTemplate>
 * </Controls.filter:View>
 * </pre>
 */

/**
 * @name Controls/_filter/View/interface/IFilterView#historyId
 * @cfg {String} Уникальный идентификатор для сохранения истории фильтров.
 * В истории будут храниться последние 10 применённых фильтров.
 * @remark
 * {@link Controls/filter:View Controls/filter:View} занимается только отображением истории последних применённых фильтров,
 * чтобы работало сохранение в историю, контрол должен быть обёрнут в {@link Controls/browser:Browser}.
 * При использовании стандартных раскладок опцию необходимо настроить на {@link Layout/browsers:Browser#historyId браузере}.
 * @example
 * <pre class="brush: html">
 * <Controls.filter:View detailTemplateName="EDO.MyPanelTemplate" historyId="myHistoryId"/>
 * </pre>
 */

/**
 * @typedef {String} ResetButtonVisibility
 * @variant hidden Кнопка "Сбросить" не отображается;
 * @variant visible Кнопка "Сбросить" отображается, если изменен хотя бы один фильтр, текст фильтра будет скрыт;
 * @variant withoutTextValue Кнопка "Сбросить" отображается, если изменен хотя бы один фильтр и в строке фильтров не выводится текст;
 */

/**
 * @name Controls/_filter/View/interface/IFilterView#resetButtonVisibility
 * @cfg {ResetButtonVisibility} Видимость кнопки сбросить, которая отображается рядом с иконкой фильтров.
 * @default hidden
 * @example
 * Пример отображения кнопки сбросить у фильтра
 * <pre class="brush: html; highlight: [4]">
 * <Controls.filter:Selector
 *     templateName="wml!MyModule/panelTemplate"
 *     items="{{_items}}"
 *     resetButtonVisibility="visible" />
 * </pre>
 */

/**
 * @event itemsChanged Происходит при изменении структуры фильтра.
 * @name Controls/_filter/View/interface/IFilterView#itemsChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<Controls/filter:IFilterItem>} items Новая структура фильтра.
 */

/*
 * @event Happens when source changed.
 * @name Controls/_filter/View/interface/IFilterView#sourceChanged
 * @param {UI/Events:SyntheticEvent} eventObject Descriptor of the event.
 * @param {Object} items New items.
 */

/**
 * Открыть панель фильтрации с шаблоном, который передан в опцию {@link detailPanelTemplateName}.
 * @name Controls/_filter/View/interface/IFilterView#openDetailPanel
 * @function
 * @example
 * <pre class="brush: js">
 * // TS
 * private _openFilter():void {
 *    this._children.filterView.openDetailPanel();
 * }
 * </pre>
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.buttons:Button caption='Open filter' on:click='_openFilter()'/>
 * <Controls.filter:View name='filterView' />
 * </pre>
 * @see Controls/_filter/View/interface/IFilterView#detailPanelTemplateName
 */

/**
 * Сбрасывает объединенный фильтр к значениям по умолчанию.
 * Для каждого фильтра такие значения задаются через свойство resetValue при настройке структуры фильтров (см. {@link source}).
 * @name Controls/_filter/View/interface/IFilterView#reset
 * @function
 * @example
 * <pre class="brush: js">
 * // TS
 * private _resetFilter():void {
 *     this._children.filterView.reset();
 * }
 * </pre>
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.buttons:Button caption='Reset filter' on:click='_resetFilter()'/>
 * <Controls.filter:View name='filterView'>
 *     ...
 * </Controls.filter:View>
 * </pre>
 * @see source
 */

/*
 * Open filter panel with template from option {@link Controls/_filter/View/interface/IFilterView#detailPanelTemplateName detailPanelTemplateName}.
 * @example
 * TS:
 * <pre>
 *    private _openFilter():void {
 *       this._children.filterView.openDetailPanel();
 *    }
 * </pre>
 *
 * WML:
 * <pre>
 *    <Controls.buttons:Button caption='Open filter' on:click='_openFilter()'/>
 *    <Controls.filter:View name='filterView'>
 *       ...
 *    </Controls.filter:View>
 * </pre>
 * @function Controls/_list/interface/IList#openDetailPanel
 */
/*
 * Reset filter.
 * @example
 * TS:
 * <pre>
 *    private _resetFilter():void {
 *       this._children.filterView.reset();
 *    }
 * </pre>
 *
 * WML:
 * <pre>
 *    <Controls.buttons:Button caption='Reset filter' on:click='_resetFilter()'/>
 *    <Controls.filter:View name='filterView'>
 *       ...
 *    </Controls.filter:View>
 * </pre>
 * @function Controls/_list/interface/IList#openDetailPanel
 */
