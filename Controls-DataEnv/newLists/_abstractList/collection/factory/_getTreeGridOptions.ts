import type { ITreeGridCollectionOptions } from 'Controls/treeGrid';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import getGridOptions from './_getGridOptions';
import getTreeOptions from './_getTreeOptions';

export default function (state: IAbstractListState): ITreeGridCollectionOptions {
    return {
        ...getTreeOptions(state),
        ...getGridOptions(state),
    } as unknown as ITreeGridCollectionOptions;
}
