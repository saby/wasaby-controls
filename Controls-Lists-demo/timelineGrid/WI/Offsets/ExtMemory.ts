import { Query } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { generateMetaData } from 'Controls-Lists-demo/timelineGrid/Sources/getHolidaysCalendar';
import { default as Memory } from '../Data/ExtMemory';

export default class ExtMemory extends Memory {
    _moduleName: string = 'Controls-Lists-demo/timelineGrid/WI/Offsets/ExtMemory';

    query(query: Query): Promise<RecordSet> {
        return super.query(query).then((data: RecordSet) => {
            data.setMetaData(generateMetaData(query));
            return data;
        });
    }
}
