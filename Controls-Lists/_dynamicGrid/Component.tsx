/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import {
    IDynamicGridComponentProps,
    IBaseDynamicGridComponentProps,
    IDynamicGridComponentState,
    TDynamicColumnMouseEventCallback,
    TBaseMouseEventCallback,
    IDynamicColumnConfig,
} from './interfaces/IDynamicGridComponent';
import {
    IEventRenderProps,
    TEventMouseEventCallback,
    TGetEventRenderPropsCallback,
} from './interfaces/IEventRenderProps';
import { TreeGridCollection, View as TreeGridComponent } from 'Controls/treeGrid';
import { IColumnConfig, TColumnWidth, TGetRowPropsCallback } from 'Controls/gridRender';
import { EdgeState } from 'Controls/columnScrollReact';
import { SELECTORS } from 'Controls/gridColumnScroll';
import { CLASS_DYNAMIC_DATA_CELL, getPreparedDynamicColumn } from './render/DynamicColumn';
import { CLASS_EVENT_CELL } from 'Controls-Lists/_dynamicGrid/render/EventsCells';
import { getPreparedDynamicHeader } from './render/Header';
import { getPreparedDynamicFooter } from './render/Footer';
import {
    getInitialColumnsScrollPosition,
    getInitialColumnsScrollPositionByActiveColumn,
} from './render/utils';
import { CLASS_DYNAMIC_HEADER_CELL, AUTOSCROLL_TARGET } from './shared/constants';
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
import 'Controls/listWebReducers';
import { useColumnScrollObserveAndRecovery } from 'Controls-Lists/_dynamicGrid/hooks/columnsScrollUtils';
import { DynamicColumnsInfoContext } from 'Controls-Lists/_dynamicGrid/context/DynamicColumnsInfoContext';

interface IPrepareDynamicColumnsParamsCommon
    extends Pick<
        IDynamicGridComponentProps,
        'hoverMode' | 'dynamicColumnsGridData' | 'columnsSpacing' | 'quantum'
    > {}

interface IPrepareDynamicGridColumnsParams extends IPrepareDynamicColumnsParamsCommon {
    staticColumns: IColumnConfig[];
    endStaticColumns?: IColumnConfig[];
    dynamicColumn: IDynamicColumnConfig;
    dataProperty: string;
    eventRender: React.ReactElement;
    eventsProperty: string;
    eventStartProperty: string;
    eventEndProperty: string;
    columnDataDensity: TColumnDataDensity;
    getDynamicColumnProps: Function;
    getRowProps: TGetRowPropsCallback;
    getEventRenderProps?: TGetEventRenderPropsCallback;
    dynamicColumnWidth?: TColumnWidth;
}

function prepareDynamicGridColumns(params: IPrepareDynamicGridColumnsParams): IColumnConfig[] {
    const {
        visibleRange,
        range,
        dataProperty,
        staticColumns,
        dynamicColumn,
        dynamicColumnsGridData,
        columnsSpacing,
        eventRender,
        getEventRenderProps,
        eventsProperty,
        eventStartProperty,
        eventEndProperty,
        quantum,
        columnDataDensity,
        hoverMode,
        endStaticColumns,
        getRowProps,
        dynamicColumnWidth,
        onEventResized,
    } = params;
    const resultColumns = [...staticColumns];

    if (dynamicColumn) {
        const preparedDynamicColumn = getPreparedDynamicColumn({
            dataProperty,
            columnIndex: staticColumns.length,
            visibleRange,
            range,
            dynamicColumn,
            dynamicColumnsGridData,
            columnsSpacing,
            eventRender,
            getEventRenderProps,
            eventsProperty,
            eventStartProperty,
            eventEndProperty,
            quantum,
            columnDataDensity,
            hoverMode,
            getCellProps: params.getDynamicColumnProps,
            getRowProps,
            dynamicColumnWidth,
            onEventResized,
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
    eventCallback: TEventMouseEventCallback;
    dynamicColumnCallback: TDynamicColumnMouseEventCallback;
    baseCallback: TBaseMouseEventCallback;
    isAfterMouseDown: boolean;
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
        isAfterMouseDown,
    } = props;
    const mouseEvent = originalEvent.nativeEvent || originalEvent;
    // Обрабатываем событие от меньшей сущности к большей: события => динамические ячейки => строка
    const target = originalEvent.target as HTMLElement;
    const resizerElementParent = target.closest(
        '.js-ControlsLists-dynamicGrid__selection__resizer'
    ) as HTMLElement;
    const resizerElementsChildren = target.getElementsByClassName(
        'js-ControlsLists-dynamicGrid__selection__resizer'
    );
    if ((resizerElementsChildren.length && !isAfterMouseDown) || resizerElementParent) {
        return;
    }
    const dynamicCellsWrapper = target.closest(
        '.js-ControlsLists-dynamicGrid__dynamicCellsWrapper'
    ) as HTMLElement;
    let dynamicColumnIndex = -1;
    if (dynamicCellsWrapper) {
        let eventIcon: HTMLElement | null = null;
        let eventText: HTMLElement | null = null;
        let eventCell: HTMLElement | null = null;
        dynamicCellsWrapper.style.setProperty('--pointer-ev', 'auto');
        const elementsAtPoint = document.elementsFromPoint(mouseEvent.x, mouseEvent.y);
        elementsAtPoint.forEach((el) => {
            if (!eventIcon) {
                eventIcon = el.closest('.js-ControlsLists-timelineGrid__Event_icon');
            }
            if (!eventText) {
                eventText = el.closest('.ControlsLists-timelineGrid__EventBlockRender_text');
            }
            if (!eventCell) {
                const eventRender = el.closest(
                    '.ControlsLists-timelineGrid__Event:not(.ControlsLists-timelineGrid__Event_non-interactive)'
                );
                if (eventRender) {
                    eventCell = eventRender.closest(`.${CLASS_EVENT_CELL}`);
                }
            }
            if (dynamicColumnIndex === -1 && el.matches(`.${CLASS_DYNAMIC_DATA_CELL}`)) {
                dynamicColumnIndex = getCellIndexByEventTargetCommon(
                    { target: el },
                    '.js-ControlsLists-dynamicGrid__dynamicCellsWrapper',
                    `.${CLASS_DYNAMIC_DATA_CELL}`
                );
            }
        });
        dynamicCellsWrapper.style.setProperty('--pointer-ev', 'none');
        if (eventCell) {
            const eventKey = eventCell.getAttribute('data-key');
            const eventRecord = contents.get(eventsProperty)?.getRecordById(eventKey);
            eventCallback?.(
                contents,
                originalEvent,
                eventRecord,
                dynamicColumnsGridData[dynamicColumnIndex],
                eventIcon ? 'icon' : eventText ? 'title' : 'body'
            );
            return;
        }
    }
    // Если произошел клик по динамической колонке
    if (target.closest(`.${CLASS_DYNAMIC_DATA_CELL}`) || dynamicColumnIndex !== -1) {
        dynamicColumnIndex =
            dynamicColumnIndex ||
            getCellIndexByEventTargetCommon(
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
    // если произошёл клик по скроллируемой области с динамическими ячейками, ничего не делаем.
    if (
        (target.firstChild as HTMLElement)?.classList?.contains(
            'js-ControlsLists-dynamicGrid__dynamicCellsWrapper'
        )
    ) {
        return;
    }

    baseCallback?.(contents, originalEvent);
}

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
    private _customEvents: string[] = [];
    private _isAfterMouseDown: boolean = false;

    constructor(props: IDynamicGridComponentProps) {
        super(props);
        this._gridComponentRef = React.createRef();
        this._gridCollectionRef = React.createRef();

        this.state = {
            gridComponent: getGridComponent(props.viewMode),
            className: `ControlsLists-dynamicGrid ${props.className}`,
            dynamicColumnsGridData: props.dynamicColumnsGridData,
            columnsDataVersion: props.columnsDataVersion,
            getNodeFooterProps: props?.getNodeFooterProps,
            getRowProps: props.getRowProps,
            viewMode: props.viewMode,
            dynamicColumnWidth: props.columnWidth,
            dynamicColumnGapSize: props.columnGapSize,
            preparedColumns: prepareDynamicGridColumns({
                visibleRange: props.visibleRange,
                range: props.range,
                dataProperty: props.dynamicDataProperty,
                staticColumns: props.staticColumns,
                endStaticColumns: props.endStaticColumns,
                dynamicColumn: props.dynamicColumn,
                dynamicColumnsGridData: props.dynamicColumnsGridData,
                eventRender: props.eventRender,
                getEventRenderProps: props.getEventRenderProps,
                eventsProperty: props.eventsProperty,
                eventStartProperty: props.eventStartProperty,
                eventEndProperty: props.eventEndProperty,
                columnsSpacing: props.columnsSpacing,
                quantum: props.quantum,
                columnDataDensity: props.columnDataDensity,
                hoverMode: props.hoverMode,
                getDynamicColumnProps: props.getDynamicColumnProps,
                getRowProps: props.getRowProps,
                dynamicColumnWidth: props.columnWidth,
                onEventResized: props.onEventResized,
            }),
            preparedHeaders: prepareExtraRowColumns({
                extraRowStaticColumns: props.staticHeaders,
                extraRowDynamicColumn: props.dynamicHeader,
                extraRowDynamicSubColumns: props.dynamicHeader?.subHeaders,
                extraRowDynamicSuperColumns: props.dynamicHeader?.superHeaders,
                extraRowEndStaticColumns: props.endStaticHeaders,
                getPreparedDynamicColumn: getPreparedDynamicHeader,
                dynamicColumn: props.dynamicColumn,
                dynamicColumnsGridData: props.dynamicColumnsGridData,
                columnsSpacing: props.columnsSpacing,
                quantum: props.quantum,
                dataDensity: props.columnDataDensity,
                hoverMode: props.hoverMode,
                getCellProps: props.getDynamicColumnHeaderProps,
                range: props.range,
                quantums: props.quantums,
                filtered: props.filtered,
                dynamicColumnWidth: props.columnWidth,
                isAdaptive: props.isAdaptive,
            }),
            preparedFooter: prepareExtraRowColumns({
                extraRowStaticColumns: props.staticFooter,
                extraRowDynamicColumn: props.dynamicFooter,
                getPreparedDynamicColumn: getPreparedDynamicFooter,
                dynamicColumn: props.dynamicColumn,
                dynamicColumnsGridData: props.dynamicColumnsGridData,
                columnsSpacing: props.columnsSpacing,
                quantum: props.quantum,
                dataDensity: props.columnDataDensity,
                hoverMode: props.hoverMode,
                range: props.range,
                filtered: props.filtered,
                dynamicColumnWidth: props.columnWidth,
                isAdaptive: props.isAdaptive,
            }),
            visibleRange: props.visibleRange,
            dynamicColumn: props.dynamicColumn,
            initialColumnScrollPosition: props.activeDynamicColumn
                ? getInitialColumnsScrollPositionByActiveColumn(
                      props.dynamicColumnsGridData,
                      props.activeDynamicColumn,
                      parseFloat(props.columnWidth),
                      props.columnsSpacing
                  )
                : props.initialColumnScrollPosition ||
                  getInitialColumnsScrollPosition(
                      parseFloat(props.columnWidth),
                      props.dynamicColumnsGridData.length,
                      props.columnsSpacing
                  ),
        };

        this._onEdgesStateChanged = this._onEdgesStateChanged.bind(this);
        this._onItemClick = this._onItemClick.bind(this);
        this._onItemMouseDown = this._onItemMouseDown.bind(this);
        this._fillCustomEventsObject(props);
    }

    // Пока требуются customEvents.
    // Метод позволяет убрать warning, если не задана стрелка редактирования.
    private _fillCustomEventsObject(props: IDynamicGridComponentProps): void {
        ['onEditArrowClick', 'onItemClick'].forEach((eventName) => {
            if (props[eventName]) {
                this._customEvents.push(eventName);
            }
        });
    }

    static getDerivedStateFromProps(
        nextProps: IDynamicGridComponentProps,
        prevState: IDynamicGridComponentState
    ) {
        const changes: Partial<IDynamicGridComponentState> = {};
        const isHoverModeChanged = prevState.hoverMode !== nextProps.hoverMode;
        const isDynamicColumnChanged = prevState.dynamicColumn !== nextProps.dynamicColumn;
        const isVisibleRangeChanged = prevState.visibleRange !== nextProps.visibleRange;
        const isDynamicColumnsGridDataChanged =
            prevState.dynamicColumnsGridData !== nextProps.dynamicColumnsGridData;

        const dynamicColumnGapSize = nextProps.columnGapSize;
        const dynamicColumnWidth = nextProps.columnWidth;
        const isStaticColumnsChanged =
            prevState.staticFooter !== nextProps.staticFooter ||
            prevState.staticHeaders !== nextProps.staticHeaders ||
            prevState.staticColumns !== nextProps.staticColumns;
        const isDynamicColumnGapSizeChanged =
            prevState.dynamicColumnGapSize !== dynamicColumnGapSize;
        const isDynamicColumnWidthChanged = prevState.dynamicColumnWidth !== dynamicColumnWidth;

        if (prevState.viewMode !== nextProps.viewMode) {
            changes.viewMode = nextProps.viewMode;
            changes.gridComponent = getGridComponent(nextProps.viewMode);

            if (nextProps.activeDynamicColumn) {
                changes.initialColumnScrollPosition = getInitialColumnsScrollPositionByActiveColumn(
                    nextProps.dynamicColumnsGridData,
                    nextProps.activeDynamicColumn,
                    parseFloat(nextProps.columnWidth),
                    nextProps.columnsSpacing
                );
            }
        }

        if (
            prevState.initialColumnScrollPosition !== nextProps.initialColumnScrollPosition &&
            !nextProps.activeDynamicColumn
        ) {
            changes.initialColumnScrollPosition = nextProps.initialColumnScrollPosition;
        }

        if (prevState?.staticFooter !== nextProps.staticFooter) {
            changes.staticFooter = nextProps.staticFooter;
        }

        if (prevState?.staticHeaders !== nextProps.staticHeaders) {
            changes.staticHeaders = nextProps.staticHeaders;
        }

        if (prevState?.staticColumns !== nextProps.staticColumns) {
            changes.staticColumns = nextProps.staticColumns;
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

        if (prevState?.getNodeFooterProps !== nextProps?.getNodeFooterProps) {
            changes.getNodeFooterProps = nextProps?.getNodeFooterProps;
        }

        if (prevState.results !== nextProps.results) {
            changes.results = nextProps.results;
        }

        if (prevState.resultsPosition !== nextProps.resultsPosition) {
            changes.resultsPosition = nextProps.resultsPosition;
        }

        if (prevState.resultsVisibility !== nextProps.resultsVisibility) {
            changes.resultsVisibility = nextProps.resultsVisibility;
        }

        if (isDynamicColumnGapSizeChanged) {
            changes.dynamicColumnGapSize = dynamicColumnGapSize;
        }

        if (isDynamicColumnWidthChanged) {
            changes.dynamicColumnWidth = dynamicColumnWidth;
        }

        if (
            isDynamicColumnsGridDataChanged ||
            isDynamicColumnChanged ||
            isVisibleRangeChanged ||
            isHoverModeChanged ||
            isStaticColumnsChanged
        ) {
            changes.preparedColumns = prepareDynamicGridColumns({
                visibleRange: nextProps.visibleRange,
                range: nextProps.range,
                dataProperty: nextProps.dynamicDataProperty,
                staticColumns: nextProps.staticColumns,
                endStaticColumns: nextProps.endStaticColumns,
                dynamicColumn: nextProps.dynamicColumn,
                dynamicColumnsGridData: nextProps.dynamicColumnsGridData,
                eventRender: nextProps.eventRender,
                getEventRenderProps: nextProps.getEventRenderProps,
                eventsProperty: nextProps.eventsProperty,
                eventStartProperty: nextProps.eventStartProperty,
                eventEndProperty: nextProps.eventEndProperty,
                columnsSpacing: nextProps.columnsSpacing,
                quantum: nextProps.quantum,
                columnDataDensity: nextProps.columnDataDensity,
                hoverMode: nextProps.hoverMode,
                getDynamicColumnProps: nextProps.getDynamicColumnProps,
                getRowProps: nextProps.getRowProps,
                filtered: nextProps.filtered,
                dynamicColumnWidth,
                onEventResized: nextProps.onEventResized,
            });

            changes.preparedHeaders = prepareExtraRowColumns({
                extraRowStaticColumns: nextProps.staticHeaders,
                extraRowDynamicColumn: nextProps.dynamicHeader,
                extraRowDynamicSubColumns: nextProps.dynamicHeader?.subHeaders,
                extraRowDynamicSuperColumns: nextProps.dynamicHeader?.superHeaders,
                extraRowEndStaticColumns: nextProps.endStaticHeaders,
                getPreparedDynamicColumn: getPreparedDynamicHeader,
                dynamicColumn: nextProps.dynamicColumn,
                dynamicColumnsGridData: nextProps.dynamicColumnsGridData,
                columnsSpacing: nextProps.columnsSpacing,
                quantum: nextProps.quantum,
                dataDensity: nextProps.columnDataDensity,
                hoverMode: nextProps.hoverMode,
                getCellProps: nextProps.getDynamicColumnHeaderProps,
                range: nextProps.range,
                quantums: nextProps.quantums,
                filtered: nextProps.filtered,
                dynamicColumnWidth,
                isAdaptive: nextProps.isAdaptive,
            });

            changes.preparedFooter = prepareExtraRowColumns({
                extraRowStaticColumns: nextProps.staticFooter,
                extraRowDynamicColumn: nextProps.dynamicFooter,
                getPreparedDynamicColumn: getPreparedDynamicFooter,
                dynamicColumn: nextProps.dynamicColumn,
                dynamicColumnsGridData: nextProps.dynamicColumnsGridData,
                columnsSpacing: nextProps.columnsSpacing,
                quantum: nextProps.quantum,
                dataDensity: nextProps.columnDataDensity,
                hoverMode: nextProps.hoverMode,
                range: nextProps.range,
                filtered: nextProps.filtered,
                dynamicColumnWidth,
                isAdaptive: nextProps.isAdaptive,
            });
        }

        return changes;
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevState.columnsDataVersion !== this.state.columnsDataVersion) {
            const gridContainer = this._gridComponentRef.current._container;
            const gridRect = gridContainer.getBoundingClientRect();

            const fixedCell = gridContainer.querySelector(`.${SELECTORS.FIXED_CELL}`);
            const fixedCellRect = fixedCell?.getBoundingClientRect() || {
                left: gridRect.left,
                top: 0,
                right: gridRect.right,
                bottom: 0,
                width: 0,
                height: 0,
            };

            const scrollableCells = gridContainer.querySelectorAll(
                `.js-${CLASS_DYNAMIC_HEADER_CELL}`
            );

            let snapshot;
            for (let idx = 0; idx < scrollableCells.length; idx++) {
                const scrollableCellRect = scrollableCells[idx].getBoundingClientRect();
                if (
                    scrollableCellRect.left + scrollableCellRect.width >
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
        this._isAfterMouseDown = true;
        executeCallbackByTarget({
            contents,
            originalEvent,
            eventsProperty: this.props.eventsProperty,
            dynamicColumnsGridData: this.props.dynamicColumnsGridData,
            eventCallback: this.props.onEventMouseDown,
            dynamicColumnCallback: this.props.onDynamicColumnMouseDown,
            baseCallback: this.props.onItemMouseDown as TBaseMouseEventCallback,
            isAfterMouseDown: this._isAfterMouseDown,
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
            isAfterMouseDown: this._isAfterMouseDown,
        });
        this._isAfterMouseDown = false;
    }

    render() {
        const GridComponent = this.state.gridComponent;
        return (
            <div
                ref={this.props.refOnlyForWasaby}
                data-qa="controlsLists_dynamicGrid"
                className="tw-contents controlsLists_dynamicGrid_theme-default"
                style={{
                    '--dynamic-column_width': this.state.dynamicColumnWidth,
                    '--dynamic-column_gap': `${this.state.dynamicColumnGapSize}px`,
                }}
            >
                <SelectionContainer
                    collectionRef={this._gridCollectionRef}
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
                                if (typeof this.props.gridComponentRef === 'function') {
                                    this.props.gridComponentRef(el);
                                } else {
                                    this.props.gridComponentRef.current = el;
                                }
                            }
                        }}
                        multiSelectAccessibilityProperty={
                            this.props.multiSelectAccessibilityProperty
                        }
                        collectionRef={this._gridCollectionRef}
                        expanderPosition={this.props.expanderPosition}
                        onEdgesStateChanged={this._onEdgesStateChanged}
                        onPositionChanged={this.props.onPositionChanged}
                        breadCrumbsMode={this.props.breadCrumbsMode || 'row'}
                        headerVisibility="visible"
                        withoutLevelPadding={this.props.isAdaptive}
                        columns={this.state.preparedColumns}
                        columnScrollStartPosition={this.state.initialColumnScrollPosition}
                        header={this.state.preparedHeaders}
                        footer={this.state.preparedFooter}
                        footerTemplate={this.props.footerTemplate}
                        results={this.props.results}
                        resultsPosition={this.props.resultsPosition}
                        resultsVisibility={this.props.resultsVisibility}
                        selectAncestors={this.props.selectAncestors}
                        selectDescendants={this.props.selectDescendants}
                        stickyHeader={this.props.stickyHeader}
                        stickyResults={this.props.stickyResults}
                        stickyFooter={this.props.stickyFooter}
                        stickyCallback={this.props?.stickyCallback}
                        emptyView={this.props.emptyView}
                        emptyViewProps={this.props.emptyViewProps}
                        className={this.state.className}
                        editingConfig={this.props.editingConfig}
                        storeId={this.props.storeId}
                        parentProperty={this.props.parentProperty}
                        nodeProperty={this.props.nodeProperty}
                        resizerVisibility={this.props.resizerVisibility}
                        colspanCallback={this.props.colspanCallback}
                        columnScroll={true}
                        stickyColumnsCount={this.props.staticColumns.length}
                        endStickyColumnsCount={
                            this.props.endStaticColumns ? this.props.endStaticColumns.length : 0
                        }
                        columnScrollViewMode={this.props.columnScrollViewMode}
                        columnScrollNavigationPosition="custom"
                        hasColumnScrollCustomAutoScrollTargets={true}
                        columnScrollAutoScrollMode={'mostVisible'}
                        getRowProps={this.state.getRowProps}
                        getNodeFooterProps={this.state?.getNodeFooterProps}
                        showEditArrow={this.props.showEditArrow}
                        editArrowVisibilityCallback={this.props.editArrowVisibilityCallback}
                        onEditArrowClick={this.props.onEditArrowClick}
                        itemActions={this.props.itemActions}
                        itemActionsVisibility={this.props.itemActionsVisibility}
                        itemActionVisibilityCallback={this.props.itemActionVisibilityCallback}
                        itemActionsProperty={this.props.itemActionsProperty}
                        itemActionsPosition={this.props.itemActionsPosition}
                        onItemClick={this._onItemClick}
                        onBeforeSelectionChanged={this.props.onBeforeSelectionChanged}
                        onActionClick={this.props.onActionClick}
                        onBeforeBeginEdit={this.props.onBeforeBeginEdit}
                        onAfterEndEdit={this.props.onAfterEndEdit}
                        onBeforeEndEdit={this.props.onBeforeEndEdit}
                        expanderClickCallback={this.props.expanderClickCallback}
                        onItemMouseDown={this._onItemMouseDown}
                        onHoveredCellChanged={this.props.onHoveredCellChanged}
                        {...this.props.swipeStaticColumnsHandlers}
                        onHeaderClick={this.props.onHeaderClick}
                        virtualScrollConfig={this.props.virtualScrollConfig}
                        customEvents={this._customEvents}
                        beforeItemsContent={this.props?.beforeItemsContent}
                        afterItemsContent={this.props?.afterItemsContent}
                        keepScrollAfterReload={this.props?.keepScrollAfterReload}
                        keepAddingOnReload={this.props?.keepAddingOnReload}
                        subPixelArtifactFix={this.props.subPixelArtifactFix}
                        bottomPaddingMode={this.props?.bottomPaddingMode}
                    />
                </SelectionContainer>
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const gridContainer = this._gridComponentRef.current._container;
        if (prevProps.activeDynamicColumn !== this.props.activeDynamicColumn) {
            const scrollableCell = gridContainer.querySelector(
                `.js-${CLASS_DYNAMIC_HEADER_CELL}_${this.props.activeDynamicColumn} .${AUTOSCROLL_TARGET}`
            );
            if (scrollableCell) {
                this.horizontalScrollToElement(scrollableCell);
            }
        }
        if (snapshot) {
            const scrollableCell = gridContainer.querySelector(
                `${snapshot.savedCellSelector} .${AUTOSCROLL_TARGET}`
            );

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

    static defaultProps: Partial<IDynamicGridComponentProps> = {
        hoverMode: 'cross',
        columnScrollViewMode: 'unaccented',
    };
}

/*
 * Компонент "Таблица с загружаемыми колонками"
 * @class Controls-Lists/_dynamicGrid/Component
 * @implements Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IDynamicGridComponentProps
 * @public
 * @demo Controls-Lists-demo/dynamicGrid/base/Index
 */
export const Component = React.forwardRef(
    (props: IDynamicGridComponentProps, ref: React.ForwardedRef<HTMLDivElement>) => {
        const [
            columnWidth,
            columnGapSize,
            dynamicGridRef,
            visibleRange,
            initialColumnsPosition,
            onColumnsPositionChanged,
        ] = useColumnScrollObserveAndRecovery(props);

        const dynamicColumnsInfoContextValue = React.useMemo(() => {
            return {
                columnsCount: props.dynamicColumnsGridData.length,
                visibleRange,
                columnWidth,
            };
        }, [props.dynamicColumnsGridData.length, visibleRange, columnWidth]);

        return (
            <DynamicColumnsInfoContext.Provider value={dynamicColumnsInfoContextValue}>
                <DynamicGridClassComponent
                    {...props}
                    refOnlyForWasaby={ref}
                    columnWidth={columnWidth}
                    columnGapSize={columnGapSize}
                    visibleRange={visibleRange}
                    initialColumnScrollPosition={initialColumnsPosition}
                    onPositionChanged={onColumnsPositionChanged}
                    gridComponentRef={(el) => {
                        dynamicGridRef.current = el;
                        if (typeof props.dynamicGridRef === 'function') {
                            props.dynamicGridRef(el);
                        } else if (props.dynamicGridRef) {
                            props.dynamicGridRef.current = el;
                        }
                    }}
                />
            </DynamicColumnsInfoContext.Provider>
        );
    }
);

export const DynamicGridComponent = Component;

export {
    IDynamicGridComponentProps,
    IBaseDynamicGridComponentProps,
    TDynamicColumnMouseEventCallback,
    TEventMouseEventCallback,
    IEventRenderProps,
};
