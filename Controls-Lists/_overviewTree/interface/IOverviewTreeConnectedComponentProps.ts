import { IColumn } from 'Controls/treeGridRender';
import type { TGetRowPropsCallback } from 'Controls/gridRender';

export interface IOverviewTreeConnectedComponentProps {
    storeId: string;
    columns?: IColumn[];
    getRowProps?: TGetRowPropsCallback;
}
