/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
/**
 * Библиотека контролов, которые реализуют список, отображающийся в виде горизонтальной адаптивной плитки.
 * @library
 * @includes IAdaptiveTile Controls/_adaptiveTile/interface/IAdaptiveTile
 * @public
 */

import { register } from 'Types/di';

import View from 'Controls/_adaptiveTile/View';

import CollectionItem from 'Controls/_adaptiveTile/display/CollectionItem';
import SpacerItem from 'Controls/_adaptiveTile/display/SpacerItem';
import Collection, {
    IAdaptiveTileCollectionOptions,
} from 'Controls/_adaptiveTile/display/Collection';

export { View, CollectionItem, SpacerItem, Collection, IAdaptiveTileCollectionOptions };

register('Controls/adaptiveTile:Collection', Collection, {
    instantiate: false,
});
register('Controls/adaptiveTile:SpacerItem', SpacerItem, {
    instantiate: false,
});
register('Controls/adaptiveTile:CollectionItem', CollectionItem, {
    instantiate: false,
});
