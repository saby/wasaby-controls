import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/LookupNew/Input/SearchValue/resources/SelectorTemplate');
import { COMPANIES } from 'Controls-demo/LookupNew/resources/DataStorage';
import * as SearchMemory from 'Controls-demo/Search/SearchMemory';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';

interface IOptions {
    searchValue?: string;
}

export default class SelectorTemplate extends Control {
    protected _template: TemplateFunction = template;
    protected _source: SearchMemory = null;
    protected _keyProperty: string = 'id';
    protected _selectionChanged: boolean = false;
    protected _searchValue: string = '';

    protected _beforeMount(options: IOptions): void {
        this._source = new SearchMemory({
            keyProperty: 'id',
            data: COMPANIES,
            searchParam: 'title',
            filter: MemorySourceFilter(),
        });
        this._searchValue = options.searchValue;
    }
}
