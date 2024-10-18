/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import { TColumnKey } from 'Controls/gridReact';
import { TQuantumType } from '../shared/types';
import { NAVIGATION_LIMIT_FACTOR } from '../constants';
import { getColumnGapSize } from '../utils';
import { TOffsetSize } from 'Controls/interface';
import { date as formatter } from 'Types/formatter';
import { constants } from 'Env/Env';
import { DateTime } from 'Types/entity';

/* @TODO Все эти утилиты относятся к таймлайну */

/**
 * Функция считает сдвиг относительно начала периода.
 * Используется, например, для позиционирования линии текущего периода.
 * @param date {Date}
 * @param quantum {Controls-Lists/dynamicGrid/TQuantumType.typedef}
 */
export function getPositionInPeriod(date: Date, quantum: TQuantumType): number {
    switch (quantum) {
        case 'day':
            return calculateDayFraction(date);
        case 'month':
            return calculateMonthFraction(date);
        case 'hour':
            return calculateHourFraction(date);
        case 'minute':
            return calculateMinuteFraction(date);
        case 'second':
            return 1; // Миллисекунды пока не учитываем
    }
}

/**
 * Возвращает дату, скорректированную до первого момента времени в текущем кванте.
 * Используется для определения точной границы времени в текущем периоде.
 * @param date {Date}
 * @param quantum {Controls-Lists/dynamicGrid/TQuantumType.typedef}
 */
export function getStartDate(date: Date, quantum: TQuantumType): Date {
    switch (quantum) {
        case 'second':
        case 'minute':
            date.setSeconds(0, 0);
            break;
        case 'hour':
            date.setMinutes(0, 0, 0);
            break;
        case 'day':
            date.setHours(0, 0, 0, 0);
            break;
        case 'month':
            // 1 - первый день этого месяца, а 0 - последний день предыдущего месяца
            date.setDate(1);
            date.setHours(0, 0, 0, 0);
            break;
    }
    return date;
}

/**
 * Возвращает дату, скорректированную до последнего момента времени в текущем кванте.
 * Используется для определения точной границы времени в текущем периоде.
 * @param date {Date}
 * @param quantum {Controls-Lists/dynamicGrid/TQuantumType.typedef}
 */
export function getEndDate(date: Date, quantum: TQuantumType): Date {
    switch (quantum) {
        case 'second':
        case 'minute':
            date.setSeconds(59, 999);
            break;
        case 'hour':
            date.setMinutes(59, 59, 999);
            break;
        case 'day':
            date.setHours(23, 59, 59, 999);
            break;
        case 'month':
            date.setMonth(date.getMonth() + 1);
            date.setDate(0);
            date.setHours(23, 59, 59, 999);
            break;
    }
    return date;
}

/**
 * Возвращает долю прошедшего времени относительно дня.
 * @param date
 */
function calculateDayFraction(date: Date): number {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const totalMins = hours * 60 + minutes;
    const dayMins = 24 * 60;

    return totalMins / dayMins;
}

/**
 * Возвращает долю прошедшего времени относительно месяца.
 * @param date
 */
function calculateMonthFraction(date: Date): number {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const dayOfMonth = date.getDate();
    return dayOfMonth / daysInMonth;
}

/**
 * Возвращает долю прошедшего времени относительно часа.
 * @param date
 */
function calculateHourFraction(date: Date): number {
    const minutesInHour = 60;
    const minute = date.getMinutes();
    return minute / minutesInHour;
}

/**
 * Возвращает долю прошедшего времени относительно минуты.
 * @param date
 */
function calculateMinuteFraction(date: Date): number {
    const secondsInMinute = 60;
    const seconds = date.getSeconds();
    return seconds / secondsInMinute;
}

/**
 * Рассчитывает значение скролла для позиционирования при построении.
 * Позиционирование осуществляется проскролом по горизонтали 1/3 динамических колонок.
 * @param columnWidth
 * @param columnsCount
 * @param columnsSpacing
 */
export function getInitialColumnsScrollPosition(
    columnWidth: number,
    columnsCount: number,
    columnsSpacing: TOffsetSize
): number {
    const visibleColumnsCount = Math.trunc(columnsCount / NAVIGATION_LIMIT_FACTOR);
    const gapSize = getColumnGapSize(columnsSpacing);
    return columnWidth * visibleColumnsCount + gapSize * visibleColumnsCount;
}

/**
 * Формирует атрибут data-qa для динамической колонки.
 * @param element
 * @param data
 */
export function getDataQa(element: string, data: Date | TColumnKey) {
    let dataString = element + '_';
    if (constants.isServerSide) {
        const tzOffset: number = DateTime.getClientTimezoneOffset();
        dataString +=
            data instanceof Date ? formatter(data, 'YYYY-MM-DD HH:mm', tzOffset) : '' + data;
    } else {
        dataString += data instanceof Date ? formatter(data, 'YYYY-MM-DD HH:mm') : '' + data;
    }
    return dataString;
}

/**
 * Корректировка даты под клиентский часовой пояс при построении на сервере.
 * Используется для синхронизации отображения дат.
 * @param date
 */
export function correctServerSideDateForRender(date: Date): Date {
    if (constants.isServerSide) {
        const tzOffset: number = DateTime.getClientTimezoneOffset();
        return new Date(formatter(date, 'YYYY.MM.DD HH:mm:ss', tzOffset));
    }
    return date;
}

/**
 * Утилиты для рендеринга таблицы с динамически генерируемыми колонками
 * @class Controls-Lists/_dynamicGrid/render/utils/RenderUtils
 * @public
 */
const RenderUtils = {
    /**
     * Функция считает сдвиг относительно начала периода.
     * Используется, например, для позиционирования линии текущего периода.
     * @function Controls-Lists/_dynamicGrid/render/utils/RenderUtils#getPositionInPeriod
     * @param date
     * @param quantum
     */
    getPositionInPeriod,

    /**
     * Возвращает дату, скорректированную до последнего момента времени в текущем кванте.
     * Используется для определения точной границы времени в текущем периоде.
     * @function Controls-Lists/_dynamicGrid/render/utils/RenderUtils#getStartDate
     * @param date {Date}
     * @param quantum {Controls-Lists/dynamicGrid/TQuantumType.typedef}
     */
    getStartDate,
    /**
     * Возвращает дату, скорректированную до последнего момента времени в текущем кванте.
     * Используется для определения точной границы времени в текущем периоде.
     * @function Controls-Lists/_dynamicGrid/render/utils/RenderUtils#getEndDate
     * @param date {Date}
     * @param quantum {Controls-Lists/dynamicGrid/TQuantumType.typedef}
     */
    getEndDate,
    /**
     * Рассчитывает значение скролла для позиционирования при построении.
     * Позиционирование осуществляется проскролом по горизонтали 1/3 динамических колонок.
     * @function Controls-Lists/_dynamicGrid/render/utils/RenderUtils#getInitialColumnsScrollPosition
     * @param columnWidth
     * @param columnsCount
     * @param columnsSpacing
     */
    getInitialColumnsScrollPosition,
    /**
     * Формирует атрибут data-qa для динамической колонки.
     * @function Controls-Lists/_dynamicGrid/render/utils/RenderUtils#getDataQa
     * @param element
     * @param data
     */
    getDataQa,

    /**
     * Корректировка даты под клиентский часовой пояс при построении на сервере.
     * Используется для синхронизации отображения дат.
     * @function Controls-Lists/_dynamicGrid/render/utils/RenderUtils#correctServerSideDateForRender
     * @param date
     */
    correctServerSideDateForRender,
};

export { RenderUtils };
