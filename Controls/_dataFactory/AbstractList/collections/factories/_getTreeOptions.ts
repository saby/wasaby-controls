/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { ITreeCollectionOptions } from 'Controls/tree';
// TODO: Сейчас тип из листа, но должен стать из абстракта.
import type { IListState } from '../../../List/_interface/IListState';

import getListOptions from './_getListOptions';

export default function (state: IListState): ITreeCollectionOptions {
    return {
        ...getListOptions(state),

        root: state.root,
        parentProperty: state.parentProperty,
        nodeHistoryType: state.nodeHistoryType,
        nodeHistoryId: state.nodeHistoryId,
        deepReload: state.deepReload,
        expandedItems: state.expandedItems,
        nodeProperty: state.nodeProperty,
        nodeTypeProperty: state.nodeTypeProperty,
        hasChildrenProperty: state.hasChildrenProperty,
        expanderVisibility: state.expanderVisibility,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...({} as any),
    };
}
