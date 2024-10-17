import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Tumbler/MainCounterStyle/MainCounterStyle';
import { RecordSet } from 'Types/collection';

interface ICounterStyleItem {
    style: string;
    items: RecordSet;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: ICounterStyleItem[] = [];
    protected _selectedKey: string = '1';

    protected _beforeMount(): void {
        const styles = [
            'secondary',
            'primary',
            'warning',
            'danger',
            'unaccented',
            'link',
            'label',
            'info',
            'default',
        ];
        styles.forEach((style) => {
            this._items.push({
                style,
                items: new RecordSet({
                    rawData: [
                        {
                            id: '1',
                            caption: 'Item 1',
                            count: 10,
                            mainCounter: 15,
                            mainCounterStyle: style,
                        },
                        {
                            id: '2',
                            caption: 'Item 2',
                        },
                    ],
                }),
            });
        });
    }
}
