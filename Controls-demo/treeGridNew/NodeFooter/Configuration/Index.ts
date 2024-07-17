import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/NodeFooter/Configuration/Configuration';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import NodeFooterChangeFooter from 'Controls-demo/treeGridNew/NodeFooter/Configuration/ChangeFooter/Index';
import NodeFooterDefaultFooter from 'Controls-demo/treeGridNew/NodeFooter/Configuration/DefaultFooter/Index';
import NodeFooterCustomFooter from 'Controls-demo/treeGridNew/NodeFooter/Configuration/CustomFooter/Index';
import NodeFooterCustomFooterColspaned from 'Controls-demo/treeGridNew/NodeFooter/Configuration/CustomFooterColspaned/Index';
import NodeFooterDefaultFooterColspaned from 'Controls-demo/treeGridNew/NodeFooter/Configuration/DefaultFooterColspaned/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...NodeFooterChangeFooter.getLoadConfig(),
            // ...NodeFooterDefaultFooter.getLoadConfig(),
            // ...NodeFooterCustomFooter.getLoadConfig(),
            // ...NodeFooterCustomFooterColspaned.getLoadConfig(),
            // ...NodeFooterDefaultFooterColspaned.getLoadConfig(),
        };
    }
}
