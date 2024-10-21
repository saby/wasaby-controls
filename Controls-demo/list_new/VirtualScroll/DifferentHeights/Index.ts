import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/DifferentHeights/DifferentHeights';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import DifferentHeightsBigFirstItemDown from 'Controls-demo/list_new/VirtualScroll/DifferentHeights/BigFirstItem/Down/Index';
import DifferentHeightsContacts from 'Controls-demo/list_new/VirtualScroll/DifferentHeights/Contacts/Index';
import DifferentHeightsDefault from 'Controls-demo/list_new/VirtualScroll/DifferentHeights/Default/Index';
import DifferentHeightsTasks from 'Controls-demo/list_new/VirtualScroll/DifferentHeights/Tasks/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...DifferentHeightsBigFirstItemDown.getLoadConfig(),
            ...DifferentHeightsContacts.getLoadConfig(),
            ...DifferentHeightsDefault.getLoadConfig(),
            ...DifferentHeightsTasks.getLoadConfig(),
        };
    }
}
