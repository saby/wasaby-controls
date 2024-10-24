/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
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
