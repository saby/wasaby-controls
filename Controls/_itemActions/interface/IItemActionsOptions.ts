/**
 * @kaizen_zone fd2f64a5-d515-49d2-8fef-3e6af047ff0a
 */
import { TVisibility } from 'Controls/interface';
import { IContextMenuConfig } from './IContextMenuConfig';
import {
    IItemAction,
    TActionCaptionPosition,
    TItemActionsPosition,
    TItemActionVisibilityCallback,
} from 'Controls/interface';
import { TActionAlignment } from './IItemActionsTemplateConfig';

/**
 * @description Допустимые значения для опции {@link itemActionsVisibility}.
 * @typedef {String} Controls/_itemActions/interface/IItemActions/TItemActionsVisibility
 * @variant onhover Опции записи отображаются при наведении на запись.
 * @variant visible Опции записи отображены изначально.
 * @variant delayed Опции записи отображаются при наведении на запись и удержании над ней курсора мыши в течение 500 мс.
 */
/*
 * @typedef {String} Controls/_itemActions/interface/IItemActions/TItemActionsVisibility
 * @variant onhover ItemActions will be Initialized and displayed right after mouseenter over Item
 * @variant visible ItemActions will be Initialized and displayed on control mount
 * @variant delayed ItemActions will be Initialized and displayed after mouseenter with 500ms delay over Item
 */
export type TItemActionsVisibility = TVisibility | 'delayed';

export interface IItemActionsOptions {
    /**
     * @name Controls/_itemActions/interface/IItemActions#contextMenuVisibility
     * @cfg {Boolean} Видимость {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/menu-visibility/ контекстного меню} опций записи.
     * @default true
     * @remark
     * Если опция установлена в значение false, то контекстное меню будет скрыто.
     * @see Controls/_listCommands/helpers/moveHelpers/MoveHelpers#canMoveToDirection утилита, позволяющая определить, можно ли переместить запись вверх/вниз с учётом иерархии
     * @see contextMenuConfig
     */

    /* ENG
     * @name Controls/_itemActions/interface/IItemActions#contextMenuVisibility
     * @cfg {Boolean} Determines whether context menu should be shown on right-click.
     * @default true
     */
    contextMenuVisibility?: boolean;

    /**
     * @name Controls/_itemActions/interface/IItemActions#contextMenuConfig
     * @cfg {Controls/itemActions:IContextMenuConfig} Визуальное представление {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/show-type/ меню опций записи} и {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/menu-visibility/ контекстного меню}.
     * @remark
     * Подробнее о настройке читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/context-menu-config/ здесь}.
     * @see contextMenuVisibility
     */

    /* ENG
     * @name Controls/_itemActions/interface/IItemActions#contextMenuConfig
     * @cfg {Controls/itemActions:IContextMenuConfig} item actions menu config
     * @default true
     */
    contextMenuConfig?: Partial<IContextMenuConfig>;

    /**
     * @name Controls/_itemActions/interface/IItemActions#itemActions
     * @cfg {Array.<Controls/itemActions:IItemAction>} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи}.
     * @demo Controls-demo/list_new/ItemActions/ItemActionsPosition/Inside/Index
     */

    /* ENG
     * @name Controls/_itemActions/interface/IItemActions#itemActions
     * @cfg {Array.<Controls/itemActions:IItemAction>} Array of configuration objects for buttons which will be shown when the user hovers over an item.
     * <a href="/materials/DemoStand/app/Controls-demo%2FList%2FList%2FItemActionsPG">Example</a>.
     */
    itemActions?: IItemAction[];

    /**
     * @name Controls/_itemActions/interface/IItemActions#itemActionsPosition
     * @cfg {Controls/_interface/IAction/TItemActionsPosition.typedef} Позиционирование панели {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/position/ опций записи}.
     * @remark
     * Пример использования значения custom можно посмотреть в {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/position/#custom-position статье}.
     * @demo Controls-demo/list_new/ItemActions/ItemActionsPosition/Outside/Index Панель с опциями записи отображается под элементом.
     * @demo Controls-demo/list_new/ItemActions/ItemActionsPosition/Custom/Hidden/Index Панель с опциями записи не отображается. Опции записи доступны через контекстное меню.
     * @demo Controls-demo/list_new/ItemActions/ItemActionsPosition/Custom/CustomPosition/Index Панель с опциями записи расположена в произвольном месте элемента.
     * @example
     * Размещаем опции записи в шаблоне с использованием itemActionsTemplate:
     * <pre class="brush: html; highlight: [2,6]">
     * <!-- WML -->
     * <Controls.list:View itemActionsPosition="custom" itemActions="{{_itemActions}}">
     *    <ws:itemTemplate>
     *      <ws:partial template="Controls/list:ItemTemplate">
     *        <ws:contentTemplate>
     *          <ws:partial template="wml!customTemplateName" scope="{{contentTemplate}}" />
     *        </ws:contentTemplate>
     *      </ws:partial>
     *    </ws:itemTemplate>
     * </Controls.list:View>
     * </pre>
     *
     * <pre class="brush: html; highlight: [4,5,6,7]">
     * <!-- customTemplateName.wml -->
     * <div>{{item.contents.title}}</div>
     *    <ws:if data="{{!item.isSwiped()}}">
     *       <ws:partial template="{{itemActionsTemplate}}"
     *                  attr:class="some-custom-class-for-itemActions"
     *                  itemData="{{itemData}}"
     *                  scope="{{_options}}"/>
     *    </ws:if>
     * <div>{{item.contents.description}}</div>
     * </pre>
     * @see itemActions
     */

    /* ENG
     * @name Controls/_itemActions/interface/IItemActions#itemActionsPosition
     * @cfg {TItemActionsPosition} Position of item actions.
     * <a href="/materials/DemoStand/app/Controls-demo%2FList%2FList%2FItemActionsPG">Example</a>.
     * @variant inside Item actions will be positioned inside the item's row.
     * @variant outside Item actions will be positioned under the item's row.
     * @variant custom Item actions must be positioned in the itemTemplate.
     * <a href="/materials/DemoStand/app/Controls-demo%2FList%2FItemActionsCustom">Example</a>.
     * @example
     * Placing Item Actions in custom item template using itemActionsTemplate
     *<pre>
     * <Controls.list:View
     *    itemActionsPosition="custom"
     *    itemActions="{{_itemActions}}">
     *    <ws:itemTemplate>
     *      <ws:partial template="Controls/list:ItemTemplate">
     *        <ws:contentTemplate>
     *          <ws:partial template="wml!customTemplateName" scope="{{contentTemplate}}" />
     *        </ws:contentTemplate>
     *      </ws:partial>
     *    </ws:itemTemplate>
     * </Controls.list:View>
     *</pre>
     *
     * customTemplateName.wml:
     * <pre>
     *  <div>{{item.contents.title}}</div>
     *    <ws:if data="{{!item.isSwiped()}}">
     *      <ws:partial template="{{itemActionsTemplate}}"
     *                  attr:class="some-custom-class-for-itemActions"
     *                  itemData="{{itemData}}"
     *                  scope="{{_options}}"/>
     *    </ws:if>
     *  <div>{{item.contents.description}}</div>
     * </pre>
     *
     */
    itemActionsPosition?: TItemActionsPosition;

    /**
     * @name Controls/_itemActions/interface/IItemActions#itemActionsProperty
     * @cfg {String} Имя поля записи, в котором хранится конфигурация для панели с {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опциями записи}.
     * @remark
     * С помощью этой опции можно задать конфигурацию набора опций для каждой записи.
     * Подробнее об использовании функционала читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/separate-set-options/#item-actions-property здесь}.
     * @demo Controls-demo/list_new/ItemActions/ItemActionsProperty/Index
     * @example
     * <pre class="brush: js">
     * _beforeMount: function(newOptions) {
     *    this._viewSource = new source.Memory({
     *       keyProperty: 'id',
     *       data: [
     *          {
     *             id: 0,
     *             title: 'The agencies’ average client makes about $32,000 a year.',
     *             itemActions: [
     *                {
     *                   id: 1,
     *                   title: 'Прочитано',
     *                   showType: TItemActionShowType.TOOLBAR,
     *                },
     *                {
     *                   id: 2,
     *                   icon: 'icon-PhoneNull',
     *                   title: 'Позвонить',
     *                   showType: TItemActionShowType.MENU_TOOLBAR,
     *                },
     *                {
     *                   id: 3,
     *                   icon: 'icon-EmptyMessage',
     *                   title: 'Написать',
     *                   showType: TItemActionShowType.TOOLBAR,
     *                }
     *             ]
     *          },
     *          ...
     *       ]
     *    });
     * }
     * </pre>
     * @see itemActions
     */

    /* ENG
     *
     * @name Controls/_itemActions/interface/IItemActions#itemActionsProperty
     * @cfg {String} Name of the item's property that contains item actions.
     */
    itemActionsProperty?: string;

    /**
     * @name Controls/_itemActions/interface/IItemActions#actionAlignment
     * @cfg {Controls/_itemActions/interface/IItemActionsTemplateConfig/IItemActionsTemplateProps/TActionAlignment.typedef} Выравнивание {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи}, когда они отображаются в {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/swipe-mobile/ режиме swipe}.
     * @demo Controls-demo/List/Swipe/Scenarios
     * @see itemActions
     * @see actionCaptionPosition
     */
    actionAlignment?: TActionAlignment;

    /**
     * @name Controls/_itemActions/interface/IItemActions#actionCaptionPosition
     * @cfg {Controls/_interface/IAction/TActionCaptionPosition.typedef} Позиция заголовка для {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи}, когда они отображаются в {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/swipe-mobile/ режиме swipe}.
     * @demo Controls-demo/List/Swipe/Scenarios
     * @see itemActions
     * @see actionAlignment
     */
    actionCaptionPosition?: TActionCaptionPosition;

    /**
     * @name Controls/_itemActions/interface/IItemActions#itemActionsVisibility
     * @cfg {TItemActionsVisibility} Отображение {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи} с задержкой или без.
     * @default onhover
     * @remark
     * Подробнее о каждом режиме отображения читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/item-actions-visibility/ здесь}.
     * @demo Controls-demo/list_new/ItemActions/ItemActionsVisibility/Delayed/Index В следующем примере опции записи появляются с задержкой.
     */

    /*
     * @name Controls/_itemActions/interface/IItemActions#itemActionsVisibility
     * @cfg {TItemActionsVisibility} Setting of ItemActions visibility
     */
    itemActionsVisibility?: TItemActionsVisibility;

    /**
     * @name Controls/_itemActions/interface/IItemActions#itemActionVisibilityCallback
     * @cfg {Controls/_interface/IAction/TItemActionVisibilityCallback.typedef} Функция обратного вызова для определения видимости {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи}.
     * @remark
     * Подробнее об использовании функции читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/separate-set-options/#visibility здесь}.
     * @demo Controls-demo/list_new/ItemActions/ItemActionVisibilityCallback/Index
     * @example
     * Режим "Чтение" недоступен, если запись имеет свойство isNew === false.
     *
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls.list:View
     *     attr:class="demo-News"
     *     itemActions="{{_itemActions}}"
     *     source="{{_source}}"
     *     actionAlignment="vertical"
     *     actionCaptionPosition="bottom"
     *     markerVisibility="hidden"
     *     itemActionVisibilityCallback="{{_visibilityCallback}}"
     *     ...
     * </Controls.list:View>
     * </pre>
     *
     * <pre class="brush: js">
     * // TypeScript
     *  ...
     *  private _visibilityCallback(action: IItemAction, item: Model, isEditing: boolean): boolean {
     *   if (action.title === 'Read') {
     *     return item.get('isNew');
     *   }
     *   return true;
     *  }
     *  ...
     * </pre>
     * @see itemActions
     * @see itemActionsPosition
     * @see actionCaptionPosition
     * @see itemActionsProperty
     * @see actionClick
     * @see actionAlignment
     */

    /* ENG
     * @name Controls/_itemActions/interface/IItemActions#itemActionVisibilityCallback
     * @cfg {TItemActionVisibilityCallback} item operation visibility filter function
     * @param {ItemAction} action Object with configuration of an action.
     * @param {Types/entity:Model} item Instance of the item whose action is being processed.
     * @param {Boolean} isEditing Determines whether the item is editing at the moment.
     * @returns {Boolean} Determines whether the action should be rendered.
     * @example
     * Item action Read don't display if item has property isNew === false
     * <pre>
     *    <Controls.list:View attr:class="demo-News"
     *                        itemActions="{{_itemActions}}"
     *                        source="{{_source}}"
     *                        actionAlignment="vertical"
     *                        actionCaptionPosition="bottom"
     *                        markerVisibility="hidden"
     *                        itemActionVisibilityCallback="{{_visibilityCallback}}"
     *                        ...
     *   </Controls.list:View>
     * </pre>
     * <pre>
     *  ...
     *  private _visibilityCallback(action: IItemAction, item: Model): boolean {
     *   if (action.title === 'Read') {
     *     return item.get('isNew');
     *   }
     *   return true;
     *  }
     *  ...
     * </pre>
     */
    itemActionVisibilityCallback?: TItemActionVisibilityCallback;

    /**
     * CSS-класс, позволяющий задать отступы и позицию панели с {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опциями записи} внутри элемента.
     * @name Controls/_itemActions/interface/IItemActions#itemActionsClass
     * @cfg {String}
     * @default controls-itemActionsV_position_bottomRight
     * @deprecated Используйте {@link Controls/list:ItemTemplate#itemActionsClass itemActionsClass} как опцию шаблона записи.
     */
    itemActionsClass?: string;
}

/**
 * @event actionClick Происходит при клике по {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опции записи}.
 * @name Controls/_itemActions/interface/IItemActions#actionClick
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Controls/itemActions:IItemAction} action Объект с конфигурацией опции записи, по которой выполнили клик.
 * @param {Types/entity:Model} item Экземпляр записи, для которой была отображена опция записи.
 * @param {HTMLElement} itemContainer Контейнер записи, по которой был выполнен клик.
 * @param {Event} nativeEvent Дескриптор исходного события браузера. Может использоваться для получения информации о том, какие клавиши-модификаторы были использованы при клике (Ctrl etc.)
 * @remark Подробнее о работе с событиями опций записи читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/event/ здесь}.
 * @see itemActions
 * @see itemActionsPosition
 * @see itemActionVisibilityCallback
 * @see itemActionsProperty
 * @see actionAlignment
 * @see actionCaptionPosition
 */

/* ENG
 * @event Occurs when itemAction button is clicked.
 * @name Controls/_itemActions/interface/IItemActions#actionClick
 * @param {UI/Events:SyntheticEvent} eventObject Descriptor of the event.
 * @param {Controls/itemActions:IItemAction} action Object with configuration of the clicked action.
 * @param {Types/entity:Model} item Instance of the item whose action was clicked.
 * @param {HTMLElement} itemContainer Container of the item whose action was clicked.
 * @param {Event} nativeEvent Native browser event
 */

/**
 * Интерфейс опций контрола, который работает с {@link Controls/_itemActions/Controller контроллером опций записи}.
 * @interface Controls/_itemActions/interface/IItemActions
 * @public
 */

/*
 * Interface of options of Control that works with {@link Controls/_itemActions/Controller Actions controller}
 * @interface Controls/_itemActions/interface/IItemActions
 * @public
 * @author Аверкиев П.А.
 */
