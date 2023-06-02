import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/ItemActionsMenuOverflow/Template';
import { HierarchicalMemory } from 'Types/source';
import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import { Model } from 'Types/entity';

const DATA = Gadgets.getPreviewItems();

const ACTIONS = [
    {
        id: 1,
        icon: 'icon-DownloadNew',
        title: 'download',
        showType: 0,
    },
    {
        id: 2,
        icon: 'icon-Signature',
        title: 'signature',
        showType: 0,
    },
    {
        id: 3,
        icon: 'icon-Print',
        title: 'print',
        showType: 0,
    },
    {
        id: 4,
        icon: 'icon-Link',
        title: 'link',
        showType: 0,
    },
    {
        id: 5,
        icon: 'icon-Edit',
        title: 'edit',
        showType: 0,
    },
    {
        id: 6,
        icon: 'icon-Copy',
        title: 'copy',
        showType: 0,
    },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;
    protected _actions: any[] = ACTIONS;
    protected _clickedItem: string;
    protected _contextMenuConfig: object = {
        headerAdditionalTextProperty: 'additionalText',
    };

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: DATA,
        });
    }

    protected _itemClick(event: Event, item: Model): void {
        this._clickedItem = item.getKey();
    }

    static _styles: string[] = ['Controls-demo/tileNew/TileScalingMode/style'];
}
