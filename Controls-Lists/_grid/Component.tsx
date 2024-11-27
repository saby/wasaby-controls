/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { getAbstractListComponent, IAbstractListComponentProps } from 'Controls-Lists/abstractList';
import { GridCollection as IGridCollection, GridView as GridRender } from 'Controls/grid';

import 'css!Controls/baseList';
import 'css!Controls/list';
import 'css!Controls/grid';
import 'css!Controls/gridReact';

export interface IComponentProps
    extends Omit<IAbstractListComponentProps, 'changeRootByItemClick'> {}

export const Component = getAbstractListComponent<IComponentProps>((props) => (
    <GridRender {...props} collection={props.collection as unknown as IGridCollection} />
));

Component.displayName = 'Controls-Lists/grid:Component';
