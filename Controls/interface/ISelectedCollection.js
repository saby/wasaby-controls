/* eslint-disable */
define('Controls/interface/ISelectedCollection', [], function () {
   /**
    * Интерфейс для выбора элементов из списка.
    * @interface Controls/interface/ISelectedCollection
    * @public
    */
   /*
    * Interface to select items from the list.
    * @interface Controls/interface/ISelectedCollection
    * @public
    * @author Герасимов А.М.
    */
   /**
    * @name Controls/interface/ISelectedCollection#displayProperty
    * @cfg {String} Имя поля элемента, значение которого будет отображаться.
    * @example
    * <pre class="brush: html">
    * <!-- WML -->
    * <Controls.lookup:Selector
    *    source="{{_source}}"
    *    displayProperty="title" />
    * </pre>
    */
   /*
    * @name Controls/interface/ISelectedCollection#displayProperty
    * @cfg {String} Name of the item property which content will be displayed.
    * @example
    * <pre class="brush: html">
    * <!-- WML -->
    * <Controls.lookup:Selector
    *    source="{{_source}}"
    *    displayProperty="title" />
    * </pre>
    */
   /**
    * @name Controls/interface/ISelectedCollection#multiSelect
    * @cfg {Boolean} Включает режим множественного выбора значений.
    * @default false
    * @variant true Разрешён множественный выбор значений.
    * @variant false Можно выбрать только одно занчение. При выборе нового значения из справочника, оно перетирает старое.
    *
    * @example
    * <pre class="brush: html">
    * <!-- WML -->
    * <Controls.lookup:Selector
    *    source="{{_source}}"
    *    multiSelect="{{true}}" />
    * </pre>
    */
   /*
    * @name Controls/interface/ISelectedCollection#multiSelect
    * @cfg {Boolean} Enables multiple value selection mode.
    * @default false
    * @variant true You can select as many values as you want.
    * @variant false After selecting the first value, the input field disappears. When you select a new value from the directory, it grinds the old.
    *
    * @example
    * <pre class="brush: html">
    * <!-- WML -->
    * <Controls.lookup:Selector
    *    source="{{_source}}"
    *    multiSelect="{{true}}" />
    * </pre>
    */
   /**
    * @name Controls/interface/ISelectedCollection#maxVisibleItems
    * @cfg {Number} Максимальное количество элементов для отображения в поле выбора с автовысотой {@link multiLine}.
    * @default 7
    * @remark
    * Если элементов выбрано больше, чем указано в опции maxVisibleItems,
    * то эти элементы отображены не будут, их можно отобразить, если нажать на счётчик всех записей.
    * Актуально только в многострочном режиме.
    * @see Controls/interface/ISelectedCollection#multiSelect
    * @example
    * <pre class="brush: html">
    * <!-- WML -->
    * <Controls.lookup:Selector
    *    source="{{_source}}"
    *    multiSelect="{{true}}"
    *    maxVisibleItems="{{3}}" />
    * </pre>
    */
   /*
    * @name Controls/interface/ISelectedCollection#maxVisibleItems
    * @cfg {Integer} The maximum number of items to display, the rest will be hidden under the counter.
    * @default 7
    * @remark
    * Only relevant in multi line mode.
    * @see Controls/interface/ISelectedCollection#multiSelect
    *
    * @example
    * <pre class="brush: html">
    * <!-- WML -->
    * <Controls.lookup:Selector
    *    source="{{_source}}"
    *    multiSelect="{{true}}"
    *    maxVisibleItems="{{3}}" />
    * </pre>
    */
   /**
    * @name Controls/interface/ISelectedCollection#counterVisibility
    * @cfg {String} Видимость счетчика выбранных записей.
    * @variant 'visible' Счетчик отображается, цвет фона счётчика зависит от опции {@link backgroundStyle}.
    * @variant 'hidden' Счётчик скрыт, вместо счётчика выводится "..." c прозрачным фоном.
    * @default 'visible'
    * @example
    * В приведённом примере у поля связи будет скрыт счётчик выбранных записей
    * <pre class="brush: js; highlight: [4]">
    *     <Controls.lookup:Input
    *       source="{{_source}}"
    *       multiSelect="{{true}}"
    *       counterVisibility="hidden"
    *     />
    * </pre>
    * @remark Вариант "hidden" рекомендуется использовать, когда поле связи лежит на цветом фоне (например в графической шапке)
    * @see backgroundStyle
    */
   /**
    * @name Controls/interface/ISelectedCollection#itemTemplate
    * @cfg {Function|String} Шаблон отображения выбранного элемента.
    * @markdown
    * @remark
    * Для отображения элементов {@link Controls/lookup:Input} и {@link Controls/lookup:Selector} используйте базовый шаблон {@link Controls/lookup:ItemTemplate}.
    *
    * @example
    * <pre class="brush: html">
    * <!-- WML -->
    * <Controls.lookup:Selector
    *    source="{{_source}}"
    *    keyProperty="id">
    *    <ws:itemTemplate>
    *       <ws:partial template="Controls/lookup:ItemTemplate"
    *          fontColorStyle="primary"
    *          size="xl"
    *          displayProperty="title"
    *          clickable="{{true}}"/>
    *    </ws:itemTemplate>
    * </Controls.lookup:Selector>
    * </pre>
    */
   /**
    * @event Controls/interface/ISelectedCollection#itemsChanged Происходит при изменении набора выбранной коллекции.
    * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
    * @param {RecordSet|List} items Список выбранных записей.
    *
    * @example
    * В следующем примере создается Controls/lookup:Selector и демонстрируется сценарий использования.
    * <pre class="brush: html">
    * <!-- WML -->
    * <Controls.lookup:Selector
    *    source="{{_source}}"
    *    keyProperty="id"
    *    on:itemsChanged="onItemsChanged()" />
    * </pre>
    * <pre>
    * // JavaScript
    * onItemsChanged: function(e, items) {
    *    this.prepareItems(items);
    * }
    * </pre>
    */
   /*
    * @event Controls/interface/ISelectedCollection#itemsChanged Occurs when changing the set of the selected collection.
    * @param {UI/Events:SyntheticEvent} eventObject The event descriptor.
    * @param {RecordSet|List} items List of selected entries.
    *
    * @example
    * The following example creates Controls/lookup:Selector and shows how to handle the event.
    * <pre class="brush: html">
    * <!-- WML -->
    * <Controls.lookup:Selector
    *    source="{{_source}}"
    *    keyProperty="id"
    *    on:itemsChanged="onItemsChanged()" />
    * </pre>
    * <pre>
    * // JavaScript
    * onItemsChanged: function(e, items) {
    *    this.prepareItems(items);
    * }
    * </pre>
    */
   /**
    * @event Controls/interface/ISelectedCollection#itemClick Происходит при нажатии на элемент коллекции.
    * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
    * @param {RecordSet} item Элемент выбраной коллекции.
    * @param {UI/Events:SyntheticEvent} nativeEvent Дескриптор события мыши.
    *
    * @example
    * В следующем примере создается Controls/lookup:Selector и демонстрируется сценарий использования.
    * <pre class="brush: html">
    * <!-- WML -->
    * <Controls.lookup:Selector
    *    source="{{_source}}"
    *    keyProperty="id"
    *    on:itemClick="onItemClick()" />
    * </pre>
    * <pre class="brush: js">
    * // JavaScript
    * openCard: function() {
    *    ...
    * },
    *
    * onItemClick: function(e, item) {
    *    this.openCard(item);
    * }
    * </pre>
    */
   /*
    * @event Controls/interface/ISelectedCollection#itemClick Occurs when clicking on a collection item.
    * @param {UI/Events:SyntheticEvent} eventObject The event descriptor.
    * @param {RecordSet} item Item selected collection.
    * @param {UI/Events:SyntheticEvent} nativeEvent Descriptor of the mouse event
    *
    * @example
    * The following example creates Controls/lookup:Selector and shows how to handle the event.
    * <pre class="brush: html">
    * <!-- WML -->
    * <Controls.lookup:Selector
    *    source="{{_source}}"
    *    keyProperty="id"
    *    on:itemClick="onItemClick()" />
    * </pre>
    * <pre class="brush: js">
    * // JavaScript
    * openCard: function() {
    *    ...
    * },
    *
    * onItemClick: function(e, item) {
    *    this.openCard(item);
    * }
    * </pre>
    */
   /**
    * @event Controls/interface/ISelectedCollection#openInfoBox Происходит перед открытием всплывающего окна со всеми выбранными записями.
    * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
    * @param {Object} config Конфиг, по которому будет построено всплывающее окно.
    *
    * @example
    * В следующем примере создается Controls/lookup:Input и демонстрируется сценарий использования.
    * <pre class="brush: html">
    * <!-- WML -->
    * <Controls.lookup:Input
    *    source="{{_source}}"
    *    keyProperty="id"
    *    searchParam="title"
    *    on:openInfoBox="_openInfoBox()" />
    * </pre>
    * <pre>
    * // JavaScript
    * _openInfoBox: function(e, config) {
    *    config.maxWidth = 500;
    *    config.templateOptions.items = new collection.List({
    *    items: Chain(config.templateOptions.items).sort(function() {
    *       }).value()
    *    })
    * }
    * </pre>
    *
    * @see Controls/interface/ISelectedCollection#closeInfoBox
    */
   /*
    * @event Controls/interface/ISelectedCollection#openInfoBox Occurs before opening a pop-up with all selected entries
    * @param {UI/Events:SyntheticEvent} eventObject The event descriptor.
    * @param {Object} config Config on which popup will be built.
    *
    * @example
    * The following example creates Controls/lookup:Input and shows how to handle the event.
    * <pre class="brush: html">
    * <!-- WML -->
    * <Controls.lookup:Input
    *    source="{{_source}}"
    *    keyProperty="id"
    *    searchParam="title"
    *    on:openInfoBox="_openInfoBox()" />
    * </pre>
    * <pre>
    * // JavaScript
    * _openInfoBox: function(e, config) {
    *    config.maxWidth = 500;
    *    config.templateOptions.items = new collection.List({
    *    items: Chain(config.templateOptions.items).sort(function() {
    *       }).value()
    *    })
    * }
    * </pre>
    *
    * @see Controls/interface/ISelectedCollection#closeInfoBox
    */
   /**
    * @event Controls/interface/ISelectedCollection#closeInfoBox Происходит при закрытии всплывающего окна со всеми выбранными записями.
    * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
    *
    * @example
    * В следующем примере создается Controls/lookup:Input и демонстрируется сценарий использования.
    * <pre class="brush: html">
    * <!-- WML -->
    * <Controls.lookup:Input
    *    source="{{_source}}"
    *    keyProperty="id"
    *    searchParam="title"
    *    on:closeInfoBox="_closeInfoBox()" />
    * </pre>
    * <pre class="brush: js">
    * // JavaScript
    * _closeInfoBox: function() {
    *    this._isOpenInfoBox = false;
    * }
    * </pre>
    *
    * @see Controls/interface/ISelectedCollection#openInfoBox
    */
   /*
    * @event Controls/interface/ISelectedCollection#closeInfoBox Occurs when closing a pop-up with all selected entries.
    * @param {UI/Events:SyntheticEvent} eventObject The event descriptor.
    *
    * @example
    * The following example creates Controls/lookup:Input and shows how to handle the event.
    * <pre class="brush: html">
    * <!-- WML -->
    * <Controls.lookup:Input
    *    source="{{_source}}"
    *    keyProperty="id"
    *    searchParam="title"
    *    on:closeInfoBox="_closeInfoBox()" />
    * </pre>
    * <pre class="brush: js">
    * // JavaScript
    * _closeInfoBox: function() {
    *    this._isOpenInfoBox = false;
    * }
    * </pre>
    *
    * @see Controls/interface/ISelectedCollection#openInfoBox
    */
});
