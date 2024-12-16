import { adapter as EntityAdapter, Record as EntityRecord } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { factory } from 'Types/chain';
import { DateType, ITimelineColumnsFilter } from 'Controls-Lists/timelineGrid';

import { addFields, shiftDate } from './utils';
import { IStaff } from 'Controls-Lists-demo/timelineGrid/Sources/Data';

export interface IDynamic {
    key: Date;
    dynamicTitle: string;
    dayType: DateType;
}

const DYNAMIC_STRUCTURE = {
    key: 'date',
    dynamicTitle: 'string',
    dayType: 'number',
};

// Генреирует данные динамических колонок
export default function generateDynamicColumnsData(
    adapter: EntityAdapter.IAdapter,
    dynamicColumnsFilter: ITimelineColumnsFilter,
    employee: EntityRecord<IStaff>
): RecordSet {
    const result = new RecordSet({
        adapter,
        keyProperty: 'key',
    });
    addFields(result, DYNAMIC_STRUCTURE);
    const colKey = new Date(dynamicColumnsFilter.position);
    let dayShifts: EntityRecord[];
    if (dynamicColumnsFilter.quantum === 'day') {
        dayShifts = factory(employee.get('EventRS'))
            .toArray()
            .filter((event) => {
                return event.get('eventType') === 'shift';
            });
    }

    for (let col = 0; col < dynamicColumnsFilter.limit; col++) {
        const dynamicTitle = '';
        const dayType = DateType.WorkDay;
        const record = new EntityRecord({ adapter });
        addFields<IDynamic>(record, DYNAMIC_STRUCTURE, {
            key: colKey,
            dynamicTitle,
            dayType,
        });
        if (dynamicColumnsFilter.direction === 'backward') {
            result.add(record, 0);
        } else {
            result.add(record);
        }
        shiftDate(colKey, dynamicColumnsFilter.direction, dynamicColumnsFilter.quantum);
    }
    return result;
}
