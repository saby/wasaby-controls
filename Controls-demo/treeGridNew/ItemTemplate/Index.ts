import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/ItemTemplate/ItemTemplate';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ItemTemplateBackgroundColorStyle from 'Controls-demo/treeGridNew/ItemTemplate/BackgroundColorStyle/Index';
import ItemTemplateColspanNodes from 'Controls-demo/treeGridNew/ItemTemplate/ColspanNodes/Index';
import ItemTemplateNoHighlightOnHover from 'Controls-demo/treeGridNew/ItemTemplate/NoHighlightOnHover/Index';
import ItemTemplateNoClickable from 'Controls-demo/treeGridNew/ItemTemplate/NoClickable/Index';
import ItemTemplateWithPhoto from 'Controls-demo/treeGridNew/ItemTemplate/WithPhoto/Index';
import ItemTemplateWithPhotoPhoto32px from 'Controls-demo/treeGridNew/ItemTemplate/WithPhoto/Photo32px/Index';
import ItemTemplateWithPhotoPhoto16px from 'Controls-demo/treeGridNew/ItemTemplate/WithPhoto/Photo16px/Index';
import ItemTemplateWithPhotoPhoto40px from 'Controls-demo/treeGridNew/ItemTemplate/WithPhoto/Photo40px/Index';
import ItemTemplateWithPhotoPhoto24px from 'Controls-demo/treeGridNew/ItemTemplate/WithPhoto/Photo24px/Index';
import ItemTemplateWithPhotoTwoLevelsWithoutPhoto from 'Controls-demo/treeGridNew/ItemTemplate/WithPhoto/TwoLevelsWithoutPhoto/Index';
import ItemTemplateWithPhotoTwoLevelsWithPhoto from 'Controls-demo/treeGridNew/ItemTemplate/WithPhoto/TwoLevelsWithPhoto/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ItemTemplateBackgroundColorStyle.getLoadConfig(),
            ...ItemTemplateColspanNodes.getLoadConfig(),
            ...ItemTemplateNoHighlightOnHover.getLoadConfig(),
            ...ItemTemplateNoClickable.getLoadConfig(),
            ...ItemTemplateWithPhoto.getLoadConfig(),
            ...ItemTemplateWithPhotoPhoto32px.getLoadConfig(),
            ...ItemTemplateWithPhotoPhoto16px.getLoadConfig(),
            ...ItemTemplateWithPhotoPhoto40px.getLoadConfig(),
            ...ItemTemplateWithPhotoPhoto24px.getLoadConfig(),
            ...ItemTemplateWithPhotoTwoLevelsWithoutPhoto.getLoadConfig(),
            ...ItemTemplateWithPhotoTwoLevelsWithPhoto.getLoadConfig(),
        };
    }
}
