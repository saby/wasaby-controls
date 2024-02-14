import { Query } from 'Types/source';
import { RecordSet } from 'Types/collection';
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
