/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type * as React from 'react';
import type { IAbstractListComponentProps } from 'Controls-Lists/abstractList';

import type { TViewMode } from 'Controls-DataEnv/interface';
import type { AbstractListSlice } from 'Controls-DataEnv/abstractList';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { useSlice } from 'Controls-DataEnv/context';
import { LibPaths } from 'Controls-DataEnv/staticLoader';

export interface IComponentProps
    extends Omit<IAbstractListComponentProps, 'changeRootByItemClick'> {}

const Components: Record<TViewMode, () => null | React.ComponentType<IAbstractListComponentProps>> =
    {
        list: () => null,
        table: () =>
            isLoaded(LibPaths.NewTreeGrid)
                ? loadSync<typeof import('Controls-Lists/treeGrid')>(LibPaths.NewTreeGrid).Component
                : null,
        tile: () =>
            isLoaded(LibPaths.NewTreeTile)
                ? loadSync<typeof import('Controls-Lists/treeTile')>(LibPaths.NewTreeTile).Component
                : null,
        composite: () => null,
        search: () => null,
        searchTile: () => null,
    };

export function Component(props: IComponentProps) {
    const slice = useSlice<AbstractListSlice>(props.storeId);

    if (!slice) {
        return null;
    }

    const Component = Components[slice.state.viewMode || 'table']();

    if (!Component) {
        return null;
    }

    return <Component {...props} changeRootByItemClick={true} />;
}

Component.displayName = 'Controls-Lists/explorer:Component';
