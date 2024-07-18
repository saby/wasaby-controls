import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/treeGridNew/Expander/ExpanderSize/ExpanderSize';

import ExpanderSizeAll from 'Controls-demo/treeGridNew/Expander/ExpanderSize/All/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ExpanderSizeAll.getLoadConfig(),
        };
    }
}
