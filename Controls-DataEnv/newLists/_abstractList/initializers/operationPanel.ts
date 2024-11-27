import type { Initializer } from '../Initializer';
import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { IOperationsPanelState } from '../interface/IAbstractListStateParts';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

export default function initState(
    initializer: Initializer,
    _: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): IOperationsPanelState {
    return {
        operationsPanelVisible: !!config.operationsPanelVisible,
        operationsController: config.operationsController || createController(initializer),
    };
}

const createController = (initializer: Initializer) => {
    if (!isLoaded('Controls/operations')) {
        return;
    }

    const { selectedKeys, excludedKeys } = initializer.getSelectionState();
    const { root } = initializer.getHierarchyState();
    const { ControllerClass } =
        loadSync<typeof import('Controls/operations')>('Controls/operations');

    return new ControllerClass({
        selectedKeys,
        excludedKeys,
        root,
    });
};
