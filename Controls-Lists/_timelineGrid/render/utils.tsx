import { getPositionInPeriod, RenderUtils } from 'Controls-Lists/dynamicGrid';
import { Quantum } from '../utils';
import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments';
import { IArrowStyle } from 'Controls-Lists/_timelineGrid/render/ArrowsLayer';

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
    /**
     * Дополнительные стили
     */
    additionalStyles?: object;
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
    additionalStyles = {},
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
        ...additionalStyles,
        left:
            'calc((var(--dynamic-column_width) + var(--dynamic-column_gap)) * ' +
            `${calcEventRelativeBlockLeftOffset(
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

export function hexToNumber(hexString: string | number): number | undefined {
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    if (!hexString) {
        return undefined;
    }
    if (typeof hexString === 'number') {
        return hexString;
    }

    const hexPrepared = hexString.replace('#', '');

    if (hexPrepared.length === 6) {
        return parseInt(hexString.slice(-hexPrepared.length), 16);
    }

    if (hexPrepared.length === 8) {
        const origColor = parseInt(hexString.slice(-8, -2), 16);
        const userInputedAlpha = parseInt(hexString.slice(-2), 16);
        // eslint-disable-next-line no-bitwise
        return (origColor & 0x00ffffff) | (userInputedAlpha << 24);
    }
}

/**
 * Функция для отрисовки зависимостей в виде стрелок
 * @param g
 * @param fromX
 * @param fromY
 * @param toX
 * @param toY
 * @param arrowStyle
 */
export function drawArrow(
    g: PIXI.Graphics,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    arrowStyle: IArrowStyle
) {
    const ARROW_HEAD_LENGTH = 6;
    const CONTROL_POINT_RATIO = 0.3;
    const START_CIRCLE_RADIUS = 3;

    // Расчет контрольных точек
    const distanceX = Math.abs(toX - fromX);
    const distanceY = Math.abs(toY - fromY);
    const cpOffsetX = distanceX * CONTROL_POINT_RATIO;
    const cpOffsetY = distanceY * CONTROL_POINT_RATIO * 2;

    const cp1X = fromX + cpOffsetX;
    const cp1Y = fromY + (toY > fromY ? cpOffsetY : -cpOffsetY);
    const cp2X = toX - cpOffsetX;
    const cp2Y = toY - (toY > fromY ? cpOffsetY : -cpOffsetY);

    // Рисуем заполненный круг в начальной точке
    g.beginFill(hexToNumber(arrowStyle?.color) || 'black');
    g.lineStyle(1, hexToNumber(arrowStyle?.color) || 'black');
    g.drawCircle(fromX, fromY, START_CIRCLE_RADIUS);
    g.endFill();

    // Рисуем кривую Безье
    g.moveTo(fromX, fromY);
    g.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, toX, toY);

    // Рисуем стрелку
    const arrowAngle = Math.atan2(toY - cp2Y, toX - cp2X);
    const arrowX1 = toX - ARROW_HEAD_LENGTH * Math.cos(arrowAngle - Math.PI / 4);
    const arrowY1 = toY - ARROW_HEAD_LENGTH * Math.sin(arrowAngle - Math.PI / 4);
    const arrowX2 = toX - ARROW_HEAD_LENGTH * Math.cos(arrowAngle + Math.PI / 4);
    const arrowY2 = toY - ARROW_HEAD_LENGTH * Math.sin(arrowAngle + Math.PI / 4);

    g.moveTo(toX, toY);
    g.lineTo(arrowX1, arrowY1);
    g.moveTo(toX, toY);
    g.lineTo(arrowX2, arrowY2);
}
