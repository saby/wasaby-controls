import { TileCollectionItem } from 'Controls/tile';
import { getItemSizeStyle, IItemSizeStyle } from './Props/ItemSize';
import { getBaseClassName } from './Classes/BaseClassName';

export interface IGetSpacerItemRenderProps {
    collectionItem: TileCollectionItem;
}

export interface ISpacerItemRenderProps extends IItemSizeStyle {
    className: string;
}

export function getSpacerItemRenderProps({
    collectionItem,
}: IGetSpacerItemRenderProps): ISpacerItemRenderProps {
    return {
        ...getItemSizeStyle({ collectionItem }),
        className: getBaseClassName(),
    };
}
