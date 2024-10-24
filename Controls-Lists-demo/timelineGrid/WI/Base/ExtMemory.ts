import { Query } from 'Types/source';
import { format as EntityFormat, Record as EntityRecord } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { default as getEventsByNumber } from '../Utils/getEventsByNumber';
import { generateMetaData } from 'Controls-Lists-demo/timelineGrid/Sources/getHolidaysCalendar';
import { default as Memory } from '../Data/ExtMemory';

export default class ExtMemory extends Memory {
    _moduleName: string = 'Controls-Lists-demo/timelineGrid/WI/Base/ExtMemory';

    query(query: Query): Promise<RecordSet> {
        return super.query(query).then((data: RecordSet) => {
            data.setMetaData(generateMetaData(query));
            return data;
        });
    }

    _beforeGenerateItems(resultRecordSet: RecordSet, query: Query): void {
        resultRecordSet.addField(new EntityFormat.RecordSetField({ name: 'EventRS' }));
    }

    _afterGenerateItem(resultRecordSet: RecordSet, record: EntityRecord, index: number): void {
        const events = getEventsByNumber(resultRecordSet.getAdapter(), index);
        record.addField(new EntityFormat.RecordSetField({ name: 'EventRS' }), null, events);
    }
}
