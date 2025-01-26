/**
 * @kaizen_zone f90b65ee-d3e2-41d5-9722-a2ea4200bc7e
 */
/**
 * Библиотека контролов, которые реализуют элемент интерфейса, позволяющий выбрать одну или несколько перечисленных опций.
 * Может отображаться на странице или в выпадающем блоке.
 * @library
 * @includes IMenuPopupOptions Controls/_menu/interface/IMenuPopup
 * @includes ItemTemplate Controls/menu:ItemTemplate
 * @public
 */

import ItemTemplate = require('wml!Controls/_menu/Render/itemTemplate');
import EmptyTemplate = require('wml!Controls/_menu/Render/empty');

export { default as Control, itemActionPin, itemActionsUnpin } from 'Controls/_menu/Control';
export { default as Render } from 'Controls/_menu/Render';
export { default as Popup } from 'Controls/_menu/Popup';
export { default as HeaderTemplate } from 'Controls/_menu/Popup/HeaderTemplate';
export { default as SearchHeaderTemplate } from 'Controls/_menu/Popup/searchHeaderTemplate';
export { default as GroupTemplate } from 'Controls/_menu/Render/GroupTemplate';

export { IMenuBaseOptions, IMenuBase } from 'Controls/_menu/interface/IMenuBase';
export {
    TSubMenuDirection,
    TItemAlign,
    default as IMenuControl,
    IMenuControlOptions,
} from 'Controls/_menu/interface/IMenuControl';
export {
    default as IMenuPopup,
    IMenuPopupOptions,
    IFooterItemData,
} from 'Controls/_menu/interface/IMenuPopup';
export { default as ControlFooterTemplate } from 'Controls/_menu/Control/FooterTemplate';
export { default as IItemTemplateOptions } from 'Controls/_menu/interface/ItemTemplate';
export { IMultipleMenu, TMenuConfig, default as Multiple } from 'Controls/_menu/Multiple';
export * as Util from 'Controls/_menu/Util';
export { getMarkerPosition } from 'Controls/_menu/Utils/getMarkerPosition';
export { getIconInRoot } from 'Controls/_menu/Utils/getIconInRoot';

export { ItemTemplate, EmptyTemplate };
