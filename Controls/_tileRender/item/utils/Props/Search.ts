import { TileCollectionItem } from 'Controls/tile';
import { IHighlightDecoratorProps } from 'Controls/interface';

interface IGetSearchProps {
    collectionItem: TileCollectionItem;
}

export interface ITileSearchProps extends Pick<IHighlightDecoratorProps, 'searchValue'> {}

export function getSearchProps({ collectionItem }: IGetSearchProps): ITileSearchProps {
    return { searchValue: collectionItem.getSearchValue() };
}
