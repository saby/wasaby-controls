import type { ITreeTileCollectionOptions } from 'Controls/treeTile';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import getTileOptions from './_getTileOptions';
import getTreeOptions from './_getTreeOptions';

export default function (state: IAbstractListState): ITreeTileCollectionOptions {
    return {
        ...getTreeOptions(state),
        ...getTileOptions(state),
    } as unknown as ITreeTileCollectionOptions;
}
