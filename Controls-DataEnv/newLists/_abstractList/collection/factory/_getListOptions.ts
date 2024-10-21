/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { ICollectionOptions } from 'Controls/display';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import extract from './extract';

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
    return {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...extract(state, OPTIONS),
        collection: state.items,
    };
}
