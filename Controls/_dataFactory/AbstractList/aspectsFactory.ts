import type { Collection as ICollection } from 'Controls/display';
import type { IAbstractListSliceState } from './_interface/IAbstractListSliceState';
import type { TCollectionType } from './_interface/IAbstractListSliceTypes';
import type { IAspectsFactory, IListAspects } from './_interface/IAspectTypes';

import { AspectsNames } from './_interface/AspectsNames';
import { loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';

// TODO: Убрать статические импорты.
import 'Controls/markerListAspect';
import 'Controls/itemsListAspect';
import 'Controls/rootListAspect';
import 'Controls/flatSelectionAspect';
import 'Controls/hierarchySelectionAspect';
import 'Controls/pathListAspect';
import 'Controls/expandCollapseListAspect';

const createFactory = (): IAspectsFactory => new Map();

const AspectsLibs = {
    [AspectsNames.Marker]: 'Controls/markerListAspect',
    [AspectsNames.Items]: 'Controls/itemsListAspect',
    [AspectsNames.Root]: 'Controls/rootListAspect',
    FlatSelection: 'Controls/flatSelectionAspect',
    HierarchySelection: 'Controls/hierarchySelectionAspect',
    [AspectsNames.Path]: 'Controls/pathListAspect',
    [AspectsNames.ExpandCollapse]: 'Controls/expandCollapseListAspect',
} as const;

const getDefaultFactory: () => IAspectsFactory = () =>
    createFactory()
        // Строго первый аспект пока нет другого решения.
        .set(
            AspectsNames.Items,
            loadSync<typeof import('Controls/itemsListAspect')>(AspectsLibs.Items)
                .itemsStateManagerFactory
        )
        // Строго второй аспект пока нет другого решения.
        .set(
            AspectsNames.Root,
            loadSync<typeof import('Controls/rootListAspect')>(AspectsLibs.Root)
                .rootStateManagerFactory
        )
        .set(
            AspectsNames.Marker,
            loadSync<typeof import('Controls/markerListAspect')>(AspectsLibs.Marker)
                .markerStateManagerFactory
        )
        .set(
            AspectsNames.Path,
            loadSync<typeof import('Controls/pathListAspect')>(AspectsLibs.Path)
                .pathStateManagerFactory
        )
        .set(
            AspectsNames.ExpandCollapse,
            loadSync<typeof import('Controls/expandCollapseListAspect')>(AspectsLibs.ExpandCollapse)
                .expandCollapseStateManagerFactory
        );

const getFactories: () => Record<TCollectionType, IAspectsFactory> = () => {
    return {
        Tree: getDefaultFactory().set(
            AspectsNames.Selection,
            loadSync<typeof import('Controls/hierarchySelectionAspect')>(
                AspectsLibs.HierarchySelection
            ).hierarchySelectionStateManagerFactory
        ),
        TreeGrid: getDefaultFactory().set(
            AspectsNames.Selection,
            loadSync<typeof import('Controls/hierarchySelectionAspect')>(
                AspectsLibs.HierarchySelection
            ).hierarchySelectionStateManagerFactory
        ),
        Columns: getDefaultFactory().set(
            AspectsNames.Selection,
            loadSync<typeof import('Controls/flatSelectionAspect')>(AspectsLibs.FlatSelection)
                .flatSelectionStateManagerFactory
        ),
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

export function loadAspects(): Promise<void> {
    return Promise.all(
        Object.keys(AspectsLibs).map((name) =>
            loadAsync(AspectsLibs[name as keyof typeof AspectsLibs])
        )
    ).then(() => void 0);
}
