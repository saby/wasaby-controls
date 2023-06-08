import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { Model } from 'Types/entity';
import { IItemAction } from 'Controls/itemActions';

import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/ItemActionsPosition/Custom/Template';
import 'css!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/ItemActionsPosition/Custom/Custom';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Gadgets.getPreviewItems().slice(2, 4);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _selectedKeys: string[] = [];
    protected _itemActions: IItemAction[] = [
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
    ];

    protected _itemActionVisibilityCallback(action: IItemAction, item: Model): boolean {
        return item.get('id') !== 3;
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
