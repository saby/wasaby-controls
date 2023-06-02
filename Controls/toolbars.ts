/**
 * @kaizen_zone 5c260dca-bc4a-4366-949a-824d00984a8e
 */
/**
 * Библиотека, которая реализует <a href='/doc/platform/developmentapl/interface-development/controls/input-elements/buttons-switches/toolbar/'>набор команд</a> в виде кнопок и выпадающего меню с дополнительными командами.
 * @library
 * @includes ItemTemplate Controls/toolbars:ItemTemplate
 * @includes IToolbar Controls/_toolbars/IToolbar
 * @includes IToolBarItem Controls/_toolbars/IToolBarItem
 * @public
 */

export { default as ItemTemplate } from './_toolbars/View/ItemTemplate';
export {
    default as View,
    IToolbarOptions,
    TItemsSpacing,
} from './_toolbars/View';
export {
    getSimpleButtonTemplateOptionsByItem,
    getButtonTemplate,
} from './_toolbars/Util';
export { default as BoxView } from './_toolbars/BoxView';
export {
    default as IToolbarSource,
    IToolBarItem,
} from './_toolbars/interfaces/IToolbarSource';
export { showType } from './_toolbars/interfaces/IShowType';
