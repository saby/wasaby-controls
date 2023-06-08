import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/treeGridNew/Offsets/LevelIndentSize/LevelIndentSize';

import SizeXL from 'Controls-demo/treeGridNew/Offsets/LevelIndentSize/All/SizeXL/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...SizeXL.getLoadConfig(),
        };
    }
}
