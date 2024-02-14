import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/Default/Default';
import { Gadgets } from 'Controls-demo/tileNew/DataHelpers/DataCatalog';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Gadgets.getRichItems();
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: object[] = [];

    protected _beforeMount(): void {
        this._itemActions = Gadgets.getActions();
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData4: {
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
