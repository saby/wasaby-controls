import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/DifferentHeights/BigFirstItem/Up/Up';
import { Memory } from 'Types/source';
import { generateData } from '../../../../DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _scrollToLastItem: boolean = true;

    private _dataArray: { key: number; title: string }[] = generateData<{
        key: number;
        title: string;
    }>({
        count: 1000,
        entityTemplate: { title: 'lorem' },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись с id="${item.key}". ${item.title}`;
            // eslint-disable-next-line
            if (item.key === 999) {
                item.title = 'Это очень большая запись!';
            }
        },
    });

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._dataArray,
        });
    }

    protected _drawItems() {
        if (this._scrollToLastItem) {
            this._children.listView.scrollToItem(999);
            this._scrollToLastItem = false;
        }
    }
}
