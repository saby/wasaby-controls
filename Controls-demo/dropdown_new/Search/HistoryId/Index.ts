import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Search/HistoryId/Index');
import { Memory } from 'Types/source';
import SearchMemory from '../SearchMemory';
import searchFilter from 'Controls-demo/dropdown_new/Search/SearchFilter';
import { getFlatItems } from 'Controls-demo/dropdown_new/resources/Data';
import 'Controls/ExpandableSearch';

class HeaderContentTemplate extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _selectedKeys: number[] = [1];

    protected _beforeMount(): void {
        this._source = new SearchMemory({
            keyProperty: 'key',
            data: getFlatItems(),
            searchParam: 'title',
            filter: searchFilter,
        });
    }
}
export default HeaderContentTemplate;
