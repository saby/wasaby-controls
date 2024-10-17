import { Memory, Query } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { adapter as EntityAdapter, format as EntityFormat, Record } from 'Types/entity';
import { ITimelineColumnsFilter } from 'Controls-Lists/timelineGrid';

const LOAD_TIMEOUT_DYNAMIC_COLUMNS = 500;

const TIME_LIST = [
    '1 вт',
    '2 ср',
    '3 чт',
    '4 пт',
    '5 сб',
    '6 вс',
    '7 пн',
    '8 вт',
    '9 ср',
    '10 чт',
    '11 пт',
    '12 сб',
    '13 вс',
    '14 пн',
    '15 вт',
    '16 ср',
    '17 чт',
    '18 пт',
    '19 сб',
    '20 вс',
    '21 пн',
    '22 вт',
];

function generateDynamicColumnsData(
    item: Record,
    dynamicColumnsFilter: ITimelineColumnsFilter,
    currentAdapter: EntityAdapter.IAdapter
): RecordSet {
    const resultRecordSet = new RecordSet({ adapter: currentAdapter, keyProperty: 'key' });

    resultRecordSet.addField(
        new EntityFormat.DateTimeField({ name: 'key', withoutTimeZone: true })
    );
    resultRecordSet.addField(new EntityFormat.StringField({ name: 'dynamicTitle' }));

    const colKey = new Date(dynamicColumnsFilter.position);
    for (let col = 0; col < dynamicColumnsFilter.limit; col++) {
        const dynamicTitle = Math.pow(colKey.getDate(), 2) + Math.pow(colKey.getDate(), 3) + col;

        const record = new Record({ adapter: currentAdapter });
        record.addField(
            new EntityFormat.DateTimeField({ name: 'key', withoutTimeZone: true }),
            null,
            colKey
        );
        record.addField(new EntityFormat.StringField({ name: 'dynamicTitle' }), null, dynamicTitle);
        if (dynamicColumnsFilter.direction === 'backward') {
            resultRecordSet.add(record, 0);
        } else {
            resultRecordSet.add(record);
        }
    }

    return resultRecordSet;
}

function generateItems(resultRecordSet: RecordSet, query: Query) {
    const rowsCursorProperty = 'key';
    const colsCursorProperty = 'dynamicColumnsData';
    const filter = query.getWhere();
    const columnsFilterRecord = filter[colsCursorProperty];
    const columnsFilter: ITimelineColumnsFilter = {
        position: columnsFilterRecord.get('position'),
        limit: columnsFilterRecord.get('limit'),
        direction: columnsFilterRecord.get('direction'),
        quantum: columnsFilterRecord.get('quantum'),
    };

    const rowsCount = query.getLimit();

    const isPrepend = typeof filter[rowsCursorProperty + '<='] !== 'undefined';

    let position = filter['key<='] || filter['key>='] || filter['key~'] || 0;

    if (isPrepend) {
        position -= rowsCount;
    }

    for (let i = 0; i < rowsCount; i++, position++) {
        const record = new Record({ adapter: resultRecordSet.getAdapter() });

        record.addField(new EntityFormat.IntegerField({ name: 'key' }), null, position);
        record.addField(new EntityFormat.StringField({ name: 'time' }), null, TIME_LIST[position]);
        record.addField(
            new EntityFormat.RecordSetField({ name: 'dynamicColumnsData' }),
            null,
            generateDynamicColumnsData(record, columnsFilter, resultRecordSet.getAdapter())
        );
        resultRecordSet.add(record);
    }
}

export default class HoverMemory extends Memory {
    query(query: Query): Promise<RecordSet> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const adapter = this.getAdapter();
                const resultRecordSet = new RecordSet({ adapter, keyProperty: 'key' });
                resultRecordSet.addField(new EntityFormat.IntegerField({ name: 'key' }));
                resultRecordSet.addField(new EntityFormat.StringField({ name: 'time' }));
                resultRecordSet.addField(
                    new EntityFormat.RecordSetField({ name: 'dynamicColumnsData' })
                );
                generateItems(resultRecordSet, query);
                resolve(resultRecordSet);
            }, LOAD_TIMEOUT_DYNAMIC_COLUMNS);
        });
    }

    _moduleName = 'Controls-Lists-demo/dynamicGrid/hover/hoverMemory';
}
