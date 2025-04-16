import { TileCollectionItem } from 'Controls/tile';

export interface IGetEditingProps {
    collectionItem: TileCollectionItem;
}

export function getEditingState({ collectionItem }: IGetEditingProps) {
    return { isEditing: collectionItem.isEditing() };
}
