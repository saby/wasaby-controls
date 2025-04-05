import { DataSet, Memory, Query } from 'Types/source';
import { IDynamicColumnsFilter } from 'Controls-Lists/DynamicGrid';
import { RecordSet } from 'Types/collection';
import { adapter as EntityAdapter, format as EntityFormat, Record } from 'Types/entity';
import { JOBS_LIST, staffWithJobs } from 'Controls-Lists-demo/dynamicGrid/WI/Base/Staff';
import { Images } from 'Controls-Lists-demo/timelineGrid/Sources/Images';

const LOAD_TIMEOUT_DYNAMIC_COLUMNS = 500;
const KEY_PROPERTY = 'key';
const DYNAMIC_COLUMNS_PROPERTY = 'dynamicColumnsData';

function generateDynamicColumnsData(
    dynamicColumnsFilter: IDynamicColumnsFilter,
    adapter: EntityAdapter.IAdapter
) {
    const position = dynamicColumnsFilter.position;
    const dynamicColumnsData = new RecordSet({ adapter, keyProperty: KEY_PROPERTY });

    dynamicColumnsData.addField(new EntityFormat.IntegerField({ name: KEY_PROPERTY }));
    dynamicColumnsData.addField(new EntityFormat.ArrayField({ name: 'data' }));

    let currentColKey = position;

    const maxElementsToAdd = Math.min(dynamicColumnsFilter.limit, staffWithJobs.length - position);

    if (dynamicColumnsFilter.direction === 'backward') {
        currentColKey = Math.max(0, currentColKey - 1);
    }

    for (let i = 0; i < maxElementsToAdd; i++) {
        if (currentColKey < 0 || currentColKey >= staffWithJobs.length) {
            break;
        }

        const dataValue = staffWithJobs[currentColKey].jobs;
        const record = new Record({ adapter });

        record.addField(new EntityFormat.IntegerField({ name: KEY_PROPERTY }), null, currentColKey);
        record.addField(new EntityFormat.ArrayField({ name: 'data' }), null, dataValue);

        if (dynamicColumnsFilter.direction === 'backward') {
            dynamicColumnsData.add(record, 0);
            currentColKey--;
        } else {
            dynamicColumnsData.add(record);
            currentColKey++;
        }
    }

    return dynamicColumnsData;
}

function generateDynamicHeadersData(
    dynamicColumnsFilter: IDynamicColumnsFilter,
    adapter: EntityAdapter.IAdapter
) {
    const position = dynamicColumnsFilter.position;
    const dynamicHeaderData = new RecordSet({ adapter, keyProperty: KEY_PROPERTY });

    dynamicHeaderData.addField(new EntityFormat.IntegerField({ name: KEY_PROPERTY }));
    dynamicHeaderData.addField(new EntityFormat.StringField({ name: 'name' }));
    dynamicHeaderData.addField(new EntityFormat.StringField({ name: 'currentCategory' }));

    let currentColKey = position;

    const maxElementsToAdd = Math.min(dynamicColumnsFilter.limit, staffWithJobs.length - position);

    if (dynamicColumnsFilter.direction === 'backward') {
        currentColKey--;
    }

    for (let i = 0; i < maxElementsToAdd; i++) {
        if (currentColKey < 0 || currentColKey >= staffWithJobs.length) {
            break;
        }

        const name = `${staffWithJobs[currentColKey].name}`;
        const record = new Record({ adapter });

        record.addField(new EntityFormat.IntegerField({ name: KEY_PROPERTY }), null, currentColKey);
        record.addField(new EntityFormat.StringField({ name: 'name' }), null, name);
        record.addField(
            new EntityFormat.StringField({ name: 'currentCategory' }),
            null,
            staffWithJobs[currentColKey].currentCategory
        );

        if (dynamicColumnsFilter.direction === 'backward') {
            dynamicHeaderData.add(record, 0);
            currentColKey--;
        } else {
            dynamicHeaderData.add(record);
            currentColKey++;
        }
    }

    return dynamicHeaderData;
}

function generateItems(query: Query, adapter: EntityAdapter.IAdapter) {
    const filter = query.getWhere();
    const columnsFilterRecord = filter[DYNAMIC_COLUMNS_PROPERTY];
    const columnsFilter: IDynamicColumnsFilter = {
        position: columnsFilterRecord.get('position'),
        limit: columnsFilterRecord.get('limit'),
        direction: columnsFilterRecord.get('direction'),
    };

    return JOBS_LIST.map((job, index) => {
        return {
            key: index,
            type: null,
            image: Images[index],
            job,
            [DYNAMIC_COLUMNS_PROPERTY]: generateDynamicColumnsData(columnsFilter, adapter),
        };
    });
}

function generateMeta(query: Query, adapter: EntityAdapter.IAdapter) {
    const filter = query.getWhere();
    const columnsFilterRecord = filter[DYNAMIC_COLUMNS_PROPERTY];
    const columnsFilter: IDynamicColumnsFilter = {
        position: columnsFilterRecord.get('position'),
        limit: columnsFilterRecord.get('limit'),
        direction: columnsFilterRecord.get('direction'),
    };

    let backward = true;
    let forward = true;

    if (columnsFilter.direction === 'bothways' && columnsFilter.position === 0) {
        backward = false;
    }

    if (
        columnsFilter.direction === 'backward' &&
        columnsFilter.position - columnsFilter.limit <= 0
    ) {
        backward = false;
    }

    if (
        columnsFilter.direction === 'forward' &&
        columnsFilter.position + columnsFilter.limit >= staffWithJobs.length
    ) {
        forward = false;
    }

    return {
        columnsMore: {
            backward,
            forward,
        },
        headers: generateDynamicHeadersData(columnsFilter, adapter),
    };
}

export default class ExtSource extends Memory {
    query(query: Query): Promise<DataSet> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const adapter = this.getAdapter();
                const resultDataSet = new DataSet({
                    keyProperty: KEY_PROPERTY,
                    itemsProperty: 'items',
                    metaProperty: 'meta',
                    adapter,
                    rawData: {
                        items: generateItems(query, adapter),
                        meta: generateMeta(query, adapter),
                    },
                });

                resolve(resultDataSet);
            }, LOAD_TIMEOUT_DYNAMIC_COLUMNS);
        });
    }

    _moduleName = 'Controls-Lists-demo/dynamicGrid/horizontalNavigation/source';
}
