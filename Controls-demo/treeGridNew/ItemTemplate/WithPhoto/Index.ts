import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/ItemTemplate/WithPhoto/WithPhoto';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import Photo16px from 'Controls-demo/treeGridNew/ItemTemplate/WithPhoto/Photo16px/Index';
import Photo24px from 'Controls-demo/treeGridNew/ItemTemplate/WithPhoto/Photo24px/Index';
import Photo32px from 'Controls-demo/treeGridNew/ItemTemplate/WithPhoto/Photo32px/Index';
import Photo40px from 'Controls-demo/treeGridNew/ItemTemplate/WithPhoto/Photo40px/Index';
import TwoLevelsWithPhoto from 'Controls-demo/treeGridNew/ItemTemplate/WithPhoto/TwoLevelsWithPhoto/Index';
import TwoLevelsWithoutPhoto from 'Controls-demo/treeGridNew/ItemTemplate/WithPhoto/TwoLevelsWithoutPhoto/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Photo16px.getLoadConfig(false),
            ...Photo24px.getLoadConfig(false),
            ...Photo32px.getLoadConfig(false),
            ...Photo40px.getLoadConfig(false),
            ...TwoLevelsWithPhoto.getLoadConfig(false),
            ...TwoLevelsWithoutPhoto.getLoadConfig(false),
        };
    }
}
