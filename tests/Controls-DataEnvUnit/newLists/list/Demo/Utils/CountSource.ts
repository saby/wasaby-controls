import { DataSet, Rpc } from 'Types/source';

export default class CountSource extends Rpc {
    protected _moduleName: string = 'Controls-DataEnvUnit/newLists/list/Demo/Utils/CountSource';
    constructor() {
        super();
    }
    call(): Promise<DataSet> {
        const result = new DataSet({
            rawData: {
                count: 42,
            },
        });
        return Promise.resolve(result);
    }
}
