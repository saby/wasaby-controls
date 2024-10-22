import { adapter as EntityAdapter, Record as EntityRecord } from 'Types/entity';
import { Memory, Query, IMemoryOptions } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { DataSet } from 'Types/source';
import { ITimelineColumnsFilter } from 'Controls-Lists/timelineGrid';
import { STAFF, STAFF_STRUCTURE } from './Data';

import { IStaff } from 'Controls-Lists-demo/timelineGrid/Sources/Data';
import { addFields } from 'Controls-Lists-demo/timelineGrid/Sources/utils';
import { generateMetaData } from 'Controls-Lists-demo/timelineGrid/Sources/getHolidaysCalendar';
import { default as generateEventsData } from 'Controls-Lists-demo/timelineGrid/Sources/generateEventsData';
import { default as generateDynamicColumnsData } from 'Controls-Lists-demo/timelineGrid/Sources/generateDynamicColumnsData';

interface IExtMemoryOptions extends IMemoryOptions {
    dynamicColumnDataField: string;
}

export default class ExtMemory extends Memory {
    private readonly _dynamicColumnDataField: string = 'dynamicColumnsData';

    constructor(options: IExtMemoryOptions) {
        super({
            ...options,
            adapter: new EntityAdapter.Sbis(),
        });
        this._dynamicColumnDataField = options.dynamicColumnDataField;
    }

    query(query: Query): Promise<DataSet> {
        const adapter = this.getAdapter();
        const result = new RecordSet({
            adapter,
            keyProperty: this.getKeyProperty(),
        });
        addFields(result, STAFF_STRUCTURE);

        const filter = query.getWhere();
        const columnsFilterRecord = filter[this._dynamicColumnDataField];
        const columnsFilter: ITimelineColumnsFilter = {
            position: columnsFilterRecord.get('position'),
            limit: columnsFilterRecord.get('limit'),
            direction: columnsFilterRecord.get('direction'),
            quantum: columnsFilterRecord.get('quantum'),
        };

        STAFF.forEach((item) => {
            const record = new EntityRecord({ adapter: result.getAdapter() });
            addFields<IStaff>(record, STAFF_STRUCTURE, {
                ...item,
                EventRS: generateEventsData(result.getAdapter(), columnsFilter, item.key),
            });
            addFields<IStaff>(record, STAFF_STRUCTURE, {
                dynamicColumnsData: generateDynamicColumnsData(
                    result.getAdapter(),
                    columnsFilter,
                    record
                ),
            });
            result.add(record);
        });

        return Promise.resolve(
            this._prepareQueryResult(
                {
                    items: result.getRawData(),
                    meta: generateMetaData(query, this._dynamicColumnDataField),
                },
                query
            )
        );
    }
}
