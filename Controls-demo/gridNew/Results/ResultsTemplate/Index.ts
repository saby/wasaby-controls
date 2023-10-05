import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/Results/ResultsTemplate/ResultsTemplate';

import Default from 'Controls-demo/gridNew/Results/ResultsTemplate/Default/Index';
import Unaccented from 'Controls-demo/gridNew/Results/ResultsTemplate/Unaccented/Index';
import Additional from 'Controls-demo/gridNew/Results/ResultsTemplate/Additional/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Default.getLoadConfig(),
            ...Unaccented.getLoadConfig(),
            ...Additional.getLoadConfig(),
        };
    }
}
