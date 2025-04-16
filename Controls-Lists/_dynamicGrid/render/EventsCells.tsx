import {
    getEndDate,
    getPositionInPeriod,
    getStartDate,
    RenderUtils,
    shiftDateByWidth,
    validateEventResizeOffset,
} from 'Controls-Lists/_dynamicGrid/render/utils';
import { TQuantumType } from 'Controls-Lists/_dynamicGrid/shared/types';
import * as React from 'react';
import { datesEqualByQuantum } from 'Controls-Lists/_dynamicGrid/shared/utils/datesEqualByQuantum';
import {
    IEventRenderProps,
    TGetEventRenderPropsCallback,
} from 'Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps';
import { ResizingLine } from 'Controls/dragnDrop';
import { CellComponent, useItemData as useGridItemData } from 'Controls/gridRender';
import { factory } from 'Types/chain';
import { Model } from 'Types/entity';
import { IDynamicCellsProps } from 'Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent';
import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments';
import { RecordSet } from 'Types/collection';
import AddDependencyButton from 'Controls-Lists/_dynamicGrid/render/AddDependencyButton';

export const CLASS_EVENT_CELL = 'ControlsLists-dynamicGrid__eventCell';

export interface IEventsConfig {
    render: React.ReactElement;
    eventsProperty: string;
    eventStartProperty: string;
    eventEndProperty: string;
    endIndex: number;
    startIndex: number;
    columnWidth: number;
    getEventRenderProps?: TGetEventRenderPropsCallback;
    onEventResized: (item: Model, event: Model) => void;
}

interface IEventCellRenderProps extends IEventsConfig {
    value: Model;
    className: string;
    quantum: TQuantumType;
    quantumSize: number;
    visibleDateRange: IRange;
    dynamicColumnsGridData: Date[];
    columnSpacing: number;
    events: RecordSet;
    item: Model;
    onEventResized: (item: Model, event: Model) => void;
    onDependencyButtonMouseDown: (
        eventId: string,
        buttonPosition: 'left' | 'right',
        lineColor: string
    ) => void;
    onDependencyButtonClick: (eventId: string, buttonPosition: 'left' | 'right') => void;
}

function EventCellRender(props: IEventCellRenderProps) {
    const {
        value,
        className,
        getEventRenderProps,
        columnWidth,
        render,
        eventStartProperty,
        eventEndProperty,
        quantum,
        quantumSize,
        visibleDateRange,
        dynamicColumnsGridData,
        columnSpacing,
        startIndex,
        endIndex,
        events,
        item,
        eventsProperty,
        onEventResized,
        onDependencyButtonMouseDown,
        onDependencyButtonClick,
    } = props;
    const customRenderProps = getEventRenderProps?.(value);
    const event = value;
    const attributes = {
        'data-key': event.getKey(),
    };
    let startDate = value.get(eventStartProperty);
    let endDate = value.get(eventEndProperty);

    let startCropped = false;
    let endCropped = false;
    let columnStartIndex = -1;
    let columnEndIndex = -1;

    if (customRenderProps?.viewMode === 'byGrid' && startDate && endDate) {
        const length = Math.ceil((endDate.getTime() - startDate.getTime()) / quantumSize);
        startDate = getStartDate(new Date(startDate), quantum);
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + length);
    }

    let startOffset = 0;
    let endOffset = 0;

    if (customRenderProps?.viewMode !== 'byGrid' && startDate && endDate) {
        // Отступами слева и справа выравниваем границы события
        startOffset = getPositionInPeriod(startDate, quantum as TQuantumType);
        endOffset = getPositionInPeriod(endDate, quantum as TQuantumType);
    }

    const onResize = React.useCallback(
        (offset: number, side: 'left' | 'right') => {
            const direction = offset > 0 ? 'forward' : 'backward';
            const validatedOffset = validateEventResizeOffset(
                Math.abs(offset),
                columnWidth,
                columnSpacing,
                startOffset
            );
            const nextDate = shiftDateByWidth(
                validatedOffset,
                side === 'left' ? startDate : endDate,
                columnWidth - columnSpacing,
                quantum,
                direction,
                side === 'left' ? startOffset : endOffset
            );
            const eventIndex = events.getIndex(event);
            const newEvent = event.clone();
            if (side === 'left') {
                newEvent.set(eventStartProperty, nextDate);
            } else if (side === 'right') {
                newEvent.set(eventEndProperty, nextDate);
            }
            const nextEvents = events.clone();
            nextEvents.replace(newEvent, eventIndex);
            item.set(eventsProperty, nextEvents);
            onEventResized(item, newEvent);
        },
        [
            event,
            item,
            onEventResized,
            columnWidth,
            columnSpacing,
            startOffset,
            endDate,
            startDate,
            events,
            quantum,
            eventEndProperty,
            eventStartProperty,
            eventsProperty,
        ]
    );

    // TODO: https://online.sbis.ru/doc/1cdeda8e-985b-4a05-8999-6819c6f53732?client=3
    // до выполнения задачи - не вывожу события без граничных дат
    if (!startDate || !endDate) {
        return null;
    }
    // Событие не 0с длительностью не попало в отрисованный диапазон ячеек
    if (endDate - startDate > 0) {
        if (startDate >= visibleDateRange.end || endDate <= visibleDateRange.start) {
            return null;
        }
    } else {
        // Событие 0с длительностью не попало в отрисованный диапазон ячеек (оно может быть на границе)
        if (
            startDate > visibleDateRange.end ||
            endDate < visibleDateRange.start ||
            endDate - startDate < 0
        ) {
            return null;
        }
    }

    // Если дата начала раньше, чем дата в первой ячейке, считаем ячейкой начала первую
    if (startDate < visibleDateRange.start) {
        startCropped = true;
        columnStartIndex = dynamicColumnsGridData.findIndex((d) => {
            const date = RenderUtils.correctServerSideDateForRender(d as Date);
            return (
                datesEqualByQuantum(visibleDateRange.start, date, quantum) ||
                visibleDateRange.start < d
            );
        });
    }

    // Если дата конца позже, чем дата в последней ячейке, считаем ячейкой конца первую
    if (endDate > visibleDateRange.end) {
        endCropped = true;
        columnEndIndex = dynamicColumnsGridData.findIndex((d) => {
            const date = RenderUtils.correctServerSideDateForRender(d as Date);
            return (
                datesEqualByQuantum(visibleDateRange.end, date as Date, quantum as TQuantumType) ||
                visibleDateRange.end < d
            );
        });
    }

    if (columnStartIndex === -1) {
        columnStartIndex = dynamicColumnsGridData.findIndex((d) => {
            const date = RenderUtils.correctServerSideDateForRender(d as Date);
            return datesEqualByQuantum(startDate, date, quantum as TQuantumType) || startDate < d;
        });
    }
    if (columnEndIndex === -1) {
        columnEndIndex = dynamicColumnsGridData.findIndex((d) => {
            const date = RenderUtils.correctServerSideDateForRender(d as Date);
            return datesEqualByQuantum(endDate, date, quantum as TQuantumType) || endDate < d;
        });
    }
    const span = columnEndIndex - columnStartIndex + 1;

    const marginLeft = startCropped ? '0' : `calc(100% / ${span} * ${startOffset})`;
    const marginRight = endCropped
        ? '0'
        : `calc(100% / ${span} * ${1 - endOffset} + ${endOffset ? 0 : columnSpacing / span}px)`;

    // Ширина видимой части события, доступная для отрисовки контента
    let width =
        columnWidth * (span - (startCropped ? 0 : startOffset) - (endCropped ? 0 : 1 - endOffset));

    if (width < 0) {
        // Ширина меньше 0, значит событие полностью попало в скрытые дни.
        return null;
    }
    width -= endOffset ? 0 : columnSpacing;
    // Считаем отступ до начала видимой части события (теперь 0, так как не рисуем за границами)
    const contentOffset = 0;
    const left = columnWidth * (columnStartIndex - startIndex + startOffset);
    const right = columnWidth * (endIndex - columnEndIndex + 1 - endOffset);
    const renderProps: IEventRenderProps = {
        events,
        item,
        event,
        width,
        contentOffset,
        left,
        right,
        startCropped,
        endCropped,
        ...customRenderProps,
    };

    const renderLeftDependencyButton = customRenderProps?.dependencyButtonsConfig?.showButtons.left;
    const renderRightDependencyButton =
        customRenderProps?.dependencyButtonsConfig?.showButtons.right;

    const cellRender = (
        <>
            {customRenderProps?.resizerVisible && (
                <ResizingLine
                    onOffset={(offset: number) => {
                        onResize(offset, 'left');
                    }}
                    onMouseDown={(e: MouseEvent) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                    customEvents={['onOffset']}
                    className={'ControlsLists-dynamicGrid__eventResizer-left'}
                />
            )}
            {renderLeftDependencyButton && (
                <AddDependencyButton
                    buttonConfig={customRenderProps?.dependencyButtonsConfig}
                    eventKey={event.getKey()}
                    buttonPosition={'left'}
                    onMouseDown={onDependencyButtonMouseDown}
                    onClick={onDependencyButtonClick}
                />
            )}
            {React.cloneElement(render, renderProps)}
            {renderRightDependencyButton && (
                <AddDependencyButton
                    buttonConfig={customRenderProps?.dependencyButtonsConfig}
                    buttonPosition={'right'}
                    eventKey={event.getKey()}
                    onMouseDown={onDependencyButtonMouseDown}
                    onClick={onDependencyButtonClick}
                />
            )}
            {customRenderProps?.resizerVisible && (
                <ResizingLine
                    onOffset={(offset: number) => {
                        onResize(offset, 'right');
                    }}
                    onMouseDown={(e: MouseEvent) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                    customEvents={['onOffset']}
                    className={'ControlsLists-dynamicGrid__eventResizer-right'}
                />
            )}
        </>
    );
    return (
        <CellComponent
            attributes={attributes}
            hoverMode="cell"
            className={className}
            render={cellRender}
            startColspanIndex={columnStartIndex + 1}
            endColspanIndex={columnStartIndex + span + 1}
            startRowspanIndex={customRenderProps?.startRow || 1}
            endRowspanIndex={customRenderProps?.endRow || 'auto'}
            style={{
                marginLeft,
                marginRight,
                pointerEvents:
                    renderLeftDependencyButton || renderRightDependencyButton ? 'auto' : 'none',
            }}
            valign={null}
            cursor={null}
            paddingLeft={null}
            paddingRight={null}
            hoverBackgroundStyle={null}
            displayType="block"
        />
    );
}

export const EventsCells = React.memo(function MemoizedEventsCells(
    props: IEventsConfig & IDynamicCellsProps & { quantum: TQuantumType }
): React.ReactElement {
    const { render, dynamicColumnsGridData, eventsProperty } = props;
    const startIndex = dynamicColumnsGridData.findIndex((d) => {
        return datesEqualByQuantum(props.range.start, d as Date, props.quantum);
    });
    const endIndex = dynamicColumnsGridData.findIndex((d) => {
        return datesEqualByQuantum(props.range.end, d as Date, props.quantum);
    });
    const quantumSize = dynamicColumnsGridData[1].getTime() - dynamicColumnsGridData[0].getTime();
    const { item, renderValues } = useGridItemData([eventsProperty]);
    const visibleDateRange = {
        start: getStartDate(new Date(props.range.start), props.quantum),
        end: getEndDate(new Date(props.range.end), props.quantum),
    };
    const events = renderValues[eventsProperty];
    if (!events || events.getCount() === 0) {
        return null;
    }
    const className = `${CLASS_EVENT_CELL} ${CLASS_EVENT_CELL}_${props.hoverMode}`;

    return (
        <>
            {factory(events)
                .map((value: Model) => {
                    return (
                        <EventCellRender
                            key={value.getKey()}
                            value={value}
                            eventStartProperty={props.eventStartProperty}
                            eventEndProperty={props.eventEndProperty}
                            events={events}
                            getEventRenderProps={props.getEventRenderProps}
                            columnWidth={props.columnWidth}
                            render={render}
                            item={item}
                            onDependencyButtonMouseDown={props.onDependencyButtonMouseDown}
                            onDependencyButtonClick={props.onDependencyButtonClick}
                            className={className}
                            quantum={props.quantum}
                            quantumSize={quantumSize}
                            visibleDateRange={visibleDateRange}
                            endIndex={endIndex}
                            startIndex={startIndex}
                            dynamicColumnsGridData={dynamicColumnsGridData}
                            columnSpacing={props.columnSpacing}
                            eventsProperty={props.eventsProperty}
                            onEventResized={props.onEventResized}
                        />
                    );
                })
                .value()}
        </>
    );
});
