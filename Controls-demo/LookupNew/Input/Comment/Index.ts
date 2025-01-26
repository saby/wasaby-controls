import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/LookupNew/Input/Comment/Index');
import { Memory } from 'Types/source';
import { COMPANIES } from 'Controls-demo/LookupNew/resources/DataStorage';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectorTemplate: TemplateFunction = null;
    protected _selectedKeys: string[] = ['Наша компания'];
    protected _selectedKeysReadOnly: string[] = ['Наша компания'];
    protected _source: Memory = null;
    protected _valueReadOnly: string = 'Введенный вручную текст';
    protected _columns: object[] = null;

    protected _beforeMount(): void {
        this._source = new Memory({
            data: COMPANIES,
            keyProperty: 'id',
            filter: MemorySourceFilter(),
        });
        this._selectorTemplate = {
            templateName: 'Controls-demo/LookupNew/Input/SelectorTemplate/resources/SelectorTemplate',
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
