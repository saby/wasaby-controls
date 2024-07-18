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
import { RenderUtils } from 'Controls-Lists/_dynamicGrid/render/utils';

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

    const days = quantums?.find((q) => q.name === Quantum.Day);
    const lessThanDay = quantums?.find(
        (q) => q.name === Quantum.Hour || q.name === Quantum.Minute || q.name === Quantum.Second
    );

    // Если разрешенный квант единственный - проваливаться некуда
    if (quantums?.length === 1) {
        return false;
    }

    // Если выбран квант меньше дня - проваливаться некуда, дальше только масштаб
    if (quantum === Quantum.Hour || quantum === Quantum.Minute || quantum === Quantum.Second) {
        return false;
    }
    const rangeSizeInDays = RangeUtils.getPeriodLengthInDays(range.start, range.end);

    // Пердыдущий квант недоступен
    if (
        (quantum === Quantum.Month && !days) ||
        (quantum === Quantum.Day && rangeSizeInDays <= DAYS_IN_WEEK && !lessThanDay)
    ) {
        return false;
    }
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
        props.quantums,
        props.filtered
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
    quantums: IQuantum[],
    filtered: boolean
): string {
    if (shouldHoverSeparatedHeaderCell(quantum, dataDensity, range, quantums)) {
        return null;
    }

    const shouldRenderHoverElement = quantum === 'day' && dataDensity !== 'advanced';
    if (shouldRenderHoverElement) {
        const date = RenderUtils.correctServerSideDateForRender(value);
        const day = date.getDay();
        const SUNDAY = 0;

        const daysToStart = (day === SUNDAY ? DAYS_IN_WEEK : day) - 1;

        return (
            'ControlsLists-timelineGrid__headerCellHoverWeek ' +
            `ControlsLists-timelineGrid__headerCellHoverWeek${
                filtered ? '_filtered' : ''
            }_day-${daysToStart}_${columnsSpacing}`
        );
    }
}
