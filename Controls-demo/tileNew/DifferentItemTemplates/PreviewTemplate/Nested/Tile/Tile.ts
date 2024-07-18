import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/ActionMode/ShowType/ShowType';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _selectedKeys: string[] = [];
    protected _itemActions: IItemAction[] = Gadgets.getPreviewActions();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            nestedListData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: Gadgets.getPreviewItems().slice(5, 6),
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                },
            },
        };
    }
}
