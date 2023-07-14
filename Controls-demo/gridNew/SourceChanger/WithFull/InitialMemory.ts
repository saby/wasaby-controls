import { Memory } from 'Types/source';

export default class InitialMemory extends Memory {
    protected _moduleName: string = 'Controls-demo/gridNew/SourceChanger/WithFull/InitialMemory';
    query(): Promise<any> {
        return super.query.apply(this, arguments).addCallback((items) => {
            const rawData = items.getRawData();
            rawData.meta.more = false;
            items.setRawData(rawData);
            return items;
        });
    }
}
