/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
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
