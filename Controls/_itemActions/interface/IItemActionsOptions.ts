/**
 * @kaizen_zone fd2f64a5-d515-49d2-8fef-3e6af047ff0a
 */
import { TIconSize, TVisibility } from 'Controls/interface';
import { IContextMenuConfig } from './IContextMenuConfig';
import {
    IItemAction,
    TActionCaptionPosition,
    TItemActionsPosition,
    TItemActionVisibilityCallback,
} from 'Controls/interface';
import { TActionAlignment } from './IItemActionsTemplateConfig';

/**
 * Допустимые значения для опции {@link itemActionsVisibility}.
 * @typedef TItemActionsVisibility
 * @variant onhover Опции записи отображаются при наведении на запись.
 * @variant visible Опции записи отображены изначально.
 * @variant delayed Опции записи отображаются при наведении на запись и удержании над ней курсора мыши в течение 500 мс.
 */
export type TItemActionsVisibility = TVisibility | 'delayed';

/**
 * Интерфейс опций контрола, который работает с {@link Controls/_itemActions/Controller контроллером опций записи}.
 * @public
 */
export interface IItemActionsOptions {
    /**
     * Видимость {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/menu-visibility/ контекстного меню} опций записи.
     * @cfg
     * @default true
     * @remark
     * Если опция установлена в значение false, то контекстное меню будет скрыто. При клике правой кнопкой мыши будет выводиться стандартное браузерное меню.
     * @see Controls/_listCommands/helpers/moveHelpers/MoveHelpers#canMoveToDirection утилита, позволяющая определить, можно ли переместить запись вверх/вниз с учётом иерархии
     * @see contextMenuConfig
     */
    contextMenuVisibility?: boolean;

    /**
     * Визуальное представление {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/show-type/ меню опций записи} и {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/menu-visibility/ контекстного меню}.
     * @cfg
     * @remark
     * Подробнее о настройке читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/context-menu-config/ здесь}.
     * @see contextMenuVisibility
     */
    contextMenuConfig?: Partial<IContextMenuConfig>;

    /**
     * Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи}.
     * @cfg
     * @demo Controls-demo/list_new/ItemActions/ItemActionsPosition/Inside/Index
     */
    itemActions?: IItemAction[];

    /**
     * Позиционирование панели {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/position/ опций записи}.
     * @cfg
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
    itemActionsPosition?: TItemActionsPosition;

    /**
     * Имя поля записи, в котором хранится конфигурация для панели с {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опциями записи}.
     * @cfg
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
    itemActionsProperty?: string;

    /**
     * Адаптивное размещение {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ действий над записью}, когда они отображаются в {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/swipe-mobile/ режиме swipe}.
     * @cfg
     * @default horizontal
     * @demo Controls-demo/List/Swipe/Scenarios
     * @see itemActions
     * @see actionCaptionPosition
     */
    actionAlignment?: TActionAlignment;

    /**
     * Позиция заголовка для {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи}, когда они отображаются в {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/swipe-mobile/ режиме swipe}.
     * @cfg
     * @demo Controls-demo/List/Swipe/Scenarios
     * @see itemActions
     * @see actionAlignment
     */
    actionCaptionPosition?: TActionCaptionPosition;

    /**
     * Отображение {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи} с задержкой или без.
     * @cfg
     * @default onhover
     * @remark
     * Подробнее о каждом режиме отображения читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/item-actions-visibility/ здесь}.
     * @demo Controls-demo/list_new/ItemActions/ItemActionsVisibility/Delayed/Index В следующем примере опции записи появляются с задержкой.
     */
    itemActionsVisibility?: TItemActionsVisibility;

    /**
     * Функция обратного вызова для определения видимости {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи}.
     * @cfg
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
    itemActionVisibilityCallback?: TItemActionVisibilityCallback;

    /**
     * CSS-класс, позволяющий задать отступы и позицию панели с {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опциями записи} внутри элемента.
     * @cfg
     * @default controls-itemActionsV_position_bottomRight
     * @deprecated Используйте {@link Controls/list:ItemTemplate#itemActionsClass itemActionsClass} как опцию шаблона записи.
     */
    itemActionsClass?: string;

    /**
     * Размер иконки меню
     * варианты 's'|'m'|'l'
     */
    menuIconSize?: Extract<TIconSize, 's' | 'm' | 'l'>;
}

/**
 * @event Controls/_itemActions/interface/IItemActionsOptions#actionClick Происходит при клике по {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опции записи}.
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
