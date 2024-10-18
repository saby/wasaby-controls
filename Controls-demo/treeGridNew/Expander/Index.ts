import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/Expander/Expander';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ExpanderIconNode from 'Controls-demo/treeGridNew/Expander/Node/Index';
import ExpanderIconNone from 'Controls-demo/treeGridNew/Expander/None/Index';
import ExpanderIconStyle from 'Controls-demo/treeGridNew/Expander/ExpanderIconStyle/Index';
import ExpanderPositionRight from 'Controls-demo/treeGridNew/Expander/ExpanderPosition/Right/Index';
import ExpanderSizeAll from 'Controls-demo/treeGridNew/Expander/ExpanderSize/All/Index';
import ExpanderPositionCustom from 'Controls-demo/treeGridNew/Expander/ExpanderPosition/Custom/Index';
import ExpanderVisibility from 'Controls-demo/treeGridNew/Expander/ExpanderVisibility/Index';
import ExpanderVisibilityHasChildren from 'Controls-demo/treeGridNew/Expander/ExpanderVisibility/HasChildren/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ExpanderIconNode.getLoadConfig(),
            ...ExpanderIconNone.getLoadConfig(),
            ...ExpanderIconStyle.getLoadConfig(),
            // ...ExpanderPositionRight.getLoadConfig(),
            ...ExpanderSizeAll.getLoadConfig(),
            //...ExpanderPositionCustom.getLoadConfig(),
            ...ExpanderVisibility.getLoadConfig(),
            ...ExpanderVisibilityHasChildren.getLoadConfig(),
        };
    }
}
