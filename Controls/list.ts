/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
/**
 * Библиотека контролов, которые реализуют {@link /doc/platform/developmentapl/interface-development/controls/list/list/ плоский список}. Список может строиться по данным, полученным из источника. Также можно организовать удаление и перемещение данных.
 * @library
 * @includes ItemTemplate Controls/_list/interface/ItemTemplate
 * @includes IClickableView Controls/_list/interface/IClickableView
 * @includes IBaseItemTemplate Controls/_list/interface/IBaseItemTemplate
 * @includes IContentTemplate Controls/_list/interface/IContentTemplate
 * @includes EmptyTemplate Controls/_list/interface/EmptyTemplate
 * @includes GroupTemplate Controls/_baseList/GroupTemplate
 * @includes EditingTemplate Controls/_list/interface/EditingTemplate
 * @includes NumberEditingTemplate Controls/_list/interface/NumberEditingTemplate
 * @includes MoneyEditingTemplate Controls/_list/interface/MoneyEditingTemplate
 * @includes LoadingIndicatorTemplate Controls/_baseList/indicators/LoadingIndicatorTemplate
 * @includes IterativeLoadingTemplate Controls/_baseList/indicators/IterativeLoadingTemplate
 * @includes ContinueSearchTemplate Controls/_baseList/indicators/ContinueSearchTemplate
 * @includes IReloadableList Controls/_list/interface/IReloadableList
 * @includes IEditableList Controls/_list/interface/IEditableList
 * @includes IItemsView Controls/_list/IItemsView
 * @includes DataContainer Controls/_list/Data
 * @includes editing Controls/list:editing
 * @includes groupConstants Controls/list:groupConstants
 * @includes IBaseGroupTemplate Controls/_list/interface/IBaseGroupTemplate
 * @includes IItemPadding Controls/_display/interface/ICollection/IItemPadding
 * @includes IList Controls/_list/interface/IList
 * @includes IReloadItemOptions Controls/_list/interface/IReloadItemOptions
 * @includes IListNavigation Controls/_list/interface/IListNavigation
 * @includes IMovableList Controls/_baseList/interface/IMovableList
 * @includes IMoveDialogTemplate Controls/_baseList/interface/IMovableList/IMoveDialogTemplate
 * @includes IRemovableList Controls/_list/interface/IRemovableList
 * @includes ItemsView Controls/list:ItemsView
 * @includes IVirtualScroll Controls/_listsCommonLogic/scrollController/interface/IVirtualScroll
 * @includes IVirtualScrollConfig Controls/_listsCommonLogic/scrollController/interface/IVirtualScroll/IVirtualScrollConfig
 * @includes MultiSelectAccessibility Controls/_display/Collection
 * @includes View Controls/_list/List
 * @includes IEditingConfig Controls/_list/interface/IEditingConfig
 * @includes IItemAddOptions Controls/_list/interface/IItemAddOptions
 * @includes IItemEditOptions Controls/_list/interface/IItemEditOptions
 * @includes FooterTemplate Controls/_list/interface/FooterTemplate
 * @includes ActionsConnectedComponent Controls/_baseList/ActionsConnectedComponent
 * @includes IListActionAdditionalConfig Controls/_baseList/interface/IListActionAdditionalConfig
 * @public
 */

/*
 * List library
 * @library
 * @includes ItemTemplate Controls/_list/interface/ItemTemplate
 * @includes IClickableView Controls/_list/interface/IClickableView
 * @includes IBaseItemTemplate Controls/_list/interface/IBaseItemTemplate
 * @includes IContentTemplate Controls/_list/interface/IContentTemplate
 * @includes EmptyTemplate Controls/_list/interface/EmptyTemplate
 * @includes GroupTemplate Controls/_baseList/GroupTemplate
 * @includes EditingTemplate Controls/_list/interface/EditingTemplate
 * @includes NumberEditingTemplate Controls/_list/interface/NumberEditingTemplate
 * @includes MoneyEditingTemplate Controls/_list/interface/MoneyEditingTemplate
 * @includes LoadingIndicatorTemplate Controls/_baseList/indicators/LoadingIndicatorTemplate
 * @includes IterativeLoadingTemplate Controls/_baseList/indicators/IterativeLoadingTemplate
 * @includes ContinueSearchTemplate Controls/_baseList/indicators/ContinueSearchTemplate
 * @includes IReloadableList Controls/_list/interface/IReloadableList
 * @includes IEditableList Controls/_list/interface/IEditableList
 * @includes IItemsView Controls/_list/IItemsView
 * @includes DataContainer Controls/_list/Data
 * @includes editing Controls/list:editing
 * @includes groupConstants Controls/list:groupConstants
 * @includes IBaseGroupTemplate Controls/_list/interface/IBaseGroupTemplate
 * @includes IItemPadding Controls/_display/interface/ICollection/IItemPadding
 * @includes IList Controls/_list/interface/IList
 * @includes IListNavigation Controls/_list/interface/IListNavigation
 * @includes IMovableList Controls/_baseList/interface/IMovableList
 * @includes IMoveDialogTemplate Controls/_baseList/interface/IMovableList/IMoveDialogTemplate
 * @includes IRemovableList Controls/_list/interface/IRemovableList
 * @includes ItemsView Controls/list:ItemsView
 * @includes MultiSelectAccessibility Controls/_display/Collection
 * @includes View Controls/_list/List
 * @includes IEditingConfig Controls/_baseList/interface/IEditingConfig
 * @includes IItemAddOptions Controls/_baseList/interface/IItemAddOptions
 * @includes IItemEditOptions Controls/_baseList/interface/IItemEditOptions
 * @includes FooterTemplate Controls/_list/interface/FooterTemplate
 * @public
 * @author Крайнов Д.О.
 */

import EmptyTemplate = require('wml!Controls/_list/emptyTemplate');
import CharacteristicsRender from 'Controls/_list/CharacteristicsTemplate/CharacteristicsRender';
import {
    ICharacteristic,
    ICharacteristicsRenderProps,
} from 'Controls/_list/CharacteristicsTemplate/CharacteristicsRender';

import BaseAction from 'Controls/_list/BaseAction';
import HotKeysContainer from 'Controls/_list/HotKeysContainer';

import FooterWrapper from 'Controls/_list/Render/FooterWrapper';
import FooterTemplate from 'Controls/_list/Render/FooterTemplate';

export * from 'Controls/baseList';
export {
    EmptyTemplate,
    BaseAction,
    CharacteristicsRender as CharacteristicsTemplate,
    CharacteristicsRender,
    ICharacteristic,
    ICharacteristicsRenderProps,
    FooterWrapper,
    FooterTemplate,
    HotKeysContainer,
};
export { default as AddButton } from 'Controls/_list/AddButton';
