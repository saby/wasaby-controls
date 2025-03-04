import resolveValue from './utils/resolveValue';
import { isValidEmptyView } from '../validators/emptyView';

import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { IEmptyViewState } from '../interface/IAbstractListStateParts';
import type { Initializer } from '../Initializer';

export default function initState(
    _initializer: Initializer,
    _loadResult: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): IEmptyViewState {
    return {
        emptyView: resolveValue(config.emptyView, isValidEmptyView),
        emptyViewConfig: config.emptyViewConfig,
    };
}
