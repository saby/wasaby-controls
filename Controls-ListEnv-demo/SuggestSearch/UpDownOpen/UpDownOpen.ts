import { Control, TemplateFunction } from 'UI/Base';
import * as MemorySourceFilter from 'Controls-ListEnv-demo/FilterPanel/View/Editors/LookupEditor/resources/MemorySourceFilter';
import * as SearchMemory from 'Controls-ListEnv-demo/SuggestSearch/resources/SearchMemory';
import { Memory } from 'Types/source';
import { _departmentsDev } from 'Controls-ListEnv-demo/SuggestSearch/resources/DataCatalog';
import controlTemplate = require('wml!Controls-ListEnv-demo/SuggestSearch/UpDownOpen/UpDownOpen');
import suggestTemplate = require('wml!Controls-ListEnv-demo/SuggestSearch/UpDownOpen/resources/SuggestTemplate');

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _suggestTemplate: TemplateFunction = suggestTemplate;
    protected _source: Memory;
    protected _navigation: object;
    protected _beforeMount(): void {
        this._source = new SearchMemory({
            keyProperty: 'id',
            data: _departmentsDev,
            searchParam: 'title',
            filter: MemorySourceFilter(),
        });
        this._navigation = {
            source: 'page',
            view: 'page',
            sourceConfig: {
                pageSize: 12,
                page: 0,
                hasMore: false,
            },
        };
    }

    static _styles: string[] = ['Controls-ListEnv-demo/SuggestSearch/Index'];
}
