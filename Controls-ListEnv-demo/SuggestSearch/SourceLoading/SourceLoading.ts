import { Control, TemplateFunction } from 'UI/Base';
import * as MemorySourceFilter from 'Controls-ListEnv-demo/FilterPanel/View/Editors/LookupEditor/resources/MemorySourceFilter';
import DelaySuggestSource from 'Controls-ListEnv-demo/SuggestSearch/SourceLoading/Source';
import { _departmentsDataLong } from 'Controls-ListEnv-demo/SuggestSearch/resources/DataCatalog';
import controlTemplate = require('wml!Controls-ListEnv-demo/SuggestSearch/SourceLoading/SourceLoading');
import suggestTemplate = require('wml!Controls-ListEnv-demo/SuggestSearch/SourceLoading/resources/SuggestTemplate');

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _suggestTemplate: TemplateFunction = suggestTemplate;
    protected _source: DelaySuggestSource = null;
    protected _navigation: object;
    protected _beforeMount(): void {
        this._source = new DelaySuggestSource({
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
