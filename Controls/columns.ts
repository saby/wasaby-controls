/**
 * @kaizen_zone 64741de4-090c-4426-a7df-258a52dacfef
 */
/**
 * Библиотека контролов, которые реализуют колонки плоского списка.
 * @library
 * @includes View Controls/columns:View
 * @includes ItemTemplate Controls/_columns/interface/ItemTemplate
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

export { ColumnsCollection };
export { ColumnsCollectionItem };
export { ColumnsVirtualScrollController };
export { default as View } from 'Controls/_columns/Columns';
export { default as ItemsView } from 'Controls/_columns/ItemsView';
export { default as ViewTemplate } from 'Controls/_columns/render/Columns';

import ItemTemplate = require('wml!Controls/_columns/render/resources/ItemTemplate');
export { ItemTemplate };

register('Controls/columns:ColumnsCollection', ColumnsCollection, {
    instantiate: false,
});
register('Controls/columns:ColumnsCollectionItem', ColumnsCollectionItem, {
    instantiate: false,
});
