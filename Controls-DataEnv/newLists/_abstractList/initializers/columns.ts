import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { IColumnsState } from '../interface/IAbstractListStateParts';
import type { Initializer } from '../Initializer';
import resolveValue from './utils/resolveValue';
import { isValidColumns as isValidColumnsBase } from '../validators/columns';
import { IBaseColumnConfig } from 'Controls-DataEnv/listTypes';

export default function initState(
    initializer: Initializer,
    _loadResult: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): IColumnsState {
    return resolveColumnsStateSync(config, initializer.getCoreState().isLatestInteractorVersion);
}

export function resolveColumnsStateSync(
    config: IAbstractListDataFactoryArguments,
    isLatestInteractorVersion: boolean
) {
    const isValidColumns = (o: unknown): o is IBaseColumnConfig[] =>
        isValidColumnsBase(o, isLatestInteractorVersion);

    return {
        header: resolveValue(config.header, isValidColumns),
        columns: resolveValue(config.columns, isValidColumns),
    };
}
