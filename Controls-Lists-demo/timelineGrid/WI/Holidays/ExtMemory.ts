import { Query } from 'Types/source';
import { format as EntityFormat, Record as EntityRecord } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { default as getEventsByNumber } from '../Utils/getEventsByNumber';
import { generateMetaData } from '../Utils/getHolidaysCalendar';
import { default as Memory } from '../Data/ExtMemory';

export default class ExtMemory extends Memory {
    _moduleName: string = 'Controls-Lists-demo/timelineGrid/WI/Holidays/ExtMemory';

    query(query: Query): Promise<RecordSet> {
        return super.query(query).then((data: RecordSet) => {
            generateMetaData(data, query);
            return data;
        });
    }
}
