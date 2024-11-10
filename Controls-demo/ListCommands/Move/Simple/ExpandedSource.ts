import { default as memoryFilter } from 'Controls-demo/ListCommands/Move/Simple/memoryFilter';
import { HierarchicalMemory, IMemoryOptions, Query, DataSet } from 'Types/source';

interface IExpandedMemorySource extends IMemoryOptions {
    keyProperty?: string;
    parentProperty?: string;
    filterProperty?: string;
    useMemoryFilter?: boolean;
}

export default class ExpandedSource extends HierarchicalMemory {
    protected _moduleName: string =  'Controls-demo/ListCommands/Move/Simple/ExpandedSource';
    private readonly _useMemoryFilter: boolean;
    private readonly _filterProperty: string;

    constructor(options: IExpandedMemorySource) {
        super(options);
        this._useMemoryFilter = options.useMemoryFilter;
        this._filterProperty = options.filterProperty;
    }

    query(query?: Query): Promise<DataSet> {
        const passedWhere = query.getWhere();
        const newQuery = query.where((item, index) => {
            return this._useMemoryFilter
                ? memoryFilter(
                    item,
                    passedWhere,
                    this._keyProperty,
                    this._$parentProperty,
                    this._filterProperty,
                    this
                )
                : true;
        });
        return super.query(newQuery);
    }

    protected _each(data: any, callback: Function, context?: object): void {
        const tableAdapter = this.getAdapter().forTable(data);
        for (
            let index = 0, count = tableAdapter.getCount();
            index < count;
            index++
        ) {
            callback.call(context || this, tableAdapter.at(index), index);
        }
    }
}
