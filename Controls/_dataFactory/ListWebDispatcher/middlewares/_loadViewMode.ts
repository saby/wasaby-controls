/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { isLoaded, loadAsync } from 'WasabyLoader/ModulesLoader';
import { TViewMode } from 'Controls-DataEnv/interface';
import { IListState } from 'Controls/_dataFactory/List/_interface/IListState';

function isLoadedDependencies(deps: string[]): boolean {
    return deps.every((dep) => isLoaded(dep));
}

function getUnloadedDependencies(deps: string[]): string[] {
    return deps.filter((dep) => !isLoaded(dep));
}

function loadDeps(deps: string[]): Promise<unknown> {
    const unloadedDeps = getUnloadedDependencies(deps);
    const promises = unloadedDeps.map((unloadDep) => loadAsync(unloadDep));

    if (promises.length) {
        return Promise.all(promises);
    } else {
        return Promise.resolve();
    }
}

type TLoadViewModeParams = TGetViewModeDependenciesParams;

export function loadViewModeFn(params: TLoadViewModeParams, viewMode: TViewMode): Promise<unknown> {
    return loadDeps(getViewModeDependencies(params, viewMode));
}

type TIsViewModeLoadedParams = TGetViewModeDependenciesParams;

export function isViewModeLoaded(
    params: TIsViewModeLoadedParams,
    viewMode: TViewMode | undefined
): boolean {
    return isLoadedDependencies(getViewModeDependencies(params, viewMode));
}

type TGetViewModeDependenciesParams = Partial<Pick<IListState, 'nodeProperty' | 'items'>>;

function getViewModeDependencies(
    cfgFromState: TGetViewModeDependenciesParams,
    viewMode: TViewMode | undefined
): string[] {
    const meta = cfgFromState.items?.getMetaData();
    const viewTemplate = meta?.results?.get('ConfigurationTemplate');
    const resultDeps = [];
    if (viewTemplate) {
        if (viewMode === 'list') {
            resultDeps.push('Controls/list');
        }
    }
    if (viewMode === 'tile') {
        if (cfgFromState.nodeProperty) {
            resultDeps.push('Controls/treeTile');
        }
        resultDeps.push('Controls/tile');
    }
    if (viewMode === 'table') {
        resultDeps.push('Controls/treeGrid');
    }
    if (viewMode === 'search') {
        resultDeps.push('Controls/searchBreadcrumbsGrid');
    }
    if (viewMode === 'searchTile') {
        resultDeps.push('Controls/searchBreadcrumbsTile');
    }
    if (viewMode === 'composite') {
        resultDeps.push('Controls/expandedCompositeTree');
        resultDeps.push('Controls-widgets/navigation');
    }
    if (viewTemplate) {
        const viewModeTemplate = viewTemplate[viewMode];
        if (viewModeTemplate && viewMode === 'tile' && viewModeTemplate?.navigation?.scheme) {
            const navigationScheme = viewModeTemplate.navigation.scheme;
            // TODO убрать подгрузку чипсов https://online.sbis.ru/opendoc.html?guid=e4c4a491-e777-453a-b526-1c993542715e&client=3
            if (navigationScheme === 'showcaseNavigation') {
                resultDeps.push('Controls-widgets/navigation');
                resultDeps.push('Controls/Chips:Control');
                resultDeps.push('Controls/RadioGroup:Control');
            } else if (navigationScheme === 'showcaseColumns') {
                resultDeps.push('Controls/columns:ItemsView');
            } else if (navigationScheme === 'showcaseTile') {
                resultDeps.push('Controls/treeTile:ItemsView');
            }
            if (navigationScheme !== 'tile') {
                resultDeps.push('Controls/expandedCompositeTree');
                resultDeps.push('Controls-widgets/navigation');
            }
        }
    }

    return resultDeps;
}
