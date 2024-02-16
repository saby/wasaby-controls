import { NAVIGATION_LIMIT_FACTOR } from 'Controls-Lists/dynamicGrid';
import { Quantum, shiftDate, IQuantum } from 'Controls-Lists/_timelineGrid/utils';

interface IDynamicColumnsGridDataGenerator {
    quantum: Quantum;
    quantums: IQuantum[];
    limit: number;
    position: Date;
    scale: number;
}

export function generateDynamicColumnsData(params: IDynamicColumnsGridDataGenerator) {
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
