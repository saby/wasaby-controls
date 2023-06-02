import { Control, TemplateFunction } from 'UI/Base';
// @ts-ignore
import * as Template from 'wml!Controls-demo/toggle/ButtonGroup/ButtonGroup';
import { RecordSet } from 'Types/collection';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items1: RecordSet;
    protected _items2: RecordSet;
    protected _selectedKey1: string = '1';
    protected _selectedKey2: string = '5';

    protected _beforeMount(): void {
        this._items1 = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Название 1',
                },
                {
                    id: '2',
                    caption: 'Название 2',
                },
            ],
            keyProperty: 'id',
        });
        this._items2 = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Название 1',
                },
                {
                    id: '2',
                    caption: 'Название 2',
                },
                {
                    id: '3',
                    caption: 'Название 3',
                },
                {
                    id: '4',
                    caption: '4',
                },
                {
                    id: '5',
                    caption: 'Название 5',
                },
            ],
            keyProperty: 'id',
        });
        this._items3 = new RecordSet({
            rawData: [
                {
                    id: '1',
                    icon: 'icon-Admin2',
                },
                {
                    id: '2',
                    icon: 'icon-AdminInfo',
                },
                {
                    id: '3',
                    icon: 'icon-Android',
                },
                {
                    id: '4',
                    icon: 'icon-AreaGeom',
                },
                {
                    id: '5',
                    icon: 'icon-AutoTuning',
                },
            ],
            keyProperty: 'id',
        });
    }
}
