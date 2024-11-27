import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Search/ExpandableInput/InlineWidthAuto/Index');
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { SyntheticEvent } from 'UICommon/Events';

class HeaderContentTemplate extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _items: RecordSet;
    protected _selectedKey: string;

    protected _beforeMount(): void {
        this._selectedKey = '1';
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '0',
                    title: 'Вправо',
                },
                {
                    id: '1',
                    title: 'Влево',
                },
            ],
        });
        this._source = new Memory({
            keyProperty: 'key',
            data: [
                { key: 1, title: 'Ярославль' },
                { key: 2, title: 'Москва' },
                { key: 3, title: 'Санкт-Петербург' },
            ],
        });
    }

    _selectedKeyChanged(event: SyntheticEvent, value: string) {
        this._selectedKey = value;
    }
}
export default HeaderContentTemplate;
