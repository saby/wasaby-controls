/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TreeGridCollection as ITreeGridCollection } from 'Controls/treeGrid';
// TODO: Сейчас тип из листа, но должен стать из абстракта.
import type { IListState } from '../../../List/_interface/IListState';

import { create as diCreate } from 'Types/di';
import getOptions from './_getTreeGridOptions';

export function createTreeGridCollection(state: IListState): ITreeGridCollection {
    return diCreate(getConstructor(), getOptions(state));
}

function getConstructor() {
    return 'Controls/treeGrid:TreeGridCollection';
}
