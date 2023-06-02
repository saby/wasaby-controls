import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/ItemActionsMenu/InsideSingleItem/Template';
import { HierarchicalMemory } from 'Types/source';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';
import { TItemActionShowType } from 'Controls/itemActions';
import { Model } from 'Types/entity';

const DATA = [
    {
        id: 0,
        parent: null,
        type: null,
        title: 'Название',
        image: explorerImages[8],
        titleStyle: 'light',
        titleLines: 2,
        'parent@': true,
        gradientType: 'dark',
        isDocument: true,
        width: 300,
        imageWidth: 1200,
        imageHeight: 800,
        isShadow: true,
    },
];

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
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;
    protected _actions: any[] = ACTIONS;

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
        item: Model
    ): string {
        return item.get('image');
    }

    static _styles: string[] = ['Controls-demo/tileNew/TileScalingMode/style'];
}
