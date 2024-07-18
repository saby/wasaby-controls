import type { IListDataFactoryLoadResult } from 'Controls/dataFactory';
import { IListDataFactoryArguments } from 'Controls/dataFactory';

import { RecordSet } from 'Types/collection';
import { ExternalCollectionItemKeys } from './_interface/IExternalTypes';
import { IListMobileDataFactoryArguments } from './_interface/IListMobileDataFactoryArguments';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { IActionOptions } from 'Controls/actions';
import { addPageDeps } from 'UI/Deps';
import { ControllerClass as OperationsController } from 'Controls/operations';

async function loadListActions(listActionsModule: string): Promise<void> {
    const listActions = await loadAsync<IActionOptions[]>(listActionsModule);
    addPageDeps([listActionsModule]);

    if (listActions) {
        const modules = listActions
            .filter((actionCfg) => !!actionCfg.actionName)
            .map((actionCfg) => actionCfg.actionName as string);

        if (modules.length) {
            await Promise.all(modules.map((moduleName) => loadAsync(moduleName)));
            addPageDeps(modules);
        }
    }
}

async function getOperationsController(
    config: IListDataFactoryArguments
): Promise<OperationsController> {
    if (config.operationsController && config.task1186833531) {
        return config.operationsController;
    }

    const operationsLib = await loadAsync<typeof import('Controls/operations')>(
        'Controls/operations'
    );

    return new operationsLib.ControllerClass({});
}

export default async function loadData(
    cfg: IListMobileDataFactoryArguments
): Promise<IListDataFactoryLoadResult & { items?: RecordSet }> {
    const parallelLoadingPromises: Promise<void>[] = [];

    if (cfg.listActions && typeof cfg.listActions === 'string') {
        parallelLoadingPromises.push(loadListActions(cfg.listActions));
    }
    const operationsPromise = getOperationsController(cfg);

    const [operationController] = await Promise.all([
        operationsPromise,
        ...parallelLoadingPromises,
    ]);

    try {
        const items = new RecordSet({
            rawData: [],
            model: cfg.model,
            keyProperty: ExternalCollectionItemKeys.ident,
        });
        return {
            error: undefined,
            data: items,
            items,
            operationController,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return {
            error,
        };
    }
}
