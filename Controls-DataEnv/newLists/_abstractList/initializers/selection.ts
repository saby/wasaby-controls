import dedupeArray from './utils/dedupeArray';

import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { ISelectionState } from '../interface/IAbstractListStateParts';
import type { Initializer } from '../Initializer';

export default function initState(
    _: Initializer,
    __: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): ISelectionState {
    return {
        selectedKeys: dedupeArray(config.selectedKeys, 'selectedKeys') || [],
        excludedKeys: dedupeArray(config.excludedKeys, 'excludedKeys') || [],
        selectionModel: new Map(),
        multiSelectVisibility: config.multiSelectVisibility || 'hidden',
    };
}
