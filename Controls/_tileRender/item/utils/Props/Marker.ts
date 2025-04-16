import { TileCollectionItem } from 'Controls/tile';
import { IMarkerProps } from 'Controls/interface';

interface IGetMarkerProps {
    collectionItem: TileCollectionItem;
}

export interface ITileMarkerProps extends Pick<IMarkerProps, 'markerVisible'> {}

export function getMarkerProps({ collectionItem }: IGetMarkerProps): ITileMarkerProps {
    return {
        markerVisible: collectionItem.isMarked(),
    };
}
