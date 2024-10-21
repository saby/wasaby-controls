/**
 * @kaizen_zone 4368b094-41a4-40db-a0f9-b83257bd8251
 */
/**
 * Библиотека контролов, которые реализуют колонки плоского списка.
 * @library
 * @includes View Controls/columns:View
 * @includes ItemTemplate Controls/_columns/interface/ItemTemplate
 * @includes IColumnsView Controls/_columns/interface/IColumnsView
 * @public
 */

/*
 * List Columns library
 * @library
 * @includes View Controls/columns:View
 * @public
 * @author Колесов В. А.
 */
import { register } from 'Types/di';

import { default as ColumnsCollection } from 'Controls/_columns/display/Collection';
import { default as ColumnsCollectionItem } from 'Controls/_columns/display/CollectionItem';
import ColumnsVirtualScrollController from 'Controls/_columns/controllers/ColumnsVirtualScrollController';
// eslint-disable-next-line deprecated-anywhere
import 'Controls/deprecatedItemActions';

export { ColumnsCollection };
export { ColumnsCollectionItem };
export { ColumnsVirtualScrollController };
export { default as View } from 'Controls/_columns/Columns';
export { default as ItemsView } from 'Controls/_columns/ItemsView';
export { default as ViewTemplate } from 'Controls/_columns/render/Columns';
export { IColumnsItemPadding, TColumnsPadding } from 'Controls/_columns/interface/IColumnsView';

import ItemTemplate from 'Controls/_columns/render/resources/Item';
export { ItemTemplate };

register('Controls/columns:ColumnsCollection', ColumnsCollection, {
    instantiate: false,
});
register('Controls/columns:ColumnsCollectionItem', ColumnsCollectionItem, {
    instantiate: false,
});
