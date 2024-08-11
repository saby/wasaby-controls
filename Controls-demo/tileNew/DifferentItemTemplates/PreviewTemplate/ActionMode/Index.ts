import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/ActionMode/ActionMode';

import Adaptive from 'Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/ActionMode/Adaptive/Index';
import ShowType from 'Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/ActionMode/ShowType/Index';

/**
 * Демка для статьи https://wi.sbis.ru/docs/js/Controls/tile/View/options/actionMode/?v=22.1100
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Adaptive.getLoadConfig(),
            ...ShowType.getLoadConfig(),
        };
    }
}
