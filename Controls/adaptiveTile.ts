import { register } from 'Types/di';

import View from 'Controls/_adaptiveTile/View';

import CollectionItem from 'Controls/_adaptiveTile/display/CollectionItem';
import SpacerItem from 'Controls/_adaptiveTile/display/SpacerItem';
import Collection from 'Controls/_adaptiveTile/display/Collection';

export { View, CollectionItem, SpacerItem, Collection };

register('Controls/adaptiveTile:Collection', Collection, {
    instantiate: false,
});
register('Controls/adaptiveTile:SpacerItem', SpacerItem, {
    instantiate: false,
});
register('Controls/adaptiveTile:CollectionItem', CollectionItem, {
    instantiate: false,
});
