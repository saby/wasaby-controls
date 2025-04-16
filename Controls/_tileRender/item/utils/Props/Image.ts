import { TileCollectionItem } from 'Controls/tile';
import { IImageProps } from 'Controls/interface';

interface IGetImageProps {
    collectionItem: TileCollectionItem;
}

export interface ITileImageProps extends Pick<IImageProps, 'imageSrc'> {}

/**
 * Возвращает src картинки с коллекции айтема
 **/
export function getImageProps({ collectionItem }: IGetImageProps): ITileImageProps {
    return { imageSrc: collectionItem.getImageUrl() };
}
