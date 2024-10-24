/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IGridViewProps } from 'Controls/grid';
import type { Collection as ICollection } from 'Controls/display';

// После выделение интерфейса базового Render'а - импортировать его, а не IGridViewProps.
export interface IAbstractRenderProps<TCollection extends ICollection = ICollection>
    extends Omit<IGridViewProps, 'collection'> {
    collection: TCollection;
}
