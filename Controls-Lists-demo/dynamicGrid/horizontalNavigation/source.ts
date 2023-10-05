import { DataSet, Memory, Query } from 'Types/source';
import { IDynamicColumnsFilter } from 'Controls-Lists/DynamicGrid';
import { RecordSet } from 'Types/collection';
import { adapter as EntityAdapter, format as EntityFormat, Record } from 'Types/entity';

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
    dynamicColumnsData.addField(new EntityFormat.StringField({ name: 'data' }));

    for (let col = position; col < position + dynamicColumnsFilter.limit; col++) {
        const dataValue = `data_${col}`;
        const record = new Record({ adapter });

        record.addField(new EntityFormat.IntegerField({ name: KEY_PROPERTY }), null, col);
        record.addField(new EntityFormat.StringField({ name: 'data' }), null, dataValue);

        if (dynamicColumnsFilter.direction === 'backward') {
            dynamicColumnsData.add(record, 0);
        } else {
            dynamicColumnsData.add(record);
        }
    }

    return dynamicColumnsData;
}

function generateItems(query: Query, adapter: EntityAdapter.IAdapter) {
    const filter = query.getWhere();
    const columnsFilterRecord = filter[DYNAMIC_COLUMNS_PROPERTY];
    const columnsFilter: IDynamicColumnsFilter = {
        position: columnsFilterRecord.get('position'),
        limit: columnsFilterRecord.get('limit'),
        direction: columnsFilterRecord.get('direction'),
    };

    return [
        {
            [KEY_PROPERTY]: 0,
            [DYNAMIC_COLUMNS_PROPERTY]: generateDynamicColumnsData(columnsFilter, adapter),
        },
    ];
}

export default class ExtSource extends Memory {
    query(query: Query): Promise<DataSet> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const adapter = this.getAdapter();
                const resultDataSet = new DataSet({
                    keyProperty: KEY_PROPERTY,
                    itemsProperty: 'items',
                    adapter,
                    rawData: {
                        items: generateItems(query, adapter),
                    },
                });

                resolve(resultDataSet);
            }, LOAD_TIMEOUT_DYNAMIC_COLUMNS);
        });
    }

    _moduleName = 'Controls-Lists-demo/dynamicGrid/horizontalNavigation/source';
}
