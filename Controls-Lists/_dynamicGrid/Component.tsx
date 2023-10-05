/**
 * Компонент "Таблица с загружаемыми колонками"
 * @class Controls-Lists/dynamicGrid:Component
 * @public
 * @demo Controls-Lists-demo/dynamicGrid/base/Index
 */

import * as React from 'react';
import {
    IDynamicGridComponentProps,
    IDynamicGridComponentState,
    IDynamicColumnClickCallback,
} from './interfaces/IDynamicGridComponent';
import { TreeGridCollection, View as TreeGridComponent } from 'Controls/treeGrid';
import { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import { EdgeState } from 'Controls/columnScrollReact';
import { SELECTORS } from 'Controls/gridColumnScroll';
import {
    CLASS_DYNAMIC_DATA_CELL,
    CLASS_EVENT_CELL,
    getPreparedDynamicColumn,
} from './render/DynamicColumn';
import { getPreparedDynamicHeader, TDynamicHeaderCellsColspanCallback } from './render/Header';
import { CLASS_DYNAMIC_HEADER_CELL, getInitialColumnsScrollPosition } from './render/utils';
import { getColumnGapSize } from './utils';
import { TColumnDataDensity } from './shared/types';
import { SyntheticEvent } from 'UI/Vdom';
import { Model } from 'Types/entity';
import SelectionContainer from './selection/SelectionContainer';
import { getCellIndexByEventTargetCommon } from 'Controls/grid';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { patchColumnProps } from './shared/utils/patchColumnProps';
import BeforeItemsContent from './render/BeforeItemsContent';

const BASE_CELL_CLASS_NAME = 'controlsLists_dynamicGrid__gridCell';

interface IPrepareDynamicColumnsParamsCommon
    extends Pick<
        IDynamicGridComponentProps,
        | 'hoverMode'
        | 'dynamicColumnsCount'
        | 'dynamicColumnsGridData'
        | 'columnsSpacing'
        | 'quantum'
    > {}

interface IPrepareDynamicGridColumnsParams extends IPrepareDynamicColumnsParamsCommon {
    staticColumns: IColumnConfig[];
    endStaticColumns?: IColumnConfig[];
    dynamicColumn: IColumnConfig;
    eventRender: React.ReactElement;
    eventsProperty: string;
    eventStartProperty: string;
    eventEndProperty: string;
    columnDataDensity: TColumnDataDensity;
}

interface IPrepareDynamicGridHeadersParams extends IPrepareDynamicColumnsParamsCommon {
    staticHeaders: IHeaderConfig[];
    endStaticHeaders?: IHeaderConfig[];
    dynamicHeader: IHeaderConfig;
    dynamicColumn: IColumnConfig;
    dynamicHeaderCellsColspanCallback?: TDynamicHeaderCellsColspanCallback;
    dataDensity: TColumnDataDensity;
}

function addDefaultClassNameToAllDynamicColumns(columns: IHeaderConfig[] | IColumnConfig[]): void {
    columns.forEach((c: IHeaderConfig | IColumnConfig) => {
        patchColumnProps(c, (superProps) => {
            return {
                className:
                    (superProps?.className ? `${superProps.className} ` : '') +
                    BASE_CELL_CLASS_NAME,
            };
        });
    });
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
        hoverMode,
        endStaticColumns,
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
            hoverMode,
        });
        resultColumns.push(preparedDynamicColumn);
    }

    if (endStaticColumns && endStaticColumns.length) {
        resultColumns.push(...endStaticColumns);
    }

    addDefaultClassNameToAllDynamicColumns(resultColumns);

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
        hoverMode,
        endStaticHeaders,
    } = params;

    const resultColumns = [...staticHeaders];

    resultColumns.forEach((c) =>
        patchColumnProps(c, () => ({
            backgroundStyle: 'unaccented',
        }))
    );

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
            hoverMode,
        });
        resultColumns.push(preparedDynamicColumn);
    }

    if (endStaticHeaders && endStaticHeaders.length) {
        const columns = [...endStaticHeaders];

        columns.forEach((c) => {
            patchColumnProps(c, () => ({
                backgroundStyle: 'unaccented',
            }));
        });

        resultColumns.push(...columns);
    }

    addDefaultClassNameToAllDynamicColumns(resultColumns);

    return resultColumns;
}

export { IDynamicGridComponentProps, IDynamicColumnClickCallback };

class DynamicGridClassComponent extends React.Component<
    IDynamicGridComponentProps,
    IDynamicGridComponentState
> {
    protected _gridComponentRef: React.RefObject<HTMLDivElement>;
    protected _gridCollectionRef: React.RefObject<TreeGridCollection>;
    protected _leftEdgeState: EdgeState;
    protected _rightEdgeState: EdgeState;

    constructor(props: IDynamicGridComponentProps) {
        super(props);
        this._gridComponentRef = React.createRef();
        this._gridCollectionRef = React.createRef();

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
                endStaticColumns: props.endStaticColumns,
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
                hoverMode: props.hoverMode,
            }),
            preparedHeaders: prepareDynamicGridHeaders({
                staticHeaders: props.staticHeaders,
                endStaticHeaders: props.endStaticHeaders,
                dynamicHeader: props.dynamicHeader,
                dynamicColumn: props.dynamicColumn,
                dynamicColumnsCount: props.dynamicColumnsCount,
                dynamicColumnsGridData: props.dynamicColumnsGridData,
                columnsSpacing: props.columnsSpacing,
                dynamicHeaderCellsColspanCallback: props.dynamicHeaderCellsColspanCallback,
                quantum: props.quantum,
                dataDensity: props.columnDataDensity,
                hoverMode: props.hoverMode,
            }),
            visibleRange: props.visibleRange,
            rangeCorrection: props.rangeCorrection,
            dynamicColumn: props.dynamicColumn,
            stickyHeader: props.stickyHeader,
            results: props.results,
            resultsPosition: props.resultsPosition,
            stickyResults: props.stickyResults,
            initialColumnScrollPosition:
                props.initialColumnScrollPosition ||
                getInitialColumnsScrollPosition(
                    parseFloat(props.dynamicColumn.width),
                    props.dynamicColumnsCount,
                    props.columnsSpacing
                ),
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
        if (prevState.initialColumnScrollPosition !== nextProps.initialColumnScrollPosition) {
            changes.initialColumnScrollPosition = nextProps.initialColumnScrollPosition;
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

        if (prevState.results !== nextProps.results) {
            changes.results = nextProps.results;
        }

        if (prevState.resultsPosition !== nextProps.resultsPosition) {
            changes.resultsPosition = nextProps.resultsPosition;
        }

        if (isDynamicColumnsGridDataChanged || isDynamicColumnChanged || isVisibleRangeChanged) {
            changes.preparedColumns = prepareDynamicGridColumns({
                visibleRange: nextProps.visibleRange,
                rangeCorrection: nextProps.rangeCorrection,
                staticColumns: nextProps.staticColumns,
                endStaticColumns: nextProps.endStaticColumns,
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
                hoverMode: nextProps.hoverMode,
            });

            changes.preparedHeaders = prepareDynamicGridHeaders({
                dynamicColumn: nextProps.dynamicColumn,
                staticHeaders: nextProps.staticHeaders,
                endStaticHeaders: nextProps.endStaticHeaders,
                dynamicHeader: nextProps.dynamicHeader,
                dynamicColumnsCount: nextProps.dynamicColumnsCount,
                dynamicColumnsGridData: nextProps.dynamicColumnsGridData,
                columnsSpacing: nextProps.columnsSpacing,
                dynamicHeaderCellsColspanCallback: nextProps.dynamicHeaderCellsColspanCallback,
                quantum: nextProps.quantum,
                dataDensity: nextProps.columnDataDensity,
                hoverMode: nextProps.hoverMode,
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
        // Обрабатываем клик от меньшей сущности к большей - события -> динамические ячейки -> строка
        const target = originalEvent.target as HTMLElement;

        // Если произошел клик по динамической колонке
        const eventTarget = target.closest(`.${CLASS_EVENT_CELL}`);
        if (eventTarget) {
            const eventKey = eventTarget.getAttribute('data-key');
            const eventRecord = contents.get(this.props.eventsProperty)?.getRecordById(eventKey);
            this.props.onEventClick?.(contents, originalEvent, eventRecord);
            return;
        }

        // Если произошел клик по событию
        if (target.closest(`.${CLASS_DYNAMIC_DATA_CELL}`)) {
            const dynamicColumnIndex = getCellIndexByEventTargetCommon(
                originalEvent,
                '.js-ControlsLists-dynamicGrid__dynamicCellsWrapper',
                `.${CLASS_DYNAMIC_DATA_CELL}`
            );

            this.props.onDynamicColumnClick?.(
                contents,
                originalEvent,
                this.props.dynamicColumnsGridData[dynamicColumnIndex]
            );
            return;
        }

        // Иначе, если клик был по статической колонке, то вызывается обычный itemClick
        if (columnIndex < this.props.staticColumns.length) {
            this.props.onItemClick?.(contents, originalEvent, columnIndex);
        }
    }

    render() {
        let GridComponent;
        if (this.state.viewMode === 'search') {
            GridComponent = loadSync<typeof import('Controls/searchBreadcrumbsGrid')>(
                'Controls/searchBreadcrumbsGrid'
            ).View;
        } else {
            GridComponent = TreeGridComponent;
        }
        return (
            <div
                ref={this.props.refOnlyForWasaby}
                className="tw-contents controlsLists_dynamicGrid_theme-default"
                style={{
                    '--dynamic-column_width': this.props.dynamicColumn.width,
                    '--dynamic-column_gap': `${getColumnGapSize(this.props.columnsSpacing)}px`,
                }}
            >
                <SelectionContainer
                    collection={this._gridCollectionRef.current}
                    itemsSpacing={this.props.columnsSpacing}
                    columnsSpacing={this.props.columnsSpacing}
                    columns={this.state.dynamicColumnsGridData}
                    multiSelectVisibility={this.props.cellsMultiSelectVisibility}
                    multiSelectAccessibilityCallback={
                        this.props.cellsMultiSelectAccessibilityCallback
                    }
                    selection={this.props.selectedCells}
                    onSelectionChanged={this.props.onSelectedCellsChanged}
                    onBeforeSelectionChange={this.props.onBeforeSelectedCellsChanged}
                    itemKeyAttribute="item-key"
                    itemSelector=".controls-ListView__itemV"
                    itemSelectorMask=".controls-ListView__itemV[item-key='$key$']"
                    columnKeyAttribute="column-key"
                    columnSelector={`.${CLASS_DYNAMIC_DATA_CELL}`}
                    columnSelectorMask={`.${CLASS_DYNAMIC_DATA_CELL}[column-key='$key$']`}
                >
                    <GridComponent
                        ref={this._gridComponentRef}
                        collectionRef={this._gridCollectionRef}
                        onEdgesStateChanged={this._onEdgesStateChanged}
                        onPositionChanged={this.props.onPositionChanged}
                        breadCrumbsMode="row"
                        headerVisibility="visible"
                        columns={this.state.preparedColumns}
                        columnScrollStartPosition={this.state.initialColumnScrollPosition}
                        header={this.state.preparedHeaders}
                        results={this.props.results}
                        resultsPosition={this.props.resultsPosition}
                        selectAncestors={this.props.selectAncestors}
                        selectDescendants={this.props.selectDescendants}
                        stickyHeader={this.props.stickyHeader}
                        stickyResults={this.props.stickyResults}
                        emptyView={this.props.emptyView}
                        className={this.state.className}
                        storeId={this.props.storeId}
                        parentProperty={this.props.parentProperty}
                        nodeProperty={this.props.nodeProperty}
                        colspanCallback={this.props.colspanCallback}
                        columnScroll={true}
                        stickyColumnsCount={this.props.staticColumns.length}
                        endStickyColumnsCount={
                            this.props.endStaticColumns ? this.props.endStaticColumns.length : 0
                        }
                        columnScrollViewMode="unaccented"
                        columnScrollNavigationPosition="custom"
                        hasColumnScrollCustomAutoScrollTargets={true}
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
                        beforeItemsContent={
                            <BeforeItemsContent
                                children={this.props?.beforeItemsContent}
                                hasMultiSelectColumn={
                                    // Не можем смотреть на метод hasMSColumn коллекции, т.к.
                                    // синхронизация коллекции вызывается после исполнения данного шаблона.
                                    this.props.multiSelectVisibility !== 'hidden' &&
                                    this.props.multiSelectPosition !== 'custom'
                                }
                                columnsSpacing={this.props.columnsSpacing}
                                stickyColumnsCount={this.props.staticColumns.length}
                                endStickyColumnsCount={
                                    this.props.endStaticColumns
                                        ? this.props.endStaticColumns.length
                                        : 0
                                }
                                dynamicColumns={this.state.dynamicColumnsGridData}
                                dynamicColumnsColspanCallback={
                                    this.props?.dynamicHeaderCellsColspanCallback
                                }
                            />
                        }
                        afterItemsContent={this.props?.afterItemsContent}
                    />
                </SelectionContainer>
            </div>
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

export const DynamicGridComponent = React.forwardRef(
    (props: IDynamicGridComponentProps, ref: React.ForwardedRef<HTMLDivElement>) => {
        return <DynamicGridClassComponent {...props} refOnlyForWasaby={ref} />;
    }
);
