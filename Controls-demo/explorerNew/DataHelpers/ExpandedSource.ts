import { default as memoryFilter } from 'Controls-demo/treeGridNew/DemoHelpers/Filter/memoryFilter';
import { HierarchicalMemory, IMemoryOptions, Query, DataSet } from 'Types/source';

interface IExpandedMemorySource extends IMemoryOptions {
    keyProperty?: string;
    parentProperty?: string;
    filterProperty?: string;
    useMemoryFilter?: boolean;
}

export default class ExpandedSource extends HierarchicalMemory {
    protected _moduleName: string =  'Controls-demo/explorerNew/DataHelpers/ExpandedSource';
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
}
