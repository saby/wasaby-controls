/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { getAbstractListComponent, IAbstractListComponentProps } from 'Controls-Lists/abstractList';
import type { GridCollection as IGridCollection } from 'Controls/gridDisplay';
import { ReactTreeGridView } from 'Controls/treeGridRender';

import 'css!Controls/baseList';
import 'css!Controls/list';
import 'css!Controls/grid';
import 'css!Controls/gridReact';
import 'css!Controls/baseTree';

export interface IComponentProps extends Omit<IAbstractListComponentProps, 'Render'> {}

export const Component = getAbstractListComponent<IComponentProps>((props) => (
    <ReactTreeGridView {...props} collection={props.collection as unknown as IGridCollection} />
));

Component.displayName = 'Controls-Lists/treeGrid:Component';
