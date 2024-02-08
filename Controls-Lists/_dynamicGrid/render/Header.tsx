import * as React from 'react';
import { TOffsetSize } from 'Controls/interface';
import {
    DYNAMIC_HEADER_PREFIX,
    CLASS_DYNAMIC_HEADER_CELL,
    AUTOSCROLL_TARGET,
} from '../shared/constants';
import { TQuantumType, TColumnDataDensity } from '../shared/types';
import {
    getExtraRowDynamicCellClassName,
    getPreparedExtraRowDynamicColumnProps,
    IGetExtraRowDynamicCellClassNameBaseProps,
    IGetPreparedExtraRowDynamicColumnBaseProps,
} from './ExtraRow';
import { AutoScrollTargetElement } from 'Controls/columnScrollReact';

import { Range as RangeUtils } from 'Controls/dateUtils';
import { IRange, Quantum, IQuantum } from '../interfaces/IEventRenderProps';

const DAYS_IN_WEEK = 7;

// TODO: Если кому-то когда-то понадобится dynamicGrid без заголовков, то
//  нужно использовать механизм prepareExtraRowColumns, но пока такой задачи нет,
//  а правки получатся большие.
function HeaderRenderComponent(props: {
    columnsSpacing: TOffsetSize;
    baseRender: React.ReactElement;
}) {
    return (
        <>
            {React.cloneElement(props.baseRender, {
                ...props,
                render: undefined,
            })}
            <AutoScrollTargetElement
                className={
                    `${AUTOSCROLL_TARGET} ` +
                    'ControlsLists-dynamicGrid__autoScrollTarget ' +
                    `ControlsLists-dynamicGrid__autoScrollTarget_columns-spacing_${props.columnsSpacing}`
                }
            />
        </>
    );
}

// TODO Это функционал таймлайна
function shouldHoverSeparatedHeaderCell(
    quantum: TQuantumType,
    dataDensity: TColumnDataDensity,
    range: IRange,
    quantums: IQuantum[]
): boolean {
    // Чтобы работал dynamicGrid без таймлайна
    if (!range) {
        return true;
    }
    // todo переделать условие с учетом ограничений кванта
    //  https://dev.saby.ru/doc/d7dd3661-7901-4b8f-b9ec-bb4f9c1b011d?client=3
    if (quantums?.length === 1 && quantums[0].name === Quantum.Month) {
        return false;
    }
    const rangeSizeInDays = RangeUtils.getPeriodLengthInDays(range.start, range.end);
    return quantum !== 'day' || dataDensity === 'advanced' || rangeSizeInDays <= DAYS_IN_WEEK;
}

export function getPreparedDynamicHeader(props: IGetPreparedExtraRowDynamicColumnBaseProps) {
    const hoverSeparatedHeaderCell = shouldHoverSeparatedHeaderCell(
        props.quantum,
        props.dataDensity,
        props.range,
        props.quantums
    );

    const hoverClassName = hoverSeparatedHeaderCell
        ? 'ControlsLists-timelineGrid__headerSeparatedCellHover'
        : null;

    const cellHoverBackgroundStyle = hoverSeparatedHeaderCell ? 'unaccented' : null;

    return getPreparedExtraRowDynamicColumnProps({
        ...props,
        extraRowDynamicColumn: {
            ...props.extraRowDynamicColumn,
            render: (
                <HeaderRenderComponent
                    baseRender={props.extraRowDynamicColumn.render}
                    columnsSpacing={props.columnsSpacing}
                />
            ),
        },
        keyPrefix: DYNAMIC_HEADER_PREFIX,
        hoverClassName,
        cellHoverBackgroundStyle,
        extraRowDynamicCellsClassNameCallback: getHeaderRowDynamicCellClass,
    });
}

export function getHeaderRowDynamicCellClass(
    props: IGetExtraRowDynamicCellClassNameBaseProps
): string {
    const { value, columnsSpacing, quantum, dataDensity } = props;
    let className = '';
    const headerHoverClass = getHeaderCellHoverClass(
        value as Date,
        columnsSpacing,
        quantum,
        dataDensity,
        props.range,
        props.quantums
    );

    if (headerHoverClass) {
        className += ` ${headerHoverClass}`;
    }
    return (
        getExtraRowDynamicCellClassName({ ...props, classPrefix: CLASS_DYNAMIC_HEADER_CELL }) +
        className
    );
}

// TODO: Вот это нужно только в таймлайн и только для дат (недель)
function getHeaderCellHoverClass(
    value: Date,
    columnsSpacing: TOffsetSize,
    quantum: TQuantumType,
    dataDensity: TColumnDataDensity,
    range: IRange,
    quantums: IQuantum[]
): string {
    if (shouldHoverSeparatedHeaderCell(quantum, dataDensity, range, quantums)) {
        return null;
    }

    const day = value.getDay();
    const SUNDAY = 0;

    const daysToStart = (day === SUNDAY ? DAYS_IN_WEEK : day) - 1;

    return (
        'ControlsLists-timelineGrid__headerCellHoverWeek ' +
        `ControlsLists-timelineGrid__headerCellHoverWeek_day-${daysToStart}_${columnsSpacing}`
    );
}
