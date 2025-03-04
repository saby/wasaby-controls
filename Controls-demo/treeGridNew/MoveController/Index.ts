import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/MoveController/MoveController';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import MoveControllerBase from 'Controls-demo/treeGridNew/MoveController/Base/Index';
// import MoveControllerBeforeMoveCallback from 'Controls-demo/treeGridNew/MoveController/BeforeMoveCallback/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...MoveControllerBase.getLoadConfig(),
            // ...MoveControllerBeforeMoveCallback.getLoadConfig(),
        };
    }
}
