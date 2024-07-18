import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ItemClickBase from 'Controls-demo/list_new/ItemClick/Base/Index';
import ItemClickWithEditing from 'Controls-demo/list_new/ItemClick/WithEditing/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ItemClickBase.getLoadConfig(),
            ...ItemClickWithEditing.getLoadConfig(),
        };
    }
}
