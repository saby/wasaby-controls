import { IMemoryOptions, Memory } from 'Types/source';
import { IQueryMeta, QueryWhereExpression } from 'Types/source';
import * as MemorySourceFilter from 'Controls-ListEnv-demo/FilterPanel/View/Editors/LookupEditor/resources/MemorySourceFilter';

class FilterMemory extends Memory {
    constructor(options: IMemoryOptions) {
        super(options);
    }

    protected _applyWhere(
        data: unknown,
        where?: QueryWhereExpression<unknown>,
        meta?: IQueryMeta
    ): unknown {
        if (!this._$filter && typeof where === 'object' && !Object.keys(where).length) {
            return data;
        }

        const adapter = this.getAdapter();
        const tableAdapter = adapter.forTable();

        this._each(data, (item, index) => {
            const localItem = adapter.forRecord(item);

            const isMatch = MemorySourceFilter();

            if (isMatch(localItem, where)) {
                tableAdapter.add(localItem.getData());
            }
        });

        return tableAdapter.getData();
    }
}

export default FilterMemory;
