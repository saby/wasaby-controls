import { IDynamicColumnsFilter } from './IDynamicGridFactory';

export interface IGenerateDynamicColumnsData<TPosition = number> {
    dynamicColumnsFilter: IDynamicColumnsFilter<TPosition>;
}

export function generateDynamicColumnsData<TPosition = number>(props: IGenerateDynamicColumnsData<TPosition>) {
    const { position, direction, limit } = props.dynamicColumnsFilter;
    const dynamicColumnsGridData = [];
    let initialPosition = position as number;

    if (direction === 'backward') {
        initialPosition -= limit;
    } else if (direction === 'bothways') {
        initialPosition -= Math.trunc(limit / 2);
    }

    for (let column = 0; column < limit; column++) {
        dynamicColumnsGridData.push(initialPosition + column);
    }

    return dynamicColumnsGridData;
}
