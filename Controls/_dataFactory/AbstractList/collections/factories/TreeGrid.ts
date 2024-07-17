import type {
    ITreeGridCollectionOptions,
    TreeGridCollection as ITreeGridCollection,
} from 'Controls/treeGrid';
// TODO: Сейчас тип из листа, но должен стать из абстракта.
import type { IListState } from '../../../List/_interface/IListState';

import { create as diCreate } from 'Types/di';
import _getTreeOptions from './_getTreeOptions';

export function createTreeGridCollection(state: IListState): ITreeGridCollection {
    return diCreate(getConstructor(), getOptions(state));
}

function getConstructor() {
    return 'Controls/treeGrid:TreeGridCollection';
}

function getOptions(state: IListState): ITreeGridCollectionOptions {
    return {
        ..._getTreeOptions(state),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...({} as any),
    };
}
