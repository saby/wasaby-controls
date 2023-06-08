import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/ItemActionsClass/Template';

function getData() {
    return Gadgets.getPreviewItems().slice(2, 4);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;
    protected _selectedKeys: string[] = [];
    protected _itemActions: IItemAction[] = [
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
    ];

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
