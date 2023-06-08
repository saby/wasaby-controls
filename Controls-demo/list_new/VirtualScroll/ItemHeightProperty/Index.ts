import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/ItemHeightProperty/Template';
import { Memory } from 'Types/source';

interface IItem {
    title: string;
    key: number;
    keyProperty: string;
    count: number;
}

const DATA = [300, 250, 200, 250, 300].map((height, index) => {
    return {
        key: index,
        height,
        title: `Запись с ключом ${index} и высотой ${height}.`,
    };
});

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _activeElement: number = 2;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: DATA,
        });
    }
}
