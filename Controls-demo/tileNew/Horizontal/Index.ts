import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/Horizontal/Template';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import Buttons from 'Controls-demo/tileNew/Horizontal/Buttons/Index';
import Scroll from 'Controls-demo/tileNew/Horizontal/Scroll/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Buttons.getLoadConfig(),
            ...Scroll.getLoadConfig(),
        };
    }
}
