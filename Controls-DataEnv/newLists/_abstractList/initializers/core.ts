import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { ICoreState } from '../interface/IAbstractListStateParts';
import type { Initializer } from '../Initializer';

export default function initState(
    _: Initializer,
    loadResult: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): ICoreState {
    return {
        sliceOwnedByBrowser: !!config.sliceOwnedByBrowser,
        isLatestInteractorVersion: loadResult.isLatestInteractorVersion,
        loading: false,
        command: undefined,
        displayProperty: config.displayProperty,
        _actionToDispatch: undefined,
    };
}
