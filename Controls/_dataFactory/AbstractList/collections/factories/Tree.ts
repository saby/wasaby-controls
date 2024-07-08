import type { ITreeCollectionOptions, TreeCollection as ITreeCollection } from 'Controls/tree';
// TODO: Сейчас тип из листа, но должен стать из абстракта.
import type { IListState } from '../../../List/_interface/IListState';
import _getTreeOptions from './_getTreeOptions';

import { create as diCreate } from 'Types/di';

export function createTreeCollection(state: IListState): ITreeCollection {
    return diCreate(getConstructor(), getOptions(state));
}

function getConstructor() {
    return 'Controls/tree:TreeCollection';
}

function getOptions(state: IListState): ITreeCollectionOptions {
    return _getTreeOptions(state);
}
