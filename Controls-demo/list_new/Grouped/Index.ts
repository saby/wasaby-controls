import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/list_new/Grouped/Grouped';

import Base from 'Controls-demo/list_new/Grouped/Base/Index';
import HiddenGroup from 'Controls-demo/list_new/Grouped/HiddenGroup/Index';
import CaptionAlignLeft from 'Controls-demo/list_new/Grouped/CaptionAlign/Left/Index';
import CaptionAlignRight from 'Controls-demo/list_new/Grouped/CaptionAlign/Right/Index';
import WithoutSeparatorLeft from 'Controls-demo/list_new/Grouped/WithoutSeparator/Left/Index';
import WithoutSeparatorRight from 'Controls-demo/list_new/Grouped/WithoutSeparator/Right/Index';
import WithoutExpander from 'Controls-demo/list_new/Grouped/WithoutExpander/Index';
import LongGroupName from 'Controls-demo/list_new/Grouped/LongGroupName/Index';
import ContentTemplate from 'Controls-demo/list_new/Grouped/ContentTemplate/Index';
import RightTemplate from 'Controls-demo/list_new/Grouped/RightTemplate/Index';
import OnGroupCollapsed from 'Controls-demo/list_new/Grouped/OnGroupCollapsed/Index';
import GroupHistoryId from 'Controls-demo/list_new/Grouped/groupHistoryId/Index';
import Sticky from 'Controls-demo/list_new/Grouped/Sticky/Index';
import NoSticky from 'Controls-demo/list_new/Grouped/NoSticky/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Base.getLoadConfig(),
            ...HiddenGroup.getLoadConfig(),
            ...CaptionAlignLeft.getLoadConfig(),
            ...CaptionAlignRight.getLoadConfig(),
            ...WithoutSeparatorLeft.getLoadConfig(),
            ...WithoutSeparatorRight.getLoadConfig(),
            ...WithoutExpander.getLoadConfig(),
            ...LongGroupName.getLoadConfig(),
            ...ContentTemplate.getLoadConfig(),
            ...RightTemplate.getLoadConfig(),
            ...OnGroupCollapsed.getLoadConfig(),
            ...GroupHistoryId.getLoadConfig(),
            ...Sticky.getLoadConfig(),
            ...NoSticky.getLoadConfig(),
        };
    }
}
