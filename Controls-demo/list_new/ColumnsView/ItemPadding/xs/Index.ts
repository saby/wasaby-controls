import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/list_new/ColumnsView/ItemPadding/Template');
import { Memory as MemorySource, Memory } from 'Types/source';
import { generateData } from '../../../DemoHelpers/DataCatalog';

const NUMBER_OF_ITEMS = 10;

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory;
    protected _dataArray: { key: number; title: string }[];
    protected _itemPaddingSize: string = 'xs';

    protected _beforeMount(): void {
        this._dataArray = generateData<{ key: number; title: string }>({
            count: NUMBER_OF_ITEMS,
            entityTemplate: { title: 'string' },
            beforeCreateItemCallback: (item) => {
                item.title = `Запись с id="${item.key}". `;
            },
        });
        this._viewSource = new MemorySource({
            data: this._dataArray,
            keyProperty: 'key',
        });
    }
}
