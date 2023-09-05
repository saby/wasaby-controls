import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Search/HistoryId/Index');
import { Memory } from 'Types/source';
import SearchMemory from '../SearchMemory';
import searchFilter from 'Controls-demo/dropdown_new/Search/SearchFilter';
import { getItems, overrideOrigSourceMethod, resetHistory } from './Utils';

class HeaderContentTemplate extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _selectedKeys: number[] = [1];

    protected _beforeMount(): void {
        overrideOrigSourceMethod();
        this._source = new SearchMemory({
            keyProperty: 'key',
            data: getItems(),
            searchParam: 'title',
            filter: searchFilter,
        });
    }

    protected _beforeUnmount(): void {
        resetHistory();
    }
}
export default HeaderContentTemplate;
