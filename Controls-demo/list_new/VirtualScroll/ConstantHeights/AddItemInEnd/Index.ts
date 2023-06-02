import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/ConstantHeights/AddItemInEnd/AddItemInEnd';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Container } from 'Controls/scroll';
import { generateData } from '../../../DemoHelpers/DataCatalog';
import { Model } from 'Types/entity';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { TVirtualScrollMode } from 'Controls/list';

interface IItem {
    title: string;
    key: number;
    keyProperty: string;
    count: number;
}

const itemActions: IItemAction[] = [
    {
        id: 'editVote',
        icon: 'icon-Edit',
        iconSize: 'm',
        title: 'Редактировать',
        showType: TItemActionShowType.MENU,
        style: 'msg-theme-action',
        iconStyle: 'secondary',
        tooltip: 'Редактировать',
    },
    {
        id: 'quoteMessage',
        icon: 'icon-Quote',
        iconSize: 'm',
        title: 'Цитировать',
        showType: TItemActionShowType.MENU_TOOLBAR,
        style: 'msg-theme-action',
        iconStyle: 'secondary',
        tooltip: 'Цитировать',
    },
    {
        id: 'sendAgain',
        icon: 'icon-Send',
        iconSize: 'm',
        title: 'Отправить ещё раз',
        showType: TItemActionShowType.MENU,
        style: 'msg-theme-action',
        iconStyle: 'secondary',
        tooltip: 'Отправить ещё раз',
    },
    {
        id: 'copyText',
        icon: 'icon-Copy',
        iconSize: 'm',
        title: 'Копировать текст',
        showType: TItemActionShowType.MENU,
        style: 'msg-theme-action',
        iconStyle: 'secondary',
        tooltip: 'Копировать текст',
    },
    {
        id: 'CopyLink',
        icon: 'icon-Link',
        iconSize: 'm',
        title: 'Получить ссылку',
        showType: TItemActionShowType.MENU,
        style: 'msg-theme-action',
        iconStyle: 'secondary',
        tooltip: 'Получить ссылку',
    },
    {
        id: 'pinMessage',
        icon: 'icon-Pin',
        title: 'Закрепить',
        showType: TItemActionShowType.MENU,
        weight: 6,
        style: 'msg-theme-action',
        iconStyle: 'secondary',
        tooltip: 'Закрепить',
    },
    {
        id: 'unPinMessage',
        icon: 'icon-PinOff',
        title: 'Открепить',
        showType: TItemActionShowType.MENU,
        weight: 7,
        style: 'msg-theme-action',
        iconStyle: 'secondary',
        tooltip: 'Открепить',
    },
    {
        id: 'createDiscussion',
        icon: 'icon-Question2',
        iconSize: 'm',
        title: 'Создать обсуждение',
        showType: TItemActionShowType.MENU,
        style: 'msg-theme-action',
        iconStyle: 'secondary',
        tooltip: 'Создать обсуждение',
    },
    {
        id: 'info',
        icon: 'icon-Info',
        iconSize: 'm',
        title: 'Информация',
        showType: TItemActionShowType.MENU,
        style: 'msg-theme-action',
        iconStyle: 'secondary',
        tooltip: 'Информация',
    },
    {
        id: 'deleteMessage',
        icon: 'icon-Erase',
        iconSize: 'm',
        iconStyle: 'danger',
        title: 'Удалить',
        showType: TItemActionShowType.MENU,
        style: 'msg-theme-action',
        tooltip: 'Удалить',
    },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _itemsCount: number = 1000;
    private _scrollToBottom: boolean = false;
    private _items: RecordSet;
    private _itemsReady: Function;
    protected _itemActions: IItemAction[] = itemActions;
    protected _virtualScrollMode: TVirtualScrollMode = 'remove';
    protected _children: {
        scroll: Container;
    };
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

    protected _addItem(): void {
        this._items.add(
            new Model({
                rawData: {
                    key: ++this._itemsCount,
                    title: `Запись с ключом ${this._itemsCount}.`,
                },
            })
        );
        this._scrollToBottom = true;
    }

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this.dataArray,
        });
        this._itemsReady = this._saveItems.bind(this);
    }

    private _itemActionVisibilityCallback(): boolean {
        return true;
    }

    private _saveItems(items: RecordSet): void {
        this._items = items;
    }

    private _onDrawItems(): void {
        if (this._scrollToBottom) {
            this._children.scroll.scrollToBottom();
            this._scrollToBottom = false;
        }
    }

    protected _toggleVirtualScrollMode(): void {
        this._virtualScrollMode =
            this._virtualScrollMode === 'hide' ? 'remove' : 'hide';
    }
}
