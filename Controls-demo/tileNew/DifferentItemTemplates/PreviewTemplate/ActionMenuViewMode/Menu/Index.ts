import { Control, TemplateFunction } from 'UI/Base';
import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/ActionMenuViewMode/Menu/Menu';

function getData() {
    return Gadgets.getPreviewItems().slice(5, 6);
}

/**
 * Демка для статьи https://wi.sbis.ru/docs/js/Controls/tile/View/options/actionMenuViewMode/?v=22.1100
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: any[] = Gadgets.getPreviewActions();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData0: {
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
