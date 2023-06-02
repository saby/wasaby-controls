import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/LookupNew/Input/SearchValue/Index');
import dialogTemplate = require('wml!Controls-demo/LookupNew/Input/SearchValue/resources/SelectorTemplate');
import { Memory } from 'Types/source';
import { COMPANIES } from 'Controls-demo/LookupNew/resources/DataStorage';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectorTemplate: TemplateFunction = null;
    protected _selectedKeys: string[] = [];
    protected _source: Memory = null;
    protected _columns: object[] = null;

    protected _beforeMount(): void {
        this._source = new Memory({
            data: COMPANIES,
            keyProperty: 'id',
            filter: MemorySourceFilter(),
        });
        this._selectorTemplate = {
            templateName:
                'Controls-demo/LookupNew/Input/SearchValue/resources/SelectorTemplate',
            templateOptions: {
                headingCaption: 'Выберите организацию',
            },
            popupOptions: {
                width: 500,
                height: 500,
            },
        };
    }
}
