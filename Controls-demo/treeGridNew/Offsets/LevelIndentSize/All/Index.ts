import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/Offsets/LevelIndentSize/All/All';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import OffsetsLevelIndentSizeAllSizeM from 'Controls-demo/treeGridNew/Offsets/LevelIndentSize/All/SizeM/Index';
import OffsetsLevelIndentSizeAllSizeCustom from 'Controls-demo/treeGridNew/Offsets/LevelIndentSize/All/SizeCustom/Index';
import OffsetsLevelIndentSizeAllSizeL from 'Controls-demo/treeGridNew/Offsets/LevelIndentSize/All/SizeL/Index';
import OffsetsLevelIndentSizeAllSizeS from 'Controls-demo/treeGridNew/Offsets/LevelIndentSize/All/SizeS/Index';
import OffsetsLevelIndentSizeAllSizeXL from 'Controls-demo/treeGridNew/Offsets/LevelIndentSize/All/SizeXL/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...OffsetsLevelIndentSizeAllSizeM.getLoadConfig(),
            ...OffsetsLevelIndentSizeAllSizeCustom.getLoadConfig(),
            ...OffsetsLevelIndentSizeAllSizeL.getLoadConfig(),
            ...OffsetsLevelIndentSizeAllSizeS.getLoadConfig(),
            ...OffsetsLevelIndentSizeAllSizeXL.getLoadConfig(),
        };
    }
}
