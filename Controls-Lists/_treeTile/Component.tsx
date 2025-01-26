/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import type { ITileItemProps } from 'Controls/tile';
import { getAbstractListComponent, IAbstractListComponentProps } from 'Controls-Lists/abstractList';
import Render from './Render';
import { useRenderEventHandlers } from './hooks/useRenderEventHandlersHook';

import 'css!Controls/tile';

export interface IComponentProps
    extends Omit<IAbstractListComponentProps, 'changeRootByItemClick'> {
    itemTemplate?: React.ComponentType<ITileItemProps>;
}

export const Component = getAbstractListComponent<IComponentProps>(
    // @ts-ignore
    (props) => <Render {...props} collection={props.collection} />,
    {
        useRenderEventHandlersHook: useRenderEventHandlers,
    }
);

Component.displayName = 'Controls-Lists/treeTile:Component';
