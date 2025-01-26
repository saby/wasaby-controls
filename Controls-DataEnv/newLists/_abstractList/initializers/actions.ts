import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { IActionsState } from '../interface/IAbstractListStateParts/IActionsState';
import type { Initializer } from '../Initializer';
import { isValidActions, isValidVisibilityCb } from '../validators/actions';
import createActionsMap from './actions/createActionsMap';
import resolveValue from './utils/resolveValue';

export default function initState(
    initializer: Initializer,
    __: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): IActionsState {
    const state: IActionsState = {
        itemActions: resolveValue(config.itemActions, isValidActions),
        listActions: resolveValue(config.listActions, isValidActions),
        itemActionsProperty: config.itemActionsProperty,
        itemActionVisibilityCallback: resolveValue(
            config.itemActionVisibilityCallback,
            isValidVisibilityCb
        ),
    };

    if (state.itemActions?.length) {
        const items = initializer.getItemsState().items;
        if (items) {
            state.itemActionsMap = createActionsMap(items, state);
        }
    }

    return state;
}
