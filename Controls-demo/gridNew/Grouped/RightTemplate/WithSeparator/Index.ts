import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/Grouped/RightTemplate/WithSeparator/WithSeparator';

import Base from 'Controls-demo/gridNew/Grouped/RightTemplate/WithSeparator/Base/Index';
import TextAlignLeft from 'Controls-demo/gridNew/Grouped/RightTemplate/WithSeparator/TextAlignLeft/Index';
import TextAlignRight from 'Controls-demo/gridNew/Grouped/RightTemplate/WithSeparator/TextAlignRight/Index';
import TextVisibleFalse from 'Controls-demo/gridNew/Grouped/RightTemplate/WithSeparator/TextVisibleFalse/Index';

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
