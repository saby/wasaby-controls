import { Base as BaseDateUtils, Range as RangeUtils } from 'Controls/dateUtils';
import { TNavigationDirection } from 'Controls/interface';
import { Logger } from 'UICommon/Utils';

import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments';
import {
    END_DAY_HOUR,
    START_DAY_HOUR,
    HOUR_QUANTUM_PAGE_SIZE,
    DAYS_COUNT_LIMIT,
    HOURS_COUNT,
} from 'Controls-Lists/_timelineGrid/constants';

/**
 * Варианты значений для насыщенности событий
 * @typedef {String} Controls-Lists/timelineGrid/TEventSaturation
 * @variant max Максимальная насыщенность
 * @variant mid Средняя насыщенность
 * @variant min Минимальная насыщенность
 */
export type TEventSaturation = 'max' | 'mid' | 'min';

/**
 * Варианты значений кванта для формирования сетки в "Таймлайн таблице".
 * @typedef {String} Controls-Lists/timelineGrid/Quantum
 * @variant hour час
 * @variant day день
 * @variant month месяц
 */
export enum Quantum {
    Hour = 'hour',
    Day = 'day',
    Month = 'month',
}

/**
 * Список квантов для ограничения работы "Таймлайн таблицы"
 * @typedef {Array<Controls-Lists/timelineGrid/Quantum.typedef>} Controls-Lists/_timelineGrid/utils/TAvailableQuantums
 */
export type TAvailableQuantums = Quantum[];

/**
 * Тип для конфигурации минимальных ширин колонок в соответствие квантам времени.
 * В качестве ключей принимает строковые названия размера квантов из {@link Controls-Lists/timelineGrid/Quantum.typedef Controls-Lists/timelineGrid:Quantum}
 * Строковые значения задаются в пикселях.
 * @example
 * <pre class="brush: js">
 * dataFactoryArguments: {
 *     dynamicColumnMinWidths: {
 *         day: '35px',
 *         month: '35px',
 *         hour: '100px',
 *     },
 * }
 * </pre>
 * @typedef {Record<Controls-Lists/timelineGrid/Quantum.typedef, string>} Controls-Lists/_timelineGrid/utils/TDynamicColumnMinWidths
 */
export type TDynamicColumnMinWidths = Record<Quantum, string>;

/**
 * Возвращает квант таймлайна по переданному диапазону дат.
 * @param {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange} range Отображаемый на таймлайне диапазон дат
 * @returns {Controls-Lists/timelineGrid/Quantum.typedef}
 */
export function getQuantum(range: IRange): Quantum {
    const hoursCount = BaseDateUtils.getHoursByRange(range.start, range.end);
    // Должно быть строгое сравнение, т.к. если выбрать 2 дня, то будет 24 часа, но квант должен быть день.
    // 24 часа, т.к. в датах время 00:00 всегда.
    if (hoursCount < HOURS_COUNT) {
        return Quantum.Hour;
    }

    const rangeSize = BaseDateUtils.getDaysByRange(range.start, range.end);
    if (rangeSize <= DAYS_COUNT_LIMIT) {
        return Quantum.Day;
    }

    return Quantum.Month;
}

/**
 * Возвращает размер диапазона (число колонок) по переданному дмапазону и кванту таймлайна.
 * В зависимости от кванта меняется единица измерения размера диапазона.
 * @param {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange} range Отображаемый на таймлайне диапазон дат
 * @param quantum {Controls-Lists/timelineGrid/Quantum.typedef}
 */
export function getRangeSize(range: IRange, quantum: Quantum): number {
    switch (quantum) {
        case Quantum.Hour:
            return HOUR_QUANTUM_PAGE_SIZE;
        case Quantum.Day:
            return RangeUtils.getPeriodLengthInDays(range.start, range.end);
        case Quantum.Month:
            return RangeUtils.getPeriodLengthInMonths(range.start, range.end);
    }
}

/**
 * Возвращает насыщенность событий по переданному дапазону
 * @param {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange} range Отображаемый на таймлайне диапазон дат
 * @returns {Controls-Lists/_timelineGrid/utils/Utils/TEventSaturation.typedef}
 */
export function getEventsSaturation(range: IRange): TEventSaturation {
    const quantum = getQuantum(range);
    const rangeSize = getRangeSize(range, quantum);
    return quantum === 'hour' || (quantum === 'day' && rangeSize <= 14)
        ? 'max'
        : quantum === 'day'
        ? 'mid'
        : 'min';
}

/**
 * Изменяет по ссылке переданную дату, добавляя или убавляя часы, дни, месяцы в зависимости от направления, кванта и коэффициента смещения
 * @param {Date} date Дата для изменения
 * @param {String} direction Направление смещения, forwards - добавляет, backwards - убавляет
 * @param {Controls-Lists/timelineGrid/Quantum.typedef} quantum Квант, для которого производятся расчёты. Если передан квант 'day', то происходит смещение дней, если 'month' - смещение месяца. При кванте 'hour' могут изменяться дни и часы.
 * @param {Number} shiftFactor Коэффициент смещения. По умолчанию имеет значение 1.
 */
export function shiftDate(
    date: Date,
    direction: Exclude<TNavigationDirection, 'bothways'>,
    quantum: Quantum,
    shiftFactor: number = 1
): Date {
    const shiftSize = (direction === 'backward' ? -1 : 1) * shiftFactor;
    switch (quantum) {
        case Quantum.Hour:
            // Находясь в начале дня, нажали стрелку назад -> Показываем прошлый день с Min(начало активности, 0 часов).
            if (date.getHours() === START_DAY_HOUR && shiftSize < 0) {
                date.setDate(date.getDate() - 1);
                date.setHours(END_DAY_HOUR + 1);
            }
            // Находясь в конце дня, нажали стрелку вперед -> Показываем следующий день с Min(начало активности, 0 часов).
            else if (date.getHours() === END_DAY_HOUR && shiftSize > 0) {
                date.setDate(date.getDate() + 1);
                date.setHours(START_DAY_HOUR - 1);
            }

            date.setHours(date.getHours() + shiftSize);

            // Если сместили на 12 часов с начала дня, то нужно сдвинуться на начало следующего дня
            if (date.getHours() === END_DAY_HOUR + 1) {
                date.setDate(date.getDate() + 1);
                date.setHours(START_DAY_HOUR);
            }

            if (date.getHours() < START_DAY_HOUR || date.getHours() > END_DAY_HOUR) {
                Logger.error(
                    `Wrong hours in date. Should be time ${START_DAY_HOUR}:00-${
                        END_DAY_HOUR + 1
                    }:00.`
                );
            }
            break;
        case Quantum.Day:
            date.setDate(date.getDate() + shiftSize);
            break;
        case Quantum.Month:
            date.setMonth(date.getMonth() + shiftSize);
            break;
    }
    return date;
}

/**
 * Утилиты для работы с таймлайн таблицей
 * @class Controls-Lists/_timelineGrid/utils/Utils
 * @public
 */
const Utils = {
    /**
     * Возвращает квант таймлайна по переданному диапазону дат.
     * @function Controls-Lists/_timelineGrid/utils/Utils#getQuantum
     * @param {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange} range Отображаемый на таймлайне диапазон дат
     */
    getQuantum,
    /**
     * Изменяет по ссылке переданную дату, добавляя или убавляя часы, дни, месяцы в зависимости от направления, кванта и коэффициента смещения
     * @function Controls-Lists/_timelineGrid/utils/Utils#shiftDate
     * @param {Date} date Дата для изменения
     * @param {String} direction Направление смещения, forwards - добавляет, backwards - убавляет
     * @param {Controls-Lists/timelineGrid/Quantum.typedef} quantum Квант, для которого производятся расчёты. Если передан квант 'day', то происходит смещение дней, если 'month' - смещение месяца. При кванте 'hour' могут изменяться дни и часы.
     * @param {Number} shiftFactor Коэффициент смещения. По умолчанию имеет значение 1.
     * @returns {Date} Date
     */
    shiftDate,
    /**
     * Возвращает насыщенность событий по переданному дапазону
     * @function Controls-Lists/_timelineGrid/utils/Utils#getEventsSaturation
     * @param {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange} range Отображаемый на таймлайне диапазон дат
     */
    getEventsSaturation,
};

export { Utils };
