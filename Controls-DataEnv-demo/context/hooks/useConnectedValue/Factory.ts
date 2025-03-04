import { FormSlice } from 'Controls-DataEnv/dataFactory';
import { Model } from 'Types/entity';

export default {
    async loadData(): Promise<unknown> {
        return new Model({
            rawData: {
                field1: 'Первое поле',
                field2: 'Второе поле',
            },
        });
    },
    slice: FormSlice,
};
