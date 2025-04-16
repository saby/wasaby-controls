import { FormSlice } from 'Controls-DataEnv/dataFactory';
import { Model } from 'Types/entity';

export default {
    async loadData(): Promise<unknown> {
        return new Model({
            rawData: {
                field1: 'Первое поле',
                field2: 'Второе поле',
                field3: 1789,
                Data: {
                    TestGraphModel: new Model({
                        rawData: {
                            id: 'graphId',
                            fieldLevel1: 'Первое поле графа',
                            fieldLevel2: 'Второе поле графа',
                        },
                    }),
                },
            },
        });
    },
    slice: FormSlice,
};
