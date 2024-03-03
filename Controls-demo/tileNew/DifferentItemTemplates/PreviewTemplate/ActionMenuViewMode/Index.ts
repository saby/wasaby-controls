import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/ActionMenuViewMode/ActionMenuViewMode';

import Menu from 'Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/ActionMenuViewMode/Menu/Index';
import Preview from 'Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/ActionMenuViewMode/Preview/Index';

/**
 * Демка для статьи https://wi.sbis.ru/docs/js/Controls/tile/View/options/actionMenuViewMode/?v=22.1100
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Menu.getLoadConfig(),
            ...Preview.getLoadConfig(),
        };
    }
}
