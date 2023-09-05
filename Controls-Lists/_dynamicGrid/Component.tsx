/**
 * Компонент "Таблица с загружаемыми колонками"
 * @class Controls-Lists/dynamicGrid:Component
 * @public
 * @demo Controls-Lists-demo/dynamicGrid/base/Index
 */

import * as React from 'react';
import { View as TreeGridComponent, ITreeGridOptions, TreeGridCollection } from 'Controls/treeGrid';
import { IColumnConfig, IHeaderConfig, TGetRowPropsCallback } from 'Controls/gridReact';
import { EdgeState } from 'Controls/columnScrollReact';
import { SELECTORS } from 'Controls/gridColumnScroll';
import { getPreparedDynamicColumn } from './render/DynamicColumn';
import { getPreparedDynamicHeader, TDynamicHeaderCellsColspanCallback } from './render/Header';
import {
    CLASS_DYNAMIC_HEADER_CELL,
    getInitialColumnsScrollPosition,
    TColumnDataDensity,
} from './render/utils';
import { TColumnKeys, TQuantumType } from './shared/types';
import { TNavigationDirection, TOffsetSize } from 'Controls/interface';
import { TViewMode } from 'Controls-DataEnv/interface';
import { IItemsRange } from 'Controls/baseList';
import { SyntheticEvent } from 'UI/Vdom';
import { Model } from 'Types/entity';
import SelectionContainer, {
    ISelection,
    IGridSelectionContainerProps,
} from './selection/SelectionContainer';
import { getCellIndexByEventTargetCommon } from 'Controls/grid';
import { loadSync } from 'WasabyLoader/ModulesLoader';

interface IPrepareDynamicGridColumnsParams {
    staticColumns: IColumnConfig[];
    dynamicColumn: IColumnConfig;
    dynamicColumnsCount: number;
    dynamicColumnsGridData: unknown[];
    columnsSpacing: TOffsetSize;
    // TODO: Перенести в timelineGrid
    eventRender: React.ReactElement;
    eventsProperty: string;
    eventStartProperty: string;
    eventEndProperty: string;
    quantum: TQuantumType;
    columnDataDensity: TColumnDataDensity;
}

interface IPrepareDynamicGridHeadersParams {
    staticHeaders: IHeaderConfig[];
    dynamicHeader: IHeaderConfig;
    dynamicColumn: IColumnConfig;
    dynamicColumnsCount: number;
    dynamicColumnsGridData: unknown[];
    columnsSpacing: TOffsetSize;
    dynamicHeaderCellsColspanCallback?: TDynamicHeaderCellsColspanCallback;
    quantum: TQuantumType;
    dataDensity: TColumnDataDensity;
}

function prepareDynamicGridColumns(params: IPrepareDynamicGridColumnsParams): IColumnConfig[] {
    const {
        visibleRange,
        rangeCorrection,
        staticColumns,
        dynamicColumn,
        dynamicColumnsCount,
        dynamicColumnsGridData,
        columnsSpacing,
        eventRender,
        eventsProperty,
        eventStartProperty,
        eventEndProperty,
        quantum,
        columnDataDensity,
    } = params;
    const resultColumns = [...staticColumns];

    if (dynamicColumn) {
        const preparedDynamicColumn = getPreparedDynamicColumn({
            dataProperty: 'dynamicColumnsData',
            columnIndex: staticColumns.length,
            visibleRange,
            rangeCorrection,
            dynamicColumn,
            dynamicColumnsCount,
            dynamicColumnsGridData,
            columnsSpacing,
            eventRender,
            eventsProperty,
            eventStartProperty,
            eventEndProperty,
            quantum,
            columnDataDensity,
        });
        resultColumns.push(preparedDynamicColumn);
    }

    return resultColumns;
}

function prepareDynamicGridHeaders(params: IPrepareDynamicGridHeadersParams): IHeaderConfig[] {
    const {
        staticHeaders,
        dynamicHeader,
        dynamicColumn,
        dynamicColumnsCount,
        dynamicColumnsGridData,
        columnsSpacing,
        quantum,
        dataDensity,
        dynamicHeaderCellsColspanCallback,
    } = params;

    const resultColumns = [...staticHeaders];

    if (dynamicHeader) {
        const preparedDynamicColumn = getPreparedDynamicHeader({
            dynamicHeader,
            dynamicColumn,
            dynamicColumnsCount,
            dynamicColumnsGridData,
            columnsSpacing,
            quantum,
            dataDensity,
            dynamicHeaderCellsColspanCallback,
        });
        resultColumns.push(preparedDynamicColumn);
    }

    return resultColumns;
}

export type IColumnsEndedCallback = (direction: TNavigationDirection) => void;

export interface IDynamicGridComponentProps extends ITreeGridOptions {
    staticColumns: IColumnConfig[];
    dynamicColumn: IColumnConfig;
    // TODO не нужная опция, колонок столько, сколько мы сгенерировали данных в dynamicColumnsGridData
    dynamicColumnsCount: number;
    staticHeaders: IHeaderConfig[];
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

export class DynamicGridComponent extends React.Component<
    IDynamicGridComponentProps,
    IDynamicGridComponentState
> {
    protected _gridComponentRef: React.RefObject<HTMLDivElement>;
    protected _gridCollectionRef: React.RefObject<TreeGridCollection>;
    protected _leftEdgeState: EdgeState;
    protected _rightEdgeState: EdgeState;
    protected _initialColumnScrollPosition: number;

    constructor(props: IDynamicGridComponentProps) {
        super(props);
        this._gridComponentRef = React.createRef();
        this._gridCollectionRef = React.createRef();

        this._initialColumnScrollPosition =
            props.initialColumnScrollPosition ||
            getInitialColumnsScrollPosition(
                parseFloat(props.dynamicColumn.width),
                props.dynamicColumnsCount,
                props.columnsSpacing
            );

        this.state = {
            className: `ControlsLists-dynamicGrid ${props.className}`,
            dynamicColumnsGridData: props.dynamicColumnsGridData,
            columnsDataVersion: props.columnsDataVersion,
            getRowProps: props.getRowProps,
            viewMode: props.viewMode,
            preparedColumns: prepareDynamicGridColumns({
                visibleRange: props.visibleRange,
                rangeCorrection: props.rangeCorrection,
                staticColumns: props.staticColumns,
                dynamicColumn: props.dynamicColumn,
                dynamicColumnsCount: props.dynamicColumnsCount,
                dynamicColumnsGridData: props.dynamicColumnsGridData,
                eventRender: props.eventRender,
                eventsProperty: props.eventsProperty,
                eventStartProperty: props.eventStartProperty,
                eventEndProperty: props.eventEndProperty,
                columnsSpacing: props.columnsSpacing,
                quantum: props.quantum,
                columnDataDensity: props.columnDataDensity,
            }),
            preparedHeaders: prepareDynamicGridHeaders({
                staticHeaders: props.staticHeaders,
                dynamicHeader: props.dynamicHeader,
                dynamicColumn: props.dynamicColumn,
                dynamicColumnsCount: this.props.dynamicColumnsCount,
                dynamicColumnsGridData: props.dynamicColumnsGridData,
                columnsSpacing: props.columnsSpacing,
                dynamicHeaderCellsColspanCallback: props.dynamicHeaderCellsColspanCallback,
                quantum: props.quantum,
                dataDensity: props.columnDataDensity,
            }),
            visibleRange: props.visibleRange,
            rangeCorrection: props.rangeCorrection,
            dynamicColumn: props.dynamicColumn,
        };

        this._onEdgesStateChanged = this._onEdgesStateChanged.bind(this);
        this._onItemClick = this._onItemClick.bind(this);
    }

    static getDerivedStateFromProps(
        nextProps: IDynamicGridComponentProps,
        prevState: IDynamicGridComponentState
    ) {
        const changes: Partial<IDynamicGridComponentState> = {};
        if (prevState.viewMode !== nextProps.viewMode) {
            changes.viewMode = nextProps.viewMode;
        }
        if (prevState.columnsDataVersion !== nextProps.columnsDataVersion) {
            changes.columnsDataVersion = nextProps.columnsDataVersion;
        }
        const isDynamicColumnsGridDataChanged =
            prevState.dynamicColumnsGridData !== nextProps.dynamicColumnsGridData;
        if (isDynamicColumnsGridDataChanged) {
            changes.dynamicColumnsGridData = nextProps.dynamicColumnsGridData;
        }

        const isDynamicColumnChanged = prevState.dynamicColumn !== nextProps.dynamicColumn;
        if (isDynamicColumnChanged) {
            changes.dynamicColumn = nextProps.dynamicColumn;
        }
        const isVisibleRangeChanged = prevState.visibleRange !== nextProps.visibleRange;
        if (isVisibleRangeChanged) {
            changes.visibleRange = nextProps.visibleRange;
        }

        if (prevState.getRowProps !== nextProps.getRowProps) {
            changes.getRowProps = nextProps.getRowProps;
        }

        if (isDynamicColumnsGridDataChanged || isDynamicColumnChanged || isVisibleRangeChanged) {
            changes.preparedColumns = prepareDynamicGridColumns({
                visibleRange: nextProps.visibleRange,
                rangeCorrection: nextProps.rangeCorrection,
                staticColumns: nextProps.staticColumns,
                dynamicColumn: nextProps.dynamicColumn,
                dynamicColumnsCount: nextProps.dynamicColumnsCount,
                dynamicColumnsGridData: nextProps.dynamicColumnsGridData,
                eventRender: nextProps.eventRender,
                eventsProperty: nextProps.eventsProperty,
                eventStartProperty: nextProps.eventStartProperty,
                eventEndProperty: nextProps.eventEndProperty,
                columnsSpacing: nextProps.columnsSpacing,
                quantum: nextProps.quantum,
                columnDataDensity: nextProps.columnDataDensity,
            });

            changes.preparedHeaders = prepareDynamicGridHeaders({
                dynamicColumn: nextProps.dynamicColumn,
                staticHeaders: nextProps.staticHeaders,
                dynamicHeader: nextProps.dynamicHeader,
                dynamicColumnsCount: nextProps.dynamicColumnsCount,
                dynamicColumnsGridData: nextProps.dynamicColumnsGridData,
                columnsSpacing: nextProps.columnsSpacing,
                dynamicHeaderCellsColspanCallback: nextProps.dynamicHeaderCellsColspanCallback,
                quantum: nextProps.quantum,
                dataDensity: nextProps.columnDataDensity,
            });
        }

        return changes;
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevState.columnsDataVersion !== this.state.columnsDataVersion) {
            const gridContainer = this._gridComponentRef.current._container;

            const fixedCell = gridContainer.querySelector(`.${SELECTORS.FIXED_CELL}`);
            const fixedCellRect = fixedCell.getBoundingClientRect();

            const scrollableCells = gridContainer.querySelectorAll(
                `.js-${CLASS_DYNAMIC_HEADER_CELL}`
            );

            let snapshot;
            for (let idx = 0; idx < scrollableCells.length; idx++) {
                const scrollableCellRect = scrollableCells[idx].getBoundingClientRect();
                if (
                    scrollableCellRect.left + scrollableCellRect.width >=
                    fixedCellRect.left + fixedCellRect.width
                ) {
                    const savedCellClassList = Array.prototype.filter.call(
                        scrollableCells[idx].classList,
                        (className) => {
                            return className.includes(`js-${CLASS_DYNAMIC_HEADER_CELL}`);
                        }
                    );

                    snapshot = {
                        savedCellOffsetLeft:
                            scrollableCellRect.left - (fixedCellRect.left + fixedCellRect.width),
                        savedCellSelector: `.${savedCellClassList.join('.')}`,
                    };
                    break;
                }
            }

            if (snapshot) {
                return snapshot;
            }
        }
        return null;
    }

    _onEdgesStateChanged(leftEdgeState: EdgeState, rightEdgeState: EdgeState) {
        if (this._rightEdgeState !== rightEdgeState) {
            this._rightEdgeState = rightEdgeState;
            if (rightEdgeState === EdgeState.Visible) {
                this.props.columnsEndedCallback('forward');
            }
        }
        if (this._leftEdgeState !== leftEdgeState) {
            this._leftEdgeState = leftEdgeState;
            if (leftEdgeState === EdgeState.Visible) {
                this.props.columnsEndedCallback('backward');
            }
        }
    }

    _onItemClick(contents: Model, originalEvent: SyntheticEvent<MouseEvent>, columnIndex: number) {
        // клик по ячейке в динамической колонке
        if (columnIndex === 1) {
            const dynamicColumnIndex = getCellIndexByEventTargetCommon(
                originalEvent,
                '.js-ControlsLists-dynamicGrid__dynamicCellsWrapper',
                '.ControlsLists-dynamicGrid__dynamicDataCell'
            );
            // клик по ячейке в динамической колонке или по событию
            if (dynamicColumnIndex < this.props.dynamicColumnsGridData.length) {
                this.props.onDynamicColumnClick?.(
                    contents,
                    originalEvent,
                    this.props.dynamicColumnsGridData[dynamicColumnIndex]
                );
                return;
            } else {
                const eventKey = originalEvent.target
                    .closest('.ControlsLists-dynamicGrid__dynamicDataCell')
                    ?.getAttribute('data-key');
                const eventRecord = contents
                    .get(this.props.eventsProperty)
                    ?.getRecordById(eventKey);
                this.props.onEventClick?.(contents, originalEvent, eventRecord);
                return;
            }
        }
        this.props.onItemClick?.(contents, originalEvent, columnIndex);
    }

    render() {
        let GridComponent;
        if (this.state.viewMode === 'search') {
            GridComponent = loadSync<typeof import('Controls/searchBreadcrumbsGrid')>('Controls/searchBreadcrumbsGrid').View;
        } else {
            GridComponent = TreeGridComponent;
        }
        return (
            <SelectionContainer
                className="controlsLists_dynamicGrid_theme-default"
                collection={this._gridCollectionRef.current}
                itemsSpacing={this.props.itemsSpacingVisibility ? this.props.itemsSpacing : null}
                columnsSpacing={this.props.columnsSpacing}
                columns={this.state.dynamicColumnsGridData}
                multiSelectVisibility={this.props.cellsMultiSelectVisibility}
                multiSelectAccessibilityCallback={this.props.cellsMultiSelectAccessibilityCallback}
                selection={this.props.selectedCells}
                onSelectionChanged={this.props.onSelectedCellsChanged}
                onBeforeSelectionChange={this.props.onBeforeSelectedCellsChanged}
                itemKeyAttribute="item-key"
                itemSelector=".controls-ListView__itemV"
                itemSelectorMask=".controls-ListView__itemV[item-key='$key$']"
                columnKeyAttribute="column-key"
                columnSelector=".ControlsLists-dynamicGrid__dynamicDataCell"
                columnSelectorMask=".ControlsLists-dynamicGrid__dynamicDataCell[column-key='$key$']"
            >
                <GridComponent
                    ref={this._gridComponentRef}
                    collectionRef={this._gridCollectionRef}
                    onEdgesStateChanged={this._onEdgesStateChanged}
                    onPositionChanged={this.props.onPositionChanged}
                    breadCrumbsMode="row"
                    columns={this.state.preparedColumns}
                    columnScrollStartPosition={this._initialColumnScrollPosition}
                    header={this.state.preparedHeaders}
                    className={this.state.className}
                    storeId={this.props.storeId}
                    parentProperty={this.props.parentProperty}
                    nodeProperty={this.props.nodeProperty}
                    columnScroll={true}
                    colspanCallback={this.props.colspanCallback}
                    columnScrollViewMode="unaccented"
                    columnScrollNavigationPosition="custom"
                    getRowProps={this.state.getRowProps}
                    showEditArrow={this.props.showEditArrow}
                    editArrowVisibilityCallback={this.props.editArrowVisibilityCallback}
                    onEditArrowClick={this.props.onEditArrowClick}
                    itemActions={this.props.itemActions}
                    itemActionsVisibility={this.props.itemActionsVisibility}
                    itemActionVisibilityCallback={this.props.itemActionVisibilityCallback}
                    itemActionsProperty={this.props.itemActionsProperty}
                    itemActionsPosition={this.props.itemActionsPosition}
                    itemActionsClass={this.props.itemActionsClass}
                    onItemClick={this._onItemClick}
                    onHeaderClick={this.props.onHeaderClick}
                    customEvents={['onEditArrowClick', 'onItemClick']}
                    beforeItemsContent={this.props?.beforeItemsContent}
                    afterItemsContent={this.props?.afterItemsContent}/>
            </SelectionContainer>
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
            const gridContainer = this._gridComponentRef.current._container;

            const scrollableCell = gridContainer.querySelector(snapshot.savedCellSelector);

            if (scrollableCell) {
                this.horizontalScrollTo(scrollableCell.offsetLeft - snapshot.savedCellOffsetLeft);
            }
        }
    }

    horizontalScrollTo(position: number): void {
        this._gridComponentRef.current.horizontalScrollTo(position);
    }
}
