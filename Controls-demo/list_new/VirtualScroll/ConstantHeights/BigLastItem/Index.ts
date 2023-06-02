import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/ConstantHeights/BigLastItem/BigLastItem';
import { Memory } from 'Types/source';
import { generateData } from '../../../DemoHelpers/DataCatalog';

interface IItem {
    title: string;
    key: number;
    keyProperty: string;
    count: number;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _initialScrollPosition: object = {
        vertical: 'end',
    };

    private _dataArray: IItem[] = generateData({
        keyProperty: 'key',
        count: 200,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись с ключом ${item.key}.`;
        },
    });

    protected _beforeMount(): void {
        let title = this._dataArray[this._dataArray.length - 1].title;
        for (let i = 0; i < 7; i++) {
            title += title;
        }
        this._dataArray[this._dataArray.length - 1].title = title;

        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._dataArray,
        });
    }
}
