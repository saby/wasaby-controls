import { Memory } from 'Types/source';
import { ChangeSourceData } from 'Controls-demo/gridNew/DemoHelpers/Data/ChangeSource';

/* eslint-disable */
export default class DemoSource extends Memory {
    protected _moduleName: string = 'Controls-demo/gridNew/SourceChanger/WithFull/DemoSource';
    queryNumber: number = 0;
    pending: Promise<any>;

    query(): Promise<any> {
        const args = arguments;
        return this.pending.then(() => {
            return super.query.apply(this, args).addCallback((items) => {
                const rawData = items.getRawData();
                rawData.items = ChangeSourceData.getData2().filter((cur) => cur.load === this.queryNumber);
                rawData.meta.more = this.queryNumber < 2;
                rawData.meta.total = rawData.items.length;
                items.setRawData(rawData);
                this.queryNumber++;
                return items;
            });
        });
    }
}
