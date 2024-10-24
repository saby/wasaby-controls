import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/Results/SingleRecordResults/SingleRecordResults';

import Simple from 'Controls-demo/gridNew/Results/SingleRecordResults/Simple/Index';
import Visible from 'Controls-demo/gridNew/Results/SingleRecordResults/Visible/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Simple.getLoadConfig(),
            ...Visible.getLoadConfig(),
        };
    }
}
