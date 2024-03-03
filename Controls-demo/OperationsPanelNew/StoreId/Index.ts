import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/OperationsPanelNew/StoreId/Index';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import TreeMemory from 'Controls-demo/OperationsPanelNew/SelectionViewMode/TreeMemory';
import { getListData } from 'Controls-demo/OperationsPanelNew/DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _gridColumns: object[] = [{
        displayProperty: 'name',
    }];
    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new TreeMemory({
                        keyProperty: 'id',
                        data: getListData(),
                    }),
                    nodeProperty: 'Раздел@',
                    parentProperty: 'Раздел',
                    keyProperty: 'id',
                    selectedKeys: [],
                    excludedKeys: [],
                    multiSelectVisibility: 'onhover',
                },
            },
        };
    }
}
