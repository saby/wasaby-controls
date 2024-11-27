import type { ITreeCollectionOptions } from 'Controls/tree';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import getListOptions from './_getListOptions';
import extract from './extract';

// TODO: (keyof IAbstractListState)[]
const OPTIONS = [
    'root',
    'parentProperty',
    'nodeHistoryType',
    'nodeHistoryId',
    'deepReload',
    'expandedItems',
    'nodeProperty',
    'nodeTypeProperty',
    'hasChildrenProperty',
    'expanderVisibility',
];

export default function (state: IAbstractListState): ITreeCollectionOptions {
    return {
        ...getListOptions(state),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...extract(state, OPTIONS),
    } as unknown as ITreeCollectionOptions;
}
