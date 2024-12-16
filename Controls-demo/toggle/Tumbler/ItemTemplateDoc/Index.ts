import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Tumbler/ItemTemplateDoc/ItemTemplate';
import { RecordSet } from 'Types/collection';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _selectedKey: string = '1';

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Отправить',
                    icon: 'icon-Send',
                },
                {
                    id: '2',
                    caption: 'В Сбис',
                    icon: 'icon-SabyBird',
                },
            ],
            keyProperty: 'id',
        });
    }
}
