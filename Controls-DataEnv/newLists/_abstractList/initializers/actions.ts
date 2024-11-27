import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { IActionsState } from '../interface/IAbstractListStateParts';
import type { Initializer } from '../Initializer';
import { loadSync } from 'WasabyLoader/ModulesLoader';

export default function initState(
    _: Initializer,
    __: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): IActionsState {
    return {
        itemActions: getActions(config.itemActions),
        listActions: getActions(config.listActions),
    };
}

const getActions = (actions: unknown[] | string | undefined) => {
    if (!actions) {
        return;
    }
    if (typeof actions === 'string') {
        // eslint-disable-next-line no-param-reassign
        actions = loadSync(actions);
    }
    if (Array.isArray(actions)) {
        return actions as unknown[];
    }
};
