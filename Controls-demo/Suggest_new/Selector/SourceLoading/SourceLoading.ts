import { Control, TemplateFunction } from 'UI/Base';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import DelaySuggestSource from 'Controls-demo/Suggest_new/Selector/SourceLoading/Source';
import { _departmentsDataLong } from 'Controls-demo/Suggest_new/DemoHelpers/DataCatalog';
import controlTemplate = require('wml!Controls-demo/Suggest_new/Selector/SourceLoading/SourceLoading');
import suggestTemplate = require('wml!Controls-demo/Suggest_new/Selector/SourceLoading/resources/SuggestTemplate');

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
}
