/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export interface ILookupOptions {
    dataLoadCallback?: Function;
}

/**
 * Интерфейс для полей и кнопок выбора.
 * @public
 */
/*
 * Interface for fields and selection buttons.
 * @public
 * @author Kapustin I.A.
 */
export default interface ILookup {
    readonly '[Controls/_interface/ILookup]': boolean;
}

/**
 * @name Controls/_lookup/Button#showClearButton
 * @cfg {Boolean} Определяет, отображается ли кнопка очистки выбранных записей
 * @remark Опция актуальна для множественного выбора
 * @default true
 * @demo Controls-demo/LookupNew/SelectorButton/ShowClearButton/Index
 * @example
 * <pre class="brush: html; highlight: [7]">
 * <Controls.lookup:Selector
 *    source="{{_sourceButton}}"
 *    displayProperty="title"
 *    keyProperty="id"
 *    caption="Выберите компанию"
 *    multiSelect="{{true}}"
 *    showClearButton="{{false}}">
 * </Controls.lookup:Selector>
 * </pre>
 */

/**
 * Открыть справочник.
 * @function Controls/_interface/ILookup#showSelector
 * @returns {Promise}
 * @param {Object} popupOptions {@link Controls/popup:IStackOpener.PopupOptions.typedef Опции всплывающего окна}.
 *
 * @example
 * Откроем окно с заданными параметрами.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.lookup:Input
 *     name="directoriesLookup"
 *     bind:selectedKeys="_selectedKeysDirectories"
 *     source="{{_source}}"
 *     searchParam="title"
 *     keyProperty="id">
 *     <ws:placeholder>
 *         Specify the
 *         <Controls.lookup:Link caption="department" on:linkClick="showSelector('department')"/>
 *         and
 *         <Controls.lookup:Link caption="company" on:linkClick="showSelector('company')"/>
 *     </ws:placeholder>
 *     <ws:selectorTemplate templateName="Engine-demo/Selector/FlatListSelectorWithTabs/FlatListSelectorWithTabs"/>
 *     <ws:suggestTemplate templateName="Controls-demo/Input/Lookup/Suggest/SuggestTemplate"/>
 * </Controls.lookup:Input>
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * class MyControl extends Control<IControlOptions> {
 *    ...
 *    showSelector: function(selectedTab) {
 *       this._children.directoriesLookup.showSelector({
 *          templateOptions: {
 *             selectedTab: selectedTab
 *          }
 *       });
 *    }
 *    ...
 * }
 * </pre>
 */
/*
 * Open stack popup.
 * @function Controls/_interface/ILookup#showSelector
 * @returns {Promise}
 * @param {Object} popupOptions {@link Controls/_popup/Opener/Stack/PopupOptions.typedef Stack popup options.}
 *
 * @example
 * Откроем окно с заданными параметрами.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.lookup:Input
 *     name="directoriesLookup"
 *     bind:selectedKeys="_selectedKeysDirectories"
 *     source="{{_source}}"
 *     searchParam="title"
 *     keyProperty="id">
 *     <ws:placeholder>
 *         Specify the
 *         <Controls.lookup:Link caption="department" on:linkClick="showSelector('department')"/>
 *         and
 *         <Controls.lookup:Link caption="company" on:linkClick="showSelector('company')"/>
 *     </ws:placeholder>
 *     <ws:selectorTemplate templateName="Engine-demo/Selector/FlatListSelectorWithTabs/FlatListSelectorWithTabs"/>
 *     <ws:suggestTemplate templateName="Controls-demo/Input/Lookup/Suggest/SuggestTemplate"/>
 * </Controls.lookup:Input>
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * class MyControl extends Control<IControlOptions> {
 *    ...
 *    showSelector: function(selectedTab) {
 *       this._children.directoriesLookup.showSelector({
 *          templateOptions: {
 *             selectedTab: selectedTab
 *          }
 *       });
 *    }
 *    ...
 * }
 * </pre>
 */

/**
 * @event showSelector Происходит перед открытием справочника через интерфейс.
 * @name Controls/_interface/ILookup#showSelector
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Object} popupOptions {@link Controls/_popup/Opener/Stack/PopupOptions.typedef Опции всплывающего окна}
 * @example
 * <b>Пример 1<b> В следующем примере создается Controls/lookup:Input и демонстрируется сценарий использования.
 * <pre class="brush: html">
 * <Controls.lookup:Input
 *     source="{{_source}}"
 *     keyProperty="id"
 *     searchParam="title"
 *     on:showSelector="_showSelectorHandler()">
 * </Controls.lookup:Input>
 * </pre>
 *
 * <pre class="brush: js">
 * // JavaScript
 * _loadParams: function() {
 *    ...
 * },
 *
 * _showSelectorHandler: function(e, popupOptions) {
 *    var self = this;
 *
 *    this._loadParams(popupOptions).addCallback(function(newPopupOptions) {
 *       self.showSelector(newPopupOptions);
 *    });
 *
 *    // отменить открытие справочника
 *    return false;
 * }
 * </pre>
 *
 * <b>Пример 2</b> В следующем примере создается Controls/lookup:Selector. В событии модифицируются опции окна выбора так, чтобы оно открылось рядом с кнопкой.
 * <pre class="brush: html; highlight: [2]">
 *  <div name="selector">
 *    <Controls.lookup:Selector
 *        caption="Выберите компанию"
 *        source="{{_source}}"
 *        keyProperty="id"
 *        on:showSelector="_showSelectorHandler()">
 *            <ws:selectorTemplate templateName="myTemplate" mode="dialog"/>
 *    </Controls.lookup:Selector>
 * </div>
 * </pre>
 *
 * <pre class="brush: js; highlight: [3]">
 * _showSelectorHandler: function(e, popupOptions) {
 *    //Укажем элемент, рядом с которым откроется окно выбора
 *    popupOptions.target = this._children.selector;
 * }
 * </pre>
 */
/*
 * @event Occurs before opening the selector through the interface.
 * @name Controls/_interface/ILookup#showSelector
 * @param {UI/Events:SyntheticEvent} eventObject The event descriptor.
 * @param {Object} popupOptions {@link Controls/_popup/Opener/Stack/PopupOptions.typedef Stack popup options.}
 * @example
 * The following example creates Controls/lookup:Input and shows how to handle the event.
 * <pre class="brush: html">
 * <Controls.lookup:Input
 *     source="{{_source}}"
 *     keyProperty="id"
 *     searchParam="title"
 *     on:showSelector="_showSelectorHandler()">
 * </Controls.lookup:Input>
 * </pre>
 *
 * <pre class="brush: js">
 * // JavaScript
 * _loadParams: function() {
 *    ...
 * },
 *
 * _showSelectorHandler: function(e, popupOptions) {
 *    var self = this;
 *
 *    this._loadParams(popupOptions).addCallback(function(newPopupOptions) {
 *       self.showSelector(newPopupOptions);
 *    });
 *
 *    // отменить открытие справочника
 *    return false;
 * }
 * </pre>
 */

/**
 * @name Controls/_interface/ILookup#lazyItemsLoading
 * @cfg {Boolean} Включает режим, при котором загружается только количество элементов, указанное в maxVisibleItems. Оставшиеся элементы будут догружены при клике по кнопке счетчика.
 * @default false
 * @remark
 * Актуально только при multiSelect: true.
 *
 * @demo Controls-demo/Lookup/Index
 *
 * @see Controls/interface/ISelectedCollection#maxVisibleItems
 * @see Controls/interface/ISelectedCollection#multiSelect
 */
