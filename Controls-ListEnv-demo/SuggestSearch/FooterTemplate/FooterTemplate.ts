import { Control, TemplateFunction } from 'UI/Base';
import * as MemorySourceFilter from 'Controls-ListEnv-demo/FilterPanel/View/Editors/LookupEditor/resources/MemorySourceFilter';
import * as SearchMemory from 'Controls-ListEnv-demo/SuggestSearch/resources/SearchMemory';
import { Memory } from 'Types/source';
import { _departmentsDataLong } from 'Controls-ListEnv-demo/SuggestSearch/resources/DataCatalog';
import controlTemplate = require('wml!Controls-ListEnv-demo/SuggestSearch/FooterTemplate/FooterTemplate');
import suggestTemplate = require('wml!Controls-ListEnv-demo/SuggestSearch/FooterTemplate/resources/SuggestTemplate');
import footerTemplate = require('wml!Controls-ListEnv-demo/SuggestSearch/FooterTemplate/resources/FooterTemplate');
import standartFooterTemplate = require('wml!Controls-ListEnv-demo/SuggestSearch/FooterTemplate/StandartFooterTemplate');

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _suggestTemplate: TemplateFunction = suggestTemplate;
    protected _demoFooterTemplate: TemplateFunction = footerTemplate;
    protected _standartFooterTemplate: TemplateFunction = standartFooterTemplate;
    protected _source: Memory;
    protected _navigation: object;
    protected _beforeMount(): void {
        this._source = new SearchMemory({
            keyProperty: 'id',
            data: _departmentsDataLong,
            searchParam: 'title',
            filter: MemorySourceFilter(),
        });
        this._navigation = {
            source: 'page',
            view: 'page',
            sourceConfig: {
                pageSize: 2,
                page: 0,
                hasMore: false,
            },
        };
    }

    static _styles: string[] = ['Controls-ListEnv-demo/SuggestSearch/Index'];
}
