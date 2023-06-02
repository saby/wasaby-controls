import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/ConstantHeights/SmallDialog/SmallDialog';
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

    private dataArray: IItem[] = generateData({
        keyProperty: 'key',
        count: 1000,
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
