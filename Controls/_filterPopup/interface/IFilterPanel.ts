/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
import { IControlOptions } from 'UI/Base';
import { IFilterItem } from 'Controls/filter';
import { TButtonStyle } from 'Controls/buttons';

export type THistorySaveMode = 'favorite' | 'pinned';
type TOrientation = 'vertical' | 'horizontal';

interface IFilterPanelTemplate {
    templateName: string;
    templateOptions: unknown;
}

export interface IFilterDetailPanelOptions extends IControlOptions {
    items: IFilterItem[];
    additionalTemplate: IFilterPanelTemplate;
    additionalTemplateProperty: string;
    historyId: string;
    historySaveMode: THistorySaveMode;
    orientation: TOrientation;
    headingCaption: string;
    headingStyle: string;
    headingFontSize: string;
    applyButtonCaption: string;
    applyButtonStyle?: TButtonStyle;
    removeOutdatedFiltersFromHistory?: boolean;
}

/**
 * Интерфейс {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-panel/ панели фильтров}.
 * @interface Controls/_filterPopup/interface/IFilterPanel
 * @public
 */

/*
 * Interface for filter panel
 * @interface Controls/_filterPopup/interface/IFilterPanel
 * @public
 * @author Герасимов А.М.
 */

/**
 * @typedef {Object} itemTpl
 * @property {String} templateName
 * @property {Object} templateOptions
 */

/**
 * @typedef {Object} additionalTpl
 * @property {String} templateName
 * @property {Object} templateOptions
 */

/**
 * @name Controls/_filterPopup/interface/IFilterPanel#orientation
 * @cfg {String} Ориентация панели фильтрации.
 * @variant vertical Вертикальная ориентация панели. Блок истории отображается внизу.
 * @variant horizontal Горизонтальная ориентация панели. Блок истории отображается справа.
 * @default vertical
 * @remark
 * Если указано значение "horizontal", но на панели нет истории фильтрации, контрол будет отображаться в одном столбце.
 * @example
 * В данном примере панель будет отображаться в две колонки.
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <Controls.filterPopup:Panel
 *    source="{{_source}}"
 *    orientation="horizontal"
 *    historyId="myHistoryId">
 *    <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
 *    <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
 * </Controls.filterPopup:Panel>
 * </pre>
 */

/*
 * @name Controls/_filterPopup/interface/IFilterPanel#orientation
 * @cfg {String} Sets the orientation of panel in one of two directions.
 * @variant vertical Vertical orientation of the panel. The history block is displayed below.
 * @variant horizontal Horizontal orientation of the panel. History block is displayed on the right.
 * @default vertical
 * @remark
 * If a “horizontal” value is specified, but there is no history in the panel, the component will be displayed in one column..filterPopup:Panel>
 * </pre>
 */

/**
 * @name Controls/_filterPopup/interface/IFilterPanel#headingCaption
 * @cfg {String} Текст заголовка.
 * @default Selected
 * @example
 * В этом примере панель имеет заголовок "Sales"
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <Controls.filterPopup:Panel
 *    items="{{_items}}"
 *    headingCaption="Sales">
 *    <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
 *    <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
 * </Controls.filterPopup:Panel>
 * </pre>
 * @see Controls/heading:Title#caption
 */

/*
 * @name Controls/_filterPopup/interface/IFilterPanel#headingCaption
 * @cfg {String} Text heading.
 * @default "Selected"
 * @see Controls/heading:Title#caption
 */

/**
 * @name Controls/_filterPopup/interface/IFilterPanel#headingStyle
 * @cfg {String} Стиль заголовка панели фильтров.
 * @variant primary Стиль заголовка - основной.
 * @variant secondary Стиль заголовка - дополнительный.
 * @default secondary
 * @example
 * В этом примере панель имеет стиль заголовка - primary.
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <Controls.filterPopup:Panel
 *     items={{_items}}
 *     headingStyle="primary">
 *     <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
 *     <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
 * </Controls.filterPopup:Panel>
 * </pre>
 * @see Controls/heading:Title#style
 */

/*
 * @name Controls/_filterPopup/interface/IFilterPanel#headingStyle
 * @cfg {String} The heading style of the filter panel.
 * @variant primary Primary heading style.
 * @variant secondary Secondary heading style.
 * @default secondary
 * @see Controls/heading:Title#style
 */

/**
 * @name Controls/_filterPopup/interface/IFilterPanel#itemTemplate
 * @cfg {TemplateFunction|String} Шаблон отображения элементов.
 * @default indefined
 * @remark
 * Чтобы отобразить строку, которая формируется значениями элементов, необходимо выполнить bind:textValue="item.textValue".
 * Для правильного отображения необходимо описать шаблоны для всех элементов.
 * @example
 * Пример настройки параметров itemTemplate.
 * <pre class="brush: html; highlight: [3]">
 * <!-- WML -->
 * <Controls.filterPopup:DetailPanel items="{{_items}}">
 *    <ws:itemTemplate templateName="wml!Module/itemTemplate"/>
 * </Controls.filterPopup:Panel>
 * </pre>
 *
 * <pre class="brush: html">
 * <!-- Module/itemTemplate.wml -->
 * <ws:template name="type">
 *    <Controls.filterPopup:Dropdown
 *       bind:selectedKeys="item.value"
 *       bind:textValue="item.textValue"
 *       keyProperty="key"
 *       displayProperty="title"
 *       source="{{item.source}}" />
 * </ws:template>
 *
 * <ws:template name="deleted">
 *    <Controls.filterPopup:Text
 *       bind:value="item.value"
 *       caption="{{item.textValue}}"/>/>
 * </ws:template>
 *
 * <ws:partial template="{{item.id}}" item="{{item}}"/>
 * </pre>
 *
 * <pre class="brush: js">
 * // TypeScript
 * import {Memory} from 'Types/source';
 *
 * protected _items: array;
 * protected _beforeMount():void {
 *     this._items = [
 *         {
 *             id: 'type',
 *             value: ['1'],
 *             resetValue: ['1'],
 *             source: new Memory({
 *                 data: [
 *                     { id: '1', title: 'All types' },
 *                     { id: '2', title: 'Meeting' },
 *                     { id: 3, title: 'VideoConference' }
 *                 ],
 *                 keyProperty: 'id'
 *             })
 *         },
 *         {
 *             id: 'deleted',
 *             value: true,
 *             resetValue: false,
 *             textValue: 'Deleted'
 *         }
 *     ];
 * }
 * </pre>
 * @see itemTemplateProperty
 */

/*
 * @name Controls/_filterPopup/interface/IFilterPanel#itemTemplate
 * @cfg {itemTpl} Template for item render.
 * @remark
 * To display in a string, that is formed by the values from items, you must make a bind:textValue="item.textValue".
 * For proper display, templates for all items should be described.
 * @see itemTemplateProperty
 */

/**
 * @name Controls/_filterPopup/interface/IFilterPanel#additionalTemplate
 * @cfg {TemplateFunction|String} Шаблон отображения элемента в блоке "Можно отобрать".
 * @default undefined
 * @remark
 * Для отображения фильтра в дополнительном блоке необходимо для поции visibility задать значение false.
 * При указании visibility = true фильтр будет отображаться в основном блоке, но при сбросе фильтра он будет отображаться в дополнительном блоке.
 * @example
 * Пример настройки параметров additionalTemplate
 * <pre class="brush: html; highlight: [3]">
 * <!-- WML -->
 * <Controls.filterPopup:Panel items="{{_items}}"">
 *    <ws:additionalTemplate templateName="wml!MyModule/additionalTemplate"/>
 * </Controls.filterPopup:Panel>
 * </pre>
 *
 * <pre class="brush: html;">
 * <!-- MyModule/additionalTemplate.wml -->
 * <ws:template name="type">
 *    <Controls.filterPopup:Dropdown
 *       bind:selectedKeys="item.value"
 *       keyProperty="key"
 *       displayProperty="title"
 *       source="{{item.source}}">
 * </ws:template>
 *
 * <ws:template name="deleted">
 *    <Controls.filterPopup:Link caption="item.textValue"/>
 * </ws:template>
 *
 * <ws:partial template="{{item.id}}" item="{{item}}"/>
 * </pre>
 *
 * <pre class="brush: js;">
 * // JavaScript
 * this._items = [
 *    {
 *       id: 'type',
 *       value: ['1'],
 *       resetValue: ['1'],
 *       visibility: true,
 *       source: new MemorySource({
 *          data: [
 *             { id: '1', title: 'All types' },
 *             { id: '2', title: 'Meeting' },
 *             { id: 3, title: 'Videoconference' }
 *          ],
 *          keyProperty: 'id'
 *       })
 *    },
 *    { id: 'deleted', value: true, resetValue: false, textValue: 'Deleted', visibility: false }
 * ];
 * </pre>
 * @see additionalTemplateProperty
 */

/*
 * @name Controls/_filterPopup/interface/IFilterPanel#additionalTemplate
 * @cfg {additionalTpl} Template for item render in the additional block.
 * @remark
 * To display the filter in the additional block, you need to specify in the settings item visibility: false.
 * When specifying visibility = true, the filter will be displayed in the main block, but when the filter is reset, it will be displayed in the additional block.
 * @see additionalTemplateProperty
 */

/**
 * @name Controls/_filterPopup/interface/IFilterPanel#footerTemplate
 * @cfg {TemplateFunction|String} Шаблон отображения подвала в панели фильтра.
 * @default undefined
 * @example
 * Пример настройки параметра footerTemplate
 * <pre class="brush: html; highlight: [3-5]">
 * <!-- WML -->
 * <Controls.filterPopup:Panel>
 *    <ws:footerTemplate>
 *       <ws:partial template="MyModule/control:footerTemplate" />
 *    </ws:footerTemplate>
 * </Controls.filterPopup:Panel>
 * </pre>
 */

/*
 * @name Controls/_filterPopup/interface/IFilterPanel#footerTemplate
 * @cfg {Function|String} Template that will be rendered below the filter panel
 */

/**
 * @name Controls/_filterPopup/interface/IFilterPanel#emptyHistoryTemplate
 * @cfg {TemplateFunction|String} Шаблон, который отображаеться в блоке с историей фильтров,
 * если фильтров, сохранённых в историю, ещё нет.
 * @default undefined
 * @demo Controls-demo/Filter_new/DetailPanel/EmptyHistoryTemplate/Index
 * @example
 * Пример настройки опции emptyHistoryTemplate
 * <pre class="brush: html; highlight: [3-5]">
 * <!-- WML -->
 * <Controls.filterPopup:Panel>
 *    <ws:emptyHistoryTemplate>
 *       <ws:partial template="MyModule/control:emptyHistoryTemplate" />
 *    </ws:emptyHistoryTemplate>
 * </Controls.filterPopup:Panel>
 * </pre>
 */

/**
 * @name Controls/_filterPopup/interface/IFilterPanel#additionalTemplateProperty
 * @demo Controls-demo/Filter_new/FilterView/Source/AdditionalTemplateProperty/Index
 * @cfg {String} Имя свойства элемента, содержащего шаблон отображения элемента в блоке "Можно отобрать". Если параметр не задан, вместо него используется additionalTemplate.
 * @default undefined
 * @remark
 * Для отображения фильтра в дополнительном блоке необходимо в свойстве visibility задать значение false.
 * Если в свойстве visibility задано значение true, тогда фильтр будет отображаться в основном блоке, но при сбросе фильтра он будет отображаться в дополнительном блоке.
 * @example
 * В этом примере шаблон отображения фильтра по "Удаленным" в дополнительном блоке будет загружен из файла MyModule/addTemplateDeleted.wml
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <Controls.filterPopup:Panel
 *    items="{{_items}}"
 *    additionalTemplateProperty="myAddTpl">
 *    <ws:itemTemplate templateName="wml!Module/itemTemplate"/>
 *    <ws:additionalTemplate templateName="wml!MyModule/additionalTemplate"/>
 * </Controls.filterPopup:Panel>
 * </pre>
 *
 * <pre class="brush: html">
 * <!-- MyModule/addTemplateDeleted.wml -->
 * <Controls.filterPopup:Link caption="item.textValue"/>
 * </pre>
 *
 * <pre class="brush: js; highlight: [23]">
 * // JavaScript
 * this._items = [
 *    {
 *       id: 'type',
 *       value: ['1'],
 *       resetValue: ['1'],
 *       visibility: true,
 *       source: new MemorySource({
 *          data: [
 *             { id: '1', title: 'All types' },
 *             { id: '2', title: 'Meeting' },
 *             { id: 3, title: 'Videoconference' }
 *          ],
 *          keyProperty: 'id'
 *       })
 *    },
 *    {
 *       id: 'deleted',
 *       value: true,
 *       resetValue: false,
 *       textValue: 'Deleted',
 *       visibility: false,
 *       myAddTpl="wml!MyModule/addTemplateDeleted"
 *     }
 * ];
 * </pre>
 * @see additionalTemplate
 */

/*
 * @name Controls/_filterPopup/interface/IFilterPanel#additionalTemplateProperty
 * @cfg {String} Name of the item property that contains template for item render in the additional block. If not set, additionalTemplate is used instead.
 * @remark
 * To display the filter in the additional block, you need to specify in the settings item visibility: false.
 * When specifying visibility = true, the filter will be displayed in the main block, but when the filter is reset, it will be displayed in the additional block.
 * @see additionalTemplate
 */

/**
 * @name Controls/_filterPopup/interface/IFilterPanel#applyButtonCaption
 * @default Отобрать
 * @demo Controls-demo/Filter_new/DetailPanel/ApplyButtonCaption/Index
 * @cfg {String} Текст на кнопке применения фильтрации.
 */

/**
 * @name Controls/_filterPopup/interface/IFilterPanel#applyButtonStyle
 * @default primary
 * @cfg {Controls/_buttons/interface/IButton/TButtonStyle.typedef} Стиль отображения кнопки применения фильтрации.
 */

/**
 * @name Controls/_filterPopup/interface/IFilterPanel#groupProperty
 * @cfg {String} Имя параметра, содержащего название группы элемента. Поддерживается группировка только в блоке "Можно отобрать".
 * @demo Controls-demo/Filter_new/DetailPanel/GroupProperty/Index
 * @default undefined
 */

/**
 * @name Controls/_filterPopup/interface/IFilterPanel#itemTemplateProperty
 * @cfg {String} Имя параметра, содержащего шаблон отображения элемента. Если не установлен, вместо него используется "itemTemplate".
 * @default undefined
 * @remark
 * Для отображения в строке, которая формируется значениями элементов, необходимо выполнить bind:textValue="item.textValue".
 * Для правильного отображения необходимо описать шаблоны для всех элементов.
 * @demo Controls-demo/Filter_new/FilterView/Source/ItemTemplateProperty/Index
 * @example
 * В этом примере шаблон отображения фильтра по "Типу" в главном блоке будет загружен из файлового модуля Module/myTemplateForType.wml
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <Controls.filterPopup:Panel
 *    items="{{_items}}"
 *    itemTemplateProperty="myTpl">
 *    <ws:itemTemplate templateName="wml!Module/itemTemplate"/>
 * </Controls.filterPopup:Panel>
 * </pre>
 *
 * <pre class="brush: html;">
 * <!-- Module/myTemplateForType.wml -->
 * <Controls.filterPopup:Dropdown
 *    bind:selectedKeys="item.value"
 *    bind:textValue="item.textValue"
 *    keyProperty="key"
 *    displayProperty="title"
 *    source="{{item.source}}" />
 * </pre>
 *
 * <pre class="brush: js; highlight: [3]">
 * // JavaScript
 * this._items = [
 *    { id: 'type', value: ['0'], resetValue: ['0'], myTpl: 'wml!Module/myTemplateForType' },
 *    { id: 'deleted', value: true, resetValue: false, textValue: 'Deleted' }
 * ];
 * </pre>
 * @see itemTemplate
 */

/*
 * @name Controls/_filterPopup/interface/IFilterPanel#itemTemplateProperty
 * @cfg {String} Name of the item property that contains template for item render. If not set, itemTemplate is used instead.
 * @remark
 * To display in a string, that is formed by the values from items, you must make a bind:textValue="item.textValue".
 * For proper display, templates for all items should be described.
 * @see itemTemplate
 */

/**
 * @name Controls/_filterPopup/interface/IFilterPanel#historyId
 * @cfg {String} Уникальный идентификатор для сохранения истории.
 * @default undefined
 * @demo Controls-demo/Filter_new/DetailPanel/HistoryId/Index
 * @remark Для корректной работы необходимо настроить параметр items в контроле с помощью {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter/filter-view/base-settings/ инструкции}.
 */

/*
 * @name Controls/_filterPopup/interface/IFilterPanel#historyId
 * @cfg {String} Unique id for save history.
 * @remark For the correct work of the history mechanism, you need to configure the items property on the control by the <a href='/doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter/filter-view/base-settings/'>instruction</a>.
 */

/**
 * @name Controls/_filterPopup/interface/IFilterPanel#items
 * @cfg {Array.<Controls/filter:IFilterItem>} Структура для визуального представления фильтра.
 */

/**
 * @event itemsChanged Происходит при изменении опции стукрутуры фильтра.
 * @name Controls/_filterPopup/interface/IFilterPanel#itemsChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<Controls/filter:IFilterItem>} items Конфигурация свойств фильтра.
 */

/*
 * @event Occurs when items options was changed.
 * @name Controls/_filterPopup/interface/IFilterPanel#itemsChanged
 * @param {Event}
 * @param {Array.<Controls/filter:IFilterItem>} items Filter items configuration.
 */
