/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { addPageDeps } from 'UI/Deps';
import { IActionOptions } from 'Controls/actions';
import { ControllerClass as OperationsController } from 'Controls/operations';
import { IListDataFactoryArguments } from '../List/_interface/IListDataFactoryArguments';

import { loadAspects } from '../AbstractList/aspectsFactory';
import { loadCollectionModule } from '../AbstractList/collections/resolveCollectionType';
import { IFilterResult, isNeedPrepareFilter, prepareFilterIfNeed } from './loadData/prepareFilter';

export { isNeedPrepareFilter, IFilterResult };

export interface IAbstractLoadDataResult extends Partial<IFilterResult> {
    operationsController?: OperationsController;
}

export async function abstractLoadData(
    // TODO: Надо конфиг поправить, не брать из наследника, должен быть свой.
    config: IListDataFactoryArguments
): Promise<IAbstractLoadDataResult> {
    const newSliceEnvPromises: Promise<unknown>[] = [];

    if (config.collectionType) {
        newSliceEnvPromises.push(
            loadAsync('Controls/marker'),
            loadAsync('Controls/multiselection'),
            loadCollectionModule(config.collectionType, true)
        );
    }

    // TODO эти две конфигурации нужно будет объединить
    if (config.listActions && typeof config.listActions === 'string') {
        newSliceEnvPromises.push(loadListActions(config.listActions));
    }
    if (config.itemActions && typeof config.itemActions === 'string') {
        newSliceEnvPromises.push(loadListActions(config.itemActions));
    }

    const [operationsController, filterLoadResult] = await Promise.all([
        getOperationsController(config),
        prepareFilterIfNeed(config),
        loadAspects(true),
        ...newSliceEnvPromises,
    ]);

    return {
        ...filterLoadResult,
        operationsController,
    };
}

async function getOperationsController(
    config: IListDataFactoryArguments
): Promise<OperationsController> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (config.operationsController && config.task1186833531) {
        return config.operationsController;
    }

    const operationsLib = await loadAsync<typeof import('Controls/operations')>(
        'Controls/operations'
    );

    return new operationsLib.ControllerClass({});
}

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
