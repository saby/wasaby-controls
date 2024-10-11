import { Control, TemplateFunction } from 'UI/Base';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import * as SearchMemory from 'Controls-demo/Search/SearchMemory';
import { Memory } from 'Types/source';
import { _departmentsDev } from 'Controls-demo/Suggest_new/DemoHelpers/DataCatalog';
import controlTemplate = require('wml!Controls-demo/Suggest_new/Input/UpDownOpen/UpDownOpen');
import suggestTemplate = require('wml!Controls-demo/Suggest_new/Input/UpDownOpen/resources/SuggestTemplate');

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

    static _styles: string[] = ['Controls-demo/Suggest_new/Index'];
}
