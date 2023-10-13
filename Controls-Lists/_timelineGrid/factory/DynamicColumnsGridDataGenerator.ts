import { ITimelineColumnsFilter } from './ITimelineGridFactory';
import { NAVIGATION_LIMIT_FACTOR } from 'Controls-Lists/dynamicGrid';
import { shiftDate } from 'Controls-Lists/_timelineGrid/utils';

export function generateDynamicColumnsData<TPosition = Date>(
    dynamicColumnsFilter: ITimelineColumnsFilter<TPosition>
) {
    const { position, direction, limit, quantum } = dynamicColumnsFilter;
    const dynamicColumnsGridData = [];
    const currentPosition = new Date(position as unknown as Date);

    if (direction === 'bothways') {
        // Т.к. мы запрашиваем данные с запасом в обе стороны, то данные нужно генерировать начиная с первой позиции
        shiftDate(currentPosition, 'backward', quantum, limit / NAVIGATION_LIMIT_FACTOR);
    }

    for (let column = 0; column < limit; column++) {
        dynamicColumnsGridData.push(new Date(currentPosition));
        shiftDate(currentPosition, 'forward', quantum);
    }

    return dynamicColumnsGridData;
}
