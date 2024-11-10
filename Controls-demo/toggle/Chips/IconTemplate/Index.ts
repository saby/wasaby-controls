import { Control, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import { BrandsImages } from 'Controls-demo/DemoData';
import * as template from 'wml!Controls-demo/toggle/Chips/IconTemplate/Index';
import * as brandTemplate from 'wml!Controls-demo/toggle/Chips/IconTemplate/templates/brandTemplate';

export default class IconTemplate extends Control {
    protected _template: TemplateFunction = template;
    protected _items: RecordSet;
    protected _selectedKeys: string[] = ['1'];

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Asus',
                    iconSize: 'l',
                    iconTemplate: brandTemplate,
                    iconOptions: {
                        src: BrandsImages.asus,
                    },
                },
                {
                    id: '2',
                    caption: 'Apple',
                    iconSize: 'l',
                    iconTemplate: brandTemplate,
                    iconOptions: {
                        src: BrandsImages.apple,
                    },
                },
            ],
            keyProperty: 'id',
        });
    }
}
