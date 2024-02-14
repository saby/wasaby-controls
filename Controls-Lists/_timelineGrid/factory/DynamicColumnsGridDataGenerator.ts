import { ITimelineColumnsFilter } from './ITimelineGridFactory';
import { NAVIGATION_LIMIT_FACTOR } from 'Controls-Lists/dynamicGrid';
import { shiftDate } from 'Controls-Lists/_timelineGrid/utils';

export function generateDynamicColumnsData<TPosition = Date>(
    dynamicColumnsFilter: ITimelineColumnsFilter<TPosition>
) {
    const { position, limit, quantum } = dynamicColumnsFilter;
    const dynamicColumnsGridData = [];
    const dynamicColumnsGridDataCount = limit * NAVIGATION_LIMIT_FACTOR;
    const currentPosition = new Date(position as unknown as Date);

    // Данные мы теперь запрашиваем только для видимого периода. Колонки, при этом, нужно генерировать на +- период.
    shiftDate(currentPosition, 'backward', quantum, limit);

    for (let column = 0; column < dynamicColumnsGridDataCount; column++) {
        dynamicColumnsGridData.push(new Date(currentPosition));
        shiftDate(currentPosition, 'forward', quantum);
    }

    return dynamicColumnsGridData;
}
