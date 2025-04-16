import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { IErrorState } from '../interface/IAbstractListStateParts';
import type { Initializer } from '../Initializer';

export default function initState(
    _: Initializer,
    loadResult: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): IErrorState {
    return {
        error: loadResult.error,
        errorViewConfig: loadResult.errorViewConfig,
        errorController: config.errorController,
    };
}
