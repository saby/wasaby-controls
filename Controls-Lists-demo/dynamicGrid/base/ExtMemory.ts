import { IDynamicColumnsFilter } from 'Controls-Lists/dynamicGrid';
import { Memory, Query } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { STAFF_LIST, resolveJobByNumber } from './Staff';

const LOAD_TIMEOUT_DYNAMIC_COLUMNS = 500;

function generateCols(dynamicColumnsFilter: IDynamicColumnsFilter): RecordSet {
    const columnsData = [];

    for (let col = 1; col <= dynamicColumnsFilter.limit; col++) {
        const colKey = new Date(dynamicColumnsFilter.position);
        if (dynamicColumnsFilter.direction === 'backward') {
            colKey.setDate(colKey.getDate() - col);
        } else {
            colKey.setDate(colKey.getDate() + col);
        }
        const dynamicTitle =
            colKey.getDate().toString().padStart(2, '0') +
            '.' +
            (colKey.getMonth() + 1).toString().padStart(2, '0');
        if (dynamicColumnsFilter.direction === 'backward') {
            columnsData.unshift({
                key: colKey,
                dynamicTitle,
            });
        } else {
            columnsData.push({
                key: colKey,
                dynamicTitle,
            });
        }
    }

    return new RecordSet({
        rawData: columnsData,
        keyProperty: 'key',
    });
}

function generateRows(query: Query): {}[] {
    const rowsCursorProperty = 'key';
    const colsCursorProperty = 'dynamicColumnsData';
    const filter = query.getWhere();
    const columnsFilter: IDynamicColumnsFilter = filter[colsCursorProperty];

    const generateColumnsData = !!columnsFilter;

    const rowsCount = query.getLimit();

    const isPrepend = typeof filter[rowsCursorProperty + '<='] !== 'undefined';

    const rows = [];
    let position = filter['key<='] || filter['key>='] || filter['key~'] || 0;

    if (isPrepend) {
        position -= rowsCount;
    }

    for (let i = 0; i < rowsCount; i++, position++) {
        rows.push({
            key: position,
            fullName: STAFF_LIST[position],
            job: resolveJobByNumber(position),
            dynamicColumnsData: generateColumnsData
                ? generateCols(columnsFilter)
                : new RecordSet({ rawData: [], keyProperty: 'key' }),
        });
    }

    return rows;
}

export default class ExtMemory extends Memory {
    query(query: Query): Promise<RecordSet> {
        return new Promise((resolve) => {
            // setTimeout(() => {
            const result = new RecordSet({
                rawData: generateRows(query),
                keyProperty: 'key',
                format: [
                    {
                        name: 'key',
                        type: 'integer',
                    },
                    {
                        name: 'title',
                        type: 'string',
                    },
                    {
                        name: 'dynamicColumnsData',
                        type: 'recordset',
                    },
                ],
            });
            resolve(result);
            // }, LOAD_TIMEOUT_DYNAMIC_COLUMNS);
        });
    }

    _moduleName = 'Controls-Lists-demo/dynamicGrid/base/ExtMemory';
}
