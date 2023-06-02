/**
 * Компонент "Таблица с загружаемыми колонками"
 * @class Controls-Lists/dynamicGrid:Component
 * @public
 * @demo Controls-Lists-demo/dynamicGrid/base/Index
 */

import * as React from 'react';
import { View as TreeGridComponent, ITreeGridOptions, TreeGridCollection } from 'Controls/treeGrid';
import { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import { EdgeState } from 'Controls/columnScrollReact';
import { SELECTORS } from 'Controls/gridColumnScroll';
import { getPreparedDynamicColumn, IEventsConfig } from './render/DynamicColumn';
import { getPreparedDynamicHeader, TIsHolidayCallback } from './render/Header';
import { CLASS_DYNAMIC_HEADER_CELL } from './render/utils';
import { TNavigationDirection, TOffsetSize } from 'Controls/interface';
import { IItemsRange } from 'Controls/baseList';
import { GridSelectionContextProvider } from './selection/gridContext/GridSelectionContextProvider';

interface IPrepareDynamicGridColumnsParams {
    staticColumns: IColumnConfig[];
    dynamicColumn: IColumnConfig;
    dynamicColumnsCount: number;
    dynamicColumnsGridData: unknown[];
    columnsSpacing: TOffsetSize;
    eventsConfig?: IEventsConfig;
    quantum: string;
}

interface IPrepareDynamicGridHeadersParams {
    staticHeaders: IHeaderConfig[];
    dynamicHeader: IHeaderConfig;
    dynamicColumn: IColumnConfig;
    dynamicColumnsCount: number;
    dynamicColumnsGridData: unknown[];
    isHolidayCallback: TIsHolidayCallback;
    columnsSpacing: TOffsetSize;
}

function prepareDynamicGridColumns(params: IPrepareDynamicGridColumnsParams): IColumnConfig[] {
    const {
        visibleRange,
        staticColumns,
        dynamicColumn,
        dynamicColumnsCount,
        dynamicColumnsGridData,
        columnsSpacing,
        eventsConfig,
        quantum,
    } = params;
    const resultColumns = [...staticColumns];

    if (dynamicColumn) {
        const preparedDynamicColumn = getPreparedDynamicColumn({
            dataProperty: 'dynamicColumnsData',
            columnIndex: staticColumns.length,
            visibleRange,
            dynamicColumn,
            dynamicColumnsCount,
            dynamicColumnsGridData,
            columnsSpacing,
            eventsConfig,
            quantum,
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
        isHolidayCallback,
        columnsSpacing,
    } = params;

    const resultColumns = [...staticHeaders];

    if (dynamicHeader) {
        const preparedDynamicColumn = getPreparedDynamicHeader({
            dynamicHeader,
            dynamicColumn,
            dynamicColumnsCount,
            dynamicColumnsGridData,
            isHolidayCallback,
            columnsSpacing,
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
    getRowProps?: Function;
    columnsSpacing?: TOffsetSize;
    quantum?: string;
    beforeItemsContent?: React.ReactElement;
    afterItemsContent?: React.ReactElement;
    visibleRange: IItemsRange;
}

export interface IDynamicGridComponentState {
    className: string;
    dynamicColumnsGridData: unknown[];
    columnsDataVersion: number;
    preparedColumns: IColumnConfig[];
    preparedHeaders: IHeaderConfig[];
    dynamicColumn: IColumnConfig;
    visibleRange: IItemsRange;
}

export class DynamicGridComponent extends React.Component<IDynamicGridComponentProps,
    IDynamicGridComponentState> {
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
            parseInt(props.dynamicColumn.width, 10) * Math.trunc(props.dynamicColumnsCount / 2);

        this.state = {
            className: 'ControlsLists-dynamicGrid ' + props.className,
            dynamicColumnsGridData: props.dynamicColumnsGridData,
            columnsDataVersion: props.columnsDataVersion,
            preparedColumns: prepareDynamicGridColumns({
                visibleRange: props.visibleRange,
                staticColumns: props.staticColumns,
                dynamicColumn: props.dynamicColumn,
                dynamicColumnsCount: props.dynamicColumnsCount,
                dynamicColumnsGridData: props.dynamicColumnsGridData,
                eventsConfig: props.eventsConfig,
                columnsSpacing: props.columnsSpacing,
                quantum: props.quantum,
            }),
            preparedHeaders: prepareDynamicGridHeaders({
                staticHeaders: props.staticHeaders,
                dynamicHeader: props.dynamicHeader,
                dynamicColumn: props.dynamicColumn,
                dynamicColumnsCount: this.props.dynamicColumnsCount,
                dynamicColumnsGridData: props.dynamicColumnsGridData,
                isHolidayCallback: props.isHolidayCallback,
                columnsSpacing: props.columnsSpacing,
            }),
            visibleRange: props.visibleRange,
            dynamicColumn: props.dynamicColumn,
        };

        this._onEdgesStateChanged = this._onEdgesStateChanged.bind(this);
    }

    static getDerivedStateFromProps(
        nextProps: IDynamicGridComponentProps,
        prevState: IDynamicGridComponentState
    ) {
        const changes: Partial<IDynamicGridComponentState> = {};
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

        if (isDynamicColumnsGridDataChanged || isDynamicColumnChanged || isVisibleRangeChanged) {
            changes.preparedColumns = prepareDynamicGridColumns({
                visibleRange: nextProps.visibleRange,
                staticColumns: nextProps.staticColumns,
                dynamicColumn: nextProps.dynamicColumn,
                dynamicColumnsCount: nextProps.dynamicColumnsCount,
                dynamicColumnsGridData: nextProps.dynamicColumnsGridData,
                eventsConfig: nextProps.eventsConfig,
                columnsSpacing: nextProps.columnsSpacing,
                quantum: nextProps.quantum,
            });

            changes.preparedHeaders = prepareDynamicGridHeaders({
                dynamicColumn: nextProps.dynamicColumn,
                staticHeaders: nextProps.staticHeaders,
                dynamicHeader: nextProps.dynamicHeader,
                dynamicColumnsCount: nextProps.dynamicColumnsCount,
                dynamicColumnsGridData: nextProps.dynamicColumnsGridData,
                isHolidayCallback: nextProps.isHolidayCallback,
                columnsSpacing: nextProps.columnsSpacing,
            });
        }

        return changes;
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevState.columnsDataVersion !== this.state.columnsDataVersion) {
            const gridContainer = this._gridComponentRef.current._container;

            const fixedCell = gridContainer.querySelector(`.${SELECTORS.FIXED_ELEMENT}`);
            const fixedCellRect = fixedCell.getBoundingClientRect();

            const scrollableCells = gridContainer.querySelectorAll(
                `.js-${CLASS_DYNAMIC_HEADER_CELL}`,
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
                        },
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

    render() {
        return (
            <GridSelectionContextProvider collection={this._gridCollectionRef.current}
                                          multiSelectVisibility={this.props.multiSelectVisibility}
            >
                <TreeGridComponent
                    ref={this._gridComponentRef}
                    collectionRef={this._gridCollectionRef}
                    onEdgesStateChanged={this._onEdgesStateChanged}
                    onPositionChanged={this.props.onPositionChanged}
                    columns={this.state.preparedColumns}
                    columnScrollStartPosition={this._initialColumnScrollPosition}
                    header={this.state.preparedHeaders}
                    className={this.state.className}
                    storeId={this.props.storeId}
                    parentProperty={this.props.parentProperty}
                    nodeProperty={this.props.nodeProperty}
                    columnScroll={true}
                    columnScrollViewMode="unaccented"
                    columnScrollNavigationPosition="custom"
                    getRowProps={this.props.getRowProps}
                    showEditArrow={this.props.showEditArrow}
                    editArrowVisibilityCallback={this.props.editArrowVisibilityCallback}
                    onEditArrowClick={this.props.onEditArrowClick}
                    customEvents={['onEditArrowClick']}
                    beforeItemsContent = {this.props?.beforeItemsContent}
                    afterItemsContent = {this.props?.afterItemsContent}
                    itemsSpacing={this.props.itemsSpacing}
                />
            </GridSelectionContextProvider>
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
            const gridContainer = this._gridComponentRef.current._container;

            const scrollableCell = gridContainer.querySelector(snapshot.savedCellSelector);

            this.horizontalScrollTo(
                scrollableCell.offsetLeft - snapshot.savedCellOffsetLeft,
            );
        }
    }

    horizontalScrollTo(position: number): void {
        this._gridComponentRef.current.horizontalScrollTo(position);
    }
}
