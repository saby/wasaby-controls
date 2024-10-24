/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import { NAVIGATION_LIMIT_FACTOR } from 'Controls-Lists/dynamicGrid';
import { Quantum, shiftDate } from 'Controls-Lists/_timelineGrid/utils';
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
    /**
     * Масштаб ячеек таймлайна
     */
    scale: number;
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
    const { position, limit, quantum, scale = 1 } = params;
    const dynamicColumnsGridData = [];
    const dynamicColumnsGridDataCount = limit * NAVIGATION_LIMIT_FACTOR;
    const currentPosition = new Date(position as unknown as Date);

    // Данные мы теперь запрашиваем только для видимого периода. Колонки, при этом, нужно генерировать на +- период.
    shiftDate(currentPosition, 'backward', quantum, limit * scale);

    for (let column = 0; column < dynamicColumnsGridDataCount; column++) {
        dynamicColumnsGridData.push(new Date(currentPosition));
        shiftDate(currentPosition, 'forward', quantum, scale);
    }

    return dynamicColumnsGridData;
}

export function generateLimitedDynamicColumnsData(
    params: ILimitedDynamicColumnsGridDataGenerator
): Date[] {
    const { position, limit, quantum, scale = 1, rangeLimit } = params;
    const dynamicColumnsGridData = [];
    const dynamicColumnsGridDataCount = limit * NAVIGATION_LIMIT_FACTOR;
    let currentPosition = new Date(position as unknown as Date);

    // Данные мы теперь запрашиваем только для видимого периода. Колонки, при этом, нужно генерировать на +- период.
    shiftDate(currentPosition, 'backward', quantum, limit * scale);

    if (rangeLimit.start) {
        if (currentPosition.getTime() < rangeLimit.start.getTime()) {
            currentPosition = new Date(rangeLimit.start);
        }
    }

    for (let column = 0; column < dynamicColumnsGridDataCount; column++) {
        dynamicColumnsGridData.push(new Date(currentPosition));
        shiftDate(currentPosition, 'forward', quantum, scale);
        if (rangeLimit.end) {
            if (currentPosition.getTime() > rangeLimit.end.getTime()) {
                break;
            }
        }
    }

    return dynamicColumnsGridData;
}
