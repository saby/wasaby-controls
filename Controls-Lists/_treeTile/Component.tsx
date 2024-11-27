/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { getAbstractListComponent, IAbstractListComponentProps } from 'Controls-Lists/abstractList';
import type { TreeTileCollection as ITreeTileCollection } from 'Controls/treeTile';
import Render from './Render';
import { useRenderEventHandlers } from './hooks/useRenderEventHandlersHook';

import 'css!Controls/tile';

export interface IComponentProps
    extends Omit<IAbstractListComponentProps, 'Render' | 'changeRootByItemClick'> {}

export const Component = getAbstractListComponent(
    (props) => (
        <Render {...props} collection={props.collection as unknown as ITreeTileCollection} />
    ),
    {
        useRenderEventHandlersHook: useRenderEventHandlers,
    }
);

Component.displayName = 'Controls-Lists/treeTile:Component';
