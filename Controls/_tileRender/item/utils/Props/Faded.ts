import { TileCollectionItem } from 'Controls/tile';

interface IItemFadedProps {
    collectionItem: TileCollectionItem;
}

/**
 * Возвращает состояние размытости элемента плитки
 **/
export function getItemFaded({ collectionItem }: IItemFadedProps) {
    return collectionItem.isFaded() || collectionItem.isDragged();
}
