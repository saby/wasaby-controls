import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/Grouped/RightTemplate/WithSeparator/WithSeparator';

import RightTemplateWithSeparatorBase from 'Controls-demo/gridNew/Grouped/RightTemplate/WithSeparator/Base/Index';
import RightTemplateWithSeparatorTextAlignLeft from 'Controls-demo/gridNew/Grouped/RightTemplate/WithSeparator/TextAlignLeft/Index';
import RightTemplateWithSeparatorTextAlignRight from 'Controls-demo/gridNew/Grouped/RightTemplate/WithSeparator/TextAlignRight/Index';
import RightTemplateWithSeparatorTextVisibleFalse from 'Controls-demo/gridNew/Grouped/RightTemplate/WithSeparator/TextVisibleFalse/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...RightTemplateWithSeparatorBase.getLoadConfig(),
            ...RightTemplateWithSeparatorTextAlignLeft.getLoadConfig(),
            ...RightTemplateWithSeparatorTextAlignRight.getLoadConfig(),
            ...RightTemplateWithSeparatorTextVisibleFalse.getLoadConfig(),
        };
    }
}
