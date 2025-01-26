import type { ITreeCollectionOptions } from 'Controls/tree';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import getListOptions from './_getListOptions';
import extract from './extract';

const _KNOWN_OPTIONS: (keyof IAbstractListState)[] = [
    'root',
    'parentProperty',
    'expandedItems',
    'nodeProperty',
];

// TODO: (keyof IAbstractListState)[]
const OPTIONS = [
    ..._KNOWN_OPTIONS,
    'nodeHistoryType',
    'nodeHistoryId',
    'deepReload',
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
