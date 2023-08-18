import { Control, TemplateFunction } from 'UI/Base';
import { IColumn } from 'Controls/grid';
import { getListData as getData } from 'Controls-demo/OperationsPanelNew/DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import Memory from 'Controls-ListEnv-demo/OperationsPanel/ChildrenCountProperty/Memory';
import * as Template from 'wml!Controls-ListEnv-demo/OperationsPanel/ChildrenCountProperty/Template';
import 'wml!Controls-demo/operations/SelectionViewMode/resources/PersonInfo';
import 'css!Controls-ListEnv-demo/OperationsPanel/ChildrenCountProperty/style';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _gridColumns: IColumn[] = null;

    protected _beforeMount(): void {
        this._gridColumns = [
            {
                template: 'wml!Controls-ListEnv-demo/OperationsPanel/ChildrenCountProperty/PersonInfo',
            },
        ];
    }

    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ChildrenCountProperty: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    viewMode: 'table',
                    root: null,
                    keyProperty: 'id',
                    parentProperty: 'Раздел',
                    nodeProperty: 'Раздел@',
                    multiSelectVisibility: 'visible',
                    listActions: 'Controls-ListEnv-demo/OperationsPanel/View/listActions',
                },
            },
        };
    }
}
