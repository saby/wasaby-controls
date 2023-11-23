import type { Collection } from 'Controls/display';
import type { TCollectionType } from '../_interface/IAbstractListSliceTypes';
import type { IAbstractListSliceState } from '../_interface/IAbstractListSliceState';
// TODO: Сейчас тип из листа, но должен стать из абстракта.
import type { IListState } from '../../List/_interface/IListState';

import { createTreeCollection } from './factories/Tree';
import { createTreeGridCollection } from './factories/TreeGrid';

const factories: Required<Record<TCollectionType, Function>> = {
    TreeGrid: createTreeGridCollection,
    Tree: createTreeCollection,
};

export function createCollection(collectionType: TCollectionType, state: IAbstractListSliceState): Collection {
    // TODO: Сейчас тип из листа, но должен стать из абстракта.
    return factories[collectionType](state as IListState);
}
