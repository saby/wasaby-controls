import { TileCollectionItem } from 'Controls/tile';

interface IGetClassNameProps {
    collectionItem: TileCollectionItem;
}

export function getClassName({ collectionItem }: IGetClassNameProps) {
    let className =
        'controls-TileView__item controls-ListView__itemV js-controls-ListView__editingTarget';

    if (collectionItem.getTileScalingMode() === 'none') {
        className += ' controls-TileView__item_unscalable';
    }

    if (collectionItem.getTileOrientation() === 'vertical') {
        className += ' ws-flex-grow-1';
    }

    className += ` ${collectionItem.getItemPaddingClasses()}`;

    return { className };
}
