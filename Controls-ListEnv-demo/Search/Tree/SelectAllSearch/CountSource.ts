import { Memory, DataSet } from 'Types/source';
import { Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';

export default class CountSource extends Memory {
    call(command: string, data: { filter: Record }): Promise<DataSet> {
        const selection = data.filter.get('selection');
        const marked: string[] = selection.get('marked');
        const excluded: string[] = selection.get('excluded');
        const items = new RecordSet({
            rawData: this._$data,
            keyProperty: 'key',
        });
        let count = 0;

        if (marked[0] === null) {
            items.each((item) => {
                const itemKey = String(item.get('key'));
                if (!excluded.includes(itemKey)) {
                    count++;
                }
            });
        } else {
            count = marked.length;
        }

        return new Promise((resolve) => {
            resolve(
                new DataSet({
                    rawData: {
                        count,
                    },
                })
            );
        });
    }
}
