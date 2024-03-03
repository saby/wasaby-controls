import { Memory, IMemoryOptions } from 'Types/source';

interface IProps extends IMemoryOptions {
    filterData?: object[];
}

/* eslint-disable */
export default class DemoSource extends Memory {
    protected _moduleName: string = 'Controls-demo/gridNew/SourceChanger/FromEmpty/DemoSource';
    queryNumber: number = 0;
    pending: Promise<any>;
    protected _filterData: object[];

    constructor(options: IProps) {
        super(options);
        this._filterData = options.filterData || this._$data;
    }

    query(): Promise<any> {
        const args = arguments;
        return this.pending.then(() => {
            return super.query.apply(this, args).addCallback((items) => {
                const rawData = items.getRawData();
                rawData.items = this._filterData.filter((cur) => cur.load === this.queryNumber);
                rawData.meta.more = this.queryNumber < 2;
                rawData.meta.total = rawData.items.length;
                items.setRawData(rawData);
                this.queryNumber++;
                return items;
            });
        });
    }
}
