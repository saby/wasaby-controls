import { Memory, IMemoryOptions } from 'Types/source';
const delay = (ms: number) => {
    return new Promise((res) => {
        return setTimeout(res, ms);
    });
};

interface IProps extends IMemoryOptions {
    filterData?: object[],
}

export default class DemoSource extends Memory {
    protected _moduleName: string = 'Controls-demo/list_new/Navigation/MaxCountValue/DemoSource';
    queryNumber: number = 0;
    protected _filterData: object[];

    constructor(options: IProps) {
        super(options);
        this._filterData = options.filterData || this._$data;
    }

    query(): Promise<any> {
        const args = arguments;
        return delay(1000).then(() => {
            return super.query.apply(this, args).addCallback((items) => {
                const rawData = items.getRawData();
                rawData.items = this._filterData.filter((cur) => {
                    return cur.key === this.queryNumber;
                });
                rawData.meta.more = this.queryNumber < 10;
                rawData.meta.total = rawData.items.length;
                items.setRawData(rawData);
                this.queryNumber++;
                return items;
            });
        });
    }
}
