/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TreeTileCollection as ITreeTileCollection } from 'Controls/treeTile';
// TODO: Сейчас тип из листа, но должен стать из абстракта.
import type { IListState } from '../../../List/_interface/IListState';

import { create as diCreate } from 'Types/di';
import getOptions from './_getTreeTileOptions';

export function createTreeTileCollection(state: IListState): ITreeTileCollection {
    return diCreate(getConstructor(), getOptions(state));
}

function getConstructor() {
    return 'Controls/treeTile:TreeTileCollection';
}
