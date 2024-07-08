/**
 * @kaizen_zone f90b65ee-d3e2-41d5-9722-a2ea4200bc7e
 */
import { TemplateFunction } from 'UI/Base';
import { IMenuBaseOptions } from './IMenuBase';
import {
    ISourceOptions,
    INavigationOptions,
    IFilterOptions,
    ISelectorDialogOptions,
    INavigationSourceConfig,
    TSelectionType,
} from 'Controls/interface';
import { IItemAction, TItemActionVisibilityCallback } from 'Controls/itemActions';
import { CalmTimer, IStickyPosition } from 'Controls/popup';
import { NewSourceController } from 'Controls/dataSource';
import {
    default as IBackgroundStyle,
    IBackgroundStyleOptions,
} from 'Controls/_interface/IBackgroundStyle';
import { RecordSet } from 'Types/collection';
import { TItemActionsVisibility } from 'Controls/itemActions';
export type TSubMenuDirection = 'bottom' | 'right';

export type TItemAlign = 'left' | 'right';

export interface IMenuControlOptions
    extends IMenuBaseOptions,
        ISourceOptions,
        IBackgroundStyle,
        IBackgroundStyleOptions,
        INavigationOptions<INavigationSourceConfig>,
        IFilterOptions,
        Partial<ISelectorDialogOptions> {
    items?: RecordSet;
    sourceProperty?: string;
    nodeFooterTemplate?: TemplateFunction;
    openSelectorCallback?: Function;
    itemActions?: IItemAction[];
    itemActionVisibilityCallback?: TItemActionVisibilityCallback;
    itemActionsVisibility?: TItemActionsVisibility;
    itemActionsProperty?: string;
    dataLoadCallback?: Function;
    dataLoadErrback?: Function;
    selectorDialogResult?: Function;
    sourceController?: NewSourceController;
    calmTimer?: CalmTimer;
    subMenuDirection?: TSubMenuDirection;
    itemAlign?: TItemAlign;
    headingCaptionProperty?: string;
    multiSelectAccessibilityProperty?: string;
    focusable?: boolean;
    selectionType?: TSelectionType;
    itemActionsClass?: string;
    markerPosition?: string;
    stickyPosition?: IStickyPosition;
}

/**
 * Интерфейс контрола меню.
 * @public
 */
export default interface IMenuControl {
    readonly '[Controls/_menu/interface/IMenuControl]': boolean;
}

/**
 * @typedef {Object} Controls/_menu/interface/IMenuControl/ISourcePropertyConfig
 * @property {String} moduleName Путь до модуля загрузки данных, поддерживающего интерфейс {@link Types/source:ICrud ICrud}.
 * @property {Object} options Опции для создания класса, указанного в moduleName.
 */

/**
 * @name Controls/_menu/interface/IMenuControl#sourceProperty
 * @cfg {String} Имя свойства, которое содержит {@link Controls/interface:ISource#source источник} или
 * {@link Controls/_menu/interface/IMenuControl/ISourcePropertyConfig.typedef конфигурацию} для создания класса для загрузки данных подменю.
 * @demo Controls-demo/Menu/Control/SourceProperty/Index
 * @see nodeProperty
 * @see parentProperty
 * @see additionalProperty
 * @see subMenuDirection
 */

/**
 * @name Controls/_menu/interface/IMenuControl#nodeFooterTemplate
 * @cfg {TemplateFunction | String} Шаблон подвала, отображающийся для всех подменю.
 * В шаблон передается объект itemData со следующими полями:
 *
 * * key — ключ родительского элемента;
 * * item — родительский элемент.
 * @example
 * <pre class="brush: html; highlight: [8-12]">
 * <!-- WML -->
 * <Controls.menu:Control
 *    keyProperty="id"
 *    icon="icon-Save icon-small"
 *    parentProperty="parent"
 *    nodeProperty="@parent"
 *    source="{{_source}}">
 *    <ws:nodeFooterTemplate>
 *       <div class="ControlsDemo-InputDropdown-footerTpl">
 *          <Controls.buttons:Button caption="+ New template" fontSize="l" viewMode="link" on:click="_clickHandler(itemData.key)"/>
 *       </div>
 *    </ws:nodeFooterTemplate>
 * </Controls.menu:Control>
 * </pre>
 * <pre class="brush: html;">
 * // JavaScript
 * _clickHandler: function(rootKey) {
 *    this._children.stack.open({
 *       opener: this._children.button
 *    });
 * }
 * </pre>
 * @demo Controls-demo/Menu/Control/NodeFooterTemplate/Index
 */

/**
 * @name Controls/_menu/interface/IMenuControl#showMoreRightTemplate
 * @cfg {TemplateFunction | String} Шаблон, который будет расположен рядом с кнопкой разворота дополнительных пунктов в меню.
 * @example
 * <pre class="brush: html; highlight: [8-12]">
 * <!-- WML -->
 * <Controls.dropdown:Button
 *    keyProperty="id"
 *    icon="icon-Save icon-small"
 *    additionalProperty="additional"
 *    source="{{_source}}">
 *    <ws:showMoreRightTemplate>
 *       <div class="Controls-showMoreRightTemplate">
 *          <Controls.buttons:Button caption="Настроить" viewMode="link" on:click="_clickHandler()"/>
 *       </div>
 *    </ws:showMoreRightTemplate>
 * </Controls.dropdown:Button>
 * </pre>
 * @demo Controls-demo/dropdown_new/Button/ShowMoreRightTemplate/Index
 */

/**
 * @name Controls/_menu/interface/IMenuControl#itemActions
 * @cfg {Array.<Controls/itemActions:IItemAction>} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи}.
 * @demo Controls-demo/Menu/Control/ItemActions/Index
 */

/**
 * @name Controls/_menu/interface/IMenuControl#itemActionVisibilityCallback
 * @cfg {Controls/_interface/IAction/TItemActionVisibilityCallback.typedef} Функция обратного вызова для определения видимости {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи}.
 * @example
 * Операция редактирования недоступна, если запись имеет свойство readOnly.
 *
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.menu:Control
 *      source="{{_source}}"
 *      keyProperty="key"
 *      displayProperty="title"
 *      itemActions="{{_itemActions}}"
 *      itemActionVisibilityCallback="{{_visibilityCallback}}"
 *  />
 * </pre>
 *
 * <pre class="brush: js">
 * // TypeScript
 *  ...
 * private _visibilityCallback(action: IItemAction, item: Model, isEditing: boolean): boolean {
 *      if (action.title === 'edit') {
 *        return !item.get('readOnly');
 *      }
 *      return true;
 * }
 *  ...
 * </pre>
 * @see itemActions
 */

/**
 * @name Controls/_menu/interface/IMenuControl#itemActionsVisibility
 * @cfg {Controls/itemActions:TItemActionsVisibility.typedef} Отображение опций записи с задержкой или без.
 * @example
 * Опции записи появляются с задержкой.
 *
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.menu:Control
 *      source="{{_source}}"
 *      keyProperty="key"
 *      displayProperty="title"
 *      itemActions="{{_itemActions}}"
 *      itemActionsVisibility="delayed"
 *  />
 * </pre>
 * @see itemActions
 */

/**
 * @name Controls/_menu/interface/IMenuControl#parentProperty
 * @cfg {String} Имя свойства, содержащего информацию о родительском элементе.
 * @demo Controls-demo/Menu/Control/ParentProperty/Index
 * @see nodeProperty
 * @see sourceProperty
 * @see additionalProperty
 * @see subMenuDirection
 */

/**
 * @name Controls/_menu/interface/IMenuControl#nodeProperty
 * @cfg {String} Имя свойства, содержащего информацию о {@link /doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy типе элемента} (лист, узел, скрытый узел).
 * @demo Controls-demo/Menu/Control/ParentProperty/Index
 * @remark Для правильного отображения скрытых узлов, при использовании источника данных Memory,
 * необходимо задать функцию фильтрации для источника, которая вернет все записи (
 * source = new Memory({
 *     data: [...],
 *     keyProperty: 'key',
 *     filter: () => true
 * });
 *
 * @see parentProperty
 * @see sourceProperty
 * @see additionalProperty
 * @see subMenuDirection
 */

/**
 * @name Controls/_menu/interface/IMenuControl#hierarchyViewMode
 * @cfg {String} Режим отображения иерархии.
 * @variant default Иерархия отображается в виде подменю;
 * @variant tree Иерархия отображается в виде дерева, начиная со второго уровня меню. На первом уровне открывается подменю.
 * @demo Controls-demo/dropdown_new/Button/HierarchyViewMode/Index
 */

/**
 * @name Controls/_menu/interface/IMenuControl#additionalProperty
 * @cfg {String} Имя свойства, содержащего информацию о дополнительном пункте выпадающего меню.
 * Подробное описание {@link /doc/platform/developmentapl/interface-development/controls/input-elements/dropdown-menu/item-config/#additional здесь}.
 * @demo Controls-demo/dropdown_new/Button/AdditionalProperty/Index
 * @see nodeProperty
 * @see parentProperty
 * @see sourceProperty
 * @see subMenuDirection
 */

/**
 * @name Controls/_menu/interface/IMenuControl#subMenuDirection
 * @cfg {String} Имя свойства, отвечающего за то, как будут раскрываться подуровни меню.
 * @variant right Меню раскрывается вбок.
 * @variant bottom Меню раскрывается вниз.
 * @default right
 * @demo Controls-demo/dropdown_new/Button/SubMenuDirection/Index
 * @see nodeProperty
 * @see parentProperty
 * @see sourceProperty
 * @see additionalProperty
 */

/**
 * @name Controls/_menu/interface/IMenuControl#openedSubMenuKey
 * @cfg {String} Идентификатор записи, от которой необходимо открыть подменю вместе с открытием основного меню.
 * @demo Controls-demo/dropdown_new/Button/HierarchyViewMode/Index
 * @see nodeProperty
 * @see parentProperty
 */

/**
 * @name Controls/_menu/interface/IMenuControl#itemAlign
 * @cfg {String} Вид отображения элемента
 * @variant left Меню раскрывается влево, элемент отображается от левого края.
 * @variant right Меню раскрывается вправо, элемент отображается от правого края
 * @default right
 * @demo Controls-demo/dropdown_new/Button/ItemAlign/Index
 * @see nodeProperty
 * @see parentProperty
 * @see sourceProperty
 * @see additionalProperty
 */

/**
 * @name Controls/_menu/interface/IMenuControl#backgroundStyle
 * @cfg {Controls/_interface/IBackgroundStyle/TBackgroundStyle.typedef} Цвет фона для меню.
 * @demo Controls-demo/dropdown_new/Button/MenuPopupBackground/Index
 */

/**
 * @name Controls/_menu/interface/IMenuControl#hoverBackgroundStyle
 * @cfg {Controls/_interface/IBackgroundStyle/TBackgroundStyle.typedef} Цвет фона для пункта меню при наведении.
 * @demo Controls-demo/Menu/Control/HoverBackgroundStyle/Index
 */
