import { ITimelineColumnsFilter, Quantum } from 'Controls-Lists/timelineGrid';
import { Memory, Query } from 'Types/source';
import { adapter as EntityAdapter, format as EntityFormat, Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { STAFF_LIST, resolveJobByNumber, getEventsByNumber } from './Staff';
import type { TNavigationDirection } from 'Controls/interface';

const LOAD_TIMEOUT_DYNAMIC_COLUMNS = 500;

function shiftDate(date: Date, direction: TNavigationDirection, quantum: Quantum): void {
    const shiftSize = direction === 'backward' ? -1 : 1;
    switch (quantum) {
        case Quantum.Hour:
            date.setHours(date.getHours() + shiftSize);
            break;
        case Quantum.Day:
            date.setDate(date.getDate() + shiftSize);
            break;
        case Quantum.Month:
            date.setMonth(date.getMonth() + shiftSize);
            break;
    }
}

function generateDynamicColumnsData(
    dynamicColumnsFilter: ITimelineColumnsFilter,
    currentAdapter: EntityAdapter.IAdapter
): RecordSet {
    const resultRecordSet = new RecordSet({ adapter: currentAdapter, keyProperty: 'key' });

    resultRecordSet.addField(new EntityFormat.DateTimeField({ name: 'key' }));
    resultRecordSet.addField(new EntityFormat.StringField({ name: 'dynamicTitle' }));

    const colKey = new Date(dynamicColumnsFilter.position);
    for (let col = 0; col < dynamicColumnsFilter.limit; col++) {
        const dynamicTitle =
            '*' +
            colKey.getDate().toString().padStart(2, '0') +
            '.' +
            (colKey.getMonth() + 1).toString().padStart(2, '0');

        const record = new Record({ adapter: currentAdapter });
        record.addField(new EntityFormat.DateTimeField({ name: 'key' }), null, colKey);
        record.addField(new EntityFormat.StringField({ name: 'dynamicTitle' }), null, dynamicTitle);
        if (dynamicColumnsFilter.direction === 'backward') {
            resultRecordSet.add(record, 0);
        } else {
            resultRecordSet.add(record);
        }

        shiftDate(colKey, dynamicColumnsFilter.direction, dynamicColumnsFilter.quantum);
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

    resultRecordSet.addField(new EntityFormat.RecordSetField({ name: 'EventRS' }));

    const rowsCount = query.getLimit();

    const isPrepend = typeof filter[rowsCursorProperty + '<='] !== 'undefined';

    let position = filter['key<='] || filter['key>='] || filter['key~'] || 0;

    if (isPrepend) {
        position -= rowsCount;
    }

    for (let i = 0; i < rowsCount; i++, position++) {
        const record = new Record({ adapter: resultRecordSet.getAdapter() });

        record.addField(new EntityFormat.IntegerField({ name: 'key' }), null, position);
        record.addField(
            new EntityFormat.StringField({ name: 'type' }),
            null,
            i === 0 ? true : null
        );
        record.addField(new EntityFormat.IntegerField({ name: 'parent' }), null, null);
        record.addField(
            new EntityFormat.StringField({ name: 'fullName' }),
            null,
            i === 0 ? 'Служба поддержки клиентов и внедрение систем' : STAFF_LIST[position]
        );
        record.addField(
            new EntityFormat.StringField({ name: 'job' }),
            null,
            i === 0
                ? 'Круглосуточная поддержка клиентов, решение вопросов клиентов по работе в СБИС'
                : resolveJobByNumber(position)
        );
        record.addField(
            new EntityFormat.RecordSetField({ name: 'dynamicColumnsData' }),
            null,
            i === 0 ? null : generateDynamicColumnsData(columnsFilter, resultRecordSet.getAdapter())
        );
        if (i > 0) {
            const events = getEventsByNumber(resultRecordSet.getAdapter(), i);
            record.addField(new EntityFormat.RecordSetField({name: 'EventRS'}), null, events);
        }
        resultRecordSet.add(record);
    }
}

export default class ExtMemory extends Memory {
    query(query: Query): Promise<RecordSet> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const adapter = this.getAdapter();
                const resultRecordSet = new RecordSet({ adapter, keyProperty: 'key' });
                resultRecordSet.addField(new EntityFormat.IntegerField({ name: 'key' }));
                resultRecordSet.addField(new EntityFormat.StringField({ name: 'type' }));
                resultRecordSet.addField(new EntityFormat.IntegerField({ name: 'parent' }));
                resultRecordSet.addField(new EntityFormat.StringField({ name: 'fullName' }));
                resultRecordSet.addField(new EntityFormat.StringField({ name: 'job' }));
                resultRecordSet.addField(
                    new EntityFormat.RecordSetField({ name: 'dynamicColumnsData' })
                );
                generateItems(resultRecordSet, query);
                resolve(resultRecordSet);
            }, LOAD_TIMEOUT_DYNAMIC_COLUMNS);
        });
    }

    _moduleName = 'Controls-Lists-demo/dynamicGrid/base/ExtMemory';
}
