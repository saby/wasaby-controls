import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Search/SearchWidth/Index');
import { Memory } from 'Types/source';
import SearchMemory from '../SearchMemory';
import searchFilter from '../SearchFilter';

class SearchFlat extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;

    protected _beforeMount(): void {
        this._source = new SearchMemory({
            keyProperty: 'key',
            data: [
                {
                    key: '1',
                    title: 'Message',
                    icon: 'icon-EmptyMessage',
                    iconStyle: 'info',
                },
                { key: '2', title: 'Report' },
                { key: '3', title: 'Task', icon: 'icon-TFTask' },
                { key: '4', title: 'News' },
            ],
            searchParam: 'title',
            filter: searchFilter,
        });
    }
}
export default SearchFlat;
