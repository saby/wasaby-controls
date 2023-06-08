/**
 * @kaizen_zone f90b65ee-d3e2-41d5-9722-a2ea4200bc7e
 */
import { IControlOptions, TemplateFunction } from 'UI/Base';
import {
    IItemTemplateOptions,
    IHierarchyOptions,
    IIconSizeOptions,
    IPromiseSelectableOptions,
    IFontColorStyleOptions,
    TSelectedKeys,
    ISearchValueOptions,
} from 'Controls/interface';
import { IGroupedOptions } from 'Controls/dropdown';

interface IItemPadding {
    left: string;
    right: string;
}

export type TKey = string | number | null;

export interface IMenuBaseOptions
    extends IControlOptions,
        IHierarchyOptions,
        IIconSizeOptions,
        IGroupedOptions,
        IItemTemplateOptions,
        IPromiseSelectableOptions,
        IFontColorStyleOptions,
        ISearchValueOptions {
    keyProperty: string;
    root?: TKey;
    displayProperty: string;
    selectedAllText?: string;
    emptyText?: string;
    emptyKey?: string | number;
    itemPadding: IItemPadding;
    multiSelect?: boolean;
    emptyTemplate: TemplateFunction;
    excludedKeys?: TSelectedKeys;
    hierarchyViewMode?: string;
    allowPin?: boolean;
}

/**
 * Интерфейс контрола, отображающего список меню
 * @interface Controls/_menu/interface/IMenuBase
 * @public
 */

export default interface IMenuBase {
    readonly '[Controls/_menu/interface/IMenuBase]': boolean;
}

/**
 * @name Controls/_menu/interface/IMenuBase#displayProperty
 * @cfg {String} Устанавливает имя поля элемента, значение которого будет отображено.
 */

/**
 * @name Controls/_menu/interface/IMenuBase#emptyText
 * @cfg {String} Добавляет пустой элемент в список с заданным текстом.
 * Ключ пустого элемента по умолчанию null, для изменения значения ключа используйте {@link emptyKey}.
 * @demo Controls-demo/Menu/Control/EmptyText/Index
 */

/**
 * @name Controls/_menu/interface/IMenuBase#emptyKey
 * @cfg {String} Первичный ключ для пункта выпадающего списка, который создаётся при установке опции {@link emptyText}.
 * @default null
 * @demo Controls-demo/Menu/Control/EmptyText/EmptyKey/Index
 */

/**
 * @name Controls/_menu/interface/IMenuBase#navigation
 * @cfg {Controls/_interface/INavigation} Конфигурация навигации по списку.
 * @demo Controls-demo/Menu/Control/Navigation/Index
 */

/**
 * @name Controls/_menu/interface/IMenuBase#itemTemplate
 * @cfg {Function} Устанавливает шаблон отображения элемента в выпадающем списке. Подробнее про настройку шаблона {@link Controls/menu:ItemTemplate здесь}.
 * Для контролов из библиотеки dropdown используйте в качестве шаблона Controls/dropdown:ItemTemplate для ленивой загрузки библиотеки menu.
 * @default {@link Controls/menu:ItemTemplate}
 * @demo Controls-demo/Menu/Control/ItemTemplate/ContentTemplate/Index
 * @see itemTemplateProperty
 */

/**
 * @name Controls/_menu/interface/IMenuBase#itemTemplateProperty
 * @cfg {String} Устанавливает имя поля, которое содержит имя шаблона отображения элемента. Подробнее про настройку шаблона {@link Controls/menu:ItemTemplate здесь}.
 * Для контролов из библиотеки dropdown используйте в качестве шаблона Controls/dropdown:ItemTemplate для ленивой загрузки библиотеки menu.
 * @demo Controls-demo/dropdown_new/Input/ItemTemplateProperty/RightTemplate/Index
 * @example
 *  <pre class="brush: html">
 *    <Controls.menu:Control
 *          keyProperty="id"
 *          displayProperty="title"
 *          source="{{_source}}"
 *          itemTemplateProperty="myTemplate"/>
 * </pre>
 * myItemTemplate.wml
 * <pre class="brush: html">
 *    <ws:partial template="Controls/menu:ItemTemplate"
 *                scope="{{_options}}">
 *       <ws:contentTemplate>
 *          <div class="demo-item">
 *             <div class="demo-title">{{itemTemplate.itemData.item.get('title')}}</div>
 *             <div class="demo-comment">{{itemTemplate.itemData.item.get('comment')}}</div>
 *          </div>
 *       </ws:contentTemplate>
 *    </ws:partial>
 * </pre>
 * <pre class="brush: js">
 *    this._source = new Memory ({
 *       data: [
 *           { id: 1,
 *             title: 'Discussion' },
 *           { id: 2,
 *             title: 'Idea/suggestion',
 *             comment: 'Offer your idea, which others can not only discuss, but also evaluate.
 *             The best ideas will not go unnoticed and will be realized',
 *            myTemplate='myItemTemplate.wml' },
 *           { id: 3,
 *             title: 'Problem' }
 *       ],
 *       keyProperty: 'id'
 *    });
 * </pre>
 * @see itemTemplate
 */
