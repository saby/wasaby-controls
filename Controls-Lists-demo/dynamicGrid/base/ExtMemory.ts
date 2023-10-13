import { ITimelineColumnsFilter, Quantum } from 'Controls-Lists/timelineGrid';
import { Memory, Query } from 'Types/source';
import { adapter as EntityAdapter, format as EntityFormat, Model, Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { STAFF_LIST, resolveJobByNumber, getEventsByNumber } from './Staff';
import type { TNavigationDirection } from 'Controls/interface';
import { Base as BaseDateUtils } from 'Controls/dateUtils';
import { date as formatDate } from 'Types/formatter';
import { getHolidays } from './Holiday';

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
    item: Record,
    dynamicColumnsFilter: ITimelineColumnsFilter,
    currentAdapter: EntityAdapter.IAdapter
): RecordSet {
    const resultRecordSet = new RecordSet({ adapter: currentAdapter, keyProperty: 'key' });

    resultRecordSet.addField(
        new EntityFormat.DateTimeField({ name: 'key', withoutTimeZone: true })
    );
    resultRecordSet.addField(new EntityFormat.StringField({ name: 'dynamicTitle' }));
    resultRecordSet.addField(new EntityFormat.IntegerField({ name: 'dayType' }));

    const colKey = new Date(dynamicColumnsFilter.position);
    for (let col = 0; col < dynamicColumnsFilter.limit; col++) {
        const dynamicTitle =
            '*' +
            colKey.getDate().toString().padStart(2, '0') +
            '.' +
            (colKey.getMonth() + 1).toString().padStart(2, '0');
        const dayType =
            item.get('key') === 2 && colKey.getMonth() === 0 && colKey.getDate() === 12 ? 2 : 0;

        const record = new Record({ adapter: currentAdapter });
        record.addField(
            new EntityFormat.DateTimeField({ name: 'key', withoutTimeZone: true }),
            null,
            colKey
        );
        record.addField(new EntityFormat.StringField({ name: 'dynamicTitle' }), null, dynamicTitle);
        record.addField(new EntityFormat.IntegerField({ name: 'dayType' }), null, dayType);
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

    const folderRecord = new Record({ adapter: resultRecordSet.getAdapter() });
    folderRecord.addField(new EntityFormat.IntegerField({ name: 'key' }), null, 111);
    folderRecord.addField(new EntityFormat.StringField({ name: 'type' }), null, true);
    folderRecord.addField(new EntityFormat.StringField({ name: 'hasChild' }), null, true);
    folderRecord.addField(new EntityFormat.IntegerField({ name: 'parent' }), null, null);
    folderRecord.addField(
        new EntityFormat.StringField({ name: 'fullName' }),
        null,
        'Обращения и инциденты'
    );
    folderRecord.addField(
        new EntityFormat.StringField({ name: 'job' }),
        null,
        'Функционал обработки возникших проблем у клиентов'
    );
    folderRecord.addField(
        new EntityFormat.RecordSetField({ name: 'dynamicColumnsData' }),
        null,
        null
    );
    resultRecordSet.add(folderRecord);

    for (let i = 0; i < rowsCount; i++, position++) {
        const record = new Record({ adapter: resultRecordSet.getAdapter() });

        record.addField(new EntityFormat.IntegerField({ name: 'key' }), null, position);
        record.addField(
            new EntityFormat.StringField({ name: 'type' }),
            null,
            i === 0 ? true : null
        );
        record.addField(
            new EntityFormat.StringField({ name: 'hasChild' }),
            null,
            i === 0 ? true : null
        );
        record.addField(
            new EntityFormat.IntegerField({ name: 'parent' }),
            null,
            i !== 0 && i % 3 === 0 ? 111 : null
        );
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
            i === 0
                ? null
                : generateDynamicColumnsData(record, columnsFilter, resultRecordSet.getAdapter())
        );

        const startWorkDate =
            i === 0 ? null : i === 5 ? new Date(2023, 0, 23) : new Date(2020, 0, 0);
        record.addField(
            new EntityFormat.DateTimeField({ name: 'startWorkDate' }),
            null,
            startWorkDate
        );

        if (i > 0) {
            const events = getEventsByNumber(resultRecordSet.getAdapter(), i);
            record.addField(new EntityFormat.RecordSetField({ name: 'EventRS' }), null, events);
        }
        resultRecordSet.add(record);
    }
}

function isWeekend(date: Date): boolean {
    const day = date.getDay();
    const SATURDAY = 6;
    const SUNDAY = 0;
    return day === SATURDAY || day === SUNDAY;
}

export function generateHolidaysCalendar(startDate: Date) {
    let startPosition = new Date(startDate);
    startPosition = BaseDateUtils.getStartOfYear(startPosition);
    const endPosition = BaseDateUtils.getEndOfYear(startPosition);

    const dates = getHolidays();

    const currentDate = new Date(startPosition);
    while (currentDate.getTime() !== endPosition.getTime()) {
        if (isWeekend(currentDate)) {
            const newWeekendItem = new Model({
                rawData: {
                    date: formatDate(currentDate, 'YYYY-MM-DD'),
                    type: 1,
                },
                keyProperty: 'date',
            });
            dates.add(newWeekendItem);
        }
        shiftDate(currentDate, 'forward', Quantum.Day);
    }
    return dates;
}

function generateMetaData(resultRecordSet: RecordSet, query: Query) {
    const colsCursorProperty = 'dynamicColumnsData';
    const filter = query.getWhere();
    const columnsFilterRecord = filter[colsCursorProperty];
    const dates = generateHolidaysCalendar(new Date(columnsFilterRecord.get('position')));

    const metaData = {
        holidaysData: dates,
    };
    resultRecordSet.setMetaData(metaData);
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
                resultRecordSet.addField(new EntityFormat.DateTimeField({ name: 'startWorkDate' }));
                resultRecordSet.addField(
                    new EntityFormat.RecordSetField({ name: 'dynamicColumnsData' })
                );
                generateItems(resultRecordSet, query);
                generateMetaData(resultRecordSet, query);
                resolve(resultRecordSet);
            }, LOAD_TIMEOUT_DYNAMIC_COLUMNS);
        });
    }

    _moduleName = 'Controls-Lists-demo/dynamicGrid/base/ExtMemory';
}
