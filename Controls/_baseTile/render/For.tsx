/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import { For, IItemTemplateProps } from 'Controls/baseList';
import type { TileCollectionItem } from 'Controls/tile';
import type { CollectionItem as AdaptiveTileCollectionItem } from 'Controls/adaptiveTile';

export default class TileFor extends For {
    protected _getItemProps(
        item: TileCollectionItem & AdaptiveTileCollectionItem
    ): IItemTemplateProps {
        return {
            ...super._getItemProps(item),
            'item-key': item.itemKeyAttribute,
            'data-qa': item.listElementName,
            searchValue: item.getSearchValue(),
            tileSize: item.getTileSize?.() || undefined,
            className: item.getItemClasses?.({}) || undefined,
            checkboxClassName: item.getMultiSelectClasses?.() || undefined,
            styleProp: item.getItemStyles?.({}) || undefined,
            imageSrc: item.getImageUrl?.() || undefined,
            fallbackImage: item.getFallbackImage?.() || undefined,
        };
    }
}
