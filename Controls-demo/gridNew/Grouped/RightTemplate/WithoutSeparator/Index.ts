import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/Grouped/RightTemplate/WithoutSeparator/WithoutSeparator';

import RightTemplateWithoutSeparatorBase from 'Controls-demo/gridNew/Grouped/RightTemplate/WithoutSeparator/Base/Index';
import RightTemplateWithoutSeparatorTextAlignLeft from 'Controls-demo/gridNew/Grouped/RightTemplate/WithoutSeparator/TextAlignLeft/Index';
import RightTemplateWithoutSeparatorTextAlignRight from 'Controls-demo/gridNew/Grouped/RightTemplate/WithoutSeparator/TextAlignRight/Index';
import RightTemplateWithoutSeparatorTextVisibleFalse from 'Controls-demo/gridNew/Grouped/RightTemplate/WithoutSeparator/TextVisibleFalse/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...RightTemplateWithoutSeparatorBase.getLoadConfig(),
            ...RightTemplateWithoutSeparatorTextAlignLeft.getLoadConfig(),
            ...RightTemplateWithoutSeparatorTextAlignRight.getLoadConfig(),
            ...RightTemplateWithoutSeparatorTextVisibleFalse.getLoadConfig(),
        };
    }
}
