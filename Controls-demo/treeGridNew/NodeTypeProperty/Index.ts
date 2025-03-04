import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/NodeTypeProperty';

import NodeTypePropertyAlignedByColumn from 'Controls-demo/treeGridNew/NodeTypeProperty/AlignedByColumn/Index';
import NodeTypePropertyBase from 'Controls-demo/treeGridNew/NodeTypeProperty/Base/Index';
import NodeTypePropertyChildNodes from 'Controls-demo/treeGridNew/NodeTypeProperty/ChildNodes/Index';
import NodeTypePropertyDynamicParentProperty from 'Controls-demo/treeGridNew/NodeTypeProperty/DynamicParentProperty/Index';
import NodeTypePropertyHideTheOnlyGroup from 'Controls-demo/treeGridNew/NodeTypeProperty/HideTheOnlyGroup/Index';
import NodeTypePropertyLadder from 'Controls-demo/treeGridNew/NodeTypeProperty/Ladder/Index';
import NodeTypePropertyVirtualScroll from 'Controls-demo/treeGridNew/NodeTypeProperty/VirtualScroll/Index';
import NodeTypePropertyWithMultiSelect from 'Controls-demo/treeGridNew/NodeTypeProperty/WithMultiSelect/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...NodeTypePropertyAlignedByColumn.getLoadConfig(),
            ...NodeTypePropertyBase.getLoadConfig(),
            ...NodeTypePropertyChildNodes.getLoadConfig(),
            ...NodeTypePropertyDynamicParentProperty.getLoadConfig(),
            ...NodeTypePropertyHideTheOnlyGroup.getLoadConfig(),
            ...NodeTypePropertyLadder.getLoadConfig(),
            ...NodeTypePropertyVirtualScroll.getLoadConfig(),
            ...NodeTypePropertyWithMultiSelect.getLoadConfig(),
        };
    }
}
