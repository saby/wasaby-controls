// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Template from 'wml!Controls-demo/list_new/ItemsView/VirtualScroll/ConstantHeights/Default/Index';
import { Control, TemplateFunction } from 'UI/Base';
import { generateData } from '../../../../DemoHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';

interface IItem {
    title: string;
    key: number;
    keyProperty: string;
    count: number;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;

    private dataArray: IItem[] = generateData({
        keyProperty: 'key',
        count: 300,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись с ключом ${item.key}.`;
        },
    });

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: this.dataArray,
        });
    }
}
