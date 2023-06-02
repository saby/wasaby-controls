import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/StickyMarkedItem/Default';
import { Memory } from 'Types/source';
import { generateData } from '../DemoHelpers/DataCatalog';
import 'css!Controls/masterDetail';

interface IItem {
    title: string;
    key: number;
    keyProperty: string;
    count: number;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

    private dataArray: IItem[] = generateData({
        keyProperty: 'key',
        count: 100,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись с ключом ${item.key}.`;
        },
    });

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this.dataArray,
        });
    }
}
