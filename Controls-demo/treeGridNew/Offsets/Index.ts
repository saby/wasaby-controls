import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/Offsets/Offsets';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import OffsetsLevelIndentSize from 'Controls-demo/treeGridNew/Offsets/LevelIndentSize/Index';
import OffsetsWithoutLevelPadding from 'Controls-demo/treeGridNew/Offsets/WithoutLevelPadding/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...OffsetsLevelIndentSize.getLoadConfig(),
            ...OffsetsWithoutLevelPadding.getLoadConfig(),
        };
    }
}
