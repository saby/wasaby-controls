import * as React from 'react';
import {ITreeGridOptions} from 'Controls/treeGrid';
import { IColumnConfig, IHeaderConfig, TGetRowPropsCallback } from 'Controls/gridReact';
import { TNavigationDirection, TOffsetSize } from 'Controls/interface';
import { TViewMode } from 'Controls-DataEnv/interface';
import { IItemsRange } from 'Controls/baseList';
import { TQuantumType, TColumnDataDensity, TColumnKeys } from '../shared/types';

import { TDynamicHeaderCellsColspanCallback } from '../render/Header';
import { IGridSelectionContainerProps, ISelection } from '../selection/SelectionContainer';

export type THoverMode = 'cross' | 'filled-cross';

type IColumnsEndedCallback = (direction: TNavigationDirection) => void;

export interface IDynamicGridComponentProps extends ITreeGridOptions {
    staticColumns: IColumnConfig[];
    endStaticColumns?: IColumnConfig[];
    dynamicColumn: IColumnConfig;
    // TODO не нужная опция, колонок столько, сколько мы сгенерировали данных в dynamicColumnsGridData
    dynamicColumnsCount: number;
    staticHeaders: IHeaderConfig[];
    endStaticHeaders?: IHeaderConfig[];
    dynamicHeader: IHeaderConfig;
    dynamicColumnsGridData: unknown[];
    columnsDataVersion: number;
    columnsEndedCallback: IColumnsEndedCallback;
    getRowProps?: TGetRowPropsCallback;
    columnsSpacing?: TOffsetSize;
    quantum?: TQuantumType;
    viewMode: TViewMode;
    beforeItemsContent?: React.ReactElement;
    afterItemsContent?: React.ReactElement;
    visibleRange: IItemsRange;
    rangeCorrection: number;
    columnDataDensity: TColumnDataDensity;
    dynamicHeaderCellsColspanCallback?: TDynamicHeaderCellsColspanCallback;
    onHeaderClick?: (event: React.MouseEvent) => void;
    cellsMultiSelectVisibility?: IGridSelectionContainerProps['multiSelectVisibility'];
    cellsMultiSelectAccessibilityCallback?: IGridSelectionContainerProps['multiSelectAccessibilityCallback'];
    selectedCells?: ISelection;
    onSelectedCellsChanged?: IGridSelectionContainerProps['onSelectionChanged'];
    onBeforeSelectedCellsChanged?: IGridSelectionContainerProps['onBeforeSelectionChange'];
    hoverMode?: THoverMode;
    // events
    eventRender: React.ReactElement;
    eventsProperty: string;
    eventStartProperty: string;
    eventEndProperty: string;
}

export interface IDynamicGridComponentState {
    className: string;
    viewMode: TViewMode;
    getRowProps: TGetRowPropsCallback;
    dynamicColumnsGridData: TColumnKeys;
    columnsDataVersion: number;
    preparedColumns: IColumnConfig[];
    preparedHeaders: IHeaderConfig[];
    dynamicColumn: IColumnConfig;
    visibleRange: IItemsRange;
    rangeCorrection: number;
    initialColumnScrollPosition?: number;
}
