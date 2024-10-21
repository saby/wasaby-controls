/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import * as React from 'react';
import { createElement } from 'UICore/Jsx';

import AdditionalTileItem from 'Controls/_tile/display/AdditionalTileItem';
import { ITileItemProps } from 'Controls/_tile/display/mixins/TileItem';
import Invisible from './Invisible';
import Default from './Default';

export default React.forwardRef(function DefaultTileItemWrapper(
    props: ITileItemProps,
    _
): JSX.Element {
    const item = props.item || props.itemData;
    const itemType = item.getItemType(props.itemType, props.nodeContentTemplate);
    const width = props.width || props.itemWidth;

    const clearProps = {
        ...props,
        item,
        itemData: item,
        itemType,
        width,
    };

    if (item['[Controls/_tile/display/mixins/InvisibleItem]']) {
        return <Invisible {...clearProps} />;
    }

    if (
        item['[Controls/_tile/AdditionalTileItem]'] &&
        (item as AdditionalTileItem).getAdditionalItemTemplate()
    ) {
        return createElement((item as AdditionalTileItem).getAdditionalItemTemplate(), {
            ...clearProps,
        });
    }

    return <Default {...clearProps} />;
});
