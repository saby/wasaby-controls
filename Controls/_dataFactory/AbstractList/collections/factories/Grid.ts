/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { GridCollection as IGridCollection } from 'Controls/grid';
// TODO: Сейчас тип из листа, но должен стать из абстракта.
import type { IListState } from '../../../List/_interface/IListState';
import getOptions from './_getGridOptions';

import { create as diCreate } from 'Types/di';

export function createGridCollection(state: IListState): IGridCollection {
    return diCreate(getConstructor(), getOptions(state));
}

function getConstructor() {
    return 'Controls/grid:GridCollection';
}
