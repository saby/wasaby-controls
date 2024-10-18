import { ITimelineColumnsFilter } from 'Controls-Lists/timelineGrid';
import { CrudEntityKey, Memory, Query } from 'Types/source';
import {
    adapter as EntityAdapter,
    format as EntityFormat,
    Record as EntityRecord,
} from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { STAFF_LIST, resolveJobByNumber } from './Staff';
import { Images } from 'Controls-Lists-demo/timelineGrid/Sources/Images';
import { shiftDate } from '../Utils/common';

export function generateDynamicColumnsData(
    item: EntityRecord,
    dynamicColumnsFilter: ITimelineColumnsFilter,
    currentAdapter: EntityAdapter.IAdapter
): RecordSet {
    const resultRecordSet = new RecordSet({
        adapter: currentAdapter,
        keyProperty: 'key',
    });

    resultRecordSet.addField(
        new EntityFormat.DateTimeField({
            name: 'key',
            withoutTimeZone: true,
        })
    );
    resultRecordSet.addField(new EntityFormat.StringField({ name: 'dynamicTitle' }));
    resultRecordSet.addField(new EntityFormat.IntegerField({ name: 'dayType' }));

    const colKey = new Date(dynamicColumnsFilter.position);
    const dayTimes = ['8', '8+', '6', '5', '4+', '2', '10'];
    for (let col = 0; col < dynamicColumnsFilter.limit; col++) {
        const index = Math.floor(col / dayTimes.length);
        const dynamicTitle = dayTimes[index];
        const dayType =
            item.get('key') === 2 && colKey.getMonth() === 0 && colKey.getDate() === 12 ? 2 : 0;

        const record = new EntityRecord({ adapter: currentAdapter });
        record.addField(
            new EntityFormat.DateTimeField({
                name: 'key',
                withoutTimeZone: true,
            }),
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

export function generateItem(
    adapter: EntityAdapter.IAdapter,
    rawData: { [p: string]: string | number | object | boolean }
): EntityRecord {
    const record = new EntityRecord({ adapter });

    record.addField(new EntityFormat.StringField({ name: 'key' }), null, rawData.key);
    record.addField(new EntityFormat.StringField({ name: 'type' }), null, rawData.type);
    record.addField(new EntityFormat.StringField({ name: 'hasChild' }), null, rawData.hasChild);
    record.addField(new EntityFormat.StringField({ name: 'parent' }), null, rawData.parent);

    record.addField(new EntityFormat.StringField({ name: 'image' }), null, rawData.image);
    record.addField(new EntityFormat.StringField({ name: 'fullName' }), null, rawData.fullName);
    record.addField(new EntityFormat.StringField({ name: 'job' }), null, rawData.job);
    record.addField(
        new EntityFormat.RecordSetField({ name: 'dynamicColumnsData' }),
        null,
        rawData.dynamicColumnsData
    );

    record.addField(
        new EntityFormat.DateTimeField({ name: 'startWorkDate' }),
        null,
        rawData.startWorkDate
    );
    return record;
}

export default class ExtMemory extends Memory {
    _moduleName: string = 'Controls-Lists-demo/timelineGrid/WI/Data/ExtMemory';
    protected _folderMap: CrudEntityKey[] = [];

    query(query: Query): Promise<RecordSet> {
        const adapter = this.getAdapter();
        const result = new RecordSet({
            adapter,
            keyProperty: 'key',
        });
        result.addField(new EntityFormat.StringField({ name: 'key' }));
        result.addField(new EntityFormat.StringField({ name: 'type' }));
        result.addField(new EntityFormat.StringField({ name: 'parent' }));
        result.addField(new EntityFormat.StringField({ name: 'fullName' }));
        result.addField(new EntityFormat.StringField({ name: 'job' }));
        result.addField(new EntityFormat.StringField({ name: 'image' }));
        result.addField(new EntityFormat.DateTimeField({ name: 'startWorkDate' }));
        result.addField(new EntityFormat.RecordSetField({ name: 'dynamicColumnsData' }));
        this._generateItems(result, query);
        return Promise.resolve(result);
    }

    _beforeGenerateItems(result: RecordSet, query: Query): void {}

    _afterGenerateItem(result: RecordSet, record: EntityRecord, index: number): void {}

    protected _generateItems(resultRecordSet: RecordSet, query: Query) {
        const colsCursorProperty = 'dynamicColumnsData';
        const filter = query.getWhere();
        const columnsFilterRecord = filter[colsCursorProperty];
        const columnsFilter: ITimelineColumnsFilter = {
            position: columnsFilterRecord.get('position'),
            limit: columnsFilterRecord.get('limit'),
            direction: columnsFilterRecord.get('direction'),
            quantum: columnsFilterRecord.get('quantum'),
        };

        this._beforeGenerateItems(resultRecordSet, query);

        STAFF_LIST.forEach((fullName, index) => {
            const record = generateItem(resultRecordSet.getAdapter(), {
                key: index,
                type: null,
                hasChild: null,
                parent: this._folderMap[index] || null,
                image: Images[index],
                fullName: STAFF_LIST[index],
                job: resolveJobByNumber(index),
                startWorkDate: new Date(2020, 0, 0),
            });
            record.set(
                'dynamicColumnsData',
                generateDynamicColumnsData(record, columnsFilter, resultRecordSet.getAdapter())
            );
            this._afterGenerateItem(resultRecordSet, record, index);
            resultRecordSet.add(record);
        });
    }
}
