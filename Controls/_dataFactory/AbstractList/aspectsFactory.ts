import type { Collection as ICollection } from 'Controls/display';
import type { IAbstractListSliceState } from './_interface/IAbstractListSliceState';
import type { TCollectionType } from './_interface/IAbstractListSliceTypes';
import type { IAspectsFactory, IListAspects } from './_interface/IAspectTypes';
import { addPageDeps } from 'UICommon/Deps';

import { AspectsNames } from './_interface/AspectsNames';
import { loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';

const createFactory = (): IAspectsFactory => new Map();

const AspectsLibs = {
    [AspectsNames.Marker]: 'Controls/listAspects',
    [AspectsNames.Items]: 'Controls/listAspects',
    [AspectsNames.Root]: 'Controls/listAspects',
    FlatSelection: 'Controls/listAspects',
    HierarchySelection: 'Controls/listAspects',
    [AspectsNames.Path]: 'Controls/listAspects',
    [AspectsNames.ExpandCollapse]: 'Controls/listAspects',
    [AspectsNames.OperationsPanel]: 'Controls/listAspects',
    [AspectsNames.HighlightFields]: 'Controls/listAspects',
    [AspectsNames.ItemActions]: 'Controls/listAspects',
    [AspectsNames.Stub]: 'Controls/listAspects',
} as const;

const getDefaultFlatFactory: () => IAspectsFactory = () =>
    createFactory()
        // Строго первый аспект пока нет другого решения.
        .set(
            AspectsNames.Items,
            loadSync<typeof import('Controls/listAspects')>(AspectsLibs.Items)
                .itemsStateManagerFactory
        )
        .set(
            AspectsNames.Marker,
            loadSync<typeof import('Controls/listAspects')>(AspectsLibs.Marker)
                .markerStateManagerFactory
        )
        .set(
            AspectsNames.HighlightFields,
            loadSync<typeof import('Controls/listAspects')>(AspectsLibs.HighlightFields)
                .highlightFieldsStateManagerFactory
        )
        .set(
            AspectsNames.ItemActions,
            loadSync<typeof import('Controls/listAspects')>(AspectsLibs.ItemActions)
                .itemActionsStateManagerFactory
        );

const getDefaultHierarchyFactory: () => IAspectsFactory = () =>
    createFactory()
        // Строго первый аспект пока нет другого решения.
        .set(
            AspectsNames.Items,
            loadSync<typeof import('Controls/listAspects')>(AspectsLibs.Items)
                .itemsStateManagerFactory
        )
        // Строго второй аспект пока нет другого решения.
        .set(
            AspectsNames.Root,
            loadSync<typeof import('Controls/listAspects')>(AspectsLibs.Root)
                .rootStateManagerFactory
        )
        .set(
            AspectsNames.Marker,
            loadSync<typeof import('Controls/listAspects')>(AspectsLibs.Marker)
                .markerStateManagerFactory
        )
        .set(
            AspectsNames.ItemActions,
            loadSync<typeof import('Controls/listAspects')>(AspectsLibs.ItemActions)
                .itemActionsStateManagerFactory
        )
        .set(
            AspectsNames.Path,
            loadSync<typeof import('Controls/listAspects')>(AspectsLibs.Path)
                .pathStateManagerFactory
        )
        .set(
            AspectsNames.ExpandCollapse,
            loadSync<typeof import('Controls/listAspects')>(AspectsLibs.ExpandCollapse)
                .expandCollapseStateManagerFactory
        )
        .set(
            AspectsNames.HighlightFields,
            loadSync<typeof import('Controls/listAspects')>(AspectsLibs.HighlightFields)
                .highlightFieldsStateManagerFactory
        );

const getFactories: () => Record<TCollectionType, IAspectsFactory> = () => {
    const addFlatSelection = (map: IAspectsFactory): IAspectsFactory =>
        map.set(
            AspectsNames.Selection,
            loadSync<typeof import('Controls/listAspects')>(AspectsLibs.FlatSelection)
                .flatSelectionStateManagerFactory
        );

    const addHierarchySelection = (map: IAspectsFactory): IAspectsFactory =>
        map.set(
            AspectsNames.Selection,
            loadSync<typeof import('Controls/listAspects')>(AspectsLibs.HierarchySelection)
                .hierarchySelectionStateManagerFactory
        );

    const addOperationsPanel = (map: IAspectsFactory): IAspectsFactory =>
        map.set(
            AspectsNames.OperationsPanel,
            loadSync<typeof import('Controls/listAspects')>(AspectsLibs.OperationsPanel)
                .operationsPanelStateManagerFactory
        );

    const addStub = (map: IAspectsFactory): IAspectsFactory =>
        map.set(
            AspectsNames.Stub,
            loadSync<typeof import('Controls/listAspects')>(AspectsLibs.Stub)
                .stubStateManagerFactory
        );

    return {
        List: addStub(addOperationsPanel(addFlatSelection(getDefaultFlatFactory()))),
        Grid: addStub(addOperationsPanel(addFlatSelection(getDefaultFlatFactory()))),
        Tree: addStub(addOperationsPanel(addHierarchySelection(getDefaultHierarchyFactory()))),
        TreeGrid: addStub(addOperationsPanel(addHierarchySelection(getDefaultHierarchyFactory()))),
        Columns: addStub(addOperationsPanel(addFlatSelection(getDefaultHierarchyFactory()))),
    };
};

export function createAspects(
    collectionType: TCollectionType,
    state: IAbstractListSliceState & {
        // TODO: Уйдет в процессе проекта, когда стратегия станет стейтлесс.
        //  Коллекция должна лежать на слайсе, а не на стейте.
        collection: ICollection;
    }
): IListAspects {
    const aspects: IListAspects = new Map();

    const viewModeAspectsFactories = getFactories()[collectionType];
    viewModeAspectsFactories.forEach((factory, name) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        aspects.set(name, factory(collectionType, state))
    );

    return aspects;
}

export async function loadAspects(shouldAddPageDeps: boolean = false): Promise<void> {
    const libName = 'Controls/listAspects';

    await loadAsync(libName);

    if (shouldAddPageDeps) {
        addPageDeps([libName]);
    }
}
