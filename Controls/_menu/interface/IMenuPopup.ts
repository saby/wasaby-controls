/**
 * @kaizen_zone f90b65ee-d3e2-41d5-9722-a2ea4200bc7e
 */
import { TemplateFunction } from 'UI/Base';
import { ISearchOptions } from 'Controls/interface';
import { IMenuControlOptions } from 'Controls/menu';
import { IStickyTemplateOptions } from 'Controls/popupTemplate';

import { Model } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';

export interface IFooterItemData {
    item: Model;
    key: CrudEntityKey;
}

export interface IMenuPopupOptions
    extends IMenuControlOptions,
        ISearchOptions,
        IStickyTemplateOptions {
    footerItemData?: IFooterItemData;
    trigger: 'click' | 'hover';
    draggable: boolean;
}

/**
 * Интерфейс контрола меню
 * @public
 */
export default interface IMenuPopup {
    readonly '[Controls/_menu/interface/IMenuPopup]': boolean;
}

/**
 * @name Controls/_menu/interface/IMenuPopup#headerContentTemplate
 * @cfg {function} Контент, располагающийся в шапке окна.
 * @demo Controls-demo/Menu/Popup/HeaderContentTemplate/Index
 * @example
 * WML:
 * <pre>
 * <Controls.menu:Popup
 *       keyProperty="key"
 *       displayProperty="title"
 *       source="{{_source}}">
 *    <ws:headerContentTemplate>
 *        <ws:partial template="Controls/menu:HeaderTemplate" caption="{[Выберите город]}"/>
 *    </ws:headerContentTemplate>
 * </Controls.menu:Popup>
 * </pre>
 * JS:
 * <pre>
 * this._source = new Memory({
 *    keyProperty: 'key',
 *    data: [
 *       {key: 1, title: 'Yaroslavl'},
 *       {key: 2, title: 'Moscow'},
 *       {key: 3, title: 'St-Petersburg'}
 *    ]
 * });
 * </pre>
 */

/**
 * @name Controls/_menu/interface/IMenuPopup#footerContentTemplate
 * @cfg {function} Контент, располагающийся в нижней части окна.
 * @demo Controls-demo/Menu/Popup/FooterContentTemplate/Scroll/Index
 * @example
 * WML:
 * <pre>
 * <Controls.menu:Popup
 *       keyProperty="key"
 *       displayProperty="title"
 *       source="{{_source}}">
 *     <ws:footerContentTemplate>
 *        <div class="footerContentTemplate">+ {[Добавить]}</div>
 *     </ws:footerContentTemplate>
 * </Controls.menu:Popup>
 * </pre>
 * JS:
 * <pre>
 * this._source = new Memory({
 *    keyProperty: 'key',
 *    data: [
 *       {key: 1, title: 'Yaroslavl'},
 *       {key: 2, title: 'Moscow'},
 *       {key: 3, title: 'St-Petersburg'}
 *    ]
 * });
 * </pre>
 */

/**
 * @name Controls/_menu/interface/IMenuPopup#searchParam
 * @cfg {String} Имя поля фильтра, в значение которого будет записываться текст для поиска.
 * Фильтр с этим значением будет отправлен в поисковой запрос в источнику данных.
 * @demo Controls-demo/Menu/Popup/SearchParam/Index
 * @example
 * <pre>
 * <Controls.menu:Popup
 *       keyProperty="key"
 *       displayProperty="title"
 *       searchParam="title"
 *       source="{{_source}}">
 * </Controls.menu:Popup>
 * </pre>
 * JS:
 * <pre>
 * this._source = new Memory({
 *    keyProperty: 'key',
 *    data: [
 *       {key: 1, title: 'Yaroslavl'},
 *       {key: 2, title: 'Moscow'},
 *       {key: 3, title: 'St-Petersburg'}
 *    ]
 * });
 * </pre>
 */

/**
 * @name Controls/_menu/interface/IMenuPopup#breadCrumbsItemTemplate
 * @cfg {String} Шаблон хлебных крошек, отображающийся при поиске в иерархическом меню.
 * @demo Controls-demo/Menu/Popup/SearchParam/BreadCrumbsItemTemplate/Index
 * @example
 * <pre>
 * <Controls.menu:Popup source="{{_source}}"
 *                      keyProperty="id"
 *                      displayProperty="title"
 *                      nodeProperty="@parent"
 *                      parentProperty="parent"
 *                      searchParam="title">
 *      <ws:breadCrumbsItemTemplate>
 *          <div class="demo-menu_wrapper">
 *              <span class="demo-menu_breadCrumbs-icon"></span>
 *              <ws:partial template="Controls/breadcrumbs:ItemTemplate">
 *                  <ws:contentTemplate>
 *                      <span class="demo-menu_breadCrumbs-text">
 *                      {{breadCrumbsItemTemplate.itemData.item.get(breadCrumbsItemTemplate.displayProperty)}}</span>
 *                  </ws:contentTemplate>
 *              </ws:partial>
 *          </div>
 *      </ws:breadCrumbsItemTemplate>
 * </Controls.menu:Popup>
 * </pre>
 */

/**
 * @name Controls/_menu/interface/IMenuPopup#emptyTemplate
 * @cfg {Function|String} Шаблон, который будет отображаться в выпадающем списке, если поисковой запрос не вернул результатов.
 * @demo Controls-demo/Menu/Popup/SearchParam/EmptyTemplate/Index
 */

/**
 * @name Controls/_menu/interface/IMenuPopup#footerItemData
 * @cfg {IFooterItemData} Данные для {@link Controls/_menu/interface/IMenuPopup#footerContentTemplate шаблона нижней части окна}.
 */

/**
 * @typedef {String} backgroundStyle
 * @variant primary.
 * @variant secondary.
 * @variant danger.
 * @variant warning.
 * @variant info.
 * @variant unaccented.
 */

/**
 * @name Controls/_menu/interface/IMenuPopup#closeButtonVisibility
 * @cfg {Boolean} Видимость кнопки закрытия.
 * @default true
 * @remark В значении true кнопка отображается.
 * @demo Controls-demo/Menu/Popup/CloseButtonVisibility/Index
 * @example
 * <pre class="brush: html; highlight: [6]">
 * <!-- WML -->
 * <Controls.menu:Popup
 *       keyProperty="key"
 *       displayProperty="title"
 *       source="{{_source}}"
 *       closeButtonVisibility="{{false}}">
 * </Controls.menu:Popup>
 * </pre>
 * <pre class="brush: js">
 * // JS
 * this._source = new Memory({
 *    keyProperty: 'key',
 *    data: [
 *       {key: 1, title: 'Yaroslavl'},
 *       {key: 2, title: 'Moscow'},
 *       {key: 3, title: 'St-Petersburg'}
 *    ]
 * });
 * </pre>
 */
