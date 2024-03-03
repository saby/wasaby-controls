/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
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
