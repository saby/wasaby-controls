import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/Grouped/RightTemplate/WithoutSeparator/WithoutSeparator';

import Base from 'Controls-demo/gridNew/Grouped/RightTemplate/WithoutSeparator/Base/Index';
import TextAlignLeft from 'Controls-demo/gridNew/Grouped/RightTemplate/WithoutSeparator/TextAlignLeft/Index';
import TextAlignRight from 'Controls-demo/gridNew/Grouped/RightTemplate/WithoutSeparator/TextAlignRight/Index';
import TextVisibleFalse from 'Controls-demo/gridNew/Grouped/RightTemplate/WithoutSeparator/TextVisibleFalse/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Base.getLoadConfig(),
            ...TextAlignLeft.getLoadConfig(),
            ...TextAlignRight.getLoadConfig(),
            ...TextVisibleFalse.getLoadConfig(),
        };
    }
}
