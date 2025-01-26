import type { ICollectionOptions } from 'Controls/display';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import extract from './extract';

// TODO: (keyof IAbstractListState)[]
const OPTIONS = [
    'items',
    'sorting',
    'filter',
    'source',
    'navigation',
    'displayProperty',
    'sourceController',
    'selectedKeys',
    'excludedKeys',
    'activeElement',
    'keyProperty',
    'markerVisibility',
    'multiSelectVisibility',
    'markedKey',
    'selectionCountMode',
    'recursiveSelection',
    'isThinInteractor',
    'rowSeparatorSize',
    'rowSeparatorVisibility',
    'ladderProperties',
    'emptyView',
    'order',
];

export default function (state: IAbstractListState): ICollectionOptions {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...extract(state, OPTIONS),
        collection: state.items,
    };
}
