import { IDynamicColumnsFilter } from './IDynamicGridDataFactoryArguments';
import { NAVIGATION_LIMIT_FACTOR } from '../constants';
import { RecordSet } from 'Types/collection';

export function generateDynamicColumnsData<TPosition = number>(
    dynamicColumnsFilter: IDynamicColumnsFilter<TPosition>
) {
    const { position, direction, limit } = dynamicColumnsFilter;
    const dynamicColumnsGridData = [];
    let initialPosition = position as unknown as number;

    if (direction === 'bothways') {
        initialPosition -= Math.trunc(limit / NAVIGATION_LIMIT_FACTOR);
    }

    for (let column = 0; column < limit; column++) {
        dynamicColumnsGridData.push(initialPosition + column);
    }

    return dynamicColumnsGridData;
}

export function generateDynamicColumnsDataByItems<TPosition = number>(
    items: RecordSet,
    dynamicColumnsDataProperty: string
) {
    const dynamicColumnsGridData = [];

    if (items && items.getCount()) {
        const columnsData = items.at(0).get(dynamicColumnsDataProperty) as RecordSet;
        if (columnsData && columnsData.getCount()) {
            columnsData.forEach((item) => {
                dynamicColumnsGridData.push(item.getKey());
            });
        }
    }

    return dynamicColumnsGridData;
}
