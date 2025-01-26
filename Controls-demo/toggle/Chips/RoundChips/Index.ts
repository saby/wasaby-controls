import { Control, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import * as template from 'wml!Controls-demo/toggle/Chips/RoundChips/Template';
import * as brandTemplate from 'wml!Controls-demo/toggle/Chips/RoundChips/templates/tmpl';
import 'css!Controls-demo/toggle/Chips/RoundChips/Styles';

export default class RoundChips extends Control {
    protected _template: TemplateFunction = template;
    protected _items: RecordSet;
    protected _selectedKeys1: string[] = ['1'];
    protected _selectedKeys2: string[] = ['1'];

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    id: '1',
                    iconSize: 's',
                    iconTemplate: brandTemplate,
                    iconOptions: {
                        count: 1,
                    },
                },
                {
                    id: '2',
                    iconSize: 's',
                    iconTemplate: brandTemplate,
                    iconOptions: {
                        count: 2,
                    },
                },
                {
                    id: '3',
                    iconSize: 's',
                    iconTemplate: brandTemplate,
                    iconOptions: {
                        count: 3,
                    },
                },
                {
                    id: '4',
                    iconSize: 's',
                    iconTemplate: brandTemplate,
                    iconOptions: {
                        count: 4,
                    },
                },
                {
                    id: '5',
                    iconSize: 's',
                    iconTemplate: brandTemplate,
                    iconOptions: {
                        count: 5,
                    },
                },
                {
                    id: '6',
                    iconSize: 's',
                    iconTemplate: brandTemplate,
                    iconOptions: {
                        count: 6,
                    },
                },
            ],
            keyProperty: 'id',
        });
    }
}
