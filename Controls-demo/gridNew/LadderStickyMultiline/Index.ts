import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/LadderStickyMultiline/LadderStickyMultiline';

import StickyMultiline from 'Controls-demo/gridNew/LadderStickyMultiline/StickyMultiline/Index';
import StickyMultilineWithHeader from 'Controls-demo/gridNew/LadderStickyMultiline/StickyMultilineWithHeader/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...StickyMultiline.getLoadConfig(),
            ...StickyMultilineWithHeader.getLoadConfig(),
        };
    }
}
