import * as React from 'react';
import { View, ITreeGridOptions, View as TreeGridComponent } from 'Controls/treeGrid';
import {
    IColumnConfig,
    IHeaderConfig,
    IResultConfig,
    TGetRowPropsCallback,
    TColumnKey as TBaseColumnKey,
    IFooterConfig,
} from 'Controls/gridReact';
import { TNavigationDirection, TOffsetSize } from 'Controls/interface';
import { TViewMode } from 'Controls-DataEnv/interface';
import { IItemsRange } from 'Controls/baseList';
import { TQuantumType, TColumnDataDensity, TColumnKeys } from '../shared/types';

import { IDynamicHeaderCellsColspanCallback } from '../render/Header';
import { IGridSelectionContainerProps, ISelection } from '../selection/SelectionContainer';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UICommon/Events';
import { View as SearchBreadcrumbsGridView } from 'Controls/searchBreadcrumbsGrid';

export type THoverMode = 'cross' | 'filled-cross' | 'none';

type IColumnsEndedCallback = (direction: TNavigationDirection) => void;

export type IDynamicColumnMouseEventCallback = (
    contents: Model,
    originalEvent: SyntheticEvent<MouseEvent>,
    columnKey: TBaseColumnKey
) => void;

export type IEventMouseEventCallback = (
    contents: Model,
    originalEvent: SyntheticEvent<MouseEvent>,
    eventRecord: Model
) => void;

export type IBaseMouseEventCallback = (
    contents: Model,
    originalEvent: SyntheticEvent<MouseEvent>
) => void;

export interface IDynamicGridComponentProps extends ITreeGridOptions {
    gridComponentRef?: React.ForwardedRef<View>;
    refOnlyForWasaby?: React.ForwardedRef<HTMLDivElement>;
    onDynamicColumnClick?: IDynamicColumnMouseEventCallback;
    onEventClick?: IEventMouseEventCallback;
    onDynamicColumnMouseDown?: IDynamicColumnMouseEventCallback;
    onEventMouseDown?: IEventMouseEventCallback;
    viewportWidth?: number;
    staticColumns: IColumnConfig[];
    endStaticColumns?: IColumnConfig[];
    dynamicColumn: IColumnConfig;
    results: IResultConfig[];
    // TODO не нужная опция, колонок столько, сколько мы сгенерировали данных в dynamicColumnsGridData
    dynamicColumnsCount: number;
    staticHeaders: IHeaderConfig[];
    endStaticHeaders?: IHeaderConfig[];
    dynamicHeader: IHeaderConfig;
    staticFooter?: IFooterConfig[];
    dynamicFooter?: IFooterConfig;
    dynamicColumnsGridData: TColumnKeys;
    columnsDataVersion: number;
    columnsEndedCallback: IColumnsEndedCallback;
    initialColumnScrollPosition?: number;
    getRowProps?: TGetRowPropsCallback;
    columnsSpacing?: TOffsetSize;
    quantum?: TQuantumType;
    viewMode: TViewMode;
    beforeItemsContent?: React.ReactElement;
    afterItemsContent?: React.ReactElement;
    visibleRange: IItemsRange;
    rangeCorrection: number;
    columnDataDensity: TColumnDataDensity;
    dynamicHeaderCellsColspanCallback?: IDynamicHeaderCellsColspanCallback;
    onHeaderClick?: (event: React.MouseEvent) => void;
    cellsMultiSelectVisibility?: IGridSelectionContainerProps['multiSelectVisibility'];
    cellsMultiSelectAccessibilityCallback?: IGridSelectionContainerProps['multiSelectAccessibilityCallback'];
    selectedCells?: ISelection;
    onSelectedCellsChanged?: IGridSelectionContainerProps['onSelectionChanged'];
    onBeforeSelectedCellsChanged?: IGridSelectionContainerProps['onBeforeSelectionChange'];
    hoverMode?: THoverMode;
    getDynamicColumnProps?: Function;
    // events
    eventRender: React.ReactElement;
    eventsProperty: string;
    eventStartProperty: string;
    eventEndProperty: string;
    fixedTimelineDate?: Date;
}

export interface IDynamicGridComponentState {
    gridComponent: typeof SearchBreadcrumbsGridView | typeof TreeGridComponent;
    className: string;
    viewMode: TViewMode;
    getRowProps: TGetRowPropsCallback;
    dynamicColumnsGridData: TColumnKeys;
    columnsDataVersion: number;
    preparedColumns: IColumnConfig[];
    preparedHeaders: IHeaderConfig[];
    preparedFooter: IFooterConfig[];
    dynamicColumn: IColumnConfig;
    visibleRange: IItemsRange;
    rangeCorrection: number;
    initialColumnScrollPosition?: number;
}
