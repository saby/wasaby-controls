import { ITimelineColumnsFilter } from './ITimelineGridFactory';
import { NAVIGATION_LIMIT_FACTOR } from 'Controls-Lists/dynamicGrid';
import { shiftDate } from 'Controls-Lists/_timelineGrid/utils';

export interface IGenerateDynamicColumnsData<TPosition = Date> {
    dynamicColumnsFilter: ITimelineColumnsFilter<TPosition>;
}

export function generateDynamicColumnsData<TPosition = Date>(
    props: IGenerateDynamicColumnsData<TPosition>
) {
    const { position, direction, limit, quantum } = props.dynamicColumnsFilter;
    const dynamicColumnsGridData = [];
    const currentPosition = new Date(position as Date);

    if (direction === 'backward') {
        shiftDate(currentPosition, 'backward', quantum, limit - 1);
    } else if (direction === 'bothways') {
        // Т.к. мы запрашиваем данные с запасом в обе стороны, то данные нужно генерировать начиная с первой позиции
        shiftDate(currentPosition, 'backward', quantum, limit / NAVIGATION_LIMIT_FACTOR);
    }

    for (let column = 0; column < limit; column++) {
        dynamicColumnsGridData.push(new Date(currentPosition));
        shiftDate(currentPosition, 'forward', quantum);
    }

    return dynamicColumnsGridData;
}
