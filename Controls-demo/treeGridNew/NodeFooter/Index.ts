import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/NodeFooter/NodeFooter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import NodeFooterChangeFooter from 'Controls-demo/treeGridNew/NodeFooter/Configuration/ChangeFooter/Index';
import NodeFooter from 'Controls-demo/treeGridNew/NodeFooter/Configuration/Index';
import NodeFooterMoreButton from 'Controls-demo/treeGridNew/NodeFooter/MoreButton/Index';
import NodeFooterMoreFontColorStyle from 'Controls-demo/treeGridNew/NodeFooter/MoreFontColorStyle/Index';
import NodeFooterExpanderIconNone from 'Controls-demo/treeGridNew/NodeFooter/ExpanderIconNone/Index';
import NodeFooterMultiLadder from 'Controls-demo/treeGridNew/NodeFooter/MultiLadder/Index';
import NodeFooterTemplate from 'Controls-demo/treeGridNew/NodeFooter/NodeFooterTemplate/Index';
import NodeFooterStickyLadder from 'Controls-demo/treeGridNew/NodeFooter/StickyLadder/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...NodeFooterChangeFooter.getLoadConfig(),
            ...NodeFooter.getLoadConfig(),
            ...NodeFooterMoreButton.getLoadConfig(),
            ...NodeFooterMoreFontColorStyle.getLoadConfig(),
            ...NodeFooterExpanderIconNone.getLoadConfig(),
            ...NodeFooterMultiLadder.getLoadConfig(),
            ...NodeFooterTemplate.getLoadConfig(),
            ...NodeFooterStickyLadder.getLoadConfig(),
        };
    }
}
