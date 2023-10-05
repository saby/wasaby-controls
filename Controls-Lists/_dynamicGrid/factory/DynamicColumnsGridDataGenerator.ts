import { IDynamicColumnsFilter } from './IDynamicGridFactory';
import { NAVIGATION_LIMIT_FACTOR } from '../constants';

export interface IGenerateDynamicColumnsData<TPosition = number> {
    dynamicColumnsFilter: IDynamicColumnsFilter<TPosition>;
}

export function generateDynamicColumnsData<TPosition = number>(
    props: IGenerateDynamicColumnsData<TPosition>
) {
    const { position, direction, limit } = props.dynamicColumnsFilter;
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
