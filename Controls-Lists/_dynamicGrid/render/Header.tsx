import { TOffsetSize } from 'Controls/interface';
import { DYNAMIC_HEADER_PREFIX, CLASS_DYNAMIC_HEADER_CELL } from '../shared/constants';
import { TQuantumType, TColumnDataDensity } from '../shared/types';
import {
    getExtraRowDynamicCellClassName,
    getPreparedExtraRowDynamicColumnProps,
    IGetExtraRowDynamicCellClassNameBaseProps,
    IGetPreparedExtraRowDynamicColumnBaseProps,
    IExtraRowDynamicCellsColspanCallback,
} from './ExtraRow';

function shouldHoverSeparatedHeaderCell(
    quantum: TQuantumType,
    dataDensity: TColumnDataDensity
): boolean {
    return quantum !== 'day' || dataDensity === 'advanced';
}

export type IDynamicHeaderCellsColspanCallback = IExtraRowDynamicCellsColspanCallback;

export function getPreparedDynamicHeader(props: IGetPreparedExtraRowDynamicColumnBaseProps) {
    const hoverSeparatedHeaderCell = shouldHoverSeparatedHeaderCell(
        props.quantum,
        props.dataDensity
    );

    const hoverClassName = hoverSeparatedHeaderCell
        ? 'ControlsLists-timelineGrid__headerSeparatedCellHover'
        : null;

    const cellHoverBackgroundStyle = hoverSeparatedHeaderCell ? 'unaccented' : null;

    return getPreparedExtraRowDynamicColumnProps({
        ...props,
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
        dataDensity
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
    dataDensity: TColumnDataDensity
): string {
    if (quantum !== 'day' || dataDensity === 'advanced') {
        return null;
    }

    const day = value.getDay();
    const SUNDAY = 0;
    const DAYS_IN_WEEK = 7;

    const daysToStart = (day === SUNDAY ? DAYS_IN_WEEK : day) - 1;

    return (
        'ControlsLists-timelineGrid__headerCellHoverWeek ' +
        `ControlsLists-timelineGrid__headerCellHoverWeek_day-${daysToStart}_${columnsSpacing}`
    );
}
