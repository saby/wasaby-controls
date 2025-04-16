import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { Confirmation } from 'Controls/popup';
import { COMPANIES } from 'Controls-demo/LookupNew/resources/DataStorage';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import * as Template from 'wml!Controls-demo/LookupNew/Input/AddButton/Index';
import 'css!Controls-demo/LookupNew/Lookup';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: Memory = new Memory({
        data: COMPANIES,
        keyProperty: 'id',
        filter: MemorySourceFilter(),
    });
    protected _selectedKeys: string[] = [];
    protected _value: string = '';
    protected _selectorTemplate: TemplateFunction = {
        templateName: 'Controls-demo/LookupNew/Input/SelectorTemplate/resources/SelectorTemplate',
        templateOptions: {
            headingCaption: 'Выберите организацию',
        },
        popupOptions: {
            width: 500,
        },
    };

    protected _addButtonClickCallback(): void {
        Confirmation.openPopup({ message: 'AddButton click!', type: 'ok' });
    }
}
