import * as Template from 'wml!Controls-demo/tileNew/VirtualScroll/VirtualScroll';
import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import { IVirtualScrollConfig, IItemPadding } from 'Controls/list';
import { INavigationOptionValue, INavigationSourceConfig, IItemAction } from 'Controls/interface';
import { TItemActionShowType } from 'Controls/itemActions';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

const images = [
    Images.SPREADSHEET_250x200,
    Images.SWEETS_250x200,
    Images.BRIDGE,
    Images.LION,
    Images.CAR,
    Images.BURGER_300x190,
    Images.KLUKVA,
    Images.MILI,
];
function generateData(count: number): object[] {
    const items = [];
    for (let i = 0; i < count; i++) {
        items.push({
            key: i,
            title: `Плитка ${i}.img`,
            image: images[i % images.length],
        });
    }
    return items;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _virtualScrollConfig: IVirtualScrollConfig = {
        pageSize: 30,
    };
    protected _itemPadding: IItemPadding = {
        top: 'xl',
        bottom: 'xl',
        left: 'xl',
        right: 'xl',
    };
    protected _navigation: INavigationOptionValue<INavigationSourceConfig> = {
        source: 'page',
        view: 'infinity',
        sourceConfig: {
            page: 0,
            pageSize: 30,
            hasMore: false,
        },
    };
    protected _actions: IItemAction[] = [
        {
            id: 1,
            title: 'Удалить',
            showType: TItemActionShowType.TOOLBAR,
            icon: 'icon-Erase',
            iconStyle: 'danger',
            handler: (item: Model) => {
                this._items.remove(item);
            },
        },
    ];

    private _items: RecordSet;
    protected _itemsReadyCallback: Function = (items) => (this._items = items);

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: generateData(400),
        });
    }
}
