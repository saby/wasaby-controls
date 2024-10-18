import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/ToggleImageVisible/ToggleImageVisible';

import ImagePropertyValueChanged from 'Controls-demo/tileNew/DifferentItemTemplates/ToggleImageVisible/ImagePropertyValueChanged/Index';
import ScrollToDown from 'Controls-demo/tileNew/DifferentItemTemplates/ToggleImageVisible/ScrollToDown/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ImagePropertyValueChanged.getLoadConfig(),
            ...ScrollToDown.getLoadConfig(),
        };
    }
}
