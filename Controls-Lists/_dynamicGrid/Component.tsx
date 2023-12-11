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
    IDynamicColumnMouseEventCallback,
    IEventMouseEventCallback,
    IBaseMouseEventCallback,
} from './interfaces/IDynamicGridComponent';
import { TreeGridCollection, View as TreeGridComponent } from 'Controls/treeGrid';
import { IColumnConfig, TGetRowPropsCallback } from 'Controls/gridReact';
import { EdgeState } from 'Controls/columnScrollReact';
import { SELECTORS } from 'Controls/gridColumnScroll';
import {
    CLASS_DYNAMIC_DATA_CELL,
    CLASS_EVENT_CELL,
    getPreparedDynamicColumn,
} from './render/DynamicColumn';
import { getPreparedDynamicHeader } from './render/Header';
import { getPreparedDynamicFooter } from './render/Footer';
import { getInitialColumnsScrollPosition } from './render/utils';
import { CLASS_DYNAMIC_HEADER_CELL, AUTOSCROLL_TARGET } from './shared/constants';
import { getColumnGapSize } from './utils';
import { TColumnDataDensity, TColumnKeys } from './shared/types';
import { SyntheticEvent } from 'UI/Vdom';
import { Model } from 'Types/entity';
import type { View as SearchBreadcrumbsGridView } from 'Controls/searchBreadcrumbsGrid';
import SelectionContainer from './selection/SelectionContainer';
import { getCellIndexByEventTargetCommon } from 'Controls/grid';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { addDefaultClassNameToAllDynamicColumns } from './shared/utils/patchColumnProps';
import { prepareExtraRowColumns } from './shared/utils/extraRowsPreparator';
import { TViewMode } from 'Controls-DataEnv/interface';

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
    getDynamicColumnProps: Function;
    getRowProps: TGetRowPropsCallback;
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
        getRowProps,
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
            getCellProps: params.getDynamicColumnProps,
            getRowProps,
        });
        resultColumns.push(preparedDynamicColumn);
    }

    if (endStaticColumns && endStaticColumns.length) {
        resultColumns.push(...endStaticColumns);
    }

    addDefaultClassNameToAllDynamicColumns(resultColumns);

    return resultColumns;
}

interface IExecuteCallbackByTarget {
    contents: Model;
    originalEvent: SyntheticEvent<MouseEvent>;
    eventsProperty: string;
    dynamicColumnsGridData: TColumnKeys;
    eventCallback: IEventMouseEventCallback;
    dynamicColumnCallback: IDynamicColumnMouseEventCallback;
    baseCallback: IBaseMouseEventCallback;
}

function executeCallbackByTarget(props: IExecuteCallbackByTarget) {
    const {
        contents,
        originalEvent,
        eventsProperty,
        dynamicColumnsGridData,
        eventCallback,
        dynamicColumnCallback,
        baseCallback,
    } = props;

    // Обрабатываем событие от меньшей сущности к большей: события => динамические ячейки => строка
    const target = originalEvent.target as HTMLElement;

    // Если произошел клик по динамической колонке
    const eventTarget = target.closest(`.${CLASS_EVENT_CELL}`);
    if (eventTarget) {
        const eventKey = eventTarget.getAttribute('data-key');
        const eventRecord = contents.get(eventsProperty)?.getRecordById(eventKey);
        eventCallback?.(contents, originalEvent, eventRecord);
        return;
    }

    // Если произошел клик по событию
    if (target.closest(`.${CLASS_DYNAMIC_DATA_CELL}`)) {
        const dynamicColumnIndex = getCellIndexByEventTargetCommon(
            originalEvent,
            '.js-ControlsLists-dynamicGrid__dynamicCellsWrapper',
            `.${CLASS_DYNAMIC_DATA_CELL}`
        );

        dynamicColumnCallback?.(
            contents,
            originalEvent,
            dynamicColumnsGridData[dynamicColumnIndex]
        );
        return;
    }

    baseCallback?.(contents, originalEvent);
}

export { IDynamicGridComponentProps, IDynamicColumnMouseEventCallback, IEventMouseEventCallback };

function getGridComponent(
    viewMode: TViewMode
): typeof SearchBreadcrumbsGridView | typeof TreeGridComponent {
    if (viewMode === 'search') {
        return loadSync<typeof import('Controls/searchBreadcrumbsGrid')>(
            'Controls/searchBreadcrumbsGrid'
        ).View;
    } else {
        return TreeGridComponent;
    }
}

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
            gridComponent: getGridComponent(props.viewMode),
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
                getDynamicColumnProps: props.getDynamicColumnProps,
                getRowProps: props.getRowProps,
            }),
            preparedHeaders: prepareExtraRowColumns({
                extraRowStaticColumns: props.staticHeaders,
                extraRowDynamicColumn: props.dynamicHeader,
                extraRowEndStaticColumns: props.endStaticHeaders,
                extraRowDynamicCellsColspanCallback: props.dynamicHeaderCellsColspanCallback,
                getPreparedDynamicColumn: getPreparedDynamicHeader,
                dynamicColumn: props.dynamicColumn,
                dynamicColumnsCount: props.dynamicColumnsCount,
                dynamicColumnsGridData: props.dynamicColumnsGridData,
                columnsSpacing: props.columnsSpacing,
                quantum: props.quantum,
                dataDensity: props.columnDataDensity,
                hoverMode: props.hoverMode,
            }),
            preparedFooter: prepareExtraRowColumns({
                extraRowStaticColumns: props.staticFooter,
                extraRowDynamicColumn: props.dynamicFooter,
                getPreparedDynamicColumn: getPreparedDynamicFooter,
                dynamicColumn: props.dynamicColumn,
                dynamicColumnsCount: props.dynamicColumnsCount,
                dynamicColumnsGridData: props.dynamicColumnsGridData,
                columnsSpacing: props.columnsSpacing,
                quantum: props.quantum,
                dataDensity: props.columnDataDensity,
                hoverMode: props.hoverMode,
            }),
            visibleRange: props.visibleRange,
            rangeCorrection: props.rangeCorrection,
            dynamicColumn: props.dynamicColumn,
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
        this._onItemMouseDown = this._onItemMouseDown.bind(this);
    }

    static getDerivedStateFromProps(
        nextProps: IDynamicGridComponentProps,
        prevState: IDynamicGridComponentState
    ) {
        const changes: Partial<IDynamicGridComponentState> = {};
        const isDynamicColumnChanged = prevState.dynamicColumn !== nextProps.dynamicColumn;
        const isVisibleRangeChanged = prevState.visibleRange !== nextProps.visibleRange;
        const isDynamicColumnsGridDataChanged =
            prevState.dynamicColumnsGridData !== nextProps.dynamicColumnsGridData;

        if (prevState.viewMode !== nextProps.viewMode) {
            changes.viewMode = nextProps.viewMode;
            changes.gridComponent = getGridComponent(nextProps.viewMode);
        }

        if (prevState.initialColumnScrollPosition !== nextProps.initialColumnScrollPosition) {
            changes.initialColumnScrollPosition = nextProps.initialColumnScrollPosition;
        }

        if (prevState.columnsDataVersion !== nextProps.columnsDataVersion) {
            changes.columnsDataVersion = nextProps.columnsDataVersion;
        }

        if (isDynamicColumnsGridDataChanged) {
            changes.dynamicColumnsGridData = nextProps.dynamicColumnsGridData;
        }

        if (isDynamicColumnChanged) {
            changes.dynamicColumn = nextProps.dynamicColumn;
        }

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
                getDynamicColumnProps: nextProps.getDynamicColumnProps,
                getRowProps: nextProps.getRowProps,
            });

            changes.preparedHeaders = prepareExtraRowColumns({
                extraRowStaticColumns: nextProps.staticHeaders,
                extraRowDynamicColumn: nextProps.dynamicHeader,
                extraRowEndStaticColumns: nextProps.endStaticHeaders,
                extraRowDynamicCellsColspanCallback: nextProps.dynamicHeaderCellsColspanCallback,
                getPreparedDynamicColumn: getPreparedDynamicHeader,
                dynamicColumn: nextProps.dynamicColumn,
                dynamicColumnsCount: nextProps.dynamicColumnsCount,
                dynamicColumnsGridData: nextProps.dynamicColumnsGridData,
                columnsSpacing: nextProps.columnsSpacing,
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

    _onItemMouseDown(contents: Model, originalEvent: SyntheticEvent<MouseEvent>) {
        executeCallbackByTarget({
            contents,
            originalEvent,
            eventsProperty: this.props.eventsProperty,
            dynamicColumnsGridData: this.props.dynamicColumnsGridData,
            eventCallback: this.props.onEventMouseDown,
            dynamicColumnCallback: this.props.onDynamicColumnMouseDown,
            baseCallback: this.props.onItemMouseDown as IBaseMouseEventCallback,
        });
    }

    _onItemClick(contents: Model, originalEvent: SyntheticEvent<MouseEvent>, columnIndex: number) {
        executeCallbackByTarget({
            contents,
            originalEvent,
            eventsProperty: this.props.eventsProperty,
            dynamicColumnsGridData: this.props.dynamicColumnsGridData,
            eventCallback: this.props.onEventClick,
            dynamicColumnCallback: this.props.onDynamicColumnClick,
            baseCallback: (contents, originalEvent) => {
                // Если клик был по статической колонке, то вызывается обычный itemClick
                this.props.onItemClick?.(contents, originalEvent, columnIndex);
            },
        });
    }

    render() {
        const GridComponent = this.state.gridComponent;
        return (
            <div
                ref={this.props.refOnlyForWasaby}
                data-qa="controlsLists_dynamicGrid"
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
                        ref={(el) => {
                            this._gridComponentRef.current = el;
                            if (this.props.gridComponentRef) {
                                this.props.gridComponentRef.current = el;
                            }
                        }}
                        collectionRef={this._gridCollectionRef}
                        onEdgesStateChanged={this._onEdgesStateChanged}
                        onPositionChanged={this.props.onPositionChanged}
                        breadCrumbsMode="row"
                        headerVisibility="visible"
                        columns={this.state.preparedColumns}
                        columnScrollStartPosition={this.state.initialColumnScrollPosition}
                        header={this.state.preparedHeaders}
                        footer={this.state.preparedFooter}
                        results={this.props.results}
                        resultsPosition={this.props.resultsPosition}
                        selectAncestors={this.props.selectAncestors}
                        selectDescendants={this.props.selectDescendants}
                        stickyHeader={this.props.stickyHeader}
                        stickyResults={this.props.stickyResults}
                        stickyFooter={this.props.stickyFooter}
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
                        onItemMouseDown={this._onItemMouseDown}
                        onHeaderClick={this.props.onHeaderClick}
                        customEvents={['onEditArrowClick', 'onItemClick']}
                        beforeItemsContent={this.props?.beforeItemsContent}
                        afterItemsContent={this.props?.afterItemsContent}
                    />
                </SelectionContainer>
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
            const gridContainer = this._gridComponentRef.current._container;

            const scrollableCell = gridContainer.querySelector(`${snapshot.savedCellSelector} .${AUTOSCROLL_TARGET}`);

            if (scrollableCell) {
                this.horizontalScrollToElement(scrollableCell);
            }
        }
    }

    horizontalScrollTo(position: number): void {
        this._gridComponentRef.current.horizontalScrollTo(position);
    }

    horizontalScrollToElement(element: HTMLElement): void {
        this._gridComponentRef.current.horizontalScrollToElement(element, 'start', false);
    }
}

export const DynamicGridComponent = React.forwardRef(
    (props: IDynamicGridComponentProps, ref: React.ForwardedRef<HTMLDivElement>) => {
        return <DynamicGridClassComponent {...props} refOnlyForWasaby={ref} />;
    }
);
