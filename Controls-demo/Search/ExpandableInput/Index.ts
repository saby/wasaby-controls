import { Control, TemplateFunction } from 'UI/Base';
import * as MemorySourceData from 'Controls-demo/Utils/MemorySourceData';
import { Memory, Query } from 'Types/source';
import { Model } from 'Types/entity';
import * as memorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import controlTemplate = require('wml!Controls-demo/Search/ExpandableInput/Index');

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _navigation: object;
    protected _beforeMount(): void {
        this._source = new Memory({
            data: MemorySourceData.departments,
            filter: this._filterFunc,
            keyProperty: 'id',
        });
    }

    protected _filterFunc(item: Model, query: Query): object {
        const filter = memorySourceFilter('department');
        return filter(item, query);
    }
}
