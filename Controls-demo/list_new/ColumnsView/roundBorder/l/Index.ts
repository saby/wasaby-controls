import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/list_new/ColumnsView/roundBorder/l/l');
import { Memory as MemorySource, Memory } from 'Types/source';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';

import { generateData } from '../../../DemoHelpers/DataCatalog';

const NUMBER_OF_ITEMS = 4;

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory;
    private _dataArray: { key: number; title: string }[];

    protected _itemActions: IItemAction[];

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
        this._itemActions = [
            {
                id: 1,
                icon: 'icon-EmptyMessage',
                title: 'message',
                showType: TItemActionShowType.MENU,
            },
            {
                id: 2,
                icon: 'icon-Erase',
                iconStyle: 'danger',
                title: 'delete',
                showType: TItemActionShowType.MENU,
            },
        ];
    }
}
