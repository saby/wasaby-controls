import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/Size/Size';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import SizeDefault from 'Controls-demo/gridNew/EditInPlace/Size/Default/Index';
import SizeS from 'Controls-demo/gridNew/EditInPlace/Size/S/Index';
import SizeM from 'Controls-demo/gridNew/EditInPlace/Size/M/Index';
import SizeL from 'Controls-demo/gridNew/EditInPlace/Size/L/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...SizeDefault.getLoadConfig(),
            ...SizeS.getLoadConfig(),
            ...SizeM.getLoadConfig(),
            ...SizeL.getLoadConfig(),
        };
    }
}
