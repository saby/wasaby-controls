/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
import { RecordSet } from 'Types/collection';
import { Record } from 'Types/entity';

export function dataConversion(data: RecordSet | Record[]): Record[] {
    if (data instanceof RecordSet) {
        const modelArray: Record[] = [];
        data.each((item) => {
            modelArray.push(item);
        });
        return modelArray;
    } else if (Array.isArray(data)) {
        return data;
    }
}
