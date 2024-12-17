import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/ItemActionsMenu/Template';

import FewNone from 'Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/ItemActionsMenu/FewNone/Index';
import FewInside from 'Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/ItemActionsMenu/FewInside/Index';
import FullNone from 'Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/ItemActionsMenu/FullNone/Index';
import FullInside from 'Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/ItemActionsMenu/FullInside/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...FewNone.getLoadConfig(),
            ...FewInside.getLoadConfig(),
            ...FullNone.getLoadConfig(),
            ...FullInside.getLoadConfig(),
        };
    }
}
