import type { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import type { IListDataFactoryArguments, IDataFactory } from 'Controls/dataFactory';
import type { TNavigationDirection } from 'Controls/interface';
import {
    TCellsMultiSelectAccessibilityCallback,
    TCellsMultiSelectVisibility,
    ISelection,
} from '../selection/SelectionContainer';

export interface IDynamicColumnsNavigationSourceConfig<TPosition = number> {
    field: string;
    direction: TNavigationDirection;
    limit: number;
    position: TPosition;
}

export interface IDynamicColumnsNavigation<TPosition = number> {
    source: string;
    sourceConfig: IDynamicColumnsNavigationSourceConfig<TPosition>;
}

export interface IDynamicGridArguments<TNavigationPosition = number> {
    staticColumns: IColumnConfig[];
    dynamicColumn: IColumnConfig;
    staticHeaders: IHeaderConfig[];
    dynamicHeader: IHeaderConfig;
    columnsNavigation: IDynamicColumnsNavigation<TNavigationPosition>;
    cellsMultiSelectVisibility?: TCellsMultiSelectVisibility;
    cellsMultiSelectAccessibilityCallback?: TCellsMultiSelectAccessibilityCallback;
    selectedCells?: ISelection;
    rootHistoryId?: string;
}

export interface IDynamicColumnsFilter<TPosition = number> {
    direction: TNavigationDirection;
    limit: number;
    position: TPosition;
}

export interface IDynamicGridDataFactoryArguments<TNavigationPosition = number>
    extends IListDataFactoryArguments,
        IDynamicGridArguments<TNavigationPosition> {}

export type IDynamicGridDataFactory = IDataFactory<unknown, IDynamicGridDataFactoryArguments>;
