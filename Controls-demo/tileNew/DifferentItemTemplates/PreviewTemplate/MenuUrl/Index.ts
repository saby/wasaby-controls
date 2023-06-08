import { Control, TemplateFunction } from 'UI/Base';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/MenuUrl/Template';
import { HierarchicalMemory } from 'Types/source';
import { TItemActionShowType } from 'Controls/itemActions';
import { Model } from 'Types/entity';

const ACTIONS = [
    {
        id: 1,
        icon: 'icon-DownloadNew',
        title: 'download',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 2,
        icon: 'icon-Signature',
        title: 'signature',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 3,
        icon: 'icon-Print',
        title: 'print',
        iconStyle: 'warning',
        showType: TItemActionShowType.FIXED,
    },
    {
        id: 4,
        icon: 'icon-Link',
        title: 'link',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 41,
        icon: 'icon-Erase',
        iconStyle: 'danger',
        title: 'remove',
        showType: TItemActionShowType.FIXED,
    },
    {
        id: 5,
        icon: 'icon-Edit',
        title: 'edit',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 6,
        icon: 'icon-Copy',
        title: 'copy',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 7,
        icon: 'icon-Paste',
        title: 'phone',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 8,
        icon: 'icon-EmptyMessage',
        title: 'message',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 9,
        icon: 'icon-PhoneNull',
        title: 'phone',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 10,
        icon: 'icon-Edit',
        title: 'edit',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 11,
        icon: 'icon-Copy',
        title: 'copy',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 12,
        icon: 'icon-Paste',
        title: 'phone',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 13,
        icon: 'icon-EmptyMessage',
        title: 'message',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 14,
        icon: 'icon-PhoneNull',
        title: 'phone',
        showType: TItemActionShowType.MENU,
    },
];

const DATA = [
    {
        id: 1,
        parent: null,
        type: null,
        'parent@': null,
        title: 'Песец',
        titleStyle: 'light',
        titleLines: 2,
        imageWidth: 1200,
        imageHeight: 800,
        gradientType: 'dark',
        image: explorerImages[13],
        imageMenu: explorerImages[8],
        width: 150,
    },
];
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;
    protected _itemActions: any[] = ACTIONS;

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: DATA,
        });
    }

    protected _imageUrlResolver(
        width: number,
        height: number,
        url: string = '',
        item: Model,
        isMenu: boolean
    ): string {
        return isMenu ? item.get('imageMenu') : item.get('image');
    }

    static _styles: string[] = ['Controls-demo/tileNew/TileScalingMode/style'];
}
