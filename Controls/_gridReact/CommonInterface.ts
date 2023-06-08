import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

import {
    ISourceOptions,
    IDraggableOptions,
    ISortingOptions,
} from 'Controls/interface';
import { IItemActionsOptions } from 'Controls/itemActions';

import {
    IColumnConfig,
    IHeaderConfig,
} from 'Controls/_gridReact/cell/interface';
import { TGetRowPropsCallback } from 'Controls/_gridReact/row/interface';

export type TItem = Model;

/**
 * Опции таблицы с новым быстрым рендером на реакте.
 * @public
 */
export interface IGridProps
    extends ISourceOptions,
        IDraggableOptions,
        ISortingOptions,
        IItemActionsOptions {
    items?: RecordSet;

    header: IHeaderConfig[];

    columns: IColumnConfig[];

    getRowProps?: TGetRowPropsCallback;
}
