import { adapter as EntityAdapter, DateTime, format as EntityFormat, Record } from 'Types/entity';

import { Utils as DynamicGridUtils } from 'Controls-Lists/dynamicGrid';
import { TNavigationDirection } from 'Controls/interface';
import { IRange, ITimelineColumnsFilter } from './ITimelineGridDataFactoryArguments';
import {
    getQuantum,
    getRangeSize,
    shiftDate,
    IQuantum,
    Quantum,
    correctDateFromClientToServer,
    correctDateFromServerToClient,
} from 'Controls-Lists/_timelineGrid/utils';
import { TQuantumScaleMap } from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';

export interface IPrepareDynamicColumnsFilter {
    columnsNavigation: ITimelineColumnsFilter;
    actualPosition?: unknown;
    actualDirection?: TNavigationDirection;
}

export function prepareDynamicColumnsFilterRecord<
    TPositionFieldFormat extends EntityFormat.DateTimeField,
    TPosition = Date
>(
    dynamicColumnsFilter: ITimelineColumnsFilter<TPosition>,
    adapter: EntityAdapter.IAdapter,
    positionFieldFormat: new (props: unknown) => TPositionFieldFormat
): Record {
    const correctedFilter = { ...dynamicColumnsFilter };
    correctedFilter.position = correctDateFromClientToServer(correctedFilter.position);
    const result = DynamicGridUtils.prepareDynamicColumnsFilterRecord(
        correctedFilter,
        adapter,
        positionFieldFormat
    );

    result.addField(
        new EntityFormat.StringField({ name: 'quantum' }),
        null,
        dynamicColumnsFilter.quantum
    );

    result.addField(
        new EntityFormat.StringField({ name: 'scale' }),
        null,
        dynamicColumnsFilter.scale
    );

    return result;
}

export function prepareDynamicColumnsFilter<TPosition = Date>(
    range: IRange,
    direction: TNavigationDirection,
    startPositionToForward?: TPosition,
    startPositionToBackward?: TPosition,
    quantums?: IQuantum[],
    quantumScale: number = 1
): ITimelineColumnsFilter<TPosition> {
    const quantum = getQuantum(range, quantums, quantumScale);
    const limit = getRangeSize(range, quantum);
    let resultDirection = direction;

    let position: Date;
    if (direction === 'forward') {
        position = new Date(startPositionToForward as unknown as Date);
        shiftDate(position, 'forward', quantum, quantumScale);
    } else if (direction === 'backward') {
        position = new Date(startPositionToBackward as unknown as Date);
        shiftDate(position, 'backward', quantum, quantumScale);
    } else {
        position = new Date(range.start);
        resultDirection = 'forward';
    }

    return {
        direction: resultDirection,
        position: position as unknown as TPosition,
        limit,
        quantum,
        scale: quantumScale,
    };
}

/*
 * Возвращает соответствие кванта и его масштаба.
 * Функция используется при инициализации фабрики, когда в сервис истории ещё не было сохранено предыдущее значение.
 * @param quantums
 */
export function getQuantumScaleMap(quantums?: IQuantum[]): TQuantumScaleMap {
    if (!quantums) {
        return {} as TQuantumScaleMap;
    }
    return quantums.reduce((acc, q) => {
        if (q.selectedScale) {
            acc[q.name] = q.selectedScale;
        }
        return acc;
    }, {} as TQuantumScaleMap);
}

/*
 * Функция для коректировки даты при уменьшении масштаба.
 * @param date
 * @param quantum
 * @param quantumScale
 */
export function resetDateToStart(date: Date, quantum: Quantum, quantumScale: number): Date {
    if (quantum === 'second' || (quantum === 'minute' && quantumScale === 1)) {
        date.setSeconds(0, 0);
    } else if (quantum === 'minute' || (quantum === 'hour' && quantumScale === 1)) {
        date.setMinutes(0, 0, 0);
    } else if (quantum === 'hour' || (quantum === 'day' && quantumScale === 1)) {
        date.setHours(0, 0, 0, 0);
    } else if (quantum === 'day' || (quantum === 'month' && quantumScale === 1)) {
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
    } else if (quantum === 'month') {
        date.setMonth(0);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
    }
    return date;
}

/**
 * Утилиты для работы с фабрикой данных таймлайн таблицей
 * @class Controls-Lists/_timelineGrid/factory/utils/FactoryUtils
 * @public
 */
const FactoryUtils = {
    /**
     * Корректировка даты под часовой пояс МСК, чтобы сформировать запрос с правильной датой.
     * На клиенте выбрали дату (01.12.2023 00:00 +5 GMT). По МСК это (30.11.2023 22:00 +3 GMT).
     * Запрос следует делать по дате (01.12.2023 00:00 +3 GMT),
     * чтобы данные вернули именно за 1 декабря, а не 30 ноября.
     * @param date
     */
    correctDateFromClientToServer,
    /**
     * Переводим дату, скорректированную под МСК обратно под клиентский ЧП
     * @param date
     */
    correctDateFromServerToClient,
    prepareDynamicColumnsFilter,
    prepareDynamicColumnsFilterRecord,
};

export { FactoryUtils };
