/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import { NAVIGATION_LIMIT_FACTOR } from 'Controls-Lists/dynamicGrid';
import { Quantum, shiftDate, ICustomRange } from 'Controls-Lists/_timelineGrid/utils';
import { IRange } from './ITimelineGridDataFactoryArguments';

/**
 * Интерфейс параметров для генератора динамических колонок таймлайн таблицы
 */
interface IDynamicColumnsGridDataGenerator {
    /**
     * Текущий квант динамических данных
     */
    quantum: Quantum;
    /**
     * Количество загружаемых данных горизонтальной навигации
     */
    limit: number;
    /**
     * Позиция горизонтальной навигации
     */
    position: Date;
    customRanges?: ICustomRange[];
}

interface ILimitedDynamicColumnsGridDataGenerator extends IDynamicColumnsGridDataGenerator {
    /**
     * Ограничение на период.
     */
    rangeLimit: IRange;
}

/**
 * Функция генерирует массив дат для динамических ячеек таймлайн таблицы.
 */
export function generateDynamicColumnsData(params: IDynamicColumnsGridDataGenerator): Date[] {
    const { position, limit, quantum, customRanges } = params;
    const dynamicColumnsGridData = [];
    const dynamicColumnsGridDataCount = limit * NAVIGATION_LIMIT_FACTOR;
    const currentPosition = new Date(position as unknown as Date);

    if (customRanges && quantum === 'hour') {
        for (let i = 0; i < customRanges.length; i++) {
            if (currentPosition.getHours() <= customRanges[i].start) {
                currentPosition.setHours(customRanges[i].start);
                break;
            }
        }
    }

    // Данные мы теперь запрашиваем только для видимого периода. Колонки, при этом, нужно генерировать на +- период.
    shiftDate(currentPosition, 'backward', quantum, limit, customRanges);

    for (let column = 0; column < dynamicColumnsGridDataCount; column++) {
        dynamicColumnsGridData.push(new Date(currentPosition));
        shiftDate(currentPosition, 'forward', quantum, 1, customRanges);
    }

    return dynamicColumnsGridData;
}

export function generateLimitedDynamicColumnsData(
    params: ILimitedDynamicColumnsGridDataGenerator
): Date[] {
    const { position, limit, quantum, rangeLimit, customRanges } = params;
    const dynamicColumnsGridData = [];
    const dynamicColumnsGridDataCount = limit * NAVIGATION_LIMIT_FACTOR;
    let currentPosition = new Date(position as unknown as Date);

    // Данные мы теперь запрашиваем только для видимого периода. Колонки, при этом, нужно генерировать на +- период.
    shiftDate(currentPosition, 'backward', quantum, limit, customRanges);

    let hoursStart;
    if (quantum === 'hour' && customRanges) {
        hoursStart = customRanges.map((customRange) => {
            return customRange.start;
        });
    }

    if (rangeLimit.start) {
        if (currentPosition.getTime() < rangeLimit.start.getTime()) {
            currentPosition = new Date(rangeLimit.start);
            if (hoursStart) {
                const hour = hoursStart.find((start) => {
                    return start >= rangeLimit.start.getHours();
                });
                if (hour) {
                    currentPosition.setHours(hour);
                }
            }
        }
    }

    for (let column = 0; column < dynamicColumnsGridDataCount; column++) {
        dynamicColumnsGridData.push(new Date(currentPosition));
        shiftDate(currentPosition, 'forward', quantum, 1, customRanges);
        if (rangeLimit.end) {
            if (currentPosition.getTime() > rangeLimit.end.getTime()) {
                break;
            }
        }
    }

    return dynamicColumnsGridData;
}
