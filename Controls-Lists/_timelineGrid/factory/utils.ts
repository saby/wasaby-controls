import { adapter as EntityAdapter, format as EntityFormat, Record } from 'Types/entity';

import { Utils as DynamicGridUtils } from 'Controls-Lists/dynamicGrid';
import { TNavigationDirection } from 'Controls/interface';
import {
    IQuantumScaleFilter,
    IRange,
    ITimelineColumnsFilter,
} from './ITimelineGridDataFactoryArguments';
import {
    correctDateFromClientToServer,
    correctDateFromServerToClient,
    getQuantum,
    getRangeSize,
    IQuantum,
    isQuantumLessThanDay,
    Quantum,
    shiftDate,
    ICustomRange,
} from 'Controls-Lists/_timelineGrid/utils';
import { TQuantsReplacementMap } from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';
import {
    MINUTES_IN_HALF_HOUR,
    MINUTES_IN_QUARTER_HOUR,
} from 'Controls-Lists/_timelineGrid/constants';

export function prepareDynamicColumnsFilterRecord<
    TPositionFieldFormat extends EntityFormat.DateTimeField,
    TPosition = Date,
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

/**
 * Конвертирует Полчаса и 15Минут в минуты с коэффициентом scale
 * Используется для корректной отправки значений на БЛ
 * @param quantum
 */
export function convertQuantumForFilter(quantum: Quantum): IQuantumScaleFilter {
    if (quantum === Quantum.HalfHour) {
        return {
            quantum: Quantum.Minute,
            scale: MINUTES_IN_HALF_HOUR,
        };
    } else if (quantum === Quantum.QuarterHour) {
        return {
            quantum: Quantum.Minute,
            scale: MINUTES_IN_QUARTER_HOUR,
        };
    }
    return {
        quantum,
        scale: 1,
    };
}

/**
 * Конвертирует минуты с коэффициентом scale в Полчаса и 15Минут
 * Используется для отрисовки значений, заданных на БЛ
 * @param quantum
 */
export function convertQuantumFromFilter(quantumScale: IQuantumScaleFilter): Quantum {
    if (quantumScale.quantum === Quantum.Minute) {
        if (quantumScale.scale === MINUTES_IN_HALF_HOUR) {
            return Quantum.HalfHour;
        } else if (quantumScale.scale === MINUTES_IN_QUARTER_HOUR) {
            return Quantum.QuarterHour;
        }
    }
    return quantumScale.quantum;
}

export interface IPrepareTimelineDynamicColumnsFilter {
    range: IRange;
    direction: TNavigationDirection;
    startPositionToForward?: TPosition;
    startPositionToBackward?: TPosition;
    quantsReplacementMap?: TQuantsReplacementMap;
    customRanges?: ICustomRange[];
}

export function prepareTimelineDynamicColumnsFilter<TPosition = Date>({
    range,
    direction,
    startPositionToForward,
    startPositionToBackward,
    quantsReplacementMap,
    customRanges,
}: IPrepareTimelineDynamicColumnsFilter): ITimelineColumnsFilter<TPosition> {
    const quantum = getQuantum(range, quantsReplacementMap);
    const limit = getRangeSize(range, quantum, customRanges);
    let resultDirection = direction;

    let position: Date;
    if (direction === 'forward') {
        position = new Date(startPositionToForward as unknown as Date);
        shiftDate(position, 'forward', quantum, 1, customRanges);
    } else if (direction === 'backward') {
        position = new Date(startPositionToBackward as unknown as Date);
        shiftDate(position, 'backward', quantum, 1, customRanges);
    } else {
        position = new Date(range.start);
        resultDirection = 'forward';
    }

    return {
        direction: resultDirection,
        position: position as unknown as TPosition,
        limit,
        ...convertQuantumForFilter(quantum),
        customRanges,
    };
}

/*
 * Возвращает карту подмены кванта. Например, можно подменить квант "Час" на квант "Полчаса".
 * Тогда при переходе из дней в глубину будет по умолчанию показываться 30 минут,
 * но с возможностью вернуться к часам при помощи кнопок масштабирования.
 * Функция используется при инициализации фабрики, когда в сервис истории ещё не было сохранено предыдущее значение.
 * @param quants
 */
export function getQuantsReplacementMap(quants?: IQuantum[]): TQuantsReplacementMap {
    const quantsReplacementMap = {} as TQuantsReplacementMap;
    if (quants) {
        // TODO когда будет Quantum.Week, поправить тут условие
        const isPresentQuantumLessThanDay = quants.some((quantum) => {
            return isQuantumLessThanDay(quantum.name);
        });
        if (isPresentQuantumLessThanDay) {
            const quantsReversed = [...quants].reverse();
            const dayQuantumIndex = quantsReversed.findIndex(
                (quantum) => quantum.name === Quantum.Day
            );
            const quantsAfterDay = quantsReversed.slice(dayQuantumIndex + 1);
            const nextDefaultQuantum =
                quantsAfterDay.find((quantum) => quantum.default) || quantsAfterDay[0];
            quantsReplacementMap[Quantum.Hour] = nextDefaultQuantum?.name || Quantum.Hour;
        }
    }
    return quantsReplacementMap;
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
    prepareDynamicColumnsFilter: prepareTimelineDynamicColumnsFilter,
    prepareDynamicColumnsFilterRecord,
};

export { FactoryUtils };
