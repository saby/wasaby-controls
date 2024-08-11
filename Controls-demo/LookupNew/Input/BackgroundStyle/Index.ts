import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import { _companies } from 'Controls-demo/Lookup/DemoHelpers/DataCatalog';
import controlTemplate = require('wml!Controls-demo/LookupNew/Input/BackgroundStyle/Index');

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _navigation: object;
    protected _selectedKeys: string[] = [
        'Иванова Зинаида Михайловна, ИП',
        'Все юридические лица',
        'Наша компания',
    ];

    protected _beforeMount(): void {
        this._source = new Memory({
            data: _companies,
            keyProperty: 'id',
            filter: MemorySourceFilter(),
        });
    }
}
