import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/treeGridNew/Offsets/LevelIndentSize/LevelIndentSize';

import All from 'Controls-demo/treeGridNew/Offsets/LevelIndentSize/All/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...All.getLoadConfig(),
        };
    }
}
