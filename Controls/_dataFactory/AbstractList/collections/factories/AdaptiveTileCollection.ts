/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { Collection as IAdaptiveTileCollection } from 'Controls/adaptiveTile';
// TODO: Сейчас тип из листа, но должен стать из абстракта.
import type { IListState } from '../../../List/_interface/IListState';
import getOptions from './_getAdaptiveTileCollection';

import { create as diCreate } from 'Types/di';

export function createAdaptiveTileCollection(state: IListState): IAdaptiveTileCollection {
    return diCreate(getConstructor(), getOptions(state));
}

function getConstructor() {
    return 'Controls/adaptiveTile:Collection';
}
