import type { ITreeTileCollectionOptions } from 'Controls/treeTile';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import getTileOptions from './_getTileOptions';
import getTreeOptions from './_getTreeOptions';
import extract from './extract';

// TODO: (keyof IAbstractListState)[]
const OPTIONS = ['nodesHeight', 'folderWidth'];

export default function (state: IAbstractListState): ITreeTileCollectionOptions {
    return {
        ...getTreeOptions(state),
        ...getTileOptions(state),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...extract(state, OPTIONS),
    } as unknown as ITreeTileCollectionOptions;
}
