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
import { constants } from 'Env/Env';
import { DateTime } from 'Types/entity';

/**
 * Варианты значений для насыщенности событий
 * @typedef {String} Controls-Lists/timelineGrid/TEventSaturation
 * @variant max Максимальная насыщенность
 * @variant mid Средняя насыщенность
 * @variant min Минимальная насыщенность
 */
export type TEventSaturation = 'max' | 'mid' | 'min';

/**
 * Варианты значений кванта динамических данных в "Таймлайн таблице".
 * @typedef {String} Controls-Lists/timelineGrid/Quantum
 * @variant hour час
 * @variant day день
 * @variant month месяц
 * @variant second В ячейках отображаются секунды
 * @variant minute В ячейках отображаются минуты
 * @variant hour В ячейках отображаются часы
 * @variant day В ячейках отображаются дни
 * @variant month В ячейках отображаются месяцы
 */

export enum Quantum {
    Second = 'second',
    Minute = 'minute',
    Hour = 'hour',
    Day = 'day',
    Month = 'month',
}

/**
 * Возвращает следующий шаг сетки для заданного кванта.
 * @param {Controls-Lists/_timelineGrid/utils/Quantum.typedef} quantum Квант, для которого производятся расчёты.
 * @param {Array.<Controls-Lists/_timelineGrid/utils/IQuantum>} quantums Конфигурация для квантов.
 * @param {Number} scale Ткущий Текущий шаг отрисовки.
 * @param {Controls-Lists/_timelineGrid/utils/TScale.typedef} scaleDirection Направление масштабирования
 */
export function getNextQuantumScale(
    quantum: Quantum,
    quantums: IQuantum[],
    scale: number,
    scaleDirection: TScaleDirection
): number {
    const steps = extractQuantumScaleValues(quantum, quantums);
    if (scaleDirection === 'increase' && steps.length > 1) {
        steps.unshift(1);
    }
    const stepIndex = steps.indexOf(scale);
    if (stepIndex === -1) {
        return;
    }
    return steps[stepIndex + (scaleDirection === 'increase' ? 1 : -1)];
}

/**
 * Возвращает следующий квант по напралению scaleDirection
 * @param quantum
 * @param quantums
 * @param scaleDirection
 */
export function getNextQuantum(
    quantum: Quantum,
    quantums: IQuantum[],
    scaleDirection: TScaleDirection
): Quantum | undefined {
    const allQuantumsStack = Object.values(Quantum).reverse();
    const availableQuantums = allQuantumsStack.filter((q1) => {
        return (
            quantums.findIndex((q2) => {
                return q2.name === q1;
            }) !== -1
        );
    });
    const quantumIndex = availableQuantums.indexOf(quantum);
    if (quantumIndex === -1) {
        return;
    }
    return availableQuantums[quantumIndex + (scaleDirection === 'increase' ? 1 : -1)] as Quantum;
}

/**
 * Возвращает массив доступных вариантов масштаба для кванта.
 * Значения автоматически сортируются в порядке убывания для корректности работы кнопок зума
 * @param quantum
 * @param quantums Конфигурация для квантов.
 */
export function extractQuantumScaleValues(quantum: Quantum, quantums?: IQuantum[]): number[] {
    const extractedQuantum = extractQuantum(quantum, quantums);
    return extractedQuantum?.scales
        ? extractedQuantum.scales.slice().sort((a, b) => {
              return b - a;
          })
        : [];
}

export function extractQuantum(quantum: Quantum, quantums?: IQuantum[]): IQuantum | null {
    const index = quantums?.findIndex((q) => {
        return q.name === quantum;
    });
    if (index === undefined || index === -1) {
        return null;
    }
    return quantums[index];
}

/**
 * Описание кванта.
 * @interface Controls-Lists/_timelineGrid/utils/IQuantum
 * @public
 * @demo Controls-Lists-demo/timelineGrid/WI/Scale/Index
 * @see https://n.sbis.ru/article/19a7fea9-d700-4bf4-9193-5e739cca9fe9?a#toc_0c675c10-beb8-48a1-981b-e88d508f2d75 Настройка доступных квантов и масштабирования
 */
export interface IQuantum {
    /**
     * Название кванта
     */
    name: Quantum;
    /**
     * Доступные масштабы для отображения.
     * @see Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments#rangeHistoryId
     * @example
     * <pre brush>
     *     {
     *         name: Quantum.Minute,
     *         scales: [30, 15],
     *     },
     * </pre>
     */
    scales?: number[];
    /**
     * Масштаб, выбранный при первоначальной загрузке.
     * При первом рендере Таймлайн таблицы запоминается в историю и в дальнейшем читается из истории.
     * @default 1
     * @see Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments#rangeHistoryId
     * @example
     * При конфигурации, приведённой ниже часы по умолчанию бьются по 30 МИНУТ.
     * <pre brush>
     *     {
     *         name: Quantum.Minute,
     *         scales: [30, 15],
     *         selectedScale: 30,
     *     },
     * </pre>
     */
    selectedScale?: number;
}

/**
 * Тип для конфигурации минимальных ширин колонок в соответствие квантам времени.
 * В качестве ключей принимает строковые названия размера квантов из {@link Controls-Lists/timelineGrid/Quantum.typedef Controls-Lists/timelineGrid:Quantum}
 * Строковые значения задаются в пикселях.
 * @example
 * <pre class="brush: js">
 *     const dynamicColumnMinWidths = {
 *         day: '35px',
 *         month: '35px',
 *         hour: '100px',
 *     };
 *
 *    return <TimelineGridConnectedComponent storeId="EmployeeList"
 *                                           viewportWidth={workspaceWidth}
 *                                           dynamicColumnMinWidths={dynamicColumnMinWidths}>;
 * </pre>
 * @typedef {Record<Controls-Lists/timelineGrid/Quantum.typedef, string>} Controls-Lists/_timelineGrid/utils/TDynamicColumnMinWidths
 */
export type TDynamicColumnMinWidths = Record<Quantum, string>;

/**
 * Варианты направления масштабирования.
 * @typedef {String} Controls-Lists/_timelineGrid/utils/TScaleDirection
 * @variant increase Более детальное отображение
 * @variant decrease Менее детальное отображение
 */
export type TScaleDirection = 'increase' | 'decrease';

/**
 * Возвращает квант таймлайна по переданному диапазону дат.
 * @param {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange} range Отображаемый на таймлайне диапазон дат
 * @param quantums
 * @param quantumScale
 * @returns {Controls-Lists/timelineGrid/Quantum.typedef}
 */
export function getQuantum(
    range: IRange,
    quantums?: IQuantum[],
    quantumScale: number = 1
): Quantum {
    let start = range.start;
    let end = range.end;
    if (constants.isServerSide) {
        start = correctDateFromClientToServer(start);
        end = correctDateFromClientToServer(end);
    }
    const hoursCount = BaseDateUtils.getHoursByRange(start, end);
    // Должно быть строгое сравнение, т.к. если выбрать 2 дня, то будет 24 часа, но квант должен быть день.
    // 24 часа, т.к. в датах время 00:00 всегда.
    if (hoursCount < HOURS_COUNT) {
        // Проверяем, не нужно ли из-за скейла побить часы на минуты
        const scaleValues = extractQuantumScaleValues(Quantum.Minute, quantums);
        if (quantumScale !== 1 && scaleValues.indexOf(quantumScale) !== -1) {
            return Quantum.Minute;
        }
        return Quantum.Hour;
    }

    const rangeSize = BaseDateUtils.getDaysByRange(start, end);
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
    let start = range.start;
    let end = range.end;
    if (constants.isServerSide) {
        start = correctDateFromClientToServer(start);
        end = correctDateFromClientToServer(end);
    }
    switch (quantum) {
        case Quantum.Minute:
        case Quantum.Second:
        case Quantum.Hour:
            return HOUR_QUANTUM_PAGE_SIZE;
        case Quantum.Day:
            return RangeUtils.getPeriodLengthInDays(start, end);
        case Quantum.Month:
            return RangeUtils.getPeriodLengthInMonths(start, end);
    }
}

const MSK = -180;

/**
 * Корректировка даты под часовой пояс МСК, чтобы сформировать запрос с правильной датой.
 * На клиенте выбрали дату (01.12.2023 00:00 +5 GMT). По МСК это (30.11.2023 22:00 +3 GMT).
 * Запрос следует делать по дате (01.12.2023 00:00 +3 GMT),
 * чтобы данные вернули именно за 1 декабря, а не 30 ноября.
 * @param date
 */
export function correctDateFromClientToServer(date: Date): Date {
    const tzOffset: number = DateTime.getClientTimezoneOffset() - MSK;
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() - tzOffset);
    return newDate;
}

/**
 * Переводим дату, скорректированную под МСК обратно под клиентский ЧП
 * @param date
 */
export function correctDateFromServerToClient(date: Date): Date {
    const tzOffset: number = DateTime.getClientTimezoneOffset() - MSK;
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + tzOffset);
    return newDate;
}

/*
 * Возвращает насыщенность событий по переданному дапазону
 * @param {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange} range Отображаемый на таймлайне диапазон дат
 * @param quantums
 * @param quantumScale
 * @returns {Controls-Lists/_timelineGrid/utils/Utils/TEventSaturation.typedef}
 */
export function getEventsSaturation(
    range: IRange,
    quantums?: IQuantum[],
    quantumScale: number = 1
): TEventSaturation {
    const quantum = getQuantum(range, quantums, quantumScale);
    const rangeSize = getRangeSize(range, quantum);
    return quantum === 'second' ||
        quantum === 'minute' ||
        quantum === 'hour' ||
        (quantum === 'day' && rangeSize <= 14)
        ? 'max'
        : quantum === 'day'
        ? 'mid'
        : 'min';
}

/*
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
        case Quantum.Second:
            date.setSeconds(date.getSeconds() + shiftSize);
            break;
        case Quantum.Minute:
            date.setMinutes(date.getMinutes() + shiftSize);
            break;
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
