import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/Mover/Mover';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import MoverBase from 'Controls-demo/treeGridNew/Mover/Base/Index';
import MoverExtended from 'Controls-demo/treeGridNew/Mover/Extended/Index';
import MoverHeadingCaption from 'Controls-demo/treeGridNew/Mover/HeadingCaption/Index';
import MoverRootLabelVisible from 'Controls-demo/treeGridNew/Mover/RootLabelVisible/Index';
import MoverSearchParam from 'Controls-demo/treeGridNew/Mover/SearchParam/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...MoverBase.getLoadConfig(),
            ...MoverExtended.getLoadConfig(),
            ...MoverHeadingCaption.getLoadConfig(),
            ...MoverRootLabelVisible.getLoadConfig(),
            ...MoverSearchParam.getLoadConfig(),
        };
    }
}
