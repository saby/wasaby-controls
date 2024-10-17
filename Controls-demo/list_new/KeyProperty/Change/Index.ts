import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/KeyProperty/Change/Change';
import { RecordSet } from 'Types/collection';

const data1 = [
    {
        key: 1,
        title: 'Элемент 1 (key1)',
        withList: false,
    },
    {
        key: 2,
        title: 'Элемент 2 (key1)',
        withList: false,
    },
    {
        key: 3,
        title: 'Элемент 3 (key1)',
        withList: true,
    },
    {
        key: 4,
        title: 'Элемент 4 (key1)',
        withList: false,
    },
    {
        key: 5,
        title: 'Элемент 5 (key1)',
        withList: false,
    },
];

const data2 = [
    {
        key2: 1,
        key: 1,
        title: 'Элемент 1 (key2)',
        withList: false,
    },
    {
        key2: 2,
        title: 'Элемент 2 (key2)',
        withList: false,
    },
    {
        key2: 3,
        key: 3,
        title: 'Элемент 3 (key2)',
        withList: true,
    },
    {
        key2: 4,
        title: 'Элемент 4 (key2)',
        withList: false,
    },
    {
        key2: 5,
        title: 'Элемент 5 (key2)',
        withList: false,
    },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _keyProperty: string;

    protected _beforeMount(): void {
        this._keyProperty = 'key';
        this._items = new RecordSet({
            rawData: data1,
            keyProperty: this._keyProperty,
        });
    }

    protected _changeOptions(): void {
        if (this._keyProperty === 'key') {
            this._keyProperty = 'key2';
            this._items = new RecordSet({
                rawData: data2,
                keyProperty: this._keyProperty,
            });
        } else {
            this._keyProperty = 'key';
            this._items = new RecordSet({
                rawData: data1,
                keyProperty: this._keyProperty,
            });
        }
    }
}
