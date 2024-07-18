import { getPositionInPeriod, RenderUtils } from 'Controls-Lists/dynamicGrid';
import { Quantum } from '../utils';
import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments';

const MILLISECONDS = 1000;
const MINUTES = 3600;
const HOURS = 24;

type TEventRelativeBlock = { [name: string]: Date };

export interface IEventRelativeBlockStyle {
    left: string;
    width: string;
    top?: string;
}

/**
 * Интерфейс параметров утилиты для расчёта позиции и ширины блоков, отрисованных относительно события / ячейки.
 * @public
 */
interface IIEventRelativeBlockStyleParams {
    /**
     * Отображаемый период таймлайна
     */
    range: IRange;
    /**
     * Квант времени для расчёта позиции и ширины относительного блока
     */
    quantum: Quantum;
    /**
     * Дата старта основного события для рассчёта позиции относительных блоков.
     */
    eventStart: Date;
    /**
     * Имя свойства относительного блока, содержащее время старта отрисовки блока.
     */
    blockStartProperty: string;
    /**
     * Имя свойства относительного блока, содержащее время окончания отрисовки блока.
     */
    blockEndProperty: string;
    /**
     * Объект с датами начала и конца относительного блока.
     */
    block: TEventRelativeBlock;
    /**
     * Считать позицию и размеры блока относительно ячейки, а не блока события с position: relative.
     * По умолчанию false.
     */
    isRelativeToCell?: boolean;
}

function calculatePeriodOffset(
    startDate: Date, // Начало периода (начало события)
    endDate: Date, // Начало относительного блока
    quantum: Quantum
): number {
    if (quantum === 'day') {
        const timeDiff = endDate.getTime() - startDate.getTime(); // расстояние от начала события до начала блока в мс
        return timeDiff / (MILLISECONDS * MINUTES * HOURS); // Доля от кванта
    }
    if (quantum === 'hour') {
        const timeDiff = endDate.getTime() - startDate.getTime();
        return timeDiff / (MILLISECONDS * MINUTES);
    }
    if (quantum === 'month') {
        const startPosition = getPositionInPeriod(startDate, quantum);
        const monthsDiff = endDate.getMonth() - startDate.getMonth();
        return monthsDiff - startPosition;
    }
    return 0;
}

export function calcEventRelativeBlockLeftOffset(
    eventStart: Date,
    relativeBlockStart: Date,
    quantum: Quantum,
    isRelativeToCell: boolean
): number {
    return (
        calculatePeriodOffset(eventStart, relativeBlockStart, quantum) +
        (isRelativeToCell ? RenderUtils.getPositionInPeriod(relativeBlockStart, quantum) : 0)
    );
}

export function calcEventRelativeBlockWidth(
    relativeBlockStart: Date,
    relativeBlockEnd: Date,
    quantum: Quantum,
    isRelativeToCell: boolean
): number {
    return (
        calculatePeriodOffset(relativeBlockStart, relativeBlockEnd, quantum) -
        (isRelativeToCell
            ? RenderUtils.getPositionInPeriod(relativeBlockStart, quantum) -
              RenderUtils.getPositionInPeriod(relativeBlockEnd, quantum)
            : 0)
    );
}

/**
 * Утилита для расчёта позиции и ширины блоков, отрисованных относительно события.
 * @public
 */
export function calcEventRelativeBlockStyles({
    range,
    eventStart,
    block,
    blockStartProperty,
    blockEndProperty,
    quantum,
    isRelativeToCell,
}: IIEventRelativeBlockStyleParams): IEventRelativeBlockStyle {
    let eventStartCropped = eventStart;
    const relativeBlockStart = new Date(block[blockStartProperty]);
    const relativeBlockEnd = new Date(block[blockEndProperty]);

    if (range.start > eventStart) {
        eventStartCropped = range.start;
    }
    let relativeBlockStartCropped = relativeBlockStart;
    if (range.start > relativeBlockStart) {
        relativeBlockStartCropped = range.start;
    }
    let relativeBlockEndCropped = relativeBlockEnd;
    if (range.end < relativeBlockStart) {
        relativeBlockEndCropped = range.end;
    }
    return {
        left: `calc((var(--dynamic-column_width) + var(--dynamic-column_gap)) *
                     ${calcEventRelativeBlockLeftOffset(
                         eventStartCropped,
                         relativeBlockStartCropped,
                         quantum,
                         !!isRelativeToCell
                     )})`,
        width: `calc(((var(--dynamic-column_width) + var(--dynamic-column_gap)) * ${calcEventRelativeBlockWidth(
            relativeBlockStartCropped,
            relativeBlockEndCropped,
            quantum,
            !!isRelativeToCell
        )} - var(--dynamic-column_gap))`,
    };
}
