/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IAbstractListComponentProps } from 'Controls-Lists/abstractList';

import { AbstractListSlice } from 'Controls-DataEnv/abstractList';
import { Component as TreeGridComponent } from 'Controls-Lists/treeGrid';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { useSlice } from 'Controls-DataEnv/context';
import { LibPaths } from 'Controls-DataEnv/staticLoader';

export interface IComponentProps
    extends Omit<IAbstractListComponentProps, 'changeRootByItemClick'> {}

export function Component(props: IComponentProps) {
    const slice = useSlice<AbstractListSlice>(props.storeId);

    if (!slice) {
        return null;
    }

    if (slice.state.viewMode === 'tile' && isLoaded(LibPaths.NewTreeTile)) {
        const TileComponent = loadSync<typeof import('Controls-Lists/treeTile')>(
            LibPaths.NewTreeTile
        ).Component;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return <TileComponent {...props} changeRootByItemClick={true} />;
    } else {
        return <TreeGridComponent {...props} changeRootByItemClick={true} />;
    }
}

Component.displayName = 'Controls-Lists/explorer:Component';
