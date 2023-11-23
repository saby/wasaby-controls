import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/ColumnsView/ColumnsView';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import Default from 'Controls-demo/list_new/ColumnsView/Default/Index';
import CustomTemplate from 'Controls-demo/list_new/ColumnsView/CustomTemplate/Index';
import MasterDetail from 'Controls-demo/list_new/ColumnsView/MasterDetail/Index';

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Default.getLoadConfig(),
            ...CustomTemplate.getLoadConfig(),
            ...MasterDetail.getLoadConfig(),
        };
    }
}
