import type { InvisibleTileItem } from 'Controls/tile';
import { ISpacerProps } from 'Controls/_tileRender/item/Spacer';
import { ITileItemHorizontalPadding } from 'Controls/_tileRender/utils/classes/Offset';
import { getItemSizeStyle } from 'Controls/_tileRender/item/utils/Props/ItemSize';

export function getSpacerProps(collectionItem: InvisibleTileItem): ISpacerProps {
    const horizontalPadding: ITileItemHorizontalPadding = {
        left: collectionItem.getLeftPadding(),
        right: collectionItem.getRightPadding(),
    };
    const { styleProp } = getItemSizeStyle({ collectionItem });

    return {
        styleProp,
        isLast: collectionItem.isLastInvisibleItem(),
        horizontalPadding,
    };
}
