import { DEFAULT_COMPRESSION_COEFF } from 'Controls/tile';
import { TileCollectionItem } from 'Controls/tile';
import { CSSProperties } from 'react';

interface IGetItemSizeStyleProps {
    collectionItem: TileCollectionItem;
}

export interface IItemSizeStyle {
    styleProp?: CSSProperties;
}

export function getItemSizeStyle({ collectionItem }: IGetItemSizeStyleProps): IItemSizeStyle {
    const width = collectionItem.getTileWidth();
    let flexBasis = width;

    if (
        Number.parseFloat(width + '').toString() === width.toString() &&
        collectionItem.getTileMode() === 'dynamic'
    )
        flexBasis = DEFAULT_COMPRESSION_COEFF * width;

    return {
        styleProp: {
            width: width ? width + 'px' : undefined,
            flexBasis,
        },
    };
}
